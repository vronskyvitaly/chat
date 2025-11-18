import { baseApi } from '@/app/api/_base-api'
import { TCreatePostRequest, TPost } from '@/features/posts/types'

export const postsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Получение всех постов пользователя
    fetchPosts: build.query<TPost[], void>({
      query: () => ({ url: 'api/posts/get-user-posts' }),
      providesTags: ['Posts']
    }),
    // Создание нового поста
    createPost: build.mutation<TPost, TCreatePostRequest>({
      query: body => ({
        url: 'api/posts/add-post',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Posts']
    }),
    // Удаление поста
    deletePost: build.mutation<void, number>({
      query: postId => ({
        url: `api/posts/delete-post/${postId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Posts']
    })
  })
})

export const { useFetchPostsQuery, useCreatePostMutation, useDeletePostMutation } = postsApi
