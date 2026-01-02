'use client'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'

type Props = {
  session: Session | null
}

export const PostPageHeader = ({ session }: Props) => {
  const router = useRouter()

  return (
    <header className='flex items-center justify-between mb-8'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Posts</h1>
        <p className='text-gray-600 dark:text-gray-400'>Create and manage your blog posts</p>
      </div>
      <div className='flex items-center gap-4'>
        {/*{todo: 501}*/}
        <button
          onClick={() => router.push('/')}
          className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
            />
          </svg>
          <span className='text-sm font-medium'>Home</span>
        </button>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
            <span className='text-white text-sm font-medium'>
              {(session?.user?.name || session?.user?.email || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          <span className='text-sm text-gray-600 dark:text-gray-400'>{session?.user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  )
}
