'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(3, 'Use 3 characters or more for your password')
})

export type SignInFormValues = z.infer<typeof signInSchema>

/**
 * Хук для управления формой логина
 */
export const useSignInForm = () =>
  useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
