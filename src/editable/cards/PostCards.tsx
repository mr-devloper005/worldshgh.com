import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group relative block overflow-hidden">
      <div className="relative aspect-[16/9] min-h-[400px] lg:min-h-[520px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:opacity-50 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-16">
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#c9a96e]">{label}</p>
          <h3 className="mt-4 max-w-3xl text-3xl font-light uppercase tracking-[0.08em] text-[#e8e2d6] sm:text-4xl lg:text-5xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {post.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-[1.8] text-[#7a7468]">{getEditableExcerpt(post, 160)}</p>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group w-[220px] shrink-0 snap-start sm:w-[260px]">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">{String(index + 1).padStart(3, '0')}</p>
          <h3 className="mt-2 line-clamp-2 text-sm font-light uppercase tracking-[0.1em] text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex items-center gap-6 border-b border-white/[0.06] py-5 transition duration-500 hover:border-white/[0.15]">
      <span className="w-12 shrink-0 text-right text-[11px] font-medium tracking-[0.2em] text-[#5a5448]">
        {String(index + 1).padStart(3, '0')}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-light uppercase tracking-[0.1em] text-[#c8c2b6] transition duration-500 group-hover:text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.1rem' }}>
          {post.title}
        </h3>
      </div>
      <span className="shrink-0 text-[10px] font-medium tracking-[0.2em] text-[#5a5448]">
        {getEditableCategory(post)}
      </span>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid items-center gap-6 border-b border-white/[0.06] py-6 transition duration-500 hover:border-white/[0.15] sm:grid-cols-[60px_1fr_auto]">
      <span className="hidden text-right text-[11px] font-medium tracking-[0.2em] text-[#5a5448] sm:block">
        {String(index + 1).padStart(3, '0')}
      </span>
      <div className="min-w-0">
        <h2 className="text-lg font-light uppercase tracking-[0.08em] text-[#c8c2b6] transition duration-500 group-hover:text-[#e8e2d6] sm:text-xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-1 text-sm leading-relaxed text-[#5a5448]">{getEditableExcerpt(post, 120)}</p>
      </div>
      <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#5a5448] transition duration-500 group-hover:text-[#c9a96e]">
        Read <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  )
}
