import { FeatureCardsSection } from '@/widgets/sections'
import { Session } from 'next-auth'
import { DecorativeBackground, Logo } from '@/common/components/ui'
import { AuthActionsPanel } from '@/widgets/ui'

type HeroSectionProps = {
  session: Session | null
}

/**
 * Hero секция главной страницы с логотипом, заголовками и CTA кнопками
 */
export const HeroSection = ({ session }: HeroSectionProps) => {
  return (
    <div className='relative flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8'>
      {/* Background decorative elements */}
      <DecorativeBackground />

      {/* Content */}
      <div className='relative z-10 max-w-4xl mx-auto'>
        {/* Logo */}
        <Logo />
        {/* Main heading */}
        <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-6'>
          Connect with
          <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            {' '}
            Real-Time
          </span>
          <br />
          Chat Experience
        </h1>
        {/* Subheading */}
        <p className='max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed'>
          Join thousands of users in seamless conversations with our modern, secure, and feature-rich chat
          platform.
        </p>
        {/* CTA Buttons */}
        <AuthActionsPanel session={session} />
        {/* Features */}
        <FeatureCardsSection />
      </div>
    </div>
  )
}
