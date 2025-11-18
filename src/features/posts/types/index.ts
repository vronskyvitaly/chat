export type TPost = {
  id: number
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
}

export type TCreatePostRequest = {
  title: string
  content: string
}
