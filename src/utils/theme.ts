export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'memo-app-theme'

// layout.tsx의 초기 스크립트와 동일한 로직 (첫 렌더 전 깜빡임 방지용)
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`

export const themeUtils = {
  // 현재 화면에 적용된 테마
  getCurrentTheme: (): Theme => {
    if (typeof window === 'undefined') return 'light'
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  },

  // 테마를 화면에 적용
  applyTheme: (theme: Theme): void => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },

  // 테마 저장
  saveTheme: (theme: Theme): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (error) {
      console.error('Error saving theme to localStorage:', error)
    }
  },
}
