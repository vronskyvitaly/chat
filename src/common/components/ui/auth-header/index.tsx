import { ReactElement } from 'react'

type Props = {
  title: string
  subtitle: string
  icon: ReactElement
}

export const AuthHeader = ({ title, subtitle, icon }: Props) => {
  return (
    <div className='text-center mb-8'>
      {icon}
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>{title}</h1>
      <p className='text-gray-600 dark:text-gray-400'>{subtitle}</p>
    </div>
  )
}

// <div className='inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'>
//         <span className='text-2xl font-bold text-white'>💬</span>
//       </div>
