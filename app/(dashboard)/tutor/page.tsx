"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getTutorDashboardStats, getTutorCourses } from '@/lib/api'
import { toast } from 'sonner'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock, 
  Play, 
  MessageCircle, 
  FileText,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  UserCheck,
  BarChart3
} from 'lucide-react'

interface DashboardStats {
  total_courses: number
  total_students: number
  total_earnings: number
  average_rating: number
  recent_enrollments: any[]
  recent_reviews: any[]
}

export default function TutorDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [dashboardStats, tutorCourses] = await Promise.all([
        getTutorDashboardStats(),
        getTutorCourses()
      ])
      setStats(dashboardStats)
      setCourses(tutorCourses)
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
          <h1 className="text-3xl font-bold text-foreground">Tutor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your courses and track your teaching progress</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Tutor
          </Badge>
          <Button size="sm" onClick={() => router.push('/tutor/courses/create')}>
            <BookOpen className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-foreground">{stats?.total_students || 0}</p>
                <p className="text-xs text-blue-600 mt-1">Across all courses</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-3xl font-bold text-foreground">{stats?.total_courses || 0}</p>
                <p className="text-xs text-green-600 mt-1">{courses.filter(c => c.status === 'published').length} published</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-3xl font-bold text-foreground">₦{Number(stats?.total_earnings || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-xs text-purple-600 mt-1">From paid courses</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-3xl font-bold text-foreground">{stats?.average_rating || 0}</p>
                <p className="text-xs text-yellow-600 mt-1">Based on reviews</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                My Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first course to get started</p>
                  <Button onClick={() => router.push('/tutor/courses/create')}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                </div>
              ) : (
                courses.slice(0, 5).map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {course.total_lessons} lessons • {course.total_students} students
                          </p>
                    </div>
                  </div>
                      <Badge className={
                        course.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }>
                        {course.status}
                      </Badge>
                </div>
                <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => router.push(`/tutor/courses/${course.id}`)}>
                        <FileText className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/tutor/courses/${course.id}/lessons/create`)}>
                    <Play className="w-4 h-4 mr-1" />
                        Add Lesson
                  </Button>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                        <Star className="w-4 h-4" />
                        {course.average_rating.toFixed(1)}
                    </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Enrollments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats?.recent_enrollments?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent enrollments</p>
              ) : (
                stats?.recent_enrollments?.slice(0, 5).map((enrollment: any) => (
                  <div key={enrollment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {enrollment.student_name?.split(' ').map((n: string) => n[0]).join('') || 'S'}
                      </span>
                </div>
                <div className="flex-1">
                      <p className="font-medium text-sm">{enrollment.student_name || 'Student'}</p>
                      <p className="text-xs text-muted-foreground">{enrollment.course_title}</p>
                </div>
                    <Badge variant="secondary" className="text-xs">
                      {enrollment.is_completed ? 'Completed' : 'Active'}
                </Badge>
              </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/tutor/courses'}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                My Courses
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                View All Students
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Set Availability
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="w-4 h-4 mr-2" />
                View Earnings
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/tutor/courses/create'}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Recent Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats?.recent_reviews?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No reviews yet</p>
              ) : (
                stats?.recent_reviews?.slice(0, 3).map((review: any) => (
                  <div key={review.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-600" />
              </div>
                <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{review.student_name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                </div>
              </div>
                      <p className="text-xs text-muted-foreground mb-1">{review.course_title}</p>
                      {review.review_text && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{review.review_text}</p>
                      )}
                </div>
              </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
