import { HeartIcon, LightningIcon, LockIcon } from '@/common'
import { FeatureCard } from '@/widgets'

export const FeatureCardsSection = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto'>
      <FeatureCard
        icon={<LightningIcon />}
        title={'Lightning Fast'}
        description={' Real-time messaging with WebSocket technology for instant delivery.'}
      />

      <FeatureCard
        icon={<LockIcon />}
        title={'Secure'}
        description={'End-to-end encryption and secure authentication for peace of mind.'}
        gradientFrom={'from-blue-500'}
        gradientTo={'to-purple-500'}
      />

      <FeatureCard
        icon={<HeartIcon />}
        title={'User Friendly'}
        description={'Beautiful interface designed for easy and enjoyable conversations.'}
        gradientFrom={'from-purple-500'}
        gradientTo={'to-pink-500'}
      />
    </div>
  )
}
