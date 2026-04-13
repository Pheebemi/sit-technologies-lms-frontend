const API_ROOT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Payment API functions
export async function initiatePayment(courseId: string, amount: number): Promise<any> {
  // Use real Flutterwave payment
  const res = await fetch(`${API_ROOT}/api/courses/payments/initiate/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      course_id: courseId,
      amount: amount,
      currency: 'NGN'
    })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to initiate payment')
  }

  return res.json()
}

export async function verifyPayment(transactionId: string, txRef: string): Promise<any> {
  // Use real Flutterwave payment verification
  const res = await fetch(`${API_ROOT}/api/courses/payments/verify/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      tx_ref: txRef,
      transaction_id: transactionId,
      status: 'successful',
      amount: 0,
      currency: 'NGN'
    })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to verify payment')
  }

  return res.json()
}
