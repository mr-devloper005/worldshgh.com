import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A creative universe of ideas and perspectives',
      description: 'Explore articles, profiles, and creative work from freelancers and independent thinkers.',
      openGraphTitle: 'A creative universe of ideas and perspectives',
      openGraphDescription: 'Discover articles, creative profiles, and independent perspectives in one cinematic space.',
      keywords: ['freelance', 'creative work', 'articles', 'profiles', 'independent'],
    },
    hero: {
      badge: 'Welcome',
      title: ['Welcome to', 'a universe of ideas'],
      description: 'Explore articles, creative profiles, and independent perspectives from freelancers and makers who do things differently.',
      primaryCta: { label: 'Explore the work', href: '/articles' },
      secondaryCta: { label: 'Meet the people', href: '/profile' },
      searchPlaceholder: 'Search articles, profiles, and more',
      focusLabel: 'Focus',
      featureCardBadge: 'Featured',
      featureCardTitle: 'Latest work shapes the visual identity of this space.',
      featureCardDescription: 'Recent articles and profiles stay at the center of the experience.',
    },
    intro: {
      badge: 'About the space',
      title: 'A place where independent work gets the spotlight it deserves.',
      paragraphs: [
        'This space brings together long-form articles, creative profiles, and curated perspectives from freelancers and independent professionals.',
        'Instead of burying great work in algorithmic feeds, we give it room to breathe with cinematic presentation and thoughtful discovery.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Cinematic presentation for articles and profiles.',
        'Built for freelancers, creators, and independent thinkers.',
        'Clean discovery without noise or clutter.',
      ],
      primaryLink: { label: 'Browse articles', href: '/articles' },
      secondaryLink: { label: 'See profiles', href: '/profile' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Discover work that matters from people who care.',
      description: 'Move between articles, profiles, and creative perspectives through one cohesive experience.',
      primaryCta: { label: 'Browse Articles', href: '/articles' },
      secondaryCta: { label: 'Get in Touch', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About',
    title: 'A cinematic space for independent voices.',
    description: `${slot4BrandConfig.siteName} is built for freelancers and creators who want their work presented with care and intention.`,
    paragraphs: [
      'We believe independent work deserves more than a generic feed. Every article, every profile gets the space and presentation it needs to make an impression.',
      'Whether you are a writer, designer, consultant, or maker, this is your stage.',
    ],
    values: [
      {
        title: 'Cinematic Presentation',
        description: 'Every piece of content gets premium visual treatment with careful typography and spacing.',
      },
      {
        title: 'Built for Independents',
        description: 'Designed specifically for freelancers, creators, and professionals who work on their own terms.',
      },
      {
        title: 'Intentional Discovery',
        description: 'No algorithms, no noise. Just thoughtful browsing that lets great work surface naturally.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Let us hear from you.',
    description: 'Whether you have a question, a collaboration idea, or just want to say hello, we would love to hear from you.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search articles, profiles, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find what inspires you.',
      description: 'Search across articles, profiles, and creative work from our community of independents.',
      placeholder: 'Search by keyword, topic, or name',
    },
    resultsTitle: 'Results',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to start creating.',
      description: 'Use your account to access the publishing workspace and share your work.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Share your work with the world.',
      description: 'Create articles, profiles, and creative content that gets the presentation it deserves.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login to your account.',
      badge: 'Welcome back',
      title: 'Sign in to your space.',
      description: 'Login to continue creating and managing your work.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account found. Create one first.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create your account.',
      badge: 'Join us',
      title: 'Create your account.',
      description: 'Join the community of freelancers and creators.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters.',
      success: 'Account created. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Next',
      fallbackTitle: 'Article',
    },
    listing: {
      relatedTitle: 'Related',
      fallbackTitle: 'Listing',
    },
    image: {
      relatedTitle: 'Related',
      fallbackTitle: 'Image',
    },
    profile: {
      relatedTitle: 'More profiles',
      fallbackDescription: 'Profile details will appear here.',
      visitButton: 'Visit Site',
    },
  },
} as const
