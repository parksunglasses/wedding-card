import { useEffect } from 'react'
import { Theme } from './index'

interface Props {
  theme: Theme
  children: React.ReactNode
}

export default function ThemeProvider({ theme, children }: Props) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--theme-bg', theme.colors.bg)
    root.style.setProperty('--theme-bg-alt', theme.colors.bgAlt)
    root.style.setProperty('--theme-bg-dark', theme.colors.bgDark)
    root.style.setProperty('--theme-text', theme.colors.text)
    root.style.setProperty('--theme-text-muted', theme.colors.textMuted)
    root.style.setProperty('--theme-accent', theme.colors.accent)
    root.style.setProperty('--theme-accent-light', theme.colors.accentLight)
    root.style.setProperty('--theme-border', theme.colors.border)
    root.style.setProperty('--theme-font-heading', theme.fonts.heading)
    root.style.setProperty('--theme-font-body', theme.fonts.body)
    root.style.setProperty('--theme-font-script', theme.fonts.script || theme.fonts.heading)
  }, [theme])

  return <>{children}</>
}
