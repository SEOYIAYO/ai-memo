'use client'

import { useRef, useState, useCallback } from 'react'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface MarkdownEditorProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

type EditorTab = 'write' | 'preview'

interface ToolbarAction {
  key: string
  label: string
  text: string
  prefix: string
  suffix: string
  placeholder: string
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    key: 'bold',
    label: '굵게',
    text: 'B',
    prefix: '**',
    suffix: '**',
    placeholder: '굵은 텍스트',
  },
  {
    key: 'italic',
    label: '기울임',
    text: 'I',
    prefix: '*',
    suffix: '*',
    placeholder: '기울임 텍스트',
  },
  {
    key: 'heading',
    label: '제목',
    text: 'H',
    prefix: '## ',
    suffix: '',
    placeholder: '제목',
  },
  {
    key: 'quote',
    label: '인용',
    text: '"',
    prefix: '> ',
    suffix: '',
    placeholder: '인용문',
  },
  {
    key: 'list',
    label: '목록',
    text: '•',
    prefix: '- ',
    suffix: '',
    placeholder: '목록 항목',
  },
  {
    key: 'task',
    label: '체크리스트',
    text: '☑',
    prefix: '- [ ] ',
    suffix: '',
    placeholder: '할 일',
  },
  {
    key: 'code',
    label: '코드',
    text: '</>',
    prefix: '`',
    suffix: '`',
    placeholder: '코드',
  },
  {
    key: 'link',
    label: '링크',
    text: '🔗',
    prefix: '[',
    suffix: '](https://)',
    placeholder: '링크 텍스트',
  },
]

export default function MarkdownEditor({
  id,
  value,
  onChange,
  placeholder,
  rows = 8,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [tab, setTab] = useState<EditorTab>('write')

  const handleToolbarClick = useCallback(
    (action: ToolbarAction) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const { selectionStart, selectionEnd } = textarea
      const selected =
        value.slice(selectionStart, selectionEnd) || action.placeholder
      const next =
        value.slice(0, selectionStart) +
        action.prefix +
        selected +
        action.suffix +
        value.slice(selectionEnd)

      onChange(next)

      // 삽입한 텍스트를 선택 상태로 유지
      const start = selectionStart + action.prefix.length
      requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + selected.length)
      })
    },
    [value, onChange]
  )

  const tabClass = (current: EditorTab) =>
    `px-3 py-1.5 text-sm rounded-md transition-colors ${
      tab === current
        ? 'bg-white text-blue-600 shadow-sm font-medium'
        : 'text-gray-500 hover:text-gray-700'
    }`

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
      {/* 툴바 */}
      <div className="flex items-center justify-between gap-2 px-2 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-1 flex-wrap">
          {TOOLBAR_ACTIONS.map(action => (
            <button
              key={action.key}
              type="button"
              onClick={() => handleToolbarClick(action)}
              disabled={tab === 'preview'}
              aria-label={action.label}
              title={action.label}
              data-testid={`md-toolbar-${action.key}`}
              className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
            >
              {action.text}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={tabClass('write')}
            data-testid="md-tab-write"
          >
            작성
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={tabClass('preview')}
            data-testid="md-tab-preview"
          >
            미리보기
          </button>
        </div>
      </div>

      {/* 본문 */}
      {tab === 'write' ? (
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="placeholder-gray-400 text-gray-700 w-full px-3 py-2 focus:outline-none resize-none font-mono text-sm"
          placeholder={placeholder}
          rows={rows}
          data-testid="md-textarea"
        />
      ) : (
        <div
          className="px-3 py-2 min-h-52 max-h-96 overflow-y-auto"
          data-testid="md-preview"
        >
          {value.trim() ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-sm text-gray-400">미리볼 내용이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  )
}
