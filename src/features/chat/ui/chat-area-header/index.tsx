import { TUser } from '@/features/users/types'
import { useMemo } from 'react'
import { useFetchUsersQuery } from '@/features/users/api'

type Props = {
  selectedUser: TUser
}

export const ChatAreaHeader = ({ selectedUser }: Props) => {
  const { data: users = [] } = useFetchUsersQuery()

  const selectedUserWithStatus = useMemo(() => {
    if (!selectedUser) return null
    return users.find(user => user.id === selectedUser.id)
  }, [users, selectedUser])

  return (
    <div className='p-4 border-b border-gray-200 bg-white'>
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <div className='w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center'>
            <span className='text-white font-medium'>
              {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          {selectedUserWithStatus?.isOnline && (
            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></div>
          )}
        </div>
        <div>
          <p className='font-semibold text-gray-900'>{selectedUser.name}</p>
          {selectedUserWithStatus?.isOnline ? (
            <p className='text-sm text-gray-500'>Online</p>
          ) : (
            <p className='text-sm text-gray-500'>Offline</p>
          )}
        </div>
      </div>
    </div>
  )
}
