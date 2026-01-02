'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { TCreatePostValues } from '@/features/posts/ui/create-post-form/types'

export const createPostSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' })
})

export const useCreatePostForm = () =>
  useForm<TCreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: ''
    }
  })
