import { Session } from 'next-auth'
import { UnauthenticatedActions, AuthenticatedActions } from '@/widgets/sections/hero-section/ui'

interface AuthActionsPanelProps {
  session: Session | null
}

/**
 * Панель с кнопками действий в зависимости от статуса авторизации
 */
export const AuthActionsPanel = ({ session }: AuthActionsPanelProps) => {
  return (
    <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
      {session ? <AuthenticatedActions /> : <UnauthenticatedActions />}
    </div>
  )
}
