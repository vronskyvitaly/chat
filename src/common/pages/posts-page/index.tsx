'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import { PATH } from '@/common/constants'
import { LoadingFullScreen } from '@/widgets/ui'
import type { TCreatePostRequest } from '@/features/posts/types'
import { PostsList } from '@/features/posts/ui/posts-list'
import { useCreatePostMutation, useFetchPostsQuery } from '@/features/posts/api'


export default function PostsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { data: posts = [], isLoading, error: fetchError } = useFetchPostsQuery()
  const [createPost, { isLoading: isCreating, error: createError }] = useCreatePostMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TCreatePostRequest>({
    defaultValues: {
      title: '',
      content: ''
    }
  })

  // Проверка сессии
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(PATH.SING_IN)
    }
  }, [status, router])

  const onSubmit = async (data: TCreatePostRequest) => {
    try {
      await createPost({
        title: data.title.trim(),
        content: data.content.trim()
      }).unwrap()
      reset()
    } catch (err) {
      console.error('Error creating post:', err)
    }
  }

  const error = createError || fetchError

  // Показываем загрузку пока проверяем сессию
  if (status === 'loading') {
    return <LoadingFullScreen />
  }

  // Если пользователь не авторизован, не показываем страницу
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
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
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Create New Post</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Title
              </label>
              <input
                id='title'
                type='text'
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters'
                  }
                })}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter post title'
              />
              {errors.title && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.title.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor='content'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Content
              </label>
              <textarea
                id='content'
                {...register('content', {
                  required: 'Content is required',
                  minLength: {
                    value: 10,
                    message: 'Content must be at least 10 characters'
                  }
                })}
                rows={4}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                placeholder='Write your post content...'
              />
              {errors.content && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.content.message}</p>
              )}
            </div>

            <button
              type='submit'
              disabled={isCreating}
              className='flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors'
            >
              {isCreating ? (
                <>
                  <FaSpinner className='animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Post'
              )}
            </button>
          </form>
        </div>

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
    </div>
  )
}
