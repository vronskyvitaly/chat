'use client'

import { FaTrash, FaSpinner } from 'react-icons/fa'
import { formatTime } from '@/common/lib'
import type { TPost } from '@/features/posts/types'
import { useDeletePostMutation } from '@/features/posts/api'

export const Post = ({ post }: { post: TPost }) => {
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

  const handleDelete = async (postId: number) => {
    try {
      await deletePost(postId).unwrap()
    } catch (err) {
      console.error('Error deleting post:', err)
    }
  }

  return (
    <div className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors `}>
      <div className='flex items-start justify-between mb-2'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>{post.title}</h3>
        <button
          onClick={() => handleDelete(post.id)}
          disabled={isDeleting}
          className='text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed'
          aria-label='Delete post'
        >
          {isDeleting ? <FaSpinner className='w-5 h-5 animate-spin' /> : <FaTrash className='w-5 h-5' />}
        </button>
      </div>
      <p className='text-gray-600 dark:text-gray-400 mb-3 whitespace-pre-wrap'>{post.content}</p>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          {formatTime(+new Date(post.createdAt), 'full')}
        </p>
      </div>
    </div>
  )
}
