const API_ROOT = process.env.NEXT_PUBLIC_API_URL || 'https://api.sittechnologies.ng'

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// User Authentication
export async function signUp(data: {
  email: string
  password: string
  first_name: string
  last_name: string
  role: 'student' | 'tutor'
}): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function signIn(data: {
  email: string
  password: string
}): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function verifyEmailOTP(email: string, otp: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/auth/verify-email/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp_code: otp }),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function resendOTP(email: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/auth/resend-otp/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Categories
export async function getCategories(): Promise<any[]> {
  const res = await fetch(`${API_ROOT}/api/courses/categories/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Courses
export async function getCourses(): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/courses/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getCourse(courseId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getTutorCourse(courseId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/tutor/courses/${courseId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getTutorLesson(courseId: string, lessonId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/tutor/courses/${courseId}/lessons/${lessonId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function createCourse(data: {
  title: string
  description: string
  short_description?: string
  category?: number
  price: number
  difficulty: string
  duration_hours: number
  language?: string
  thumbnail?: File
  preview_video_url?: string
  status?: string
  is_featured?: boolean
}): Promise<any> {
  // Create FormData for file upload
  const formData = new FormData()
  
  // Add all fields to FormData
  formData.append('title', data.title)
  formData.append('description', data.description)
  if (data.short_description) formData.append('short_description', data.short_description)
  if (data.category) formData.append('category', data.category.toString())
  formData.append('price', data.price.toString())
  formData.append('difficulty', data.difficulty)
  formData.append('duration_hours', data.duration_hours.toString())
  if (data.language) formData.append('language', data.language)
  if (data.preview_video_url) formData.append('preview_video_url', data.preview_video_url)
  if (data.status) formData.append('status', data.status)
  if (data.is_featured !== undefined) formData.append('is_featured', data.is_featured.toString())
  if (data.thumbnail) formData.append('thumbnail', data.thumbnail)

  const res = await fetch(`${API_ROOT}/api/courses/courses/create/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: formData,
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function updateCourse(courseId: string, data: any): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/update/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Lessons
export async function getLessons(courseId: string): Promise<any[]> {
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/lessons/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getLesson(courseId: string, lessonId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/lessons/${lessonId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function createLesson(courseId: string, data: {
  title: string
  description?: string
  order: number
  content?: string
  video_url?: string
  duration_minutes: number
  resources?: string[]
  is_published: boolean
}): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/lessons/create/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  return res.json()
}

// Quizzes - Note: Quiz data is included in lesson detail response

export async function submitQuizAttempt(quizId: string, answers: any[]): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/quizzes/${quizId}/submit/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ answers }),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getQuiz(courseId: string, lessonId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/lessons/${lessonId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }

  const lessonData = await res.json()
  if (!lessonData.quiz) {
    throw new Error('No quiz found for this lesson')
  }

  return lessonData.quiz
}

export async function getQuizAttempts(quizId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/quizzes/${quizId}/attempts/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }

  return res.json()
}

// Auto-generate quiz
export async function autoGenerateQuiz(courseId: string, lessonId: string, numQuestions: number = 5, difficulty: string = 'medium'): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/tutor/courses/${courseId}/lessons/${lessonId}/generate-quiz/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      num_questions: numQuestions,
      difficulty: difficulty
    }),
  })

  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }

  return res.json()
}

// Enrollments
export async function enrollInCourse(courseId: string): Promise<any> {
  console.log('API: Enrolling in course:', courseId)
  console.log('API: URL:', `${API_ROOT}/api/courses/enroll/`)

  const res = await fetch(`${API_ROOT}/api/courses/enroll/`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ course_id: courseId }),
  })
  
  console.log('API: Response status:', res.status, res.statusText)
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
      console.log('API: Error response:', error)
    } catch (parseError) {
      console.log('API: Failed to parse error response:', parseError)
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  const data = await res.json()
  console.log('API: Success response:', data)
  return data
}

export async function getStudentEnrollments(): Promise<any[]> {
  const res = await fetch(`${API_ROOT}/api/courses/student/enrollments/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Progress
export async function markLessonComplete(courseId: string, lessonId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/lessons/${lessonId}/complete/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Dashboard Stats
export async function getTutorDashboardStats(): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/tutor/dashboard/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getStudentDashboardStats(): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/student/dashboard/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getTutorCourses(): Promise<any[]> {
  const res = await fetch(`${API_ROOT}/api/courses/tutor/courses/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Certificate API functions
export async function getStudentCertificates(): Promise<any[]> {
  const res = await fetch(`${API_ROOT}/api/courses/student/certificates/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function generateCertificate(enrollmentId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/student/certificates/generate/${enrollmentId}/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getCertificateDetail(certificateId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/student/certificates/${certificateId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Quiz Management
export async function createQuiz(lessonId: string, data: any): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/lessons/${lessonId}/quiz/create/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function updateQuiz(quizId: string, data: any): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/quizzes/${quizId}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Course Management
export async function deleteCourse(courseId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/${courseId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getTutorCourseStats(courseId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/tutor/courses/${courseId}/stats/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Lesson Management
export async function updateLesson(courseId: string, lessonId: string, data: any): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/lessons/${lessonId}/update/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function deleteLesson(courseId: string, lessonId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/lessons/${lessonId}/delete/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Blog API functions
export async function getBlogPosts(params?: {
  page?: number
  category?: string
  tag?: string
  search?: string
}): Promise<any> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.append('page', params.page.toString())
  if (params?.category) searchParams.append('category', params.category)
  if (params?.tag) searchParams.append('tag', params.tag)
  if (params?.search) searchParams.append('search', params.search)
  
  const queryString = searchParams.toString()
  const url = `${API_ROOT}/api/blog/posts/${queryString ? `?${queryString}` : ''}`
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getBlogPost(slug: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/blog/posts/${slug}/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getBlogCategories(): Promise<any[]> {
  const res = await fetch(`${API_ROOT}/api/blog/categories/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getBlogTags(): Promise<any[]> {
  const res = await fetch(`${API_ROOT}/api/blog/tags/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getBlogStats(): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/blog/stats/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function addBlogComment(postSlug: string, data: {
  name: string
  email: string
  content: string
}): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/blog/posts/${postSlug}/comments/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Admin Blog API functions
export async function getAdminBlogPosts(): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/blog/admin/posts/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function createBlogPost(data: {
  title: string
  slug: string
  category: number
  tags: number[]
  excerpt: string
  content: string
  featured_image?: File
  meta_description: string
  status: 'draft' | 'published' | 'archived'
}): Promise<any> {
  const formData = new FormData()
  
  formData.append('title', data.title)
  formData.append('slug', data.slug)
  formData.append('category', data.category.toString())
  formData.append('excerpt', data.excerpt)
  formData.append('content', data.content)
  formData.append('meta_description', data.meta_description)
  formData.append('status', data.status)
  
  // Add tags
  data.tags.forEach(tagId => {
    formData.append('tags', tagId.toString())
  })
  
  if (data.featured_image) {
    formData.append('featured_image', data.featured_image)
  }

  const res = await fetch(`${API_ROOT}/api/blog/admin/posts/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: formData,
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function updateBlogPost(postId: string, data: any): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/blog/admin/posts/${postId}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function deleteBlogPost(postId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/blog/admin/posts/${postId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getAdminBlogCategories(): Promise<any[]> {
  const res = await fetch(`${API_ROOT}/api/blog/admin/categories/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function createBlogCategory(data: {
  name: string
  slug: string
  description: string
}): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/blog/admin/categories/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getAdminBlogTags(): Promise<any[]> {
  const res = await fetch(`${API_ROOT}/api/blog/admin/tags/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function createBlogTag(data: {
  name: string
  slug: string
}): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/blog/admin/tags/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getAdminBlogComments(): Promise<any[]> {
  const res = await fetch(`${API_ROOT}/api/blog/admin/comments/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function approveBlogComment(commentId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/blog/admin/comments/${commentId}/approve/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

export async function getAdminBlogStats(): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/blog/admin/stats/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}

// Contact Form API functions
export async function submitContactForm(data: {
  first_name: string
  last_name: string
  email: string
  phone?: string
  message: string
}): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/contacts/submit/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      error = {
        error: 'Server Error',
        message: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    throw error
  }
  
  return res.json()
}
