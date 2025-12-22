'use client'
import { formatTime } from '@/common/lib'
import type { TUser } from '@/features/users/types'
import { useEffect, useRef } from 'react'
import { useFetchUserChatQuery } from '@/features/chat/api'

type Props = {
  selectedUser: TUser
}

export const ChatAreaMessages = ({ selectedUser }: Props) => {
  const { data: chat } = useFetchUserChatQuery({ targetUserId: String(selectedUser?.id) || '0' })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Автоматическая прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages])

  return (
    <div className='flex-1 p-4 overflow-y-auto bg-gray-50'>
      {chat?.messages && chat.messages.length > 0 ? (
        chat.messages.map(message => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.senderId === selectedUser.id ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                message.senderId === selectedUser.id
                  ? 'bg-white text-gray-800 rounded-bl-none'
                  : 'bg-blue-500 text-white rounded-br-none'
              }`}
            >
              <p>{message.content}</p>
              <p className='text-xs mt-1 opacity-70'>{formatTime(message.createdAt, 'timeAndDate')}</p>
            </div>
          </div>
        ))
      ) : (
        <>
          <div className='flex flex-col items-center justify-center h-32 text-gray-500'>
            <p>No messages yet</p>
          </div>
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
