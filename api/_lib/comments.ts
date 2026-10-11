import { getSupabase } from './supabase'

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

interface CommentRow {
  id: string
  name: string
  email: string
  project_id: string
  comment: string
  rating: number
  created_at: string
  approved: boolean
}

function fromRow(row: CommentRow): Comment {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    projectId: row.project_id,
    comment: row.comment,
    rating: row.rating,
    createdAt: row.created_at,
    approved: row.approved
  }
}

export async function getApprovedComments(): Promise<Comment[]> {
  const { data, error } = await getSupabase()
    .from('comments')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return (data as CommentRow[]).map(fromRow)
}

export async function getPendingComments(): Promise<Comment[]> {
  const { data, error } = await getSupabase()
    .from('comments')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as CommentRow[]).map(fromRow)
}

export async function insertComment(input: Omit<Comment, 'createdAt'>): Promise<Comment> {
  const { data, error } = await getSupabase()
    .from('comments')
    .insert({
      id: input.id,
      name: input.name,
      email: input.email,
      project_id: input.projectId,
      comment: input.comment,
      rating: input.rating,
      approved: input.approved
    })
    .select()
    .single()

  if (error) throw error
  return fromRow(data as CommentRow)
}

export async function approveComment(id: string): Promise<Comment | null> {
  const { data, error } = await getSupabase()
    .from('comments')
    .update({ approved: true })
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) throw error
  return data ? fromRow(data as CommentRow) : null
}

export async function deleteComment(id: string): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from('comments')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) throw error
  return data !== null
}
