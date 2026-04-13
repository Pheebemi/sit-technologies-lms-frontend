"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Search,
  Play,
  CheckCircle,
  Lock,
  TrendingUp,
  Award,
  ShoppingCart,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { getCourses, enrollInCourse, getStudentEnrollments } from '@/lib/api'
import { initiatePayment } from '@/lib/payment-api'

interface Course {
  id: string
  title: string
  description: string
  short_description?: string
  instructor_name?: string
  category_name?: string
  price: number
  total_lessons: number
  duration_hours: number
  difficulty: string
  average_rating: number
  total_students: number
  thumbnail_url?: string
  is_published: boolean
  is_free: boolean
}

interface Enrollment {
  id: string
  course: Course
  enrolled_at: string
  progress_percentage: number
  is_completed: boolean
  last_accessed_at?: string
}

export default function StudentCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [enrolling, setEnrolling] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Filter courses based on search term
    console.log('Courses in filter effect:', courses, 'Type:', typeof courses, 'Is Array:', Array.isArray(courses))
    
    // Ensure courses is always an array
    const coursesArray = Array.isArray(courses) ? courses : []
    
    if (searchTerm.trim() === '') {
      setFilteredCourses(coursesArray)
    } else {
      const filtered = coursesArray.filter(course =>
        course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course?.instructor?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course?.instructor?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCourses(filtered)
    }
  }, [courses, searchTerm])

  const loadData = async () => {
    try {
      setLoading(true)
      const [coursesData, enrollmentsData] = await Promise.all([
        getCourses(),
        getStudentEnrollments()
      ])
      
      console.log('Raw courses data:', coursesData)
      console.log('Courses results:', coursesData.results)
      console.log('Enrollments data:', enrollmentsData)
      
      // Handle paginated response from getCourses
      setCourses(coursesData.results || [])
      setEnrollments(enrollmentsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrolling(courseId)
      console.log('Enrolling in course:', courseId)
      
      const enrollmentResponse = await enrollInCourse(courseId)
      console.log('Enrollment response:', enrollmentResponse)
      
      toast.success('Successfully enrolled in course!')
      
      // Find the course that was enrolled in
      const enrolledCourse = courses.find(course => course.id === courseId)
      if (enrolledCourse) {
        // Create a new enrollment object and add it to the state
        const newEnrollment = {
          id: enrollmentResponse.id || Date.now().toString(), // Use response ID or fallback
          course: enrolledCourse,
          enrolled_at: new Date().toISOString(),
          progress_percentage: 0,
          is_completed: false,
          last_accessed_at: null
        }
        
        // Update enrollments state immediately
        setEnrollments(prevEnrollments => [...prevEnrollments, newEnrollment])
        console.log('Added new enrollment to state:', newEnrollment)
      }
      
      // Also reload enrollments from server as backup
      try {
        const updatedEnrollments = await getStudentEnrollments()
        console.log('Updated enrollments from server:', updatedEnrollments)
        setEnrollments(updatedEnrollments)
      } catch (serverError) {
        console.log('Failed to reload enrollments from server, using local state')
      }
      
    } catch (error) {
      console.error('Error enrolling in course:', error)
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        response: error?.response,
        stack: error?.stack
      })
      toast.error(`Failed to enroll in course: ${error?.message || 'Unknown error'}`)
    } finally {
      setEnrolling(null)
    }
  }

  const handleBuyCourse = async (courseId: string, price: number) => {
    try {
      setEnrolling(courseId)
      
      // Initiate payment
      const paymentData = await initiatePayment(courseId, price)
      
      // Redirect to Flutterwave payment page
      window.location.href = paymentData.payment_url
      
    } catch (error: any) {
      console.error('Error initiating payment:', error)
      
      // Handle specific error cases
      if (error.message.includes('pending payment')) {
        toast.error('You already have a pending payment for this course. Please complete it first.')
      } else if (error.message.includes('already enrolled')) {
        toast.error('You are already enrolled in this course.')
        // Refresh the page to update the UI
        window.location.reload()
      } else {
        toast.error('Failed to initiate payment')
      }
    } finally {
      setEnrolling(null)
    }
  }

  const isEnrolled = (courseId: string) => {
    const enrolled = enrollments.some(enrollment => enrollment.course?.id === courseId)
    console.log(`Checking enrollment for course ${courseId}:`, enrolled, 'Total enrollments:', enrollments.length)
    return enrolled
  }

  const getEnrollment = (courseId: string) => {
    return enrollments.find(enrollment => enrollment.course?.id === courseId)
  }

  const getDifficultyColor = (difficulty: string | null | undefined) => {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Courses</h1>
        <p className="text-muted-foreground">Discover and enroll in courses to start your learning journey</p>
      </div>

      {/* Search and Stats */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search courses, instructors, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Available Courses</p>
                  <p className="text-2xl font-bold">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled</p>
                  <p className="text-2xl font-bold">{enrollments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">
                    {enrollments.filter(e => !e.is_completed && e.progress_percentage > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {enrollments.filter(e => e.is_completed).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* My Enrollments Section */}
      {enrollments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => {
              // Skip enrollments without course data
              if (!enrollment.course) {
                console.log('Enrollment without course:', enrollment)
                return null
              }
              
              return (
                <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{enrollment.course.title || 'Untitled Course'}</CardTitle>
                        <CardDescription className="mb-3">
                          by {enrollment.course.instructor_name || 'Unknown Instructor'}
                        </CardDescription>
                      </div>
                      <Badge className={getDifficultyColor(enrollment.course.difficulty)}>
                        {enrollment.course.difficulty || 'Unknown'}
                      </Badge>
                    </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {enrollment.course.total_lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {enrollment.course.duration_hours}h
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-semibold">{enrollment.progress_percentage}%</span>
                      </div>
                      <Progress value={enrollment.progress_percentage} className="h-2" />
                    </div>
                    
                    {enrollment.is_completed && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Course Completed!</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => router.push(`/student/courses/${enrollment.course.id}`)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {enrollment.is_completed ? 'Review Course' : 'Continue Learning'}
                  </Button>
                </CardFooter>
              </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Available Courses Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {searchTerm ? `Search Results (${filteredCourses.length})` : 'Available Courses'}
        </h2>
        
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No courses are available at the moment'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const enrolled = isEnrolled(course.id)
              const enrollment = getEnrollment(course.id)
              
              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                        <CardDescription className="mb-3">
                          by {course.instructor_name || 'Unknown Instructor'}
                        </CardDescription>
                      </div>
                      <Badge className={getDifficultyColor(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.total_lessons} lessons
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration_hours}h
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.total_students}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{course.average_rating.toFixed(1)}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {course.category_name || 'Uncategorized'}
                          </Badge>
                        </div>
                        
                        {/* Price Display */}
                        <div className="text-right">
                          {course.is_free ? (
                            <div className="flex items-center gap-1 text-green-600 font-semibold">
                              <span className="text-lg">FREE</span>
                            </div>
                          ) : (
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">₦{course.price?.toLocaleString() || '0'}</div>
                              <div className="text-xs text-muted-foreground">One-time payment</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {enrolled && enrollment && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Your Progress</span>
                            <span className="font-semibold">{enrollment.progress_percentage}%</span>
                          </div>
                          <Progress value={enrollment.progress_percentage} className="h-2" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    {enrolled ? (
                      <Button 
                        className="w-full"
                        onClick={() => router.push(`/student/courses/${course.id}`)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {enrollment?.is_completed ? 'Review Course' : 'Continue Learning'}
                      </Button>
                    ) : course.is_free ? (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrolling === course.id}
                      >
                        {enrolling === course.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Enrolling...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Enroll Now
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="w-full space-y-2">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleBuyCourse(course.id, course.price)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy Now - ₦{course.price?.toLocaleString() || '0'}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => router.push(`/student/courses/${course.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Course
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
