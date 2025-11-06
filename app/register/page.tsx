'use client'
import { FormEvent, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  console.log('RegisterPage', process.env.NEXT_PUBLIC_EXPRESS_SERVER)

  const handleBackToLogin = () => {
    router.push('/login')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Валидация формы
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER}api/auth/register`, {
        name,
        email,
        password
      })

      // Если регистрация успешна, перенаправляем на страницу входа
      if (response.status === 201) {
        router.push('/login')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации')
    } finally {
      setIsLoading(false)
    }
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
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name Field */}
          <div className='space-y-2'>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Full Name
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaUser className='h-5 w-5 text-gray-400' />
              </div>
              <input
                id='name'
                type='text'
                placeholder='John Doe'
                value={name}
                onChange={e => setName(e.target.value)}
                className='block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors'
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className='space-y-2'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Email Address
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaEnvelope className='h-5 w-5 text-gray-400' />
              </div>
              <input
                id='email'
                type='email'
                placeholder='name@example.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors'
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className='space-y-2'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Password
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaLock className='h-5 w-5 text-gray-400' />
              </div>
              <input
                id='password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors'
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className='space-y-2'>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Confirm Password
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaLock className='h-5 w-5 text-gray-400' />
              </div>
              <input
                id='confirmPassword'
                type='password'
                placeholder='••••••••'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className='block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors'
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-xl dark:bg-red-900/30 dark:border-red-800'>
              <div className='flex items-start'>
                <svg
                  className='h-5 w-5 text-red-500 mt-0.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <p className='ml-2 text-sm text-red-600 dark:text-red-400'>{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105'
          >
            {isLoading ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

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

export default RegisterPage
