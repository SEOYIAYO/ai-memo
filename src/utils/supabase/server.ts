import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 서버 액션에서만 사용하는 Supabase 클라이언트 (요청마다 생성, 세션 저장 안 함)
export const createSupabaseServerClient = (): SupabaseClient => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error('Supabase 환경변수가 설정되지 않았습니다.')
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
