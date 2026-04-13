"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTutorCourse, getLessons, getTutorCourseStats, Course, Lesson } from '@/lib/api'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Clock, 
  Users, 
  Star,
  DollarSign,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Eye,
  EyeOff,
  MoreVertical,
  ChevronRight
} from 'lucide-react'

export default function CourseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (courseId) {
      loadCourseData()
    }
  }, [courseId])

  // Refresh data when page becomes visible (e.g., returning from lesson creation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && courseId) {
        loadCourseData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [courseId])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      const [courseData, lessonsData, statsData] = await Promise.all([
        getTutorCourse(courseId),
        getLessons(courseId),
        getTutorCourseStats(courseId)
      ])
      setCourse(courseData)
      setLessons(lessonsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load course data:', error)
      toast.error('Failed to load course data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading course...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Course not found</h3>
              <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or you don't have access to it.</p>
              <Button onClick={() => router.push('/tutor/courses')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/tutor/courses')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <Badge className={getStatusColor(course.status)}>
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </Badge>
              {course.is_featured && (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{course.short_description || course.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push(`/tutor/courses/${courseId}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Course
            </Button>
            <Button onClick={() => router.push(`/tutor/courses/${courseId}/lessons/create`)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lesson
            </Button>
          </div>
        </div>

        {/* Course Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{course.total_lessons}</div>
                    <div className="text-sm text-muted-foreground">Lessons</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{course.total_students}</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{course.average_rating.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{course.duration_hours}h</div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    {course.is_free ? 'Free' : `₦${Number(course.price || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {course.duration_hours} hours
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    {course.language}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Thumbnail/Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                )}
                
                {course.preview_video_id && (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${course.preview_video_id}`}
                      title="Course Preview"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lessons */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Lessons ({lessons.length})
              </CardTitle>
              <Button onClick={() => router.push(`/tutor/courses/${courseId}/lessons/create`)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Lesson
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {lessons.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No lessons yet</h3>
                <p className="text-muted-foreground mb-6">Start building your course by adding your first lesson.</p>
                <Button onClick={() => router.push(`/tutor/courses/${courseId}/lessons/create`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Lesson
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {lesson.order}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{lesson.title}</h3>
                          {lesson.is_published ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              Published
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Draft
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {lesson.description || 'No description provided'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration_minutes} min
                          </div>
                          {lesson.video_id && (
                            <div className="flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              Video
                            </div>
                          )}
                          {lesson.has_quiz && (
                            <div className="flex items-center gap-1">
                              <HelpCircle className="w-3 h-3" />
                              Quiz
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/tutor/courses/${courseId}/lessons/${lesson.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/tutor/courses/${courseId}/lessons/${lesson.id}`)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
