"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  Trophy,
  Target,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { getLesson, getCourse, submitQuizAttempt, getQuizAttempts } from '@/lib/api'

interface QuizQuestion {
  id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay'
  points: number
  options: string[]
  correct_answer: string
  acceptable_answers: string[]
  order: number
}

interface Quiz {
  id: string
  title: string
  description: string
  time_limit_minutes: number
  passing_score: number
  max_attempts: number
  is_published: boolean
  questions: QuizQuestion[]
}

interface Lesson {
  id: string
  title: string
  course: {
    id: string
    title: string
  }
  quiz?: Quiz
}

interface QuizAttempt {
  id: string
  quiz: string
  student: string
  started_at: string
  submitted_at?: string
  score?: number
  is_passed: boolean
  answers: any[]
}

export default function StudentQuizPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizResult, setQuizResult] = useState<any>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([])
  const [questionMapping, setQuestionMapping] = useState<Record<number, number>>({}) // shuffled index -> original question id

  useEffect(() => {
    if (lessonId) {
      loadQuizData()
    }
  }, [lessonId])

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (quizStarted && timeRemaining > 0 && !quizSubmitted) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [quizStarted, timeRemaining, quizSubmitted])

  const loadQuizData = async () => {
    try {
      setLoading(true)
      const [lessonData, courseData] = await Promise.all([
        getLesson(courseId, lessonId),
        getCourse(courseId)
      ])

      setLesson(lessonData)

      if (lessonData.quiz) {
        setQuiz(lessonData.quiz)
        setTimeRemaining(lessonData.quiz.time_limit_minutes * 60)

        // Load previous attempts for this quiz
        try {
          const attemptsData = await getQuizAttempts(lessonData.quiz.id.toString())
          setAttempts(attemptsData || [])
        } catch (error) {
          console.error('Error loading quiz attempts:', error)
          setAttempts([])
        }
      }
    } catch (error) {
      console.error('Error loading quiz data:', error)
      toast.error('Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

  // Function to shuffle questions
  const shuffleQuestions = (questions: QuizQuestion[]): { shuffled: QuizQuestion[], mapping: Record<number, number> } => {
    const shuffled = [...questions]
    const mapping: Record<number, number> = {}

    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Create mapping from shuffled position to original question ID
    shuffled.forEach((question, index) => {
      mapping[index] = question.id
    })

    return { shuffled, mapping }
  }

  const startQuiz = () => {
    if (attempts.length >= (quiz?.max_attempts || 1)) {
      toast.error('Maximum attempts reached')
      return
    }

    if (quiz?.questions) {
      // Shuffle questions when starting the quiz
      const { shuffled, mapping } = shuffleQuestions(quiz.questions)
      setShuffledQuestions(shuffled)
      setQuestionMapping(mapping)
      console.log('Questions shuffled:', shuffled.map(q => q.id))
    }

    setQuizStarted(true)
    toast.success('Quiz started! Good luck!')
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    console.log('Answer changed:', { questionId, answer, currentQuestionId: currentQuestion?.id })
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: answer
      }
      console.log('Updated answers:', newAnswers)
      return newAnswers
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    try {
      setQuizSubmitted(true)
      
      // Calculate score
      let correctAnswers = 0
      let totalPoints = 0
      
      quiz?.questions.forEach(question => {
        totalPoints += question.points
        const userAnswer = answers[question.id]
        
        if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
          if (userAnswer === question.correct_answer) {
            correctAnswers += question.points
          }
        } else if (question.question_type === 'short_answer') {
          const acceptableAnswers = question.acceptable_answers.map(ans => ans.toLowerCase())
          if (acceptableAnswers.includes(userAnswer?.toLowerCase() || '')) {
            correctAnswers += question.points
          }
        }
        // Essay questions would need manual grading
      })
      
      const score = Math.round((correctAnswers / totalPoints) * 100)
      const isPassed = score >= (quiz?.passing_score || 70)
      
      // Submit quiz attempt to backend
      if (quiz?.id) {
        console.log('Raw answers object:', answers)
        console.log('Answers entries:', Object.entries(answers))

        // Convert answers to the format expected by backend
        // Use original question IDs from mapping if questions were shuffled
        const formattedAnswers = Object.entries(answers)
          .filter(([questionId, answerText]) => answerText !== undefined && answerText !== null && answerText !== '')
          .map(([questionId, answerText]) => ({
            question_id: parseInt(questionId),
            answer_text: answerText
          }))

        console.log('Filtered answers:', formattedAnswers)
        
        if (formattedAnswers.length === 0) {
          console.warn('No answers provided, but continuing anyway for debugging')
          // throw new Error('No answers provided')
        }
        
        console.log('Submitting quiz attempt for quiz:', quiz.id)
        console.log('Formatted answers:', formattedAnswers)
        console.log('Quiz ID type:', typeof quiz.id)
        
        try {
          // Ensure quiz ID is a number for the backend
          const quizIdNumber = parseInt(quiz.id)
          console.log('Quiz ID as number:', quizIdNumber)
          await submitQuizAttempt(quizIdNumber.toString(), formattedAnswers)
          console.log('Quiz attempt submitted successfully')
          
          // Reload quiz attempts to show the new submission
          try {
            const attemptsData = await getQuizAttempts(quiz.id.toString())
            setAttempts(attemptsData || [])
          } catch (error) {
            console.error('Error reloading quiz attempts:', error)
          }
        } catch (submitError) {
          console.error('Submit error details:', submitError)
          throw submitError
        }
      }
      
      const result = {
        score,
        isPassed,
        correctAnswers,
        totalPoints,
        timeSpent: (quiz?.time_limit_minutes || 0) * 60 - timeRemaining
      }
      
      setQuizResult(result)
      
      if (isPassed) {
        toast.success(`Congratulations! You passed with ${score}%`)
      } else {
        toast.error(`You scored ${score}%. You need ${quiz?.passing_score || 70}% to pass.`)
      }
      
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz')
      setQuizSubmitted(false) // Reset submission state on error
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimeColor = (time: number) => {
    if (time < 60) return 'text-red-600'
    if (time < 300) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson || !quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quiz Available</h3>
            <p className="text-muted-foreground mb-4">This lesson doesn't have a quiz yet.</p>
            <Button onClick={() => router.push(`/student/courses/${courseId}/lessons/${lessonId}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lesson
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = shuffledQuestions.length > 0 ? shuffledQuestions[currentQuestionIndex] : quiz?.questions?.[currentQuestionIndex]
  const progress = shuffledQuestions.length ? ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100 : (quiz?.questions?.length ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0)

  // Don't render quiz content if currentQuestion is undefined
  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Not Available</h1>
          <p className="text-muted-foreground mb-4">The current question is not available.</p>
          <Button onClick={() => router.push(`/student/courses/${courseId}/lessons/${lessonId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lesson
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/student/courses/${courseId}/lessons/${lessonId}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lesson
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{lesson.course?.title || 'Unknown Course'}</Badge>
              <Badge variant="outline">{lesson.title || 'Unknown Lesson'}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{quiz?.title || 'Quiz'}</h1>
            <p className="text-muted-foreground mb-4">{quiz?.description || 'No description available'}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {quiz?.time_limit_minutes || 0} minutes
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                {quiz?.passing_score || 0}% to pass
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                {quiz?.questions?.length || 0} questions
              </div>
            </div>
          </div>
          
          {quizStarted && !quizSubmitted && (
            <div className={`text-2xl font-bold ${getTimeColor(timeRemaining)}`}>
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>
      </div>

      {!quizStarted ? (
        /* Quiz Start Screen */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Quiz Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Time Limit</span>
                </div>
                <p className="text-sm text-muted-foreground">{quiz.time_limit_minutes} minutes</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Passing Score</span>
                </div>
                <p className="text-sm text-muted-foreground">{quiz.passing_score}%</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold">Questions</span>
                </div>
                <p className="text-sm text-muted-foreground">{shuffledQuestions.length || quiz?.questions?.length || 0} questions</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Important Notes:</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• You have {quiz.time_limit_minutes} minutes to complete the quiz</li>
                    <li>• You need {quiz.passing_score}% to pass</li>
                    <li>• You can navigate between questions using the Previous/Next buttons</li>
                    <li>• Once you submit, you cannot change your answers</li>
                    <li>• Attempts remaining: {quiz.max_attempts - attempts.length}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={startQuiz}
                disabled={attempts.length >= quiz.max_attempts}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : quizSubmitted ? (
        /* Quiz Results */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                quizResult?.isPassed 
                  ? 'bg-green-100 dark:bg-green-900/20' 
                  : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {quizResult?.isPassed ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              
              <h2 className={`text-3xl font-bold mb-2 ${
                quizResult?.isPassed ? 'text-green-600' : 'text-red-600'
              }`}>
                {quizResult?.isPassed ? 'Congratulations!' : 'Try Again'}
              </h2>
              
              <p className="text-muted-foreground mb-6">
                {quizResult?.isPassed 
                  ? 'You passed the quiz!' 
                  : `You scored ${quizResult?.score}%. You need ${quiz.passing_score}% to pass.`
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{quizResult?.score}%</div>
                <div className="text-sm text-muted-foreground">Your Score</div>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{quizResult?.correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{formatTime(quizResult?.timeSpent || 0)}</div>
                <div className="text-sm text-muted-foreground">Time Spent</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => router.push(`/student/courses/${courseId}/lessons/${lessonId}`)}
              >
                Back to Lesson
              </Button>
              
              {!quizResult?.isPassed && attempts.length < quiz.max_attempts && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setQuizStarted(false)
                    setQuizSubmitted(false)
                    setQuizResult(null)
                    setCurrentQuestionIndex(0)
                    setAnswers({})
                    setTimeRemaining(quiz.time_limit_minutes * 60)
                  }}
                >
                  Retake Quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Quiz Taking Interface */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Question {currentQuestionIndex + 1} of {shuffledQuestions.length || quiz?.questions?.length || 0}
                  </CardTitle>
                  <Badge variant="outline">{currentQuestion.points} points</Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{currentQuestion.question_text}</h3>
                  {console.log('Current question:', currentQuestion.id, 'Current answers:', answers)}
                  
                  {currentQuestion.question_type === 'multiple_choice' && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`option-${currentQuestion.id}-${index}`}
                            name={`question-${currentQuestion.id}`}
                            value={option}
                            checked={answers[currentQuestion.id] === option}
                            onChange={(e) => {
                              if (e.target.checked) {
                                console.log('Multiple choice answer selected:', { value: option, questionId: currentQuestion.id })
                                handleAnswerChange(currentQuestion.id, option)
                              }
                            }}
                            className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                          <label htmlFor={`option-${currentQuestion.id}-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {currentQuestion.question_type === 'true_false' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`true-${currentQuestion.id}`}
                          name={`question-${currentQuestion.id}`}
                          value="True"
                          checked={answers[currentQuestion.id] === "True"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              console.log('True/False answer selected:', { value: "True", questionId: currentQuestion.id })
                              handleAnswerChange(currentQuestion.id, "True")
                            }
                          }}
                          className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <label htmlFor={`true-${currentQuestion.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          True
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`false-${currentQuestion.id}`}
                          name={`question-${currentQuestion.id}`}
                          value="False"
                          checked={answers[currentQuestion.id] === "False"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              console.log('True/False answer selected:', { value: "False", questionId: currentQuestion.id })
                              handleAnswerChange(currentQuestion.id, "False")
                            }
                          }}
                          className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <label htmlFor={`false-${currentQuestion.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          False
                        </label>
                      </div>
                    </div>
                  )}
                  
                  {currentQuestion.question_type === 'short_answer' && (
                    <Textarea
                      placeholder="Enter your answer here..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="min-h-[100px]"
                    />
                  )}
                  
                  {currentQuestion.question_type === 'essay' && (
                    <Textarea
                      placeholder="Write your essay answer here..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="min-h-[200px]"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex-1"
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === (shuffledQuestions.length || quiz?.questions?.length || 0) - 1}
                    className="flex-1"
                  >
                    Next
                  </Button>
                </div>
                
                <div className="grid grid-cols-5 gap-1">
                  {(shuffledQuestions.length > 0 ? shuffledQuestions : quiz?.questions || []).map((_, index) => (
                    <Button
                      key={index}
                      variant={index === currentQuestionIndex ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentQuestionIndex(index)}
                      className="h-8 w-8 p-0"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Submit */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submit Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={handleSubmitQuiz}
                >
                  Submit Quiz
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  You can review your answers before submitting
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
