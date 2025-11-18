import { PATH } from '@/shared'
import Link from 'next/link'
import { SignOutButton } from '@/features'

/**
 * Кнопки действий для авторизованных пользователей
 */
export const AuthenticatedActions = () => {
  return (
    <>
      <Link
        href={PATH.POSTS}
        className='flex h-14 items-center justify-center gap-3 px-8 bg-gradient-to-r from-dark-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105'
      >
        Go to my posts
      </Link>
      <Link
        href={PATH.CHAT}
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
      <SignOutButton />
    </>
  )
}
