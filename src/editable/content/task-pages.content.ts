import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'The Work',
    headline: 'Articles and essays worth your time.',
    description: 'In-depth pieces from freelancers, creators, and independent thinkers exploring ideas that matter.',
    filterLabel: 'Filter by topic',
    secondaryNote: 'Every article gets the cinematic treatment it deserves.',
    chips: ['Long-form', 'Essays', 'Perspectives'],
  },
  classified: {
    eyebrow: 'Opportunities',
    headline: 'Opportunities and notices.',
    description: 'Time-sensitive posts, offers, and opportunities from the community.',
    filterLabel: 'Filter category',
    secondaryNote: 'Quick, scannable, action-oriented.',
    chips: ['Offers', 'Notices', 'Quick reads'],
  },
  sbm: {
    eyebrow: 'Resources',
    headline: 'Curated links and references.',
    description: 'Bookmarked resources, tools, and references worth saving.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated with care.',
    chips: ['Collections', 'Tools', 'References'],
  },
  profile: {
    eyebrow: 'The People',
    headline: 'Freelancers and creators.',
    description: 'Meet the independent professionals, makers, and creative minds behind the work.',
    filterLabel: 'Filter by specialty',
    secondaryNote: 'Every profile tells a story.',
    chips: ['Freelancers', 'Creators', 'Professionals'],
  },
  pdf: {
    eyebrow: 'Documents',
    headline: 'Guides and resources.',
    description: 'Downloadable documents, guides, and reference material.',
    filterLabel: 'Filter type',
    secondaryNote: 'Download and explore.',
    chips: ['Guides', 'Reports', 'Files'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Businesses and organizations.',
    description: 'Discover businesses, studios, and organizations in the community.',
    filterLabel: 'Filter category',
    secondaryNote: 'Find what you need.',
    chips: ['Directory', 'Businesses', 'Studios'],
  },
  image: {
    eyebrow: 'Gallery',
    headline: 'Visual stories.',
    description: 'Image-first posts and visual collections from creators.',
    filterLabel: 'Filter category',
    secondaryNote: 'Let the images speak.',
    chips: ['Gallery', 'Visual', 'Portfolio'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
