'use client'

import { PATH } from '@/common/constants'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaUser } from 'react-icons/fa'
import axios from 'axios'
import { useState } from 'react'
import { SignUpFormValues, SignUpForm } from '@/features/auth/ui'

const SignUpPage = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: SignUpFormValues) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER}api/auth/register`, {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password
      })

      // Если регистрация успешна, перенаправляем на страницу входа
      if (response.status === 201) {
        router.push(PATH.SING_IN)
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Ошибка регистрации')
      } else {
        setError(err instanceof Error ? err.message : 'Ошибка регистрации')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    router.push(PATH.SING_IN)
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full'>
            <FaUser className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>Create Account</h1>
          <p className='text-gray-600 dark:text-gray-400'>Join us to start chatting with friends</p>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBackToLogin}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors'
        >
          <FaArrowLeft className='w-4 h-4' />
          <span className='text-sm font-medium'>Back to Sign In</span>
        </button>

        {/* Registration Form */}
        <SignUpForm onSubmit={onSubmit} error={error} isLoading={isLoading} />

        {/* Footer */}
        <div className='mt-8 text-center text-sm text-gray-600 dark:text-gray-400'>
          <p>
            Already have an account?{' '}
            <button
              onClick={handleBackToLogin}
              className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className='mt-12 text-center text-xs text-gray-500 dark:text-gray-600'>
          <p>Secure • Fast • Reliable</p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
