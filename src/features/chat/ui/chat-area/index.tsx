'use client'
import { FaUser } from 'react-icons/fa'
import { useFetchUserChatQuery, useSendMessageMutation } from '@/features/chat/api'
import { ChatAreaHeader, ChatAreaMessages } from '@/features/chat/ui'
import { SendMessageToUserForm } from '@/features/chat/ui/send-message-to-user-form/ui'
import { useFetchUsersQuery } from '@/features/users/api'
import type { TSendMessageSchemaValues } from '@/features/chat/ui/send-message-to-user-form/types'

type Props = {
  selectedUserId: string
}

export const ChatArea = ({ selectedUserId }: Props) => {
  const { data: chat } = useFetchUserChatQuery({ targetUserId: selectedUserId || '0' })
  const [sendMessageMutation] = useSendMessageMutation()
  const { data: users } = useFetchUsersQuery()

  if (!users) return null

  const user = users.find(user => user.id === Number(selectedUserId))

  if (!user) return null

  const sendMessageHandler = async (data: TSendMessageSchemaValues) => {
    if (!selectedUserId || !chat) return

    await sendMessageMutation({
      chatId: chat.id,
      content: data.content.trim()
    }).unwrap()
  }

  if (!selectedUserId) {
    return (
      <div className='flex-1 flex items-center justify-center bg-white'>
        <div className='text-center text-gray-500'>
          <FaUser className='w-16 h-16 mx-auto mb-4 opacity-50' />
          <h3 className='text-xl font-semibold mb-2'>Select a contact</h3>
          <p>Choose a user from the list to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col'>
      {/* Chat Header */}
      <ChatAreaHeader selectedUser={user} />
      {/* Messages Area */}
      <ChatAreaMessages selectedUser={user} />
      {/* Send message form */}
      <SendMessageToUserForm selectedUser={user} onSendMessage={sendMessageHandler} />
    </div>
  )
}
