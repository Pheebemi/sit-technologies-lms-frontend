const API_ROOT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token')
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

export async function createCourse(data: {
  title: string
  description: string
  category: string
  difficulty_level: string
  price: number
  preview_video_url?: string
  duration_hours: number
  is_published: boolean
}): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/courses/create/`, {
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
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/lessons/${lessonId}/`, {
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

// Quizzes
export async function getQuiz(courseId: string, lessonId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/lessons/${lessonId}/quiz/`, {
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

// Enrollments
export async function enrollInCourse(courseId: string): Promise<any> {
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/enroll/`, {
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
  const res = await fetch(`${API_ROOT}/api/courses/courses/${courseId}/lessons/${lessonId}/complete/`, {
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
