import { baseApi } from '@/app/api/_base-api'
import type { TUser } from '@/features/users/types'
import { subscribeToEvent } from '@/common/socket'
import { SOCKET_EVENT_USERS } from '@/features/users/constants'

const usersApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchUsers: build.query<TUser[], void>({
      query: () => ({ url: 'api/users/get-all' }),
      keepUnusedDataFor: 0,
      providesTags: ['Users'],
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        // Ждем разрешения начального запроса перед продолжением
        await cacheDataLoaded

        const unsubscribe4 = subscribeToEvent<
          { user: TUser; onlineCount: number },
          { userId: number; name: string }
        >(
          SOCKET_EVENT_USERS.USER_ONLINE,
          data => {
            debugger
            updateCachedData(draft => {
              const userIndex = draft.findIndex(u => u.id === data.user.id)
              if (userIndex !== -1) {
                draft[userIndex].isOnline = true
              }
            })
          },
          { userId: 1, name: 'test' }
        )

        const unsubscribe3 = subscribeToEvent<
          { user: TUser; onlineCount: number },
          { userId: number; name: string }
        >(
          SOCKET_EVENT_USERS.USER_OFFLINE,
          data => {
            updateCachedData(draft => {
              const userIndex = draft.findIndex(u => u.id === data.user.id)
              if (userIndex !== -1) {
                draft[userIndex].isOnline = false
              }
            })
          },
          { userId: 1, name: 'test' }
        )

        // CacheEntryRemoved разрешится, когда подписка на кеш больше не активна
        await cacheEntryRemoved
        // unsubscribe()
        // unsubscribe2()
        unsubscribe3()
        unsubscribe4()
      }
    }),

    // Новый endpoint для получения пользователя по email
    fetchUserByEmail: build.query<TUser, string>({
      query: email => ({
        url: `api/users/by-email/${encodeURIComponent(email)}`
      }),
      providesTags: ['User']
    })
  })
})

export const { useFetchUsersQuery, useFetchUserByEmailQuery } = usersApi
