// src/app/api/users-api.ts
import { baseApi } from '@/app/api/_base-api'
import { subscribeToEvent } from '@/common/socket'
import { TUser } from '@/features/users/types'
import { SOCKET_EVENT_USERS } from '@/common/constants/socket-events'



export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    me: build.query<TUser, void>({
      query: () => ({ url: 'api/auth/me' }),
      keepUnusedDataFor: 60,
      providesTags: ['Auth'],
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        // Ждем разрешения начального запроса перед продолжением
        await cacheDataLoaded

        const unsubscribe4 = subscribeToEvent<
          {user: TUser, onlineCount: number},
          { userId: number; name: string }
        >(
          SOCKET_EVENT_USERS.USER_ONLINE,
          data => {
            updateCachedData( (draft) => {
              if (draft?.id === data.user.id) {
                debugger
                draft.isOnline = true
              }
            })
          },
          { userId: 1, name: 'test' }
        )

        const unsubscribe3 = subscribeToEvent<
          {user: TUser, onlineCount: number},
          { userId: number; name: string }
        >(
          SOCKET_EVENT_USERS.USER_OFFLINE,
          data => {
            updateCachedData( (draft) => {
              if (draft?.id === data.user.id) {
                debugger
                draft.isOnline = false
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


    signUp: build.mutation<
      { message: string; userId: number },
      Pick<TUser, 'name' | 'email'> & { password: string }
    >({
      query: userData => ({
        url: 'api/auth/sign-up',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: ['Users', 'Auth']
    })
  })
})

export const { useSignUpMutation, useMeQuery } = authApi