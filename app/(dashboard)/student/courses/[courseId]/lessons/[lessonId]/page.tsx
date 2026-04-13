"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Clock, 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Play,
  FileText,
  Video,
  Download,
  Star,
  MessageCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { getLesson, getCourse, getStudentEnrollments, markLessonComplete } from '@/lib/api'

interface Lesson {
  id: string
  title: string
  description: string
  content: string
  order: number
  duration_minutes: number
  is_published: boolean
  lesson_type: string
  video_url?: string
  attachments?: any[]
  quiz?: {
    id: string
    title: string
    description: string
    time_limit_minutes: number
    passing_score: number
    max_attempts: number
    is_published: boolean
  }
  course: {
    id: string
    title: string
  }
}

interface Course {
  id: string
  title: string
  lessons: Lesson[]
}

interface Enrollment {
  id: string
  course: Course
  enrolled_at: string
  progress_percentage: number
  is_completed: boolean
  last_accessed_at?: string
  lesson_progress: any[]
}

export default function StudentLessonPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    if (courseId && lessonId) {
      loadLessonData()
      setStartTime(new Date())
    }
  }, [courseId, lessonId])

  useEffect(() => {
    // Track time spent on lesson
    const interval = setInterval(() => {
      if (startTime) {
        setTimeSpent(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const loadLessonData = async () => {
    try {
      setLoading(true)
      const [lessonData, courseData, enrollmentsData] = await Promise.all([
        getLesson(courseId, lessonId),
        getCourse(courseId),
        getStudentEnrollments()
      ])
      
      setLesson(lessonData)
      setCourse(courseData)
      
      // Find enrollment for this course
      const courseEnrollment = enrollmentsData.find(
        (enrollment: Enrollment) => enrollment.course?.id === courseId
      )
      setEnrollment(courseEnrollment || null)
      
      // Find current lesson index
      const lessonIndex = courseData.lessons.findIndex((l: Lesson) => l.id === lessonId)
      setCurrentLessonIndex(lessonIndex)
      
      // Check if lesson is completed
      const lessonProgress = courseEnrollment?.lesson_progress?.find(
        (progress: any) => progress.lesson_id === lessonId
      )
      setIsCompleted(lessonProgress?.is_completed || false)
      
    } catch (error) {
      console.error('Error loading lesson data:', error)
      toast.error('Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    // Check if quiz is required and completed
    if (!canMarkComplete()) {
      if (lesson?.quiz && lesson.quiz.is_published && !isQuizCompleted()) {
        toast.error('You must complete the quiz before marking this lesson as complete!')
        return
      }
    }

    try {
      await markLessonComplete(courseId, lessonId)
      setIsCompleted(true)
      toast.success('Lesson marked as complete!')
      
      // Reload enrollment data to update progress
      const updatedEnrollments = await getStudentEnrollments()
      const courseEnrollment = updatedEnrollments.find(
        (enrollment: Enrollment) => enrollment.course?.id === courseId
      )
      setEnrollment(courseEnrollment || null)
      
      // Navigate to next lesson if available
      const nextLesson = course?.lessons[currentLessonIndex + 1]
      if (nextLesson) {
        setTimeout(() => {
          router.push(`/student/courses/${courseId}/lessons/${nextLesson.id}`)
        }, 1500)
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error)
      toast.error('Failed to mark lesson as complete')
    }
  }

  const isQuizCompleted = () => {
    if (!enrollment?.lesson_progress) return false
    const progress = enrollment.lesson_progress.find((progress: any) => progress.lesson_id === lessonId)
    return progress?.quiz_completed || false
  }

  const canMarkComplete = () => {
    // If lesson is already completed, they can't mark it complete again
    if (isCompleted) return false
    
    // If lesson has a quiz, they must complete it first
    if (lesson?.quiz && lesson.quiz.is_published) {
      return isQuizCompleted()
    }
    
    // If no quiz, they can mark complete directly
    return true
  }

  const navigateToLesson = (direction: 'prev' | 'next') => {
    const targetIndex = direction === 'next' ? currentLessonIndex + 1 : currentLessonIndex - 1
    const targetLesson = course?.lessons[targetIndex]
    
    if (targetLesson) {
      router.push(`/student/courses/${courseId}/lessons/${targetLesson.id}`)
    }
  }

  const getLessonIcon = (lessonType: string | null | undefined) => {
    if (!lessonType) {
      return BookOpen
    }
    
    switch (lessonType.toLowerCase()) {
      case 'video':
        return Video
      case 'text':
        return FileText
      default:
        return BookOpen
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading lesson...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Lesson not found</h3>
            <p className="text-muted-foreground mb-4">The lesson you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => router.push(`/student/courses/${courseId}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const LessonIcon = getLessonIcon(lesson.lesson_type)
  const hasNextLesson = currentLessonIndex < course.lessons.length - 1
  const hasPrevLesson = currentLessonIndex > 0
  const nextLesson = hasNextLesson ? course.lessons[currentLessonIndex + 1] : null
  const prevLesson = hasPrevLesson ? course.lessons[currentLessonIndex - 1] : null

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/student/courses/${courseId}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{course.title}</Badge>
              <span className="text-sm text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {course.lessons.length}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
            <p className="text-muted-foreground mb-4">{lesson.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <LessonIcon className="w-4 h-4" />
                {lesson.lesson_type}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {lesson.duration_minutes} minutes
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Play className="w-4 h-4" />
                {formatTime(timeSpent)} spent
              </div>
            </div>
          </div>
          
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <span className="font-medium">Completed</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LessonIcon className="w-5 h-5" />
                Lesson Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {console.log('Rendering lesson content:', {
                lesson_type: lesson?.lesson_type,
                video_url: lesson?.video_url,
                video_id: lesson?.video_id,
                shouldShowVideo: lesson?.lesson_type === 'video' && lesson?.video_url,
                fullLesson: lesson
              })}
              
              {/* Video Content */}
              {(lesson.lesson_type === 'video' || lesson.video_url) && lesson.video_url && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Video Lesson</h3>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${lesson.video_id || getVideoId(lesson.video_url)}`}
                      title={lesson.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
              
              {/* Text Content */}
              {lesson.content && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Lesson Notes</h3>
                  <div
                    className="prose max-w-none text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                </div>
              )}
              
              {/* Show message if no content */}
              {!lesson.video_url && !lesson.content && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No content available for this lesson yet.</p>
                </div>
              )}
              
              {/* Attachments */}
              {lesson.attachments && lesson.attachments.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Attachments</h3>
                  <div className="space-y-2">
                    {lesson.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-sm text-muted-foreground">{attachment.size}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-semibold">{enrollment?.progress_percentage || 0}%</span>
                </div>
                <Progress value={enrollment?.progress_percentage || 0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Lessons Completed</span>
                  <span className="font-semibold">
                    {course.lessons.filter((l, index) => index <= currentLessonIndex).length}/{course.lessons.length}
                  </span>
                </div>
                <Progress 
                  value={(course.lessons.filter((l, index) => index <= currentLessonIndex).length / course.lessons.length) * 100} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Lesson Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lesson Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {prevLesson && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigateToLesson('prev')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous: {prevLesson.title}
                </Button>
              )}
              
              {nextLesson && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigateToLesson('next')}
                >
                  Next: {nextLesson.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              
              {!nextLesson && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Last lesson in course</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!isCompleted ? (
                <div className="space-y-2">
                  <Button 
                    className="w-full"
                    onClick={handleMarkComplete}
                    disabled={!canMarkComplete()}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                  {lesson?.quiz && lesson.quiz.is_published && !isQuizCompleted() && (
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      ⚠️ Complete the quiz first to mark this lesson as complete
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Lesson Completed!</span>
                  </div>
                </div>
              )}
              
              {/* Quiz Navigation */}
              {lesson.quiz && lesson.quiz.is_published && (
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push(`/student/courses/${courseId}/lessons/${lessonId}/quiz`)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Take Quiz
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
              
              <Button variant="outline" className="w-full">
                <Star className="w-4 h-4 mr-2" />
                Rate Lesson
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
