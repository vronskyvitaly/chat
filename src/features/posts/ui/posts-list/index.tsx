import { TPost } from '@/features/posts/types'
import { Post } from '@/features/posts/ui/post'

export const PostsList = ({ posts }: { posts: TPost[] }) => {
  return posts.map(post => <Post post={post} key={post.id} />)
}
