'use client'

import { useCallback, useState } from 'react'
import { summarizeMemoAction } from '@/app/actions/summarize'

interface MemoSummaryProps {
  content: string
}

export default function MemoSummary({ content }: MemoSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSummarize = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setSummary(null)

    try {
      const result = await summarizeMemoAction(content)

      if ('error' in result) {
        setError(result.error)
        return
      }
      setSummary(result.summary)
    } catch {
      setError('네트워크 오류로 요약에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [content])

  return (
    <section className="mt-6" data-testid="memo-summary">
      <button
        onClick={handleSummarize}
        disabled={isLoading || content.trim().length === 0}
        data-testid="summarize-btn"
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '요약 중...' : '✨ AI로 요약하기'}
      </button>

      {error && (
        <p
          role="alert"
          data-testid="summary-error"
          className="mt-4 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
        >
          {error}
        </p>
      )}

      {summary && (
        <div
          data-testid="summary-result"
          className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg dark:bg-purple-900/20 dark:border-purple-800"
        >
          <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-2">
            AI 요약
          </h3>
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      )}
    </section>
  )
}
