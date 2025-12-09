import { PATH } from '@/common'
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
      <SignOutButton />
    </>
  )
}
