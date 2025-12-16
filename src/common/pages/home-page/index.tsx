'use client'
import { useSession } from 'next-auth/react'
import {  HeroSection } from '@/widgets/sections'
import { Footer, LoadingFullScreen } from '@/widgets/ui'

export default function HomePage(){
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <LoadingFullScreen />
  }

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <HeroSection session={session} />
      <Footer />
    </div>
  )
}
