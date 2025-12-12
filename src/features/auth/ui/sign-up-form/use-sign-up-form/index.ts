'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const signUpSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export type SignUpFormValues = z.infer<typeof signUpSchema>

/**
 * Хук для управления формой логина
 */
export const useSignUpForm = () =>
  useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onBlur',
    reValidateMode: 'onChange'
  })

/**
 * Хук для управления формой регистрации
 */
// export const useSignUpForm = () => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isValid }
//   } = useForm<RegisterFormData>({
//     defaultValues: {
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: ''
//     },
//     mode: 'onBlur',
//     reValidateMode: 'onChange'
//   })

// const onSubmit = async (data: RegisterFormData) => {
//   setError(null)
//   setIsLoading(true)
//
//   try {
//     const response = await axios.post(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER}posts-auth-api/auth/register`, {
//       name: data.name.trim(),
//       email: data.email.trim(),
//       password: data.password
//     })
//
//     // Если регистрация успешна, перенаправляем на страницу входа
//     if (response.status === 201) {
//       router.push(PATH.SING_IN)
//     }
//   } catch (err: unknown) {
//     if (axios.isAxiosError(err)) {
//       setError(err.response?.data?.message || 'Ошибка регистрации')
//     } else {
//       setError(err instanceof Error ? err.message : 'Ошибка регистрации')
//     }
//   } finally {
//     setIsLoading(false)
//   }
// }

// return {
//   register,
//   handleSubmit: handleSubmit(onSubmit),
//   errors,
//   error,
//   isLoading,
//   watch,
//   isValid
// }
