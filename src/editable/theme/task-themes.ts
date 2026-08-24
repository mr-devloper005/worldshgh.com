import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Cormorant Garamond', Georgia, serif"
const BODY_FONT = "'Space Grotesk', system-ui, -apple-system, sans-serif"

const base = {
  dark: true,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#000000',
  surface: '#0a0a0a',
  raised: '#111111',
  text: '#c8c2b6',
  muted: '#7a7468',
  line: 'rgba(255,255,255,0.08)',
  accent: '#c9a96e',
  accentSoft: 'rgba(201,169,110,0.1)',
  onAccent: '#000000',
  glow: 'rgba(201,169,110,0.08)',
  radius: '0',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'The Work', note: 'In-depth articles and essays exploring ideas worth your time.' },
  listing: { ...base, kicker: 'Directory', note: 'Curated business and organization profiles.' },
  classified: { ...base, kicker: 'Notices', note: 'Time-sensitive posts and opportunities.' },
  image: { ...base, kicker: 'Gallery', note: 'Visual stories and image collections.' },
  sbm: { ...base, kicker: 'Resources', note: 'Saved links and curated references.' },
  pdf: { ...base, kicker: 'Documents', note: 'Downloadable guides and reference material.' },
  profile: { ...base, kicker: 'People', note: 'Freelancers, creators, and professionals.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
