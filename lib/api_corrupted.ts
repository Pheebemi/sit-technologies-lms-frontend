export const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT || 'http://localhost:8000'

type RegisterData = {
  username: string
  email: string
  password: string
  password_confirm: string
  first_name?: string
  last_name?: string
  role?: 'student' | 'tutor'
}

export async function register(data: RegisterData) {
  const res = await fetch(`${API_ROOT}/api/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  const json = await res.json()
  if (!res.ok) throw json
  return json
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_ROOT}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  })

  const json = await res.json()
  if (!res.ok) throw json
  return json
}

export function saveTokens(tokens: { access: string; refresh: string }) {
  if (typeof window === 'undefined') return
  localStorage.setItem('access', tokens.access)
  localStorage.setItem('refresh', tokens.refresh)
}

export async function verifyEmailOTP(email: string, otpCode: string) {
  const res = await fetch(`${API_ROOT}/api/auth/verify-email/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp_code: otpCode }),
    credentials: 'include',
  })

  const json = await res.json()
  if (!res.ok) throw json
  return json
}

export async function resendOTP(email: string) {
  const res = await fetch(`${API_ROOT}/api/auth/resend-otp/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include',
  })

  const json = await res.json()
  if (!res.ok) throw json
  return json
}

// Course Management API Functions
export type Course = {
  id: string
  title: string
  description: string
  short_description?: string
  instructor_name: string
  category_name?: string
  price: number
  is_free: boolean
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number
  language: string
  thumbnail_url?: string
  preview_video_id?: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  total_lessons: number
  total_students: number
  average_rating: number
  total_ratings: number
  created_at: string
  published_at?: string
}

export type Category = {
  id: number
  name: string
  description?: string
  color: string
  icon?: string
  created_at: string
}

export type Lesson = {
  id: string
  title: string
  description?: string
  order: number
  duration_minutes: number
  video_id?: string
  has_quiz: boolean
  is_published: boolean
  created_at: string
}

export type Quiz = {
  id: string
  title: string
  description?: string
  time_limit_minutes: number
  passing_score: number
  max_attempts: number
  is_published: boolean
  questions: QuizQuestion[]
  created_at: string
  updated_at: string
}

export type QuizQuestion = {
  id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  order: number
  points: number
  options: string[]
  correct_answer: string
  acceptable_answers: string[]
}

// Helper function to get auth headers
function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_ROOT}/api/courses/categories/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) throw new Error('Failed to fetch categories')
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


// Courses
export async function getCourses(params?: {
  search?: string
  category?: string
  difficulty?: string
  is_free?: boolean
  is_featured?: boolean
  sort_by?: string
  page?: number
}): Promise<{ results: Course[], count: number, next?: string, previous?: string }> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.append('search', params.search)
  if (params?.category) searchParams.append('category', params.category)
  if (params?.difficulty) searchParams.append('difficulty', params.difficulty)
  if (params?.is_free !== undefined) searchParams.append('is_free', params.is_free.toString())
  if (params?.is_featured !== undefined) searchParams.append('is_featured', params.is_featured.toString())
  if (params?.sort_by) searchParams.append('sort_by', params.sort_by)
  if (params?.page) searchParams.append('page', params.page.toString())
  
  const res = await fetch(`${API_ROOT}/api/courses/courses/?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) throw new Error('Failed to fetch courses')
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


export async function getCourse(courseId: string): Promise<Course> {
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) throw new Error('Failed to fetch course')
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


export async function createCourse(data: {
  title: string
  description: string
  short_description?: string
  category?: number
  price: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number
  language: string
  thumbnail?: File
  preview_video_url?: string
  status: 'draft' | 'published'
  is_featured: boolean
}): Promise<Course> {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('description', data.description)
  if (data.short_description) formData.append('short_description', data.short_description)
  if (data.category) formData.append('category', data.category.toString())
  formData.append('price', data.price.toString())
  formData.append('difficulty', data.difficulty)
  formData.append('duration_hours', data.duration_hours.toString())
  formData.append('language', data.language)
  if (data.thumbnail) formData.append('thumbnail', data.thumbnail)
  if (data.preview_video_url) formData.append('preview_video_url', data.preview_video_url)
  formData.append('status', data.status)
  formData.append('is_featured', data.is_featured.toString())
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null
  const res = await fetch(`${API_ROOT}/api/courses/courses/create/`, {
    method: 'POST',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
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


export async function updateCourse(courseId: string, data: Partial<{
  title: string
  description: string
  short_description: string
  category: number
  price: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number
  language: string
  thumbnail: File
  preview_video_url: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
}>): Promise<Course> {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString())
    }
  })
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/update/`, {
    method: 'PATCH',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
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


export async function deleteCourse(courseId: string): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/delete/`, {
    method: 'DELETE',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  })
  
  if (!res.ok) throw new Error('Failed to delete course')
}

// Lessons
export async function getLessons(courseId: string): Promise<Lesson[]> {
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/lessons/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) throw new Error('Failed to fetch lessons')
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


export async function getLesson(lessonId: string): Promise<Lesson> {
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


export async function createLesson(courseId: string, data: {
  title: string
  description?: string
  order: number
  content?: string
  video_url?: string
  duration_minutes: number
  resources?: string[]
  is_published: boolean
}): Promise<Lesson> {
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


export async function updateLesson(lessonId: string, data: Partial<{
  title: string
  description: string
  order: number
  content: string
  video_url: string
  duration_minutes: number
  resources: string[]
  is_published: boolean
}>): Promise<Lesson> {
  const res = await fetch(`${API_ROOT}/api/courses/lessons/${lessonId}/update/`, {
    method: 'PATCH',
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


export async function deleteLesson(lessonId: string): Promise<void> {
  const res = await fetch(`${API_ROOT}/api/courses/lessons/${lessonId}/delete/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) throw new Error('Failed to delete lesson')
}

// Quizzes
export async function getQuiz(quizId: string): Promise<Quiz> {
  const res = await fetch(`${API_ROOT}/api/courses/quizzes/${quizId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) throw new Error('Failed to fetch quiz')
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


export async function createQuiz(lessonId: string, data: {
  title: string
  description?: string
  time_limit_minutes: number
  passing_score: number
  max_attempts: number
  is_published: boolean
  questions: Omit<QuizQuestion, 'id'>[]
}): Promise<Quiz> {
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
      // If response is not JSON (e.g., HTML error page), create a generic error
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


export async function updateQuiz(quizId: string, data: Partial<{
  title: string
  description: string
  time_limit_minutes: number
  passing_score: number
  max_attempts: number
  is_published: boolean
  questions: Omit<QuizQuestion, 'id'>[]
}>): Promise<Quiz> {
  const res = await fetch(`${API_ROOT}/api/courses/quizzes/${quizId}/update/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch (parseError) {
      // If response is not JSON (e.g., HTML error page), create a generic error
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


// Tutor Dashboard
export async function getTutorCourses(): Promise<Course[]> {
  const res = await fetch(`${API_ROOT}/api/courses/tutor/courses/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) throw new Error('Failed to fetch tutor courses')
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


export async function getTutorCourseStats(courseId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/tutor/courses/${courseId}/stats/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) throw new Error('Failed to fetch course stats')
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


export async function getTutorDashboardStats(): Promise<{
  total_courses: number
  total_students: number
  total_earnings: number
  average_rating: number
  recent_enrollments: any[]
  recent_reviews: any[]
}> {
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


// Student API Functions
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


export async function getStudentDashboardStats(): Promise<{
  total_enrollments: number
  completed_courses: number
  total_study_hours: number
  average_progress: number
  recent_activity: any[]
  upcoming_lessons: any[]
}> {
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


export async function enrollInCourse(courseId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/enroll/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ course_id: courseId }),
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


export async function markLessonComplete(lessonId: string): Promise<any> {
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
