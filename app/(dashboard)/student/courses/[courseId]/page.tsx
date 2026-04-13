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
  Users, 
  Star, 
  Play,
  CheckCircle,
  Lock,
  ArrowLeft,
  FileText,
  Video,
  Award,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'
import { getCourse, getStudentEnrollments } from '@/lib/api'

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
}

interface Course {
  id: string
  title: string
  description: string
  instructor: {
    first_name: string
    last_name: string
  }
  category: string
  price: number
  total_lessons: number
  duration_hours: number
  difficulty_level: string
  average_rating: number
  total_students: number
  thumbnail_url?: string
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

export default function StudentCourseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (courseId) {
      loadCourseData()
    }
  }, [courseId])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      const [courseData, enrollmentsData] = await Promise.all([
        getCourse(courseId),
        getStudentEnrollments()
      ])
      
      setCourse(courseData)
      
      // Find enrollment for this course
      const courseEnrollment = enrollmentsData.find(
        (enrollment: Enrollment) => enrollment.course.id === courseId
      )
      setEnrollment(courseEnrollment || null)
      
    } catch (error) {
      console.error('Error loading course data:', error)
      toast.error('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const getLessonProgress = (lessonId: string) => {
    if (!enrollment?.lesson_progress) return null
    return enrollment.lesson_progress.find((progress: any) => progress.lesson_id === lessonId)
  }

  const isLessonCompleted = (lessonId: string) => {
    const progress = getLessonProgress(lessonId)
    return progress?.is_completed || false
  }

  const isLessonAccessible = (lesson: Lesson, index: number) => {
    // First lesson is always accessible
    if (index === 0) return true
    
    // Check if previous lesson is completed
    const previousLesson = course?.lessons[index - 1]
    if (previousLesson) {
      return isLessonCompleted(previousLesson.id)
    }
    
    return false
  }

  const getDifficultyColor = (difficulty: string | undefined | null) => {
    if (!difficulty) {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
    
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getLessonIcon = (lessonType: string | undefined | null) => {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading course...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Course not found</h3>
            <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => router.push('/student/courses')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Not Enrolled</h3>
            <p className="text-muted-foreground mb-4">You need to enroll in this course to access its content.</p>
            <Button onClick={() => router.push('/student/courses')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completedLessons = (course.lessons || []).filter(lesson => isLessonCompleted(lesson.id)).length
  const nextIncompleteLesson = (course.lessons || []).find((lesson, index) => 
    isLessonAccessible(lesson, index) && !isLessonCompleted(lesson.id)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/student/courses')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">
              by {course.instructor?.first_name || 'Unknown'} {course.instructor?.last_name || 'Instructor'}
            </p>
            <div className="mb-4">
              <Button 
                onClick={() => router.push(`/student/courses/${courseId}/intro`)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {enrollment ? 'Continue Learning' : 'Start Course'}
              </Button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Badge className={getDifficultyColor(course.difficulty_level)}>
                {course.difficulty_level || 'Unknown'}
              </Badge>
              <Badge variant="outline">{course.category?.name || 'Uncategorized'}</Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{(course.average_rating || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {nextIncompleteLesson && (
            <Button 
              size="lg"
              onClick={() => router.push(`/student/courses/${courseId}/intro`)}
            >
              <Play className="w-5 h-5 mr-2" />
              Continue Learning
            </Button>
          )}
        </div>
      </div>

      {/* Course Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Course Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose max-w-none text-muted-foreground mb-6"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{course.total_lessons || 0}</p>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">{course.duration_hours || 0}h</p>
                  <p className="text-sm text-muted-foreground">Duration</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">{course.total_students || 0}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold">{enrollment.progress_percentage}%</p>
                  <p className="text-sm text-muted-foreground">Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-semibold">{enrollment.progress_percentage}%</span>
                </div>
                <Progress value={enrollment.progress_percentage} className="h-3" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Lessons Completed</span>
                  <span className="font-semibold">{completedLessons}/{course.total_lessons || 0}</span>
                </div>
                <Progress value={course.total_lessons ? (completedLessons / course.total_lessons) * 100 : 0} className="h-2" />
              </div>
              
              {enrollment.is_completed && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Course Completed!</span>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Enrolled on {new Date(enrollment.enrolled_at).toLocaleDateString()}
                </p>
                {enrollment.last_accessed_at && (
                  <p className="text-sm text-muted-foreground">
                    Last accessed {new Date(enrollment.last_accessed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lessons List */}
      <Card>
        <CardHeader>
          <CardTitle>Course Lessons</CardTitle>
          <CardDescription>
            Complete lessons in order to unlock the next ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(course.lessons || []).map((lesson, index) => {
              const LessonIcon = getLessonIcon(lesson.lesson_type)
              const isCompleted = isLessonCompleted(lesson.id)
              const isAccessible = isLessonAccessible(lesson, index)
              const progress = getLessonProgress(lesson.id)
              
              return (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    isCompleted 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                      : isAccessible
                      ? 'bg-background hover:bg-muted cursor-pointer'
                      : 'bg-muted/50 opacity-60'
                  }`}
                  onClick={() => {
                    if (isAccessible) {
                      // If this is the first lesson, go to intro page first
                      if (index === 0) {
                        router.push(`/student/courses/${courseId}/intro`)
                      } else {
                        router.push(`/student/courses/${courseId}/lessons/${lesson.id}`)
                      }
                    }
                  }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
                      : isAccessible
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
                      : 'bg-gray-100 dark:bg-gray-900/20 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isAccessible ? (
                      <LessonIcon className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{lesson.title}</h3>
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration_minutes} min
                      </div>
                      <div className="flex items-center gap-1">
                        <LessonIcon className="w-3 h-3" />
                        {lesson.lesson_type}
                      </div>
                      {progress?.time_spent && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {Math.round(progress.time_spent / 60)} min studied
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isAccessible ? (
                      <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                        {isCompleted ? 'Review' : 'Start'}
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        <Lock className="w-4 h-4 mr-1" />
                        Locked
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
