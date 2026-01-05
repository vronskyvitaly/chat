'use client'
import { type TCreatePostValues, useCreatePostForm } from '@/features/posts/ui'

type Props = {
  onSubmit(data: TCreatePostValues): void
  createPostIsLoading?: boolean
}

export const CreatePostForm = ({ onSubmit, createPostIsLoading }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid }
  } = useCreatePostForm()

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8'>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Create New Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-2'>
          <label htmlFor='title' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Title
          </label>
          <input
            id='title'
            type='text'
            {...register('title')}
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Enter post title'
          />
          {errors.title && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.title.message}</p>
          )}
        </div>
        <div className='space-y-2'>
          <label htmlFor='content' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Content
          </label>
          <textarea
            id='content'
            {...register('content')}
            rows={4}
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            placeholder='Write your post content...'
          />
          {errors.content && (
            <p className='mt-[-5px] text-sm text-red-600 dark:text-red-400'>{errors.content.message}</p>
          )}
        </div>

        <button
          disabled={!isDirty || !isValid || createPostIsLoading}
          type='submit'
          className=' w-full flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors'
        >
          Create Post
        </button>
      </form>
    </div>
  )
}
