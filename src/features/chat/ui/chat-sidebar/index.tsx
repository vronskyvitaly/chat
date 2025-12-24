'use client'
import { ChatSidebarSearchUserInput, ChatSidebarHeader, UserList } from '@/features/chat/ui'
import { useState } from 'react'
import { useMeQuery } from '@/features/auth/api'

export const ChatSidebar = () => {
  useMeQuery()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
      {/* Header */}
      <ChatSidebarHeader />
      {/* Search */}
      <ChatSidebarSearchUserInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* Users List */}
      <UserList searchTerm={searchTerm} />
    </div>
  )
}
