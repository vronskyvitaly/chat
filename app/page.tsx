'use client'

import { useSession } from 'next-auth/react'
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  // Показываем загрузку пока проверяем сессию
  if (status === 'loading') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
        <div className='flex flex-col items-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      {/* Hero Section */}
      <div className='relative flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8'>
        {/* Background decorative elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 dark:from-blue-900 dark:to-purple-900'></div>
          <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-green-200 to-blue-200 rounded-full opacity-20 dark:from-green-900 dark:to-blue-900'></div>
        </div>

        {/* Content */}
        <div className='relative z-10 max-w-4xl mx-auto'>
          {/* Logo */}
          <div className='flex justify-center mb-8'>
            <div className='flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:bg-gray-800/80 dark:border-gray-700/20'>
              <Image
                className='dark:invert'
                src='/next.svg'
                alt='Next.js logo'
                width={40}
                height={8}
                priority
              />
            </div>
          </div>

          {/* Main heading */}
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-6'>
            Connect with
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              {' '}
              Real-Time
            </span>
            <br />
            Chat Experience
          </h1>

          {/* Subheading */}
          <p className='max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed'>
            Join thousands of users in seamless conversations with our modern, secure, and feature-rich chat
            platform.
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
            {session ? (
              // Если пользователь авторизован, показываем кнопки "Go to Chat" и "Sign Out"
              <>
                <Link
                  href='/posts'
                  className='flex h-14 items-center justify-center gap-3 px-8 bg-gradient-to-r from-dark-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105'
                >
                  Go to my posts
                </Link>
                <Link
                  href='/chat-friends'
                  className='flex h-14 items-center justify-center gap-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    />
                  </svg>
                  Go to Chat
                </Link>
                <button
                  onClick={() => signOut()}
                  className='flex h-14 items-center justify-center gap-3 px-8 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700 transition-all duration-200'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                    />
                  </svg>
                  Sign Out
                </button>
              </>
            ) : (
              // Если пользователь не авторизован, показываем кнопки "Sign In" и "Create Account"
              <>
                <button
                  onClick={() => signIn('google')}
                  className='flex h-14 items-center justify-center gap-3 px-8 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700 transition-all duration-200'
                >
                  <svg className='w-5 h-5' viewBox='0 0 24 24'>
                    <path
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                      fill='#4285F4'
                    />
                    <path
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                      fill='#34A853'
                    />
                    <path
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.23.81-.62z'
                      fill='#FBBC05'
                    />
                    <path
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                      fill='#EA4335'
                    />
                  </svg>
                  Sign in with Google
                </button>
                <Link
                  href='/login'
                  className='flex h-14 items-center justify-center gap-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                    />
                  </svg>
                  Sign In
                </Link>
                <Link
                  href='/register'
                  className='flex h-14 items-center justify-center gap-3 px-8 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700 transition-all duration-200'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                    />
                  </svg>
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Features */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto'>
            <div className='text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/20'>
              <div className='w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>Lightning Fast</h3>
              <p className='text-gray-600 dark:text-gray-300 text-sm'>
                Real-time messaging with WebSocket technology for instant delivery.
              </p>
            </div>

            <div className='text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/20'>
              <div className='w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>Secure</h3>
              <p className='text-gray-600 dark:text-gray-300 text-sm'>
                End-to-end encryption and secure authentication for peace of mind.
              </p>
            </div>

            <div className='text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/20'>
              <div className='w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>User Friendly</h3>
              <p className='text-gray-600 dark:text-gray-300 text-sm'>
                Beautiful interface designed for easy and enjoyable conversations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='py-6 text-center text-sm text-gray-500 dark:text-gray-400 bg-white/30 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-800/30 dark:border-gray-700'>
        <p>© {new Date().getFullYear()} ChatApp. Built with Next.js and WebSocket technology.</p>
      </footer>
    </div>
  )
}
