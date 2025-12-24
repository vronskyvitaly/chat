'use client'
import { FaPaperPlane } from 'react-icons/fa'
import { useSendMessageToUserForm } from '@/features/chat/ui/send-message-to-user-form/hook'
import type { TUser } from '@/features/users/types'
import type { TSendMessageSchemaValues } from '@/features/chat/ui/send-message-to-user-form/types'

export const SendMessageToUserForm = ({
  onSendMessage,
  selectedUser
}: {
  onSendMessage: (data: TSendMessageSchemaValues) => void
  selectedUser: TUser
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useSendMessageToUserForm()

  const onSubmit = (data: TSendMessageSchemaValues) => {
    if (data.content?.trim()) {
      onSendMessage(data)
      reset() // Очистка формы после отправки
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(onSubmit)()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div className='p-4 bg-white border-t border-gray-200'>
        <div className='flex gap-2'>
          <textarea
            {...register('content')}
            onKeyPress={handleKeyPress}
            placeholder={selectedUser ? `Message to ${selectedUser.name}` : 'Select a user'}
            className='flex-1 rounded-lg border border-gray-300 text-black p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            rows={1}
            disabled={!selectedUser}
          />
          <button
            type='submit'
            className='px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            <FaPaperPlane />
          </button>
        </div>
        {errors.content && <p className='text-sm text-red-500 mt-1'>{errors.content.message}</p>}
      </div>
    </form>
  )
}
