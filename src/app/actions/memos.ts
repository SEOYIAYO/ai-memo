'use server'

import { v4 as uuidv4 } from 'uuid'
import { Memo, MemoFormData } from '@/types/memo'
import { createSupabaseServerClient } from '@/utils/supabase/server'

// DB 행(snake_case) 타입
interface MemoRow {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  created_at: string
  updated_at: string
}

const toMemo = (row: MemoRow): Memo => ({
  id: row.id,
  title: row.title,
  content: row.content,
  category: row.category,
  tags: row.tags,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export async function getMemosAction(): Promise<Memo[]> {
  const { data, error } = await createSupabaseServerClient()
    .from('memos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`메모 조회 실패: ${error.message}`)
  return (data as MemoRow[]).map(toMemo)
}

export async function createMemoAction(formData: MemoFormData): Promise<Memo> {
  const { data, error } = await createSupabaseServerClient()
    .from('memos')
    .insert({ id: uuidv4(), ...formData })
    .select()
    .single()

  if (error) throw new Error(`메모 생성 실패: ${error.message}`)
  return toMemo(data as MemoRow)
}

export async function updateMemoAction(
  id: string,
  formData: MemoFormData
): Promise<Memo> {
  const { data, error } = await createSupabaseServerClient()
    .from('memos')
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`메모 수정 실패: ${error.message}`)
  return toMemo(data as MemoRow)
}

export async function deleteMemoAction(id: string): Promise<void> {
  const { error } = await createSupabaseServerClient()
    .from('memos')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`메모 삭제 실패: ${error.message}`)
}

export async function clearMemosAction(): Promise<void> {
  // PostgREST는 조건 없는 delete를 막으므로 항상 참인 조건 사용
  const { error } = await createSupabaseServerClient()
    .from('memos')
    .delete()
    .not('id', 'is', null)

  if (error) throw new Error(`메모 전체 삭제 실패: ${error.message}`)
}
