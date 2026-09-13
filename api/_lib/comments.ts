import { getRedis } from './redis'

export interface Comment {
  id: string
  name: string
  email: string
  projectId: string
  comment: string
  rating: number
  createdAt: string
  approved: boolean
}

const COMMENTS_KEY = 'comments'

export async function loadComments(): Promise<Comment[]> {
  const comments = await getRedis().get<Comment[]>(COMMENTS_KEY)
  return comments ?? []
}

export async function saveComments(comments: Comment[]): Promise<void> {
  await getRedis().set(COMMENTS_KEY, comments)
}
