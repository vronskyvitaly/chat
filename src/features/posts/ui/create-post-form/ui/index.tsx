'use client'
import { type TCreatePostValues, useCreatePostForm } from '@/features/posts/ui'
import { type ChangeEvent, useState } from 'react'
import { ACCEPT_CONFIG_IMAGE } from '@/features/chat/ui'

type Props = {
  onSubmit(data: FormData): void
  createPostIsLoading?: boolean
}

export const CreatePostForm = ({ onSubmit, createPostIsLoading }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid }
  } = useCreatePostForm()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    if (input && input.files?.length && input.files.length > 0) {
      const file = input.files[0]
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    setSelectedFile(null)
    const fileInput = document.getElementById('image') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const submitHandler = (data: TCreatePostValues) => {
    const title = data.title || ''
    const content = data.content || ''

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('content', content.trim())

    // Добавляем файл если он есть
    if (selectedFile) {
      formData.append('image', selectedFile)
    }
    onSubmit(formData)
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8'>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Create New Post</h2>
      <form onSubmit={handleSubmit(submitHandler)} className='space-y-6'>
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
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.content.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className='space-y-2'>
          <label htmlFor='image' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Image (optional)
          </label>
          <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg'>
            <div className='space-y-1 text-center'>
              {previewImage ? (
                <div className='relative'>
                  <img
                    src={previewImage}
                    alt='Preview'
                    className='mx-auto h-32 w-auto object-cover rounded'
                  />
                  <button
                    type='button'
                    onClick={handleRemoveImage}
                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors'
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    className='mx-auto h-12 w-12 text-gray-400'
                    stroke='currentColor'
                    fill='none'
                    viewBox='0 0 48 48'
                    aria-hidden='true'
                  >
                    <path
                      d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <div className='flex text-sm text-gray-600 dark:text-gray-400'>
                    <label
                      htmlFor='image'
                      className='relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2'
                    >
                      <span>Upload a file</span>
                      <input
                        id='image'
                        name='image'
                        type='file'
                        accept={ACCEPT_CONFIG_IMAGE}
                        className='sr-only'
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className='pl-1'>or drag and drop</p>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          disabled={!isDirty || !isValid || createPostIsLoading}
          type='submit'
          className='w-full flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors'
        >
          Create Post
        </button>
      </form>
    </div>
  )
}
