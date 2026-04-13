"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Award, 
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  Play,
  Star
} from 'lucide-react'
import { toast } from 'sonner'
import { getStudentDashboardStats, getStudentEnrollments } from '@/lib/api'

interface Enrollment {
  id: string
  course: {
    id: string
    title: string
    category_name?: string
    difficulty: string
    total_lessons: number
    duration_hours: number
    instructor_name?: string
  }
  enrolled_at: string
  progress_percentage: number
  is_completed: boolean
  last_accessed_at?: string
  lesson_progress: any[]
}

interface DashboardStats {
  total_enrollments: number
  total_study_hours: number
  completed_courses: number
  average_progress: number
  recent_activity: any[]
  upcoming_lessons: any[]
  study_streak: number
  weekly_goals: {
    lessons_completed: number
    study_hours: number
    target_lessons: number
    target_hours: number
  }
}

export default function StudentProgressPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    try {
      setLoading(true)
      const [statsData, enrollmentsData] = await Promise.all([
        getStudentDashboardStats(),
        getStudentEnrollments()
      ])
      
      setStats(statsData)
      setEnrollments(enrollmentsData)
    } catch (error) {
      console.error('Error loading progress data:', error)
      toast.error('Failed to load progress data')
    } finally {
      setLoading(false)
    }
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 60) return 'text-yellow-600'
    if (progress >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading progress...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{stats?.total_enrollments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats?.completed_courses || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Hours</p>
                <p className="text-2xl font-bold">{stats?.total_study_hours || 0}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{stats?.average_progress || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Course Progress
              </CardTitle>
              <CardDescription>
                Track your progress across all enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses enrolled</h3>
                    <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in courses</p>
                    <Button onClick={() => router.push('/student/courses')}>
                      Browse Courses
                    </Button>
                  </div>
                ) : (
                  enrollments.map((enrollment) => {
                    // Skip enrollments without course data
                    if (!enrollment.course) {
                      console.log('Enrollment without course in progress page:', enrollment)
                      return null
                    }
                    
                    return (
                      <div key={enrollment.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{enrollment.course.title || 'Untitled Course'}</h3>
                            <p className="text-sm text-muted-foreground">
                              by {enrollment.course.instructor_name || 'Unknown Instructor'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(enrollment.course.difficulty)}>
                              {enrollment.course.difficulty || 'Unknown'}
                            </Badge>
                          {enrollment.is_completed && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className={`font-semibold ${getProgressColor(enrollment.progress_percentage)}`}>
                            {enrollment.progress_percentage}%
                          </span>
                        </div>
                        <Progress value={enrollment.progress_percentage} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>{enrollment.course.total_lessons || 0} lessons</span>
                          <span>{enrollment.course.duration_hours || 0}h duration</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {enrollment.last_accessed_at && (
                            <span>Last accessed: {new Date(enrollment.last_accessed_at).toLocaleDateString()}</span>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => enrollment.course?.id && router.push(`/student/courses/${enrollment.course.id}`)}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weekly Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Weekly Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Lessons Completed</span>
                  <span className="font-semibold">
                    {stats?.weekly_goals?.lessons_completed || 0}/{stats?.weekly_goals?.target_lessons || 5}
                  </span>
                </div>
                <Progress 
                  value={((stats?.weekly_goals?.lessons_completed || 0) / (stats?.weekly_goals?.target_lessons || 5)) * 100} 
                  className="h-2" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Study Hours</span>
                  <span className="font-semibold">
                    {stats?.weekly_goals?.study_hours || 0}/{stats?.weekly_goals?.target_hours || 10}h
                  </span>
                </div>
                <Progress 
                  value={((stats?.weekly_goals?.study_hours || 0) / (stats?.weekly_goals?.target_hours || 10)) * 100} 
                  className="h-2" 
                />
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Study Streak</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{stats?.study_streak || 0} days</span>
                    <span className="text-yellow-500">🔥</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recent_activity?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                ) : (
                  stats?.recent_activity?.slice(0, 5).map((activity: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.is_completed ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.is_completed ? 'Completed Lesson' : 'Started Lesson'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.lesson_title} - {new Date(activity.completed_at || activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Study Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Study Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Study calendar coming soon</p>
                <p className="text-xs text-muted-foreground">Track your daily study sessions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
