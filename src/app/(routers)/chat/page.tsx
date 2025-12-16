'use client'
import { useFetchUsersQuery } from '@/features/users/api'
import { FaUser, FaSearch } from 'react-icons/fa'
import { useState } from 'react'
import { useFilteredUsers } from '@/common/hooks'

export default function ChatPage() {
  const { data: users = [] } = useFetchUsersQuery()
  const [searchTerm, setSearchTerm] = useState('')
  const filteredUsers = useFilteredUsers(users, searchTerm)

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
        {/* Header */}
        <div className='p-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-800'>Chat</h2>
        </div>

        {/* Search */}
        <div className='p-3 border-b border-gray-200'>
          <div className='relative'>
            <FaSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search contacts...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-black focus:border-blue-500 focus:outline-none'
            />
          </div>
        </div>

        {/* Users List */}
        <div className='flex-1 overflow-y-auto'>
          <div className='p-2'>
            <h3 className='px-2 py-1 text-sm font-medium text-gray-500 uppercase tracking-wider'>Contacts</h3>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  className='flex items-center gap-3 p-3 mb-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors'
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
                </div>
              ))
            ) : (
              <div className='py-8 text-center text-gray-500'>
                <p>No contacts found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className='flex-1 flex flex-col'>
        <div className='flex-1 flex items-center justify-center bg-white'>
          <div className='text-center text-gray-500'>
            <FaUser className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <h3 className='text-xl font-semibold mb-2'>Select a contact</h3>
            <p>Choose a user from the list to start chatting</p>
          </div>
        </div>
      </div>
    </div>
  )
}
