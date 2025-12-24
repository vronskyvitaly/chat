import { SendMessageToUserForm } from '@/features/chat/ui/send-message-to-user-form/ui'
import { SendFileToUserForm } from '@/features/chat/ui/send-file-to-user-form/ui'
import type { TUser } from '@/features/users/types'
import type { TSendMessageSchemaValues } from '@/features/chat/ui/send-message-to-user-form/types'
import type { ChangeEvent } from 'react'

type Props = {
  selectedUser: TUser
  onSendMessageHandler: (data: TSendMessageSchemaValues) => void
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const ChatSubmitBlock = ({ selectedUser, onSendMessageHandler, onFileChange }: Props) => {
  return (
    <div className='flex gap-2 items-center p-4 bg-white border-t border-gray-200'>
      <SendFileToUserForm onFileChange={onFileChange} />
      <SendMessageToUserForm selectedUser={selectedUser} onSendMessage={onSendMessageHandler} />
    </div>
  )
}
