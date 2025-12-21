'use client'
import { KeyboardEvent, useEffect, useMemo, useRef } from 'react'
import { useFetchUsersQuery } from '@/features/users/api'
import { FaUser, FaSearch, FaPaperPlane } from 'react-icons/fa'
import { useState } from 'react'
import { useFilteredUsers } from '@/common/hooks'
import type { TUser } from '@/features/users/types'
import { useFetchUserChatQuery, useSendMessageMutation } from '@/features/chat/api'
import { formatTime } from '@/common/lib'

export default function ChatPage() {
  const { data: users = [] } = useFetchUsersQuery()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<null | TUser>(null)
  const [message, setMessage] = useState('')
  const filteredUsers = useFilteredUsers(users, searchTerm)
  const { data: chat } = useFetchUserChatQuery({ targetUserId: String(selectedUser?.id) || '0' })
  const [sendMessage] = useSendMessageMutation()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Автоматическая прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages])

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser || !chat) return

    try {
      await sendMessage({
        chatId: chat.id,
        content: message.trim()
      }).unwrap()

      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await handleSendMessage()
    }
  }

  const selectedUserWithStatus = useMemo(() => {
    if (!selectedUser) return null
    return users.find(user => user.id === selectedUser.id)
  }, [users, selectedUser])

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
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center gap-3 p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                    selectedUser?.id === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'
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
        {selectedUser ? (
          <>
            {/* Chat Header */}
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

            {/* Messages Area */}
            <div className='flex-1 p-4 overflow-y-auto bg-gray-50'>
              {chat?.messages && chat.messages.length > 0 ? (
                chat.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex mb-4 ${
                      message.senderId === selectedUser.id ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                        message.senderId === selectedUser.id
                          ? 'bg-white text-gray-800 rounded-bl-none'
                          : 'bg-blue-500 text-white rounded-br-none'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className='text-xs mt-1 opacity-70 text-end'>
                        {formatTime(message.createdAt, 'timeAndDate')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className='flex flex-col items-center justify-center h-32 text-gray-500'>
                  <p>No messages yet</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className='p-4 bg-white border-t border-gray-200'>
              <div className='flex gap-2'>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message to ${selectedUser.name}`}
                  className='flex-1 rounded-lg border border-gray-300 text-black  p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className='px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center bg-white'>
            <div className='text-center text-gray-500'>
              <FaUser className='w-16 h-16 mx-auto mb-4 opacity-50' />
              <h3 className='text-xl font-semibold mb-2'>Select a contact</h3>
              <p>Choose a user from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
