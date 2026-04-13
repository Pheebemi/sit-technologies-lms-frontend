
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getStudentDashboardStats, getStudentEnrollments } from '@/lib/api'
import { toast } from 'sonner'
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Award, 
  Clock, 
  Play, 
  CheckCircle, 
  Star,
  TrendingUp,
  MessageCircle,
  FileText,
  Target
} from 'lucide-react'

interface DashboardStats {
  total_enrollments: number
  completed_courses: number
  total_study_hours: number
  average_progress: number
  recent_activity: any[]
  upcoming_lessons: any[]
}

export default function StudentDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [dashboardStats, enrollmentData] = await Promise.all([
        getStudentDashboardStats(),
        getStudentEnrollments()
      ])
      setStats(dashboardStats)
      setEnrollments(enrollmentData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Student
          </Badge>
          <Button size="sm" onClick={() => router.push('/courses')}>
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                <p className="text-3xl font-bold text-foreground">{stats?.total_enrollments || 0}</p>
                <p className="text-xs text-blue-600 mt-1">Enrolled courses</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                <p className="text-3xl font-bold text-foreground">{stats?.total_study_hours || 0}</p>
                <p className="text-xs text-green-600 mt-1">Total course hours</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-foreground">{stats?.completed_courses || 0}</p>
                <p className="text-xs text-purple-600 mt-1">Courses finished</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Progress</p>
                <p className="text-3xl font-bold text-foreground">{stats?.average_progress || 0}%</p>
                <p className="text-xs text-yellow-600 mt-1">Across all courses</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                My Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
                  <Button onClick={() => router.push('/courses')}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Button>
                </div>
              ) : (
                enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                        <h3 className="font-semibold">{enrollment.course_title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </p>
                  </div>
                      <Badge className={
                        enrollment.is_completed 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      }>
                        {enrollment.is_completed ? 'Completed' : 'In Progress'}
                      </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                        <span>{Math.round(enrollment.progress_percentage)}%</span>
                  </div>
                      <Progress value={enrollment.progress_percentage} className="h-2" />
                </div>
                <div className="flex items-center gap-2 mt-3">
                      {enrollment.is_completed ? (
                        <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push(`/student/certificates/${enrollment.id}`)}
                  >
                            <Award className="w-4 h-4 mr-1" />
                            View Certificate
                  </Button>
                  <Button size="sm" variant="ghost">
                            <Star className="w-4 h-4 mr-1" />
                            Leave Review
                  </Button>
                        </>
                      ) : (
                        <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      // Check if course data exists
                      if (!enrollment.course?.id) {
                        console.error('Course data not available')
                        toast.error('Course data not available')
                        return
                      }
                      
                      // Check if user has completed any lessons
                      const completedLessons = enrollment.lesson_progress?.filter((progress: any) => progress.is_completed) || []
                      
                      if (completedLessons.length === 0) {
                        // No lessons completed, go to intro
                        router.push(`/student/courses/${enrollment.course.id}/intro`)
                      } else {
                        // Find the next incomplete lesson
                        const nextIncompleteLesson = enrollment.course.lessons?.find((lesson: any) => {
                          const lessonProgress = enrollment.lesson_progress?.find((progress: any) => progress.lesson_id === lesson.id)
                          return !lessonProgress?.is_completed
                        })
                        
                        if (nextIncompleteLesson) {
                          router.push(`/student/courses/${enrollment.course.id}/lessons/${nextIncompleteLesson.id}`)
                        } else {
                          // All lessons completed, go to intro
                          router.push(`/student/courses/${enrollment.course.id}/intro`)
                        }
                      }
                    }}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Continue
                  </Button>
                  <Button size="sm" variant="ghost">
                    <FileText className="w-4 h-4 mr-1" />
                    Materials
                  </Button>
                        </>
                      )}
                </div>
              </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Streak & Motivation */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔥</span>
                </div>
                <h3 className="font-bold text-lg mb-2">7 Day Streak!</h3>
                <p className="text-sm text-muted-foreground mb-4">Keep the momentum going!</p>
                <div className="flex justify-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Lesson to Study */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Play className="w-5 h-5" />
                Continue Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.upcoming_lessons?.length === 0 ? (
                <div className="text-center py-6">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No lessons to continue</p>
                  <Button size="sm" onClick={() => router.push('/courses')}>
                    Find Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats?.upcoming_lessons?.slice(0, 1).map((upcoming: any) => (
                    <div key={upcoming.lesson.id} className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-sm mb-1">{upcoming.lesson.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{upcoming.course.title}</p>
                      <Button 
                        size="sm" 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => router.push(`/student/courses/${upcoming.course.id}/intro`)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Lesson
                      </Button>
                </div>
                  ))}
              </div>
              )}
            </CardContent>
          </Card>

          {/* Study Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                This Week's Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Lessons to Complete</span>
                  <span className="font-semibold text-green-600">2/3</span>
                </div>
                <Progress value={66} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Study Hours</span>
                  <span className="font-semibold text-blue-600">5.4/8h</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weekly Progress</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    On Track
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">First Course Complete!</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-blue-600" />
              </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">7 Day Streak</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => router.push('/student/achievements')}
              >
                View All Achievements →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}



