"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  GraduationCap,
  Download,
  Eye,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  Star,
  User,
  BookOpen
} from 'lucide-react'
import { getStudentEnrollments, getStudentCertificates, generateCertificate } from '@/lib/api'
import { toast } from 'sonner'

interface Enrollment {
  id: string
  course: {
    id: string
    title: string
    description: string
    instructor_name?: string
    difficulty: string
    total_lessons: number
    duration_hours: number
    average_rating: number
    category_name?: string
  }
  progress_percentage: number
  is_completed: boolean
  completed_at?: string
  enrolled_at: string
  last_accessed_at?: string
}

interface Certificate {
  id: number
  certificate_id: string
  course: {
    id: string
    title: string
  }
  issued_at: string
  image_file?: string
  image_file_url?: string
  is_verified: boolean
}

export default function StudentCertificatesPage() {
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [enrollmentData, certificateData] = await Promise.all([
        getStudentEnrollments(),
        getStudentCertificates().catch(() => []) // Don't fail if certificates API fails
      ])
      setEnrollments(enrollmentData || [])
      setCertificates(certificateData || [])
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCertificate = async (enrollmentId: string) => {
    try {
      setGenerating(enrollmentId)
      await generateCertificate(enrollmentId)
      toast.success('Certificate generated successfully!')
      // Reload certificates
      const certificateData = await getStudentCertificates()
      setCertificates(certificateData || [])
    } catch (error: any) {
      console.error('Failed to generate certificate:', error)
      toast.error(error?.message || 'Failed to generate certificate')
    } finally {
      setGenerating(null)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const downloadCertificate = async (enrollment: Enrollment) => {
    try {
      // Find the certificate for this enrollment
      const certificate = certificates.find(cert => 
        cert.course.id === enrollment.course.id
      )

      if (!certificate || !certificate.image_file_url) {
        toast.error('Certificate not generated yet. Please generate it first.')
        return
      }

      // Download the PNG image
      const response = await fetch(certificate.image_file_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Certificate_${enrollment.course.title.replace(/[^a-zA-Z0-9]/g, '_')}_${certificate.certificate_id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Certificate downloaded successfully!')
    } catch (error) {
      console.error('Failed to download certificate:', error)
      toast.error('Failed to download certificate')
    }
  }

  const viewCertificate = (enrollment: Enrollment) => {
    // This would open the certificate in a new tab
    router.push(`/student/certificates/${enrollment.id}`)
  }

  const completedCourses = enrollments.filter(enrollment => enrollment.is_completed)
  const totalCertificates = completedCourses.length

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading certificates...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Certificates</h1>
            <p className="text-muted-foreground">
              View and download your course completion certificates
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCertificates}</p>
                  <p className="text-sm text-muted-foreground">Certificates Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{enrollments.length}</p>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {enrollments.length > 0 ? Math.round(enrollments.reduce((acc, e) => acc + e.progress_percentage, 0) / enrollments.length) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Average Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Certificates List */}
      {completedCourses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Certificates Yet</h3>
            <p className="text-muted-foreground mb-6">
              Complete courses to earn your first certificate!
            </p>
            <Button onClick={() => router.push('/student/courses')}>
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {completedCourses.map((enrollment) => (
            <Card key={enrollment.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{enrollment.course.title}</h3>
                        <p className="text-muted-foreground">
                          by {enrollment.course.instructor_name || 'Unknown Instructor'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={getDifficultyColor(enrollment.course.difficulty)}>
                        {enrollment.course.difficulty || 'Unknown'}
                      </Badge>
                      <Badge variant="outline">
                        {enrollment.course.category_name || 'Uncategorized'}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{(enrollment.course.average_rating || 0).toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <BookOpen className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                        <p className="text-sm font-medium">{enrollment.course.total_lessons || 0}</p>
                        <p className="text-xs text-muted-foreground">Lessons</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Clock className="w-5 h-5 mx-auto mb-1 text-green-600" />
                        <p className="text-sm font-medium">{enrollment.course.duration_hours || 0}h</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Calendar className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                        <p className="text-sm font-medium">
                          {enrollment.completed_at ? formatDate(enrollment.completed_at) : 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Award className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                        <p className="text-sm font-medium">100%</p>
                        <p className="text-xs text-muted-foreground">Progress</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4">
                      {enrollment.course.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    {certificates.find(cert => cert.course.id === enrollment.course.id) ? (
                      <>
                        <Button
                          onClick={() => viewCertificate(enrollment)}
                          className="w-full"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Certificate
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => downloadCertificate(enrollment)}
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PNG
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleGenerateCertificate(enrollment.id)}
                        disabled={generating === enrollment.id}
                        className="w-full"
                      >
                        {generating === enrollment.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-2" />
                            Generate Certificate
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* In Progress Courses */}
      {enrollments.filter(e => !e.is_completed).length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments
              .filter(enrollment => !enrollment.is_completed)
              .slice(0, 3)
              .map((enrollment) => (
                <Card key={enrollment.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{enrollment.course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          by {enrollment.course.instructor_name || 'Unknown Instructor'}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getDifficultyColor(enrollment.course.difficulty)}>
                            {enrollment.course.difficulty || 'Unknown'}
                          </Badge>
                          <Badge variant="outline">
                            {enrollment.course.category_name || 'Uncategorized'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{enrollment.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progress_percentage}%` }}
                        />
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => router.push(`/student/courses/${enrollment.course.id}`)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Continue Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
