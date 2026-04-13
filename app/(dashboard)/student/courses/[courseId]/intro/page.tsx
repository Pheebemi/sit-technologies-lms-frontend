"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getCourse, getStudentEnrollments } from '@/lib/api'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Video, 
  FileText,
  CheckCircle,
  Lock,
  ArrowRight,
  Calendar,
  Award
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description?: string
  lesson_type: string
  duration_minutes: number
  order: number
  is_published: boolean
}

interface Course {
  id: string
  title: string
  description: string
  short_description?: string
  instructor?: {
    first_name: string
    last_name: string
  }
  category?: string
  difficulty: string
  duration_hours: number
  language: string
  thumbnail_url?: string
  preview_video_id?: string
  total_lessons: number
  total_students: number
  average_rating: number
  total_ratings: number
  lessons: Lesson[]
  created_at: string
}

interface Enrollment {
  id: string
  course: Course
  enrolled_at: string
  progress_percentage: number
  last_accessed_at?: string
  lesson_progress: any[]
}

export default function CourseIntroPage() {
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
        (enrollment: Enrollment) => enrollment.course?.id === courseId
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

  const getDifficultyColor = (difficulty: string) => {
    if (!difficulty) return 'bg-gray-100 text-gray-800'
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLessonIcon = (lessonType: string) => {
    if (!lessonType) return BookOpen
    
    switch (lessonType.toLowerCase()) {
      case 'video':
        return Video
      case 'text':
        return FileText
      default:
        return BookOpen
    }
  }

  const startCourse = () => {
    if (course?.lessons && course.lessons.length > 0) {
      const firstLesson = course.lessons[0]
      router.push(`/student/courses/${courseId}/lessons/${firstLesson.id}`)
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
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{course.category?.name || 'Uncategorized'}</Badge>
              <Badge className={getDifficultyColor(course.difficulty)}>
                {course.difficulty}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
              {course.description}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.total_students} students
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration_hours} hours
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course.total_lessons} lessons
              </div>
              {course.average_rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {course.average_rating.toFixed(1)} ({course.total_ratings} reviews)
                </div>
              )}
            </div>
          </div>
          
          {course.thumbnail_url && (
            <div className="ml-8">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-64 h-36 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Preview Video */}
          {course.preview_video_id && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Course Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${course.preview_video_id}`}
                    title="Course Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                What You'll Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div 
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Curriculum */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Curriculum
              </CardTitle>
              <CardDescription>
                {course.total_lessons} lessons • {course.duration_hours} hours total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => {
                  const LessonIcon = getLessonIcon(lesson.lesson_type)
                  const isCompleted = isLessonCompleted(lesson.id)
                  const isAccessible = isLessonAccessible(lesson, index)
                  
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
                            <Badge variant="secondary" className="text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {lesson.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <LessonIcon className="w-3 h-3" />
                            {lesson.lesson_type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration_minutes} min
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          {enrollment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-semibold">{enrollment.progress_percentage || 0}%</span>
                  </div>
                  <Progress value={enrollment.progress_percentage || 0} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Lessons Completed</span>
                    <span className="font-semibold">
                      {course.lessons.filter(lesson => isLessonCompleted(lesson.id)).length}/{course.total_lessons}
                    </span>
                  </div>
                  <Progress 
                    value={(course.lessons.filter(lesson => isLessonCompleted(lesson.id)).length / course.total_lessons) * 100} 
                    className="h-2" 
                  />
                </div>
                
                {enrollment.last_accessed_at && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Last accessed: {new Date(enrollment.last_accessed_at).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Instructor</span>
                  <span className="text-sm font-medium">
                    {course.instructor?.first_name || 'Unknown'} {course.instructor?.last_name || 'Instructor'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Language</span>
                  <span className="text-sm font-medium">{course.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium">{course.duration_hours} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lessons</span>
                  <span className="text-sm font-medium">{course.total_lessons}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Course Button */}
          <Card>
            <CardContent className="p-6">
              <Button 
                onClick={startCourse}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                {enrollment ? 'Continue Learning' : 'Start Course'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              {enrollment && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Enrolled on {new Date(enrollment.enrolled_at).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
