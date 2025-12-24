'use client'
import { useFetchUserChatQuery, useSendFileMutation, useSendMessageMutation } from '@/features/chat/api'
import { ChatAreaHeader, ChatAreaMessages, ChatSubmitBlock } from '@/features/chat/ui'
import { useFetchUsersQuery } from '@/features/users/api'
import type { TSendMessageSchemaValues } from '@/features/chat/ui/send-message-to-user-form/types'
import type { ChangeEvent } from 'react'
import axios from 'axios'

type Props = {
  selectedUserId: string
}

export const ChatArea = ({ selectedUserId }: Props) => {
  const { data: chat } = useFetchUserChatQuery({ targetUserId: selectedUserId || '0' })
  const [sendMessageMutation] = useSendMessageMutation()
  const [sendFileMutation] = useSendFileMutation()
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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const input = event.target as HTMLInputElement
      if (input && input.files?.length && input.files.length > 0 && chat) {
        const file = input.files[0]
        const formData = new FormData()
        formData.set('file', file)
        formData.set('chatId', chat.id)
        sendFileMutation(formData)
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log('src/features/chat/ui/chat-area/index.tsx', e.response?.data)
      }
    }
  }

  return (
    <div className='flex-1 flex flex-col'>
      {/* Chat Header */}
      <ChatAreaHeader selectedUser={user} />
      {/* Messages Area */}
      <ChatAreaMessages selectedUser={user} />
      {/* Send message form */}
      <ChatSubmitBlock
        selectedUser={user}
        onSendMessageHandler={sendMessageHandler}
        onFileChange={handleFileChange}
      />
    </div>
  )
}
