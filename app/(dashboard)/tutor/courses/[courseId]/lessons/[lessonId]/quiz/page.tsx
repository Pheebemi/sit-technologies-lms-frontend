"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getQuiz, updateQuiz, Quiz } from '@/lib/api'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Save, 
  Edit, 
  Trash2, 
  HelpCircle,
  Plus,
  CheckCircle
} from 'lucide-react'

export default function QuizEditPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time_limit_minutes: 30,
    passing_score: 70,
    max_attempts: 3,
    is_published: false,
    questions: [] as any[]
  })
  
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    question_type: 'multiple_choice' as 'multiple_choice' | 'true_false' | 'short_answer',
    points: 1,
    options: ['', '', '', ''],
    correct_answer: '',
    acceptable_answers: [] as string[]
  })

  useEffect(() => {
    if (lessonId) {
      loadQuizData()
    }
  }, [lessonId])

  const loadQuizData = async () => {
    try {
      setLoading(true)

      // Use our API function to get the quiz
      const quizData = await getQuiz(courseId, lessonId)
      setQuiz(quizData)
      
      // Populate form data
      setFormData({
        title: quizData.title,
        description: quizData.description || '',
        time_limit_minutes: quizData.time_limit_minutes,
        passing_score: quizData.passing_score,
        max_attempts: quizData.max_attempts,
        is_published: quizData.is_published,
        questions: quizData.questions || []
      })
    } catch (error) {
      console.error('Failed to load quiz data:', error)
      toast.error('Failed to load quiz data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'time_limit_minutes' || name === 'passing_score' || name === 'max_attempts') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleQuestionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setNewQuestion(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'points') {
      setNewQuestion(prev => ({ ...prev, [name]: parseInt(value) || 1 }))
    } else if (name === 'question_type') {
      setNewQuestion(prev => ({ 
        ...prev, 
        [name]: value as 'multiple_choice' | 'true_false' | 'short_answer',
        options: value === 'multiple_choice' ? ['', '', '', ''] : ['True', 'False'],
        correct_answer: ''
      }))
    } else {
      setNewQuestion(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }))
  }

  const addQuestion = () => {
    if (!newQuestion.question_text.trim()) {
      toast.error('Please enter a question')
      return
    }

    if (newQuestion.question_type === 'multiple_choice' && !newQuestion.correct_answer) {
      toast.error('Please select a correct answer')
      return
    }

    if (newQuestion.question_type === 'true_false' && !newQuestion.correct_answer) {
      toast.error('Please select True or False')
      return
    }

    if (newQuestion.question_type === 'short_answer' && !newQuestion.acceptable_answers.length) {
      toast.error('Please add at least one acceptable answer')
      return
    }

    const question = {
      ...newQuestion,
      order: formData.questions.length + 1,
      options: newQuestion.question_type === 'short_answer' ? [] : newQuestion.options.filter(opt => opt.trim())
    }

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, question]
    }))

    // Reset form
    setNewQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      options: ['', '', '', ''],
      correct_answer: '',
      acceptable_answers: []
    })
  }

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i + 1 }))
    }))
  }

  const addAcceptableAnswer = () => {
    const answer = prompt('Enter acceptable answer:')
    if (answer && answer.trim()) {
      setNewQuestion(prev => ({
        ...prev,
        acceptable_answers: [...prev.acceptable_answers, answer.trim()]
      }))
    }
  }

  const removeAcceptableAnswer = (index: number) => {
    setNewQuestion(prev => ({
      ...prev,
      acceptable_answers: prev.acceptable_answers.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    if (!quiz) return

    if (!formData.title.trim()) {
      toast.error('Quiz title required', {
        description: 'Please enter a quiz title before saving'
      })
      return
    }

    if (formData.questions.length === 0) {
      toast.error('Questions required', {
        description: 'Please add at least one question before saving'
      })
      return
    }

    // Validate each question
    for (let i = 0; i < formData.questions.length; i++) {
      const question = formData.questions[i]
      if (!question.question_text.trim()) {
        toast.error(`Question ${i + 1} incomplete`, {
          description: 'Question text is required'
        })
        return
      }
      if (question.question_type === 'multiple_choice' && !question.correct_answer) {
        toast.error(`Question ${i + 1} incomplete`, {
          description: 'Please select a correct answer for multiple choice questions'
        })
        return
      }
      if (question.question_type === 'true_false' && !question.correct_answer) {
        toast.error(`Question ${i + 1} incomplete`, {
          description: 'Please select True or False for this question'
        })
        return
      }
      if (question.question_type === 'short_answer' && question.acceptable_answers.length === 0) {
        toast.error(`Question ${i + 1} incomplete`, {
          description: 'Please add at least one acceptable answer for short answer questions'
        })
        return
      }
    }

    setSaving(true)
    const loadingToast = toast.loading('Saving quiz...', {
      description: 'Please wait while we save your changes'
    })

    try {
      const updatedQuiz = await updateQuiz(quiz.id, formData)
      setQuiz(updatedQuiz)
      setIsEditing(false)
      toast.success('Quiz updated successfully!', {
        description: `Your quiz "${updatedQuiz.title}" has been saved with ${updatedQuiz.questions.length} questions`
      })
    } catch (error: any) {
      console.error('Failed to update quiz:', error)
      
      let errorMessage = 'Failed to update quiz'
      let errorDescription = 'Please try again'
      
      if (error.error) {
        errorMessage = error.error
        errorDescription = error.message || 'Please check your input and try again'
      } else if (error.message) {
        errorMessage = error.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
        errorDescription = error.response.data.message || 'Please check your input and try again'
      }
      
      toast.error(errorMessage, {
        description: errorDescription
      })
    } finally {
      toast.dismiss(loadingToast)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading quiz...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Quiz not found</h3>
              <p className="text-muted-foreground mb-6">The quiz you're looking for doesn't exist.</p>
              <Button onClick={() => router.push(`/tutor/courses/${courseId}/lessons/${lessonId}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lesson
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/tutor/courses/${courseId}/lessons/${lessonId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lesson
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-2xl font-bold border-none p-0 h-auto"
                />
              ) : (
                <h1 className="text-3xl font-bold">{quiz.title}</h1>
              )}
              <Badge className={quiz.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {quiz.is_published ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Published
                  </>
                ) : (
                  <>
                    <Edit className="w-3 h-3 mr-1" />
                    Draft
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <HelpCircle className="w-4 h-4" />
                {quiz.questions.length} questions
              </div>
              <div className="flex items-center gap-1">
                <span>{quiz.time_limit_minutes} min limit</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Quiz
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Questions ({formData.questions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.questions.map((question, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">Question {question.order}</h4>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{question.question_text}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{question.question_type.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{question.points} point{question.points !== 1 ? 's' : ''}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add New Question Form */}
                {isEditing && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Add New Question</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Question Text <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={newQuestion.question_text}
                          onChange={handleQuestionInputChange}
                          name="question_text"
                          placeholder="Enter your question"
                          className={`w-full px-3 py-2 border bg-background rounded-md text-sm min-h-[80px] resize-none ${
                            !newQuestion.question_text.trim() ? 'border-red-500 focus:border-red-500' : 'border-input'
                          }`}
                        />
                        {!newQuestion.question_text.trim() && (
                          <p className="text-red-500 text-xs mt-1">Question text is required</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Question Type</label>
                          <select
                            value={newQuestion.question_type}
                            onChange={handleQuestionInputChange}
                            name="question_type"
                            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                          >
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="true_false">True/False</option>
                            <option value="short_answer">Short Answer</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Points</label>
                          <Input
                            type="number"
                            value={newQuestion.points}
                            onChange={handleQuestionInputChange}
                            name="points"
                            min="1"
                          />
                        </div>
                      </div>

                      {/* Multiple Choice Options */}
                      {newQuestion.question_type === 'multiple_choice' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Options</label>
                          <div className="space-y-2">
                            {newQuestion.options.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => handleOptionChange(index, e.target.value)}
                                  placeholder={`Option ${index + 1}`}
                                />
                                <input
                                  type="radio"
                                  name="correct_answer"
                                  value={option}
                                  checked={newQuestion.correct_answer === option}
                                  onChange={handleQuestionInputChange}
                                  disabled={!option.trim()}
                                />
                                <span className="text-xs text-muted-foreground">Correct</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* True/False Options */}
                      {newQuestion.question_type === 'true_false' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Correct Answer</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="correct_answer"
                                value="True"
                                checked={newQuestion.correct_answer === 'True'}
                                onChange={handleQuestionInputChange}
                              />
                              True
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="correct_answer"
                                value="False"
                                checked={newQuestion.correct_answer === 'False'}
                                onChange={handleQuestionInputChange}
                              />
                              False
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Short Answer Options */}
                      {newQuestion.question_type === 'short_answer' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Acceptable Answers</label>
                          <div className="space-y-2">
                            {newQuestion.acceptable_answers.map((answer, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-sm">{answer}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAcceptableAnswer(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addAcceptableAnswer}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Answer
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Button onClick={addQuestion} disabled={!newQuestion.question_text.trim()}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Quiz Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Time Limit (minutes)</label>
                      <Input
                        type="number"
                        value={formData.time_limit_minutes}
                        onChange={handleInputChange}
                        name="time_limit_minutes"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Passing Score (%)</label>
                      <Input
                        type="number"
                        value={formData.passing_score}
                        onChange={handleInputChange}
                        name="passing_score"
                        min="1"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Attempts</label>
                      <Input
                        type="number"
                        value={formData.max_attempts}
                        onChange={handleInputChange}
                        name="max_attempts"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={handleInputChange}
                        name="description"
                        placeholder="Enter quiz description"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm min-h-[80px] resize-none"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={formData.is_published}
                        onChange={handleInputChange}
                        name="is_published"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="is_published" className="text-sm font-medium">
                        Published
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Time Limit</span>
                      <span className="text-sm font-medium">{quiz.time_limit_minutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Passing Score</span>
                      <span className="text-sm font-medium">{quiz.passing_score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Attempts</span>
                      <span className="text-sm font-medium">{quiz.max_attempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className={quiz.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {quiz.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    {quiz.description && (
                      <div>
                        <span className="text-sm text-muted-foreground">Description</span>
                        <p className="text-sm mt-1">{quiz.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
