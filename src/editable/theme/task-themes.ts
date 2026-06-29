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

const SOCIAL_FONT = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: SOCIAL_FONT,
  fontBody: SOCIAL_FONT,
  bg: '#f3f2ef',
  surface: '#ffffff',
  raised: '#eef3f7',
  text: '#0B0909',
  muted: '#56615e',
  line: '#dedbd4',
  accent: '#408175',
  accentSoft: '#e5f2ef',
  onAccent: '#ffffff',
  glow: 'rgba(64,129,117,0.12)',
  radius: '0.5rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Top Content', note: 'Articles, essays, and useful perspectives from the community.' },
  listing: { ...base, kicker: 'Directory', note: 'Business and organization pages with practical details.' },
  classified: { ...base, kicker: 'Opportunities', note: 'Fresh posts, notices, and time-sensitive updates.' },
  image: { ...base, kicker: 'Visuals', note: 'Image-first posts and galleries from contributors.' },
  sbm: { ...base, kicker: 'Resources', note: 'Curated links and references worth saving.' },
  pdf: { ...base, kicker: 'Documents', note: 'Downloadable guides, reports, and public files.' },
  profile: { ...base, kicker: 'People', note: 'Profiles for writers, creators, businesses, and professionals.' },
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
