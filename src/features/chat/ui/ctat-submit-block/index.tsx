import type { TUser } from '@/features/users/types'
import type { ChangeEvent } from 'react'

import { SendFileToUserForm, SendMessageToUserForm, type TSendMessageSchemaValues } from '@/features/chat/ui'

type Props = {
  selectedUser: TUser
  onSendMessageHandler(data: TSendMessageSchemaValues): void
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
