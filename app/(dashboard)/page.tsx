"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Get user role from localStorage
    const userData = localStorage.getItem('user')
    
    if (userData) {
      const user = JSON.parse(userData)
      if (user.role === 'student') {
        router.replace('/student')
      } else if (user.role === 'tutor') {
        router.replace('/tutor')
      } else if (user.role === 'admin') {
        // Redirect admin to tutor dashboard for now (no admin dashboard yet)
        router.replace('/tutor')
      } else {
        // Fallback for unknown roles
        router.replace('/sign-in')
      }
    } else {
      // No user data, redirect to sign in
      router.replace('/sign-in')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
