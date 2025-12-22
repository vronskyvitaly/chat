'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TSendMessageSchemaValues } from '@/features/chat/ui'

export const sendMessageSchema = z.object({
  content: z.string().min(1, { message: 'Message must contain at least 1 character' })
})

export const useSendMessageToUserForm = () =>
  useForm<TSendMessageSchemaValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: ''
    },
    mode: 'onBlur'
  })
