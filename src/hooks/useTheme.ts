'use client'

import { useState, useEffect, useCallback } from 'react'
import { Theme, themeUtils } from '@/utils/theme'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light')

  // 초기 스크립트가 적용한 테마를 상태에 동기화
  useEffect(() => {
    setTheme(themeUtils.getCurrentTheme())
  }, [])

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    themeUtils.applyTheme(next)
    themeUtils.saveTheme(next)
    setTheme(next)
  }, [theme])

  return {
    theme,
    toggleTheme,
  }
}
