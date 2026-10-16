'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemos } from '@/hooks/useMemos'
import { MEMO_CATEGORIES } from '@/types/memo'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import MemoSummary from '@/components/MemoSummary'

export default function MemoDetailPage() {
  const params = useParams<{ id: string }>()
  const { loading, getMemoById } = useMemos()
  const memo = getMemoById(params.id)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">메모를 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          ← 목록으로
        </Link>

        {!memo ? (
          <p className="mt-6 text-gray-600 dark:text-gray-300">
            메모를 찾을 수 없습니다.
          </p>
        ) : (
          <article className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {memo.title}
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {MEMO_CATEGORIES[
                  memo.category as keyof typeof MEMO_CATEGORIES
                ] || memo.category}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(memo.updatedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <MarkdownRenderer content={memo.content} />

            {memo.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-6">
                {memo.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <MemoSummary content={memo.content} />
          </article>
        )}
      </main>
    </div>
  )
}
