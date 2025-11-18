'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

/**
 * Хук для управления социальной авторизацией (Google, GitHub)
 */
export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    signIn('google', { callbackUrl: '/' })
  }

  const handleGithubSignIn = () => {
    setIsLoading(true)
    signIn('github', { callbackUrl: '/' })
  }

  return {
    isLoading,
    handleGoogleSignIn,
    handleGithubSignIn
  }
}
