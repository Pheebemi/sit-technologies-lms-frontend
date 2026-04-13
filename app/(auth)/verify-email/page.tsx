"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { verifyEmailOTP, resendOTP } from '@/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, RefreshCw, CheckCircle } from 'lucide-react'

function VerifyEmailContent() {
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    } else {
      // If no email in params, redirect to sign up
      router.push('/sign-up')
    }
  }, [searchParams, router])

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleOtpChange = (value: string) => {
    // Only allow 6 digits
    const digits = value.replace(/\D/g, '').slice(0, 6)
    setOtpCode(digits)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otpCode.length !== 6) {
      toast.error('Please enter a 6-digit OTP code')
      return
    }
    
    setLoading(true)
    
    const loadingToast = toast.loading('Verifying your email...', {
      description: 'Please wait while we verify your OTP'
    })
    
    try {
      const res = await verifyEmailOTP(email, otpCode)
      
      // Save tokens to localStorage
      if (res.tokens) {
        localStorage.setItem('access_token', res.tokens.access)
        localStorage.setItem('refresh_token', res.tokens.refresh)
      }
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(res.user))
      
      toast.success('Email verified successfully!', {
        description: 'Welcome to SIT Technologies LMS! Redirecting to dashboard...',
        duration: 2000
      })
      
      setTimeout(() => {
        // Redirect based on user role
        if (res.user.role === 'student') {
          router.push('/student')
        } else if (res.user.role === 'tutor') {
          router.push('/tutor')
        } else {
          router.push('/')
        }
      }, 1000)
      
    } catch (err: unknown) {
      console.error('Verification error:', err)
      
      let errorMessage = 'Verification failed'
      let errorDescription = 'Please check your OTP code and try again'
      
      if (err.error) {
        errorMessage = err.error
        if (err.attempts_remaining !== undefined) {
          errorDescription = `${err.attempts_remaining} attempts remaining`
        }
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000
      })
    } finally {
      toast.dismiss(loadingToast)
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResendLoading(true)
    
    const loadingToast = toast.loading('Sending new OTP...', {
      description: 'Please wait while we generate a new code'
    })
    
    try {
      await resendOTP(email)
      
      toast.success('New OTP sent!', {
        description: 'Please check your email for the new verification code',
        duration: 3000
      })
      
      // Reset timer
      setTimeLeft(600)
      
    } catch (err: unknown) {
      console.error('Resend error:', err)
      
      let errorMessage = 'Failed to resend OTP'
      const errorDescription = 'Please try again later'
      
      if (err.error) {
        errorMessage = err.error
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000
      })
    } finally {
      toast.dismiss(loadingToast)
      setResendLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="otp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Enter verification code
          </label>
          <Input
            id="otp"
            type="text"
            placeholder="000000"
            value={otpCode}
            onChange={e => handleOtpChange(e.target.value)}
            className="h-12 text-center text-2xl font-mono tracking-widest"
            maxLength={6}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-10 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200" 
          disabled={loading || otpCode.length !== 6}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Verify email
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </Button>
      </form>

      {/* Timer and Resend */}
      <div className="text-center space-y-3">
        {timeLeft > 0 ? (
          <p className="text-sm text-muted-foreground">
            Code expires in <span className="font-medium text-foreground">{formatTime(timeLeft)}</span>
          </p>
        ) : (
          <p className="text-sm text-destructive">
            Code has expired. Please request a new one.
          </p>
        )}
        
        <Button
          type="button"
          variant="outline"
          onClick={handleResendOTP}
          disabled={resendLoading || timeLeft > 0}
          className="h-9"
        >
          {resendLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
              Sending...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Resend code
            </div>
          )}
        </Button>
      </div>


      {/* Back to Sign Up */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Wrong email? </span>
        <button 
          onClick={() => router.push('/sign-up')}
          className="text-primary hover:underline font-medium"
        >
          Go back to sign up
        </button>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
