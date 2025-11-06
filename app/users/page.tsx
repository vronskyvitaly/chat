// components/UsersList.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
}

export default function UsersList() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [session])

  const loadUsers = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER}api/users`, {})
      if (response.ok) {
        const allUsers: User[] = await response.json()
        // Фильтруем пользователей, исключая текущего
        const otherUsers = allUsers.filter(user => user.id !== session.user.id)
        setUsers(otherUsers)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className='flex justify-center items-center h-32'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow'>
      {/* Header */}
      <div className='p-4 border-b border-gray-200'>
        <h2 className='text-xl font-bold text-gray-800'>All Users</h2>
        <p className='text-sm text-gray-600 mt-1'>Start a conversation with other users</p>

        {/* Search */}
        <div className='mt-4'>
          <input
            type='text'
            placeholder='Search users by name or email...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {/* Users List */}
      <div className='divide-y divide-gray-100 max-h-96 overflow-y-auto'>
        {filteredUsers.length === 0 ? (
          <div className='p-8 text-center'>
            <div className='text-4xl mb-4'>👥</div>
            <p className='text-gray-500'>{searchTerm ? 'No users found' : 'No other users found'}</p>
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className='p-4 hover:bg-gray-50 cursor-pointer transition-colors'>
              <div className='flex items-center space-x-4'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                  <span className='text-white font-medium text-lg'>
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-lg font-semibold text-gray-900 truncate'>
                    {user.name || 'Unknown User'}
                  </p>
                  <p className='text-sm text-gray-500 truncate'>{user.email}</p>
                </div>
                <div className='flex-shrink-0'>
                  <Link
                    className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
                    href={`/chatroom/${user.id}`}
                  >
                    Message
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className='p-4 border-t border-gray-200 bg-gray-50'>
        <p className='text-sm text-gray-600 text-center'>
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
        </p>
      </div>
    </div>
  )
}
