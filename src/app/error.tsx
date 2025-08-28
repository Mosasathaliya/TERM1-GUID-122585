'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ ما!</h2>
        <p className="mb-6">
          {error.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.'}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  )
}
