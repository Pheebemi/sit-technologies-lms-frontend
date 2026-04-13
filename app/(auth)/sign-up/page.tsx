"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signUp } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUpPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    role: 'student',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.password_confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await signUp(form)
      if (res.email_verification_required) {
        localStorage.setItem('user', JSON.stringify(res.user))
        toast.success('Account created! Check your email for a verification code.')
        setTimeout(() => router.push(`/verify-email?email=${encodeURIComponent(res.email)}`), 800)
      } else {
        if (res.tokens) {
          localStorage.setItem('access_token', res.tokens.access)
          localStorage.setItem('refresh_token', res.tokens.refresh)
        }
        localStorage.setItem('user', JSON.stringify(res.user))
        toast.success('Account created!')
        setTimeout(() => {
          if (res.user.role === 'student') router.push('/student')
          else if (res.user.role === 'tutor') router.push('/tutor')
          else router.push('/')
        }, 800)
      }
    } catch (err: any) {
      const errors = err.response?.data?.errors
      const description = errors?.username?.[0] || errors?.email?.[0] || errors?.password?.[0]
      toast.error(err.response?.data?.message || 'Failed to create account', {
        description,
      })
    } finally {
      setLoading(false)
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Create account</h2>
        <p className="text-sm text-muted-foreground">Fill in your details to get started</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* Role */}
        <div className="space-y-1">
          <label className="text-sm font-medium">I am a</label>
          <div className="flex gap-2">
            {['student', 'tutor'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setForm(f => ({ ...f, role }))}
                className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors capitalize ${
                  form.role === role
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-muted'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">First name</label>
            <Input placeholder="John" value={form.first_name} onChange={set('first_name')} required />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Last name</label>
            <Input placeholder="Doe" value={form.last_name} onChange={set('last_name')} required />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Username</label>
          <Input placeholder="johndoe" value={form.username} onChange={set('username')} required />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Confirm password</label>
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password_confirm}
              onChange={set('password_confirm')}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.password_confirm && form.password !== form.password_confirm && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
