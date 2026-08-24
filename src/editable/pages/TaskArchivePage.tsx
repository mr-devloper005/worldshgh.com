import Link from 'next/link'
import { ArrowRight, ChevronDown, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
const placeholder = '/placeholder.svg?height=900&width=1200'

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singles = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singles].filter(Boolean).slice(0, 8)
}

const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body) || 'Open this post to read the full content.')
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-black pt-24 text-[#c8c2b6]">
        <section className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#7a7468]">{voice?.eyebrow || label}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-light uppercase tracking-[0.1em] text-[#e8e2d6] sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {voice?.headline || label}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-[1.9] text-[#7a7468]">{voice?.description || `Explore ${label} from ${SITE_CONFIG.name}.`}</p>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-10 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#5a5448]">
              <span className="text-[#c8c2b6]">{posts.length}</span> {posts.length === 1 ? 'entry' : 'entries'}
            </p>
            <form action={basePath} className="flex gap-3">
              <div className="relative">
                <select name="category" defaultValue={category} className="h-10 appearance-none border border-white/[0.1] bg-black pl-4 pr-10 text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8c2b6] outline-none" aria-label={voice?.filterLabel || 'Filter'}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-[#5a5448]" />
              </div>
              <button className="h-10 border border-[#c9a96e] bg-transparent px-5 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c9a96e] transition duration-500 hover:bg-[#c9a96e] hover:text-black">
                Apply
              </button>
            </form>
          </div>

          <div className="mx-auto max-w-6xl px-4 py-6">
            <Ads slot="in-feed" showLabel eager className="mx-auto w-full" />
          </div>

          {posts.length ? (
            <div>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="border border-white/[0.06] px-8 py-20 text-center">
              <Search className="mx-auto h-6 w-6 text-[#5a5448]" />
              <h2 className="mt-5 text-2xl font-light uppercase tracking-[0.1em] text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Nothing here yet</h2>
              <p className="mt-2 text-sm text-[#5a5448]">Try another category or check back later.</p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-14 flex flex-wrap items-center justify-center gap-4 text-sm">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="border border-white/[0.1] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c8c2b6] transition duration-500 hover:border-white/30">Previous</Link> : null}
              <span className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#5a5448]">Page {page} of {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="border border-white/[0.1] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c8c2b6] transition duration-500 hover:border-white/30">Next</Link> : null}
            </nav>
          ) : null}

          <div className="mx-auto max-w-6xl px-4 py-6">
            <Ads slot="footer" showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = post.slug ? `${basePath}/${post.slug}` : buildPostUrl(task, post.slug)
  if (task === 'profile') return <ProfileCard post={post} href={href} />
  if (task === 'image') return <ImageFirstCard post={post} href={href} index={index} />
  if (index === 0) return <FeaturedCard post={post} href={href} task={task} />
  if (index % 5 === 1) return <HorizontalCard post={post} href={href} task={task} index={index} />
  if (index % 5 === 2) return <CompactCard post={post} href={href} task={task} index={index} />
  return <TrackListCard post={post} href={href} task={task} index={index} />
}

function FeaturedCard({ post, href, task: _task }: { post: SitePost; href: string; task: TaskKey }) {
  return (
    <Link href={href} className="group relative mb-8 block min-h-[400px] overflow-hidden lg:min-h-[500px]">
      <img src={getImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-30 transition duration-700 group-hover:opacity-45 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
        <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#c9a96e]">Featured</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-light uppercase tracking-[0.08em] text-[#e8e2d6] sm:text-4xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {post.title}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-[1.8] text-[#7a7468]">{getSummary(post).slice(0, 160)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a96e]">
          Read <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  )
}

function HorizontalCard({ post, href, task, index: _index }: { post: SitePost; href: string; task: TaskKey; index: number }) {
  return (
    <Link href={href} className="group grid items-center gap-6 border-b border-white/[0.06] py-6 transition duration-500 hover:border-white/[0.12] sm:grid-cols-[140px_1fr_auto]">
      <div className="relative hidden aspect-[4/3] overflow-hidden sm:block">
        <img src={getImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:opacity-70" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">{getCategory(post, getTaskConfig(task)?.label || 'Post')}</p>
        <h2 className="mt-2 text-lg font-light uppercase tracking-[0.06em] text-[#c8c2b6] transition duration-500 group-hover:text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-1 text-sm text-[#5a5448]">{getSummary(post).slice(0, 100)}</p>
      </div>
      <ArrowRight className="hidden h-4 w-4 text-[#5a5448] transition duration-500 group-hover:text-[#c9a96e] sm:block" />
    </Link>
  )
}

function CompactCard({ post, href, task, index }: { post: SitePost; href: string; task: TaskKey; index: number }) {
  return (
    <Link href={href} className="group flex items-center gap-6 border-b border-white/[0.06] py-5 transition duration-500 hover:border-white/[0.12]">
      <span className="w-10 shrink-0 text-right text-[11px] font-medium tracking-[0.2em] text-[#5a5448]">{String(index + 1).padStart(3, '0')}</span>
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-light uppercase tracking-[0.06em] text-[#c8c2b6] transition duration-500 group-hover:text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {post.title}
        </h2>
      </div>
      <span className="hidden shrink-0 text-[10px] font-medium uppercase tracking-[0.2em] text-[#5a5448] sm:block">{getCategory(post, getTaskConfig(task)?.label || 'Post')}</span>
    </Link>
  )
}

function TrackListCard({ post, href, task, index }: { post: SitePost; href: string; task: TaskKey; index: number }) {
  return (
    <Link href={href} className="group grid items-center gap-6 border-b border-white/[0.06] py-5 transition duration-500 hover:border-white/[0.12] sm:grid-cols-[50px_1fr_180px_auto]">
      <span className="hidden text-right text-[11px] font-medium tracking-[0.2em] text-[#5a5448] sm:block">{String(index + 1).padStart(3, '0')}</span>
      <h2 className="text-base font-light uppercase tracking-[0.06em] text-[#c8c2b6] transition duration-500 group-hover:text-[#e8e2d6] sm:text-lg" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        {post.title}
      </h2>
      <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-[#5a5448] sm:block">{getCategory(post, getTaskConfig(task)?.label || 'Post')}</span>
      <ArrowRight className="hidden h-4 w-4 text-[#5a5448] transition duration-500 group-hover:text-[#c9a96e] sm:block" />
    </Link>
  )
}

function ImageFirstCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group relative mb-4 block overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={getImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:opacity-60 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">{String(index + 1).padStart(3, '0')}</p>
          <h2 className="mt-2 text-xl font-light uppercase tracking-[0.06em] text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{post.title}</h2>
        </div>
      </div>
    </Link>
  )
}

function ProfileCard({ post, href }: { post: SitePost; href: string }) {
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group flex items-center gap-6 border-b border-white/[0.06] py-6 transition duration-500 hover:border-white/[0.12]">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.08]">
        {getImages(post)[0] ? <img src={getImages(post)[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-6 w-6 text-[#5a5448]" />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-light uppercase tracking-[0.06em] text-[#c8c2b6] transition duration-500 group-hover:text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {post.title}
        </h2>
        {role ? <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#7a7468]">{role}</p> : null}
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-[#5a5448] transition duration-500 group-hover:text-[#c9a96e]" />
    </Link>
  )
}
