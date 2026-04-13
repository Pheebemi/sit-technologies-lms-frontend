"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, CreditCard, Loader2 } from 'lucide-react'
import { verifyPayment } from '@/lib/payment-api'
import { toast } from 'sonner'

function MockPaymentContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleMockPayment = async () => {
      try {
        const txRef = searchParams.get('tx_ref')
        
        if (!txRef) {
          setStatus('error')
          setMessage('Invalid payment reference')
          return
        }

        // Simulate payment processing
        setMessage('Processing mock payment...')
        
        // Wait 2 seconds to simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Verify payment with backend
        const result = await verifyPayment('mock-transaction-id', txRef)
        
        setStatus('success')
        setMessage('Mock payment successful! You have been enrolled in the course.')
        
        // Redirect to courses page after 3 seconds
        setTimeout(() => {
          router.push('/student/courses')
        }, 3000)

      } catch (error) {
        console.error('Mock payment verification failed:', error)
        setStatus('error')
        setMessage('Mock payment verification failed. Please try again.')
      }
    }

    handleMockPayment()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Mock Payment</CardTitle>
          <CardDescription>
            Testing payment flow locally...
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <p className="text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <p className="text-green-600 font-semibold">{message}</p>
              <p className="text-sm text-gray-600">
                Redirecting you to your courses...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <CreditCard className="w-12 h-12 text-red-600 mx-auto" />
              <p className="text-red-600 font-semibold">{message}</p>
              <Button 
                onClick={() => router.push('/student/courses')}
                className="mt-4"
              >
                Back to Courses
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Mock Payment</CardTitle>
            <CardDescription>
              Loading payment verification...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <p className="text-gray-600 mt-4">Processing...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <MockPaymentContent />
    </Suspense>
  )
}

