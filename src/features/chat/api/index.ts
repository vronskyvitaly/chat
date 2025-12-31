import { baseApi } from '@/app/api/_base-api'
import { SOCKET_EVENT_CHAT } from '@/features/chat/constants'
import { subscribeToEvent } from '@/common/socket'
import type { TChatMessage, TResponseFetchUserChat } from '@/features/chat/types'
import { getCookie } from '@/common/utils/get-cookie'

const chatApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchUserChat: build.query<TResponseFetchUserChat, { targetUserId: string }>({
      query: ({ targetUserId }) => ({
        url: 'api/chat',
        params: { targetUserId }
      }),

      keepUnusedDataFor: 0,
      providesTags: ['Chat'],
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded

        const userId = await getCookie('userId')

        const unsubscribe4 = subscribeToEvent<{ message: TChatMessage }, { userId: number; name: string }>(
          SOCKET_EVENT_CHAT.CHAT_MESSAGE,
          data => {
            debugger
            updateCachedData(draft => {
              draft.messages.push(data.message)
            })
          },
          { userId: +userId!, name: 'test' }
        )

        // CacheEntryRemoved разрешится, когда подписка на кеш больше не активна
        await cacheEntryRemoved
        unsubscribe4()
      }
    }),
    sendMessage: build.mutation<TChatMessage, { chatId: string; content: string }>({
      query: ({ chatId, content }) => ({
        url: 'api/chat/message',
        method: 'POST',
        body: { chatId, content }
      }),
      invalidatesTags: ['Chat']
    }),

    sendFile: build.mutation<TChatMessage, FormData>({
      query: FormData => ({
        url: 'api/chat/image',
        method: 'POST',
        body: FormData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
      invalidatesTags: ['Chat']
    })
  })
})

export const { useFetchUserChatQuery, useSendMessageMutation, useSendFileMutation } = chatApi
