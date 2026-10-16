'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// prose 기본 스타일 보정: 마커 색, 인용문/인라인 코드의 장식 문자 제거
const PROSE_CLASSES = [
  'prose prose-sm max-w-none prose-gray prose-a:text-blue-600',
  'prose-li:marker:text-gray-500 prose-blockquote:not-italic',
  '[&_blockquote_p]:before:content-none! [&_blockquote_p]:after:content-none!',
  '[&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-gray-100',
  '[&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5',
  '[&_:not(pre)>code]:before:content-none [&_:not(pre)>code]:after:content-none',
].join(' ')

export default function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  return (
    <div className={`${PROSE_CLASSES} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
