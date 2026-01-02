import { EmptyPostsList, PostsList } from '@/features/posts/ui'
import type { TPost } from '@/features/posts/types'

type Props = {
  posts: TPost[]
}

export const PostsListSection = ({ posts }: Props) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'>
      <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>All Posts</h2>
      </div>
      {posts.length === 0 ? (
        <EmptyPostsList />
      ) : (
        <div className='divide-y divide-gray-200 dark:divide-gray-700'>
          <PostsList posts={posts} />
        </div>
      )}
    </div>
  )
}
