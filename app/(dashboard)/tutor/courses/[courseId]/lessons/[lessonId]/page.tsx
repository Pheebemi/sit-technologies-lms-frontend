"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTutorLesson, updateLesson, deleteLesson, getQuiz, createQuiz, autoGenerateQuiz, Quiz } from '@/lib/api'
import RichTextEditor from '@/components/rich-text-editor'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Save, 
  Edit, 
  Trash2, 
  Video, 
  FileText,
  Clock,
  HelpCircle,
  Plus,
  Eye,
  EyeOff,
  Play,
  CheckCircle,
  Zap
} from 'lucide-react'

export default function LessonDetailPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string
  
  const [lesson, setLesson] = useState<any>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showCreateQuiz, setShowCreateQuiz] = useState(false)
  const [showAutoGenerateQuiz, setShowAutoGenerateQuiz] = useState(false)
  const [autoGenerateForm, setAutoGenerateForm] = useState({
    num_questions: 5,
    difficulty: 'medium'
  })
  const [generatingQuiz, setGeneratingQuiz] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1,
    content: '',
    video_url: '',
    duration_minutes: 0,
    resources: [] as string[],
    is_published: false
  })
  
  const [newResource, setNewResource] = useState('')

  const [quizFormData, setQuizFormData] = useState({
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
      loadLessonData()
    }
  }, [lessonId])

  const loadLessonData = async () => {
    try {
      setLoading(true)
      const lessonData = await getTutorLesson(courseId, lessonId)
      setLesson(lessonData)
      
      // Check if lesson has a quiz
      if (lessonData.quiz) {
        setQuiz(lessonData.quiz)
      } else {
        setQuiz(null)
      }
      
      // Populate form data
      setFormData({
        title: lessonData.title,
        description: lessonData.description || '',
        order: lessonData.order,
        content: lessonData.content || '',
        video_url: lessonData.video_url || '',
        duration_minutes: lessonData.duration_minutes,
        resources: lessonData.resources || [],
        is_published: lessonData.is_published
      })
    } catch (error) {
      console.error('Failed to load lesson data:', error)
      toast.error('Failed to load lesson data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'duration_minutes' || name === 'order') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addResource = () => {
    if (newResource.trim()) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }))
      setNewResource('')
    }
  }

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Lesson title required', {
        description: 'Please enter a lesson title before saving'
      })
      return
    }

      setSaving(true)
    const loadingToast = toast.loading('Saving lesson...', {
      description: 'Please wait while we save your changes'
    })

    try {
      const updatedLesson = await updateLesson(courseId, lessonId, formData)
      setLesson(updatedLesson)
      setIsEditing(false)
      toast.success('Lesson updated successfully!', {
        description: `Your lesson "${updatedLesson.title}" has been saved`
      })
    } catch (error: any) {
      console.error('Failed to update lesson:', error)
      
      let errorMessage = 'Failed to update lesson'
      let errorDescription = 'Please try again'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
        errorDescription = error.response.data.message || 'Please check your input and try again'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage, {
        description: errorDescription
      })
    } finally {
      toast.dismiss(loadingToast)
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      return
    }

    const loadingToast = toast.loading('Deleting lesson...', {
      description: 'Please wait while we delete your lesson'
    })

    try {
      await deleteLesson(courseId, lessonId)
      toast.success('Lesson deleted successfully', {
        description: 'The lesson has been permanently removed'
      })
      router.push(`/tutor/courses/${courseId}`)
    } catch (error: any) {
      console.error('Failed to delete lesson:', error)
      
      let errorMessage = 'Failed to delete lesson'
      let errorDescription = 'Please try again'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
        errorDescription = error.response.data.message || 'Please try again later'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage, {
        description: errorDescription
      })
    } finally {
      toast.dismiss(loadingToast)
    }
  }

  const getVideoId = (url: string) => {
    if (!url) return null
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0]
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0]
    }
    return null
  }

  const handleQuizInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setQuizFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'time_limit_minutes' || name === 'passing_score' || name === 'max_attempts') {
      setQuizFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setQuizFormData(prev => ({ ...prev, [name]: value }))
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
      order: quizFormData.questions.length + 1,
      options: newQuestion.question_type === 'short_answer' ? [] : newQuestion.options.filter(opt => opt.trim()),
      correct_answer: newQuestion.question_type === 'short_answer' 
        ? (newQuestion.acceptable_answers[0] || '') 
        : newQuestion.correct_answer
    }

    setQuizFormData(prev => ({
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
    setQuizFormData(prev => ({
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

  const handleCreateQuiz = async () => {
    // Validate quiz title
    if (!quizFormData.title.trim()) {
      toast.error('Quiz title required', {
        description: 'Please enter a quiz title before creating the quiz'
      })
      return
    }

    // Validate questions
    if (quizFormData.questions.length === 0) {
      toast.error('Questions required', {
        description: 'Please add at least one question before creating the quiz'
      })
      return
    }

    // Validate each question
    for (let i = 0; i < quizFormData.questions.length; i++) {
      const question = quizFormData.questions[i]
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
    const loadingToast = toast.loading('Creating quiz...', {
      description: 'Please wait while we create your quiz'
    })

    try {
      const createdQuiz = await createQuiz(lessonId, quizFormData)
      setQuiz(createdQuiz)
      setShowCreateQuiz(false)
      
      // Reset quiz form
      setQuizFormData({
        title: '',
        description: '',
        time_limit_minutes: 30,
        passing_score: 70,
        max_attempts: 3,
        is_published: false,
        questions: []
      })
      
      toast.success('Quiz created successfully!', {
        description: `Your quiz "${createdQuiz.title}" has been created with ${createdQuiz.questions.length} questions`
      })
    } catch (error: any) {
      console.error('Failed to create quiz:', error)
      
      let errorMessage = 'Failed to create quiz'
      let errorDescription = 'Please try again'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
        errorDescription = error.response.data.message || 'Please check your input and try again'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage, {
        description: errorDescription
      })
    } finally {
      toast.dismiss(loadingToast)
      setSaving(false)
    }
  }

  const handleAutoGenerateQuiz = async () => {
    if (autoGenerateForm.num_questions < 1 || autoGenerateForm.num_questions > 20) {
      toast.error('Number of questions must be between 1 and 20')
      return
    }

    try {
      setGeneratingQuiz(true)

      const result = await autoGenerateQuiz(courseId, lessonId, autoGenerateForm.num_questions, autoGenerateForm.difficulty)

      toast.success('Quiz generated successfully!', {
        description: `Auto-generated quiz with ${result.quiz.questions.length} questions`
      })

      // Close modal and refresh data
      setShowAutoGenerateQuiz(false)
      await loadLessonData()

      // Reset form
      setAutoGenerateForm({
        num_questions: 5,
        difficulty: 'medium'
      })

    } catch (error: any) {
      console.error('Failed to auto-generate quiz:', error)

      let errorMessage = 'Failed to generate quiz'
      let errorDescription = 'Please try again'

      if (error?.error) {
        errorMessage = error.error
        if (error.error.includes('already has a quiz')) {
          errorDescription = 'This lesson already has a quiz. Delete the existing quiz first.'
        }
      }

      toast.error(errorMessage, { description: errorDescription })
    } finally {
      setGeneratingQuiz(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading lesson...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lesson not found</h3>
              <p className="text-muted-foreground mb-6">The lesson you're looking for doesn't exist.</p>
              <Button onClick={() => router.push(`/tutor/courses/${courseId}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const videoId = getVideoId(formData.video_url)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/tutor/courses/${courseId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
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
                <h1 className="text-3xl font-bold">{lesson.title}</h1>
              )}
              <Badge className={lesson.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {lesson.is_published ? (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Draft
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {lesson.duration_minutes} minutes
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Lesson {lesson.order}
              </div>
              {lesson.video_id && (
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  Video
                </div>
              )}
              {quiz && (
                <div className="flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" />
                  Quiz
                </div>
              )}
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
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section */}
            {videoId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Lesson Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={lesson.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lesson Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of what students will learn"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm min-h-[80px] resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Content</label>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                        placeholder="Write your lesson notes here — students see this exactly as formatted"
                        minHeight="220px"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lesson.description && (
                      <p className="text-muted-foreground">{lesson.description}</p>
                    )}
                    {lesson.content ? (
                      <div
                        className="prose max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                      />
                    ) : (
                      <p className="text-muted-foreground italic">No content provided for this lesson.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resources */}
            {(lesson.resources?.length > 0 || isEditing) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newResource}
                          onChange={(e) => setNewResource(e.target.value)}
                          placeholder="https://example.com/resource"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
                        />
                        <Button type="button" onClick={addResource} disabled={!newResource.trim()}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {formData.resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                          <a
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-sm text-blue-600 hover:underline truncate"
                          >
                            {resource}
                          </a>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResource(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {lesson.resources.map((resource: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                          <a
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-sm text-blue-600 hover:underline"
                          >
                            {resource}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Lesson Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Order</label>
                      <Input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                      <Input
                        type="number"
                        value={formData.duration_minutes}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Video URL</label>
                      <Input
                        value={formData.video_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={formData.is_published}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
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
                      <span className="text-sm text-muted-foreground">Order</span>
                      <span className="text-sm font-medium">{lesson.order}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="text-sm font-medium">{lesson.duration_minutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className={lesson.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {lesson.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quiz Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quiz ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Quiz Created</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {quiz.questions.length} questions • {quiz.time_limit_minutes} min limit
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/tutor/courses/${courseId}/lessons/${lessonId}/quiz`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      No quiz created for this lesson yet.
                    </p>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full"
                        onClick={() => setShowAutoGenerateQuiz(true)}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Auto Generate Quiz
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowCreateQuiz(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Manual Create Quiz
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quiz Creation Modal */}
        {showCreateQuiz && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Create Quiz</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCreateQuiz(false)
                      // Reset quiz form
                      setQuizFormData({
                        title: '',
                        description: '',
                        time_limit_minutes: 30,
                        passing_score: 70,
                        max_attempts: 3,
                        is_published: false,
                        questions: []
                      })
                      setNewQuestion({
                        question_text: '',
                        question_type: 'multiple_choice',
                        points: 1,
                        options: ['', '', '', ''],
                        correct_answer: '',
                        acceptable_answers: []
                      })
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Validation Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Quiz Requirements</h4>
                  <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                    <div className={`flex items-center gap-2 ${quizFormData.title.trim() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <span>{quizFormData.title.trim() ? '✓' : '✗'}</span>
                      <span>Quiz title is required</span>
                    </div>
                    <div className={`flex items-center gap-2 ${quizFormData.questions.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <span>{quizFormData.questions.length > 0 ? '✓' : '✗'}</span>
                      <span>At least one question is required</span>
                    </div>
                    <div className="text-blue-700 dark:text-blue-300">
                      <span>Questions added: {quizFormData.questions.length}</span>
                    </div>
                  </div>
                </div>

                {/* Quiz Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Quiz Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={quizFormData.title}
                      onChange={handleQuizInputChange}
                      name="title"
                      placeholder="Enter quiz title"
                      className={!quizFormData.title.trim() ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {!quizFormData.title.trim() && (
                      <p className="text-red-500 text-xs mt-1">Quiz title is required</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Limit (minutes)</label>
                    <Input
                      type="number"
                      value={quizFormData.time_limit_minutes}
                      onChange={handleQuizInputChange}
                      name="time_limit_minutes"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Passing Score (%)</label>
                    <Input
                      type="number"
                      value={quizFormData.passing_score}
                      onChange={handleQuizInputChange}
                      name="passing_score"
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Attempts</label>
                    <Input
                      type="number"
                      value={quizFormData.max_attempts}
                      onChange={handleQuizInputChange}
                      name="max_attempts"
                      min="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    value={quizFormData.description}
                    onChange={handleQuizInputChange}
                    name="description"
                    placeholder="Enter quiz description"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm min-h-[80px] resize-none"
                  />
                </div>

                {/* Questions List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Questions ({quizFormData.questions.length})</h3>
                  
                  {quizFormData.questions.map((question, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">Question {question.order}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is_published"
                            checked={quizFormData.is_published}
                            onChange={handleQuizInputChange}
                            name="is_published"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="is_published" className="text-sm font-medium">
                            Publish Quiz
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="p-6 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowCreateQuiz(false)
                  // Reset quiz form
                  setQuizFormData({
                    title: '',
                    description: '',
                    time_limit_minutes: 30,
                    passing_score: 70,
                    max_attempts: 3,
                    is_published: false,
                    questions: []
                  })
                  setNewQuestion({
                    question_text: '',
                    question_type: 'multiple_choice',
                    points: 1,
                    options: ['', '', '', ''],
                    correct_answer: '',
                    acceptable_answers: []
                  })
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleCreateQuiz()
                  }} 
                  disabled={saving || quizFormData.questions.length === 0 || !quizFormData.title.trim()}
                  type="button"
                  className={!quizFormData.title.trim() ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Quiz
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Auto Generate Quiz Modal */}
        {showAutoGenerateQuiz && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-md w-full">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Auto Generate Quiz</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAutoGenerateQuiz(false)}
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Questions</label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={autoGenerateForm.num_questions}
                    onChange={(e) => setAutoGenerateForm(prev => ({
                      ...prev,
                      num_questions: parseInt(e.target.value) || 5
                    }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Choose between 1-20 questions (recommended: 5)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={autoGenerateForm.difficulty}
                    onChange={(e) => setAutoGenerateForm(prev => ({
                      ...prev,
                      difficulty: e.target.value as 'easy' | 'medium' | 'hard'
                    }))}
                  >
                    <option value="easy">Easy - Basic questions</option>
                    <option value="medium">Medium - Mixed difficulty</option>
                    <option value="hard">Hard - Advanced questions</option>
                  </select>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What gets generated:</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Multiple choice questions</li>
                    <li>• True/False questions</li>
                    <li>• Short answer questions</li>
                    <li>• Questions based on lesson content</li>
                    <li>• Automatic scoring setup</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 border-t flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAutoGenerateQuiz(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAutoGenerateQuiz}
                  disabled={generatingQuiz}
                >
                  {generatingQuiz ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
