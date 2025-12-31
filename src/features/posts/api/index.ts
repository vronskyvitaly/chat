import { baseApi } from '@/app/api/_base-api'
import { subscribeToEvent } from '@/common/socket'
import { SOCKET_EVENT_POSTS } from '@/features/posts/constants'
import type { TCreatePostRequest, TPost } from '@/features/posts/types'
import { getCookie } from '@/common/utils/get-cookie'

export const postsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Получение всех постов пользователя
    fetchPosts: build.query<TPost[], void>({
      query: () => ({ url: 'api/posts/get-user-posts' }),
      providesTags: ['PostsUser'],
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded

        const userId = await getCookie('userId')

        const unsubscribe4 = subscribeToEvent<{ postId: number }, { userId: number; name: string }>(
          SOCKET_EVENT_POSTS.POST_DELETED,
          data => {
            updateCachedData(draft => {
              const postIndex = draft.findIndex(post => post.id === data.postId)
              if (postIndex !== -1) {
                draft.splice(postIndex, 1)
              }
            })
          },
          { userId: +userId!, name: 'test' }
        )

        const unsubscribe3 = subscribeToEvent<
          { message: string; post: TPost; timestamp: Date },
          { userId: number; name: string }
        >(
          SOCKET_EVENT_POSTS.POST_CREATED,
          data => {
            updateCachedData(draft => {
              draft.unshift(data.post)
            })
          },
          { userId: +userId!, name: 'test' }
        )

        // CacheEntryRemoved разрешится, когда подписка на кеш больше не активна
        await cacheEntryRemoved
        unsubscribe3()
        unsubscribe4()
      }
    }),
    // Создание нового поста
    createPost: build.mutation<TPost, TCreatePostRequest>({
      query: body => ({
        url: 'api/posts/add-post',
        method: 'POST',
        body
      }),
      invalidatesTags: ['PostsUser']
    }),
    // Удаление поста
    deletePost: build.mutation<void, number>({
      query: postId => ({
        url: `api/posts/delete-post/${postId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['PostsUser']
    })
  }),
  overrideExisting: true
})

export const { useFetchPostsQuery, useCreatePostMutation, useDeletePostMutation } = postsApi
