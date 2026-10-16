'use client'

import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { toggleTheme } = useTheme()

  // 아이콘은 CSS(dark: 변형)로 전환하여 SSR 하이드레이션 불일치를 방지
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="야간 모드 전환"
      title="야간 모드 전환"
      data-testid="theme-toggle-btn"
      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
    >
      {/* 라이트 모드: 달 아이콘 (클릭하면 야간 모드) */}
      <svg
        className="w-5 h-5 dark:hidden"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      {/* 다크 모드: 해 아이콘 (클릭하면 라이트 모드) */}
      <svg
        className="w-5 h-5 hidden dark:block"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </button>
  )
}
