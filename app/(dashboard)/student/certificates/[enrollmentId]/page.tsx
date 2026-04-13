"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Download,
  Share2,
  Printer,
  GraduationCap,
  CheckCircle,
  Calendar,
  Clock,
  BookOpen,
  User,
  Award,
  Star
} from 'lucide-react'
import { getStudentEnrollments, getStudentCertificates, generateCertificate } from '@/lib/api'
import { toast } from 'sonner'

interface Enrollment {
  id: string
  course: {
    id: string
    title: string
    description: string
    instructor?: {
      first_name: string
      last_name: string
    }
    difficulty_level?: string
    total_lessons: number
    duration_hours: number
    average_rating: number
    category?: {
      name: string
    }
  }
  progress_percentage: number
  is_completed: boolean
  completed_at?: string
  enrolled_at: string
  last_accessed_at?: string
}

export default function CertificateDetailPage() {
  const router = useRouter()
  const params = useParams()
  const enrollmentId = params.enrollmentId as string
  
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [certificate, setCertificate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (enrollmentId) {
      loadEnrollment()
    }
  }, [enrollmentId])

  const loadEnrollment = async () => {
    try {
      setLoading(true)
      const [enrollmentsData, certificatesData] = await Promise.all([
        getStudentEnrollments(),
        getStudentCertificates().catch(() => [])
      ])
      
      // Find enrollment by ID (handle both string and number types)
      const foundEnrollment = enrollmentsData.find((e: Enrollment) => {
        return String(e.id) === String(enrollmentId)
      })
      
      if (!foundEnrollment) {
        toast.error('Certificate not found')
        router.push('/student/certificates')
        return
      }

      if (!foundEnrollment.is_completed) {
        toast.error('Course not completed yet')
        router.push('/student/certificates')
        return
      }

      setEnrollment(foundEnrollment)
      setImageError(false) // Reset image error when loading new certificate
      
      // Find certificate for this enrollment
      // Try to match by enrollment ID first, then fall back to course ID
      const foundCertificate = certificatesData.find((cert: any) => {
        // Check if certificate has enrollment field and it matches (handle both string and number)
        if (cert.enrollment) {
          const certEnrollmentId = String(cert.enrollment)
          const enrollmentIdStr = String(foundEnrollment.id)
          if (certEnrollmentId === enrollmentIdStr) {
            return true
          }
        }
        // Fall back to matching by course ID
        if (cert.course && cert.course.id === foundEnrollment.course.id) {
          return true
        }
        return false
      })
      setCertificate(foundCertificate || null)
    } catch (error) {
      console.error('Failed to load enrollment:', error)
      toast.error('Failed to load certificate')
      router.push('/student/certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCertificate = async () => {
    if (!enrollment) return
    
    try {
      setGenerating(true)
      const result = await generateCertificate(enrollment.id)
      toast.success('Certificate generated successfully!')
      setCertificate(result.certificate)
      // Reload to get the image URL
      await loadEnrollment()
    } catch (error: any) {
      console.error('Failed to generate certificate:', error)
      toast.error(error?.message || 'Failed to generate certificate')
    } finally {
      setGenerating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const downloadCertificate = async () => {
    if (!certificate || !certificate.image_file_url) {
      toast.error('Certificate not generated yet. Please generate it first.')
      return
    }

    try {
      const response = await fetch(certificate.image_file_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Certificate_${enrollment?.course.title.replace(/[^a-zA-Z0-9]/g, '_')}_${certificate.certificate_id}.png`
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

  const shareCertificate = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate of Completion - ${enrollment?.course.title}`,
        text: `I completed the course "${enrollment?.course.title}"!`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Certificate link copied to clipboard!')
    }
  }

  const printCertificate = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading certificate...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Certificate Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The requested certificate could not be found.
            </p>
            <Button onClick={() => router.push('/student/certificates')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Certificates
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
          variant="outline"
          onClick={() => router.push('/student/certificates')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Certificates
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Certificate of Completion</h1>
            <p className="text-muted-foreground">
              Course: {enrollment.course.title}
            </p>
          </div>
          <div className="flex gap-2">
            {certificate ? (
              <>
                <Button onClick={downloadCertificate}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
                <Button variant="outline" onClick={shareCertificate}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={printCertificate}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </>
            ) : (
              <Button onClick={handleGenerateCertificate} disabled={generating}>
                {generating ? (
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
      </div>

      {/* Certificate */}
      <div className="max-w-4xl mx-auto">
        {certificate?.image_file_url ? (
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                {!imageError ? (
                  <img 
                    src={certificate.image_file_url} 
                    alt="Certificate" 
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      console.error('Image load error:', {
                        src: img.src,
                        error: e,
                        certificateUrl: certificate.image_file_url
                      })
                      setImageError(true)
                      toast.error('Failed to load certificate image. Please try downloading it instead.')
                    }}
                    onLoad={() => {
                      console.log('Certificate image loaded successfully')
                      setImageError(false)
                    }}
                  />
                ) : (
                  <div className="p-8 bg-muted rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      Unable to display certificate image. Please use the download button to view your certificate.
                    </p>
                    <Button onClick={downloadCertificate}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                )}
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  If the image doesn't display, click the Download button to save it.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="p-12">
            {/* Certificate Header */}
            <div className="text-center mb-12">
              <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6">
                <GraduationCap className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-primary mb-4">
                Certificate of Completion
              </h2>
              <p className="text-xl text-muted-foreground">
                This is to certify that
              </p>
            </div>

            {/* Student Name */}
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-2">John Doe</h3>
              <p className="text-lg text-muted-foreground">
                has successfully completed the course
              </p>
            </div>

            {/* Course Details */}
            <div className="text-center mb-12">
              <h4 className="text-2xl font-semibold mb-4">{enrollment.course.title}</h4>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {enrollment.course.difficulty_level || 'Unknown'} Level
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {enrollment.course.category?.name || 'Uncategorized'}
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {enrollment.course.description}
              </p>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center p-4 bg-muted rounded-lg">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{enrollment.course.total_lessons || 0}</p>
                <p className="text-sm text-muted-foreground">Lessons</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{enrollment.course.duration_hours || 0}h</p>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-lg font-bold">
                  {enrollment.completed_at ? formatDate(enrollment.completed_at) : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Award className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </div>

            {/* Instructor */}
            <div className="text-center mb-12">
              <p className="text-muted-foreground mb-2">Instructor</p>
              <p className="text-xl font-semibold">
                {enrollment.course.instructor?.first_name || 'Unknown'} {enrollment.course.instructor?.last_name || 'Instructor'}
              </p>
            </div>

            {/* Completion Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-6 py-3 rounded-full">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Course Completed Successfully</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Certificate ID: CERT-{enrollment.id.slice(-8).toUpperCase()}</p>
              <p>Issued on {enrollment.completed_at ? formatDate(enrollment.completed_at) : 'N/A'}</p>
              <p className="mt-2">This certificate is digitally verified and authentic</p>
            </div>
          </CardContent>
        </Card>
        )}
      </div>

      {/* Course Actions */}
      <div className="max-w-4xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Course Actions</CardTitle>
            <CardDescription>
              Continue your learning journey or explore related content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => router.push(`/student/courses/${enrollment.course.id}`)}>
                <BookOpen className="w-4 h-4 mr-2" />
                View Course
              </Button>
              <Button variant="outline" onClick={() => router.push('/student/courses')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Browse More Courses
              </Button>
              <Button variant="outline" onClick={() => router.push('/student/progress')}>
                <Award className="w-4 h-4 mr-2" />
                View Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
