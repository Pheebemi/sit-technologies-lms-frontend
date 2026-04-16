"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  BookOpen, 
  Users, 
  Calendar, 
  LogOut, 
  User,
  Home,
  MessageCircle,
  Bell,
  GraduationCap,
  Award,
  TrendingUp,
  Star,
  Target,
  FileText,
  Menu,
  X
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ role: string; first_name: string; last_name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token')
    console.log('Dashboard layout - checking token:', token ? 'exists' : 'missing')
    
    if (!token) {
      console.log('No token found, redirecting to sign-in')
      router.push('/sign-in')
      return
    }

    // Get user data from localStorage or API
    const userData = localStorage.getItem('user')
    console.log('Dashboard layout - user data:', userData ? 'exists' : 'missing')
    
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    setLoading(false)
  }, [router])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    router.push('/sign-in')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  )
}

  const isStudent = user?.role === 'student'
  const isTutor = user?.role === 'tutor'

  const navigation = isStudent ? [
    // Student Navigation
    {
      name: 'Dashboard',
      href: '/student',
      icon: Home,
      current: pathname === '/student'
    },
    {
      name: 'My Courses',
      href: '/student/courses',
      icon: BookOpen,
      current: pathname.includes('/student/courses')
    },
    {
      name: 'Progress',
      href: '/student/progress',
      icon: TrendingUp,
      current: pathname.includes('/student/progress')
    },
    {
      name: 'Achievements',
      href: '/student/achievements',
      icon: Award,
      current: pathname.includes('/student/achievements')
    },
    {
      name: 'Certificates',
      href: '/student/certificates',
      icon: GraduationCap,
      current: pathname.includes('/student/certificates')
    },
    {
      name: 'Study Goals',
      href: '/student/goals',
      icon: Target,
      current: pathname.includes('/student/goals')
    },
    {
      name: 'Messages',
      href: '/student/messages',
      icon: MessageCircle,
      current: pathname.includes('/student/messages')
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: FileText,
      current: pathname.includes('/blog')
    }
  ] : [
    // Tutor Navigation
    {
      name: 'Dashboard',
      href: '/tutor',
      icon: Home,
      current: pathname === '/tutor'
    },
    {
      name: 'My Courses',
      href: '/tutor/courses',
      icon: BookOpen,
      current: pathname.includes('/tutor/courses')
    },
    {
      name: 'My Students',
      href: '/tutor/students',
      icon: Users,
      current: pathname.includes('/tutor/students')
    },
    {
      name: 'Sessions',
      href: '/tutor/sessions',
      icon: Calendar,
      current: pathname.includes('/tutor/sessions')
    },
    {
      name: 'Analytics',
      href: '/tutor/analytics',
      icon: TrendingUp,
      current: pathname.includes('/tutor/analytics')
    },
    {
      name: 'Reviews',
      href: '/tutor/reviews',
      icon: Star,
      current: pathname.includes('/tutor/reviews')
    },
    {
      name: 'Messages',
      href: '/tutor/messages',
      icon: MessageCircle,
      current: pathname.includes('/tutor/messages')
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: FileText,
      current: pathname.includes('/blog')
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-card border-r">
          <div className="flex items-center justify-between flex-shrink-0 px-4">
            <div className="flex items-center space-x-3">
              <img src="/sit.png" alt="SIT Technologies" className="h-8 w-8 rounded-lg object-contain" />
              <div>
                <span className="text-lg font-bold text-foreground">SIT Technologies</span>
                <div className="text-xs text-muted-foreground -mt-1">LMS</div>
              </div>
            </div>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                )
              })}
            </nav>
        </div>

          {/* User info and logout */}
          <div className="flex-shrink-0 flex border-t border-border p-4">
              <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {user?.first_name} {user?.last_name}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {isStudent ? 'Student' : isTutor ? 'Tutor' : 'User'}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
                </div>
              </div>
                </div>
        </div>

      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <div className="flex flex-col flex-grow pt-5 bg-card border-r">
          <div className="flex items-center justify-between flex-shrink-0 px-4">
            <div className="flex items-center space-x-3">
              <img src="/sit.png" alt="SIT Technologies" className="h-8 w-8 rounded-lg object-contain" />
              <div>
                <span className="text-lg font-bold text-foreground">SIT Technologies</span>
                <div className="text-xs text-muted-foreground -mt-1">LMS</div>
              </div>
            </div>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                )
              })}
            </nav>
          </div>

          {/* User info and logout */}
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {user?.first_name} {user?.last_name}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {isStudent ? 'Student' : isTutor ? 'Tutor' : 'User'}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}