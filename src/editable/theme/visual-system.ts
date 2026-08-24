import { slot4BrandConfig } from './brand.config'

export type Slot4VisualPreset =
  | 'editorial-paper'
  | 'luxury-atelier'
  | 'brutalist-index'
  | 'organic-journal'
  | 'tech-directory'
  | 'retro-bulletin'
  | 'visual-gallery'

export const visualPresets = {
  'editorial-paper': {
    label: 'Editorial Paper',
    mood: 'calm magazine authority',
    fontDirection: 'serif headlines with quiet sans body',
    colors: { background: '#f7efe3', foreground: '#201711', muted: '#7b6253', primary: '#261811', accent: '#b76e45', surface: '#fffaf2' },
    shape: 'soft editorial cards with fine borders',
  },
  'luxury-atelier': {
    label: 'Luxury Atelier',
    mood: 'premium, restrained, cinematic',
    fontDirection: 'Cormorant Garamond headlines with Space Grotesk body',
    colors: { background: '#000000', foreground: '#e8e2d6', muted: '#7a7468', primary: '#c9a96e', accent: '#c9a96e', surface: '#0a0a0a' },
    shape: 'dark panels, gold hairlines, wide letter-spacing',
  },
  'brutalist-index': {
    label: 'Brutalist Index',
    mood: 'bold, raw, memorable',
    fontDirection: 'condensed headings, mono labels, hard rhythm',
    colors: { background: '#f2f0e8', foreground: '#111111', muted: '#55524a', primary: '#111111', accent: '#ff4d00', surface: '#ffffff' },
    shape: 'sharp edges, thick borders, offset blocks',
  },
  'organic-journal': {
    label: 'Organic Journal',
    mood: 'warm, natural, trustworthy',
    fontDirection: 'rounded serif or humanist sans with soft captions',
    colors: { background: '#f4efe5', foreground: '#263021', muted: '#68705a', primary: '#415b32', accent: '#c47c51', surface: '#fffaf0' },
    shape: 'rounded cards, natural spacing, calm texture',
  },
  'tech-directory': {
    label: 'Tech Directory',
    mood: 'clean, fast, useful',
    fontDirection: 'modern sans with crisp mono data accents',
    colors: { background: '#f7f9fc', foreground: '#0f172a', muted: '#56607a', primary: '#4f46e5', accent: '#4f46e5', surface: '#ffffff' },
    shape: 'clean grids, pill filters, sharp information hierarchy',
  },
  'retro-bulletin': {
    label: 'Retro Bulletin',
    mood: 'playful, local, energetic',
    fontDirection: 'chunky headings with friendly body type',
    colors: { background: '#fff3c4', foreground: '#2b1d12', muted: '#7b5736', primary: '#2b1d12', accent: '#e85d2a', surface: '#fff8da' },
    shape: 'stickers, tabs, framed modules, playful dividers',
  },
  'visual-gallery': {
    label: 'Visual Gallery',
    mood: 'cinematic, image-led, immersive',
    fontDirection: 'minimal sans with oversized display moments',
    colors: { background: '#07101f', foreground: '#f8fbff', muted: '#a9b6c8', primary: '#8df0c8', accent: '#f2a0ff', surface: '#101b2d' },
    shape: 'dark cards, large media, glass overlays',
  },
} as const

export const visualSystem = {
  productKind: slot4BrandConfig.productKind,
  recommendedPreset: 'luxury-atelier',
  radius: { sm: '0', md: '0', lg: '0', xl: '0' },
  motion: {
    pageLoad: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
    cardHover: 'transition duration-700 hover:opacity-75',
    softHover: 'transition duration-500 hover:opacity-60',
    reduceMotionSafe: 'motion-reduce:transform-none motion-reduce:transition-none',
  },
  typography: {
    eyebrow: 'text-[11px] font-medium uppercase tracking-[0.35em]',
    heroTitle: 'text-5xl font-light tracking-[0.12em] uppercase sm:text-6xl lg:text-8xl',
    sectionTitle: 'text-3xl font-light tracking-[0.12em] uppercase sm:text-4xl lg:text-5xl',
    body: 'text-base leading-[1.9]',
    caption: 'text-[10px] font-medium uppercase tracking-[0.3em]',
  },
  surfaces: {
    glass: 'border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl',
    paper: 'border border-white/[0.06] bg-[#0a0a0a]',
    quiet: 'border-b border-white/[0.06] bg-transparent',
    dark: 'border border-white/[0.06] bg-[#050505]',
  },
  layout: {
    page: 'mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10',
    sectionY: 'py-20 sm:py-24 lg:py-32',
    cardGrid: 'grid gap-0',
  },
} as const

export function getVisualPreset(name: Slot4VisualPreset = visualSystem.recommendedPreset as Slot4VisualPreset) {
  return visualPresets[name]
}
