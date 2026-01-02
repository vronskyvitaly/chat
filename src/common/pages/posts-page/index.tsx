'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PATH } from '@/common/constants'
import { LoadingFullScreen } from '@/widgets/ui'
import { PostsList } from '@/features/posts/ui/posts-list'
import { useCreatePostMutation, useFetchPostsQuery } from '@/features/posts/api'
import { useCreatePostForm } from '@/features/posts/ui/create-post-form/hook'
import { CreatePostForm } from '@/features/posts/ui/create-post-form/ui'
import type { TCreatePostValues } from '@/features/posts/ui/create-post-form/types'

export default function PostsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { data: posts = [], isLoading } = useFetchPostsQuery()
  const [createPost, { isLoading: createPostIsLoading }] = useCreatePostMutation()
  const { reset } = useCreatePostForm()
  const [formKey, setFormKey] = useState(0)

  // Проверка сессии
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(PATH.SING_IN)
    }
  }, [status, router])

  const onSubmit = async (data: TCreatePostValues) => {
    try {
      await createPost({
        title: data.title.trim(),
        content: data.content.trim()
      }).unwrap()
      reset()
      setFormKey(prev => prev + 1)
    } catch (error) {
      console.log('Create post [src/common/pages/posts-page/index.tsx] onSubmit', error)
    }
  }

  if (status === 'loading') {
    return <LoadingFullScreen />
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <main className='flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='w-full max-w-4xl mx-auto p-4'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Posts</h1>
            <p className='text-gray-600 dark:text-gray-400'>Create and manage your blog posts</p>
          </div>
          <div className='flex items-center gap-4'>
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
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {session?.user?.name || 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Create Post Form */}
        <CreatePostForm key={formKey} onSubmit={onSubmit} createPostIsLoading={createPostIsLoading} />

        {/* Posts List */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>All Posts</h2>
          </div>

          {isLoading ? (
            <div className='flex flex-col items-center justify-center p-8'>
              <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
              <p className='mt-4 text-gray-600 dark:text-gray-400'>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className='flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400'>
              <div className='text-6xl mb-4'>📝</div>
              <p className='text-lg'>No posts yet</p>
              <p className='text-sm'>Create your first post to get started</p>
            </div>
          ) : (
            <div className='divide-y divide-gray-200 dark:divide-gray-700'>
              <PostsList posts={posts} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
