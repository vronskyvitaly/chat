import { Session } from 'next-auth'
import { AuthenticatedActions } from '@/widgets/ui/hero-section/ui/authenticated-actions'
import { UnauthenticatedActions } from '@/widgets/ui/hero-section/ui/unauthenticated-actions'

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
