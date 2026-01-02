'use client'
import { useFilteredUsers } from '@/common/hooks'
import { useFetchUsersQuery } from '@/features/users/api'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Props = {
  searchTerm: string
  currentUserId?: number
}

export const UserList = ({ searchTerm, currentUserId = 0 }: Props) => {
  const { data: users = [] } = useFetchUsersQuery()
  const filteredUsers = useFilteredUsers(
    users.filter(user => user.id !== currentUserId),
    searchTerm as string
  )
  const selectedUserId = useParams().id

  return (
    <div className='flex-1 overflow-y-auto'>
      <div className='p-2'>
        <h3 className='px-2 py-1 text-sm font-medium text-gray-500 uppercase tracking-wider'>Contacts</h3>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => {
            return (
              <Link href={`/chat/${user.id}`} key={user.id} className='block'>
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                    +selectedUserId! === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className='relative'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center'>
                      <span className='text-white font-medium'>
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    {/* Green dot for online status */}
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${user.isOnline ? 'block' : 'hidden'}`}
                    ></div>
                  </div>
                  <div className='text-left'>
                    <p className='font-medium text-gray-900'>{user.name}</p>
                    <p className='text-sm text-gray-500'>{user.isOnline ? 'Online' : 'Offline'}</p>
                  </div>
                </div>{' '}
              </Link>
            )
          })
        ) : (
          <div className='py-8 text-center text-gray-500'>
            <p>No contacts found</p>
          </div>
        )}
      </div>
    </div>
  )
}
