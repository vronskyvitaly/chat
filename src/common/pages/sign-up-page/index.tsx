'use client'
import { useEffect, useState } from 'react'
import { PATH } from '@/common/constants'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaUser } from 'react-icons/fa'
import { SignUpForm } from '@/features/auth/ui/sign-up-form/ui'
import { useSignUpMutation } from '@/features/auth/api'
import type { TSignUpFormValues } from '@/features/auth/ui/sign-up-form/types'

const SignUpPage = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [signUpMutation] = useSignUpMutation()
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  // Очистка таймаута при размонтировании компонента
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  const onSubmit = async (data: TSignUpFormValues) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }

    setError(null)
    setIsLoading(true)

    try {
      await signUpMutation(data).unwrap()
      // Если регистрация успешна, перенаправляем на страницу входа
      router.push(PATH.SING_IN)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const errorData = err as { data: { message?: string } }
        // todo: 500 [client || server]
        const errorMessage =
          errorData.data.message === 'Пользователь с таким email уже зарегистрирован'
            ? 'A user with this email is already registered'
            : 'Registration error'
        setError(errorMessage)

        // Устанавливаем новый таймаут и сохраняем его ID
        const id = setTimeout(() => {
          setError(null)
          setTimeoutId(null)
        }, 4000)

        setTimeoutId(id)
      } else {
        setError('Registration error')
        const id = setTimeout(() => {
          setError(null)
          setTimeoutId(null)
        }, 4000)

        setTimeoutId(id)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    router.push(PATH.SING_IN)
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
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
    </main>
  )
}

export default SignUpPage
