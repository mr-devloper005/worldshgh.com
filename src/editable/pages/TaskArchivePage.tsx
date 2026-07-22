import Link from 'next/link'
import { ArrowRight, ChevronDown, ChevronRight, FileText, Image as ImageIcon, MessageCircle, MoreHorizontal, Search, Send, ThumbsUp, UserRound } from 'lucide-react'
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
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const placeholder = '/placeholder.svg?height=900&width=1200'

const dedupeUrls = (urls: Array<string | null | undefined>): string[] =>
  Array.from(new Set(urls.map((url) => (typeof url === 'string' ? url.trim() : '')).filter((url) => url.length > 0)))

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singles = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singles].filter(Boolean).slice(0, 8)
}

const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body) || 'Open this post to read the full update and continue exploring.')
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
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[#f3f2ef] text-[#0b0909]">
        <section className="border-b border-[#dedbd4] bg-white">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-[#dedbd4] bg-white p-6">
              <p className="text-sm text-[#56615e]">Top Content /</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight">{label}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#56615e]">{voice?.description || `Explore posts, profiles, and articles from ${SITE_CONFIG.name}.`}</p>
            </div>
          </div>
        </section>

   
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
          <div className="min-w-0">
            <div className="mb-4 rounded-lg border border-[#dedbd4] bg-white p-4">
              <form action={basePath} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#56615e]"><span className="font-semibold text-[#0b0909]">{posts.length}</span> {posts.length === 1 ? 'post' : 'posts'} · {categoryLabel}</p>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <select name="category" defaultValue={category} className="h-11 w-full appearance-none rounded-full border border-[#0b0909] bg-white pl-4 pr-10 text-sm font-semibold outline-none" aria-label={voice?.filterLabel || 'Filter category'}>
                      <option value="all">All categories</option>
                      {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#56615e]" />
                  </div>
                  <button className="h-11 rounded-full bg-[#0a66c2] px-5 text-sm font-semibold text-white">Apply</button>
                </div>
              </form>
            </div>

      

            {posts.length ? (
              <div className="grid gap-4">
                {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#bdb9b0] bg-white px-8 py-16 text-center">
                <Search className="mx-auto h-8 w-8 text-[#408175]" />
                <h2 className="mt-5 text-2xl font-semibold">Nothing here yet</h2>
                <p className="mt-2 text-sm leading-6 text-[#56615e]">Try another category or check back when new posts are published.</p>
              </div>
            )}

            {posts.length ? (
              <nav className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
                {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[#0b0909] bg-white px-5 py-2.5 font-semibold">Previous</Link> : null}
                <span className="rounded-full border border-[#dedbd4] bg-white px-5 py-2.5 font-semibold text-[#56615e]">Page {page} of {pagination.totalPages || 1}</span>
                {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[#0b0909] bg-white px-5 py-2.5 font-semibold">Next</Link> : null}
              </nav>
            ) : null}

            
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Ads slot="sidebar" showLabel className="mx-auto w-full" />
            <RailCard title={`More in ${label}`} items={(posts.length ? posts : []).slice(0, 6).map((post) => [post.title, `${basePath}/${post.slug}`])} fallbackHref={basePath} />
            <div className="rounded-lg border border-[#dedbd4] bg-white p-6">
              <h2 className="text-2xl font-normal">Explore categories</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.slice(0, 8).map((item) => (
                  <Link key={item.slug} href={pageHref(basePath, item.slug, 1)} className="rounded-full border border-[#b7b7b7] px-4 py-2 text-sm font-semibold hover:border-[#0a66c2]">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-6">
          <Ads slot="footer" showLabel className="mx-auto w-full" />
        </div>
      </main>
    </EditableSiteShell>
  )
}

function RailCard({ title, items, fallbackHref }: { title: string; items: string[][]; fallbackHref: string }) {
  const visible = items.length ? items : [['Browse all posts', fallbackHref]]
  return (
    <div className="rounded-lg border border-[#dedbd4] bg-white p-6">
      <h2 className="text-2xl font-normal">{title}</h2>
      <div className="mt-5 grid gap-1">
        {visible.map(([label, href]) => (
          <Link key={`${label}-${href}`} href={href} className="flex items-center justify-between gap-3 py-3 text-sm font-semibold">
            <span className="line-clamp-2">{label}</span>
            <ChevronRight className="h-5 w-5 shrink-0 text-[#666]" />
          </Link>
        ))}
      </div>
    </div>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = post.slug ? `${basePath}/${post.slug}` : buildPostUrl(task, post.slug)
  if (task === 'profile') return <ProfileCard post={post} href={href} />
  if (task === 'image') return <ImageFirstCard post={post} href={href} />
  if (index % 5 === 0) return <FeaturedFeedCard post={post} href={href} task={task} />
  if (index % 5 === 1) return <HorizontalCard post={post} href={href} task={task} />
  if (index % 5 === 2) return <CompactCard post={post} href={href} task={task} />
  return <EditorialCard post={post} href={href} task={task} />
}

function AuthorRow({ post, task }: { post: SitePost; task: TaskKey }) {
  const image = getImage(post)
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e5f2ef]">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{post.title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-[#666]">{getCategory(post, getTaskConfig(task)?.label || 'Post')} · {SITE_CONFIG.name}</p>
      </div>
      <MoreHorizontal className="h-5 w-5 text-[#333]" />
    </div>
  )
}

function ActionRow() {
  return (
    <div className="flex items-center justify-around border-t border-[#e7e5df] px-4 py-3 text-sm font-semibold text-[#666]">
      <span className="inline-flex items-center gap-2"><ThumbsUp className="h-4 w-4" /> Like</span>
      <span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Comment</span>
      <span className="inline-flex items-center gap-2"><Send className="h-4 w-4" /> Share</span>
    </div>
  )
}

function FeaturedFeedCard({ post, href, task }: { post: SitePost; href: string; task: TaskKey }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#dedbd4] bg-white">
      <div className="p-4"><AuthorRow post={post} task={task} /></div>
      <p className="px-4 pb-4 text-sm leading-6">{getSummary(post)}</p>
      <Link href={href} className="block bg-[#d9d9d9]">
        <img src={getImage(post)} alt={post.title} className="mx-auto max-h-[560px] w-full object-cover" />
      </Link>
      <div className="px-4 py-2 text-sm text-[#666]">4,135 · 405 Comments</div>
      <ActionRow />
    </article>
  )
}

function HorizontalCard({ post, href, task }: { post: SitePost; href: string; task: TaskKey }) {
  return (
    <Link href={href} className="grid overflow-hidden rounded-lg border border-[#dedbd4] bg-white transition hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] sm:grid-cols-[180px_1fr]">
      <img src={getImage(post)} alt={post.title} className="h-full min-h-[150px] w-full object-cover" />
      <div className="p-5">
        <p className="text-xs font-semibold uppercase text-[#408175]">{getCategory(post, getTaskConfig(task)?.label || 'Post')}</p>
        <h2 className="mt-2 text-xl font-semibold leading-snug">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#56615e]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function CompactCard({ post, href, task }: { post: SitePost; href: string; task: TaskKey }) {
  return (
    <Link href={href} className="rounded-lg border border-[#dedbd4] bg-white p-5 transition hover:border-[#408175]">
      <div className="flex gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#e5f2ef] text-[#408175]">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-[#408175]">{getCategory(post, getTaskConfig(task)?.label || 'Post')}</p>
          <h2 className="mt-1 line-clamp-2 text-lg font-semibold leading-snug">{post.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#56615e]">{getSummary(post)}</p>
        </div>
      </div>
    </Link>
  )
}

function EditorialCard({ post, href, task }: { post: SitePost; href: string; task: TaskKey }) {
  return (
    <article className="rounded-lg border border-[#dedbd4] bg-white p-5">
      <p className="text-xs font-semibold uppercase text-[#408175]">{getCategory(post, getTaskConfig(task)?.label || 'Post')}</p>
      <Link href={href} className="mt-2 block text-2xl font-semibold leading-snug hover:text-[#0a66c2]">{post.title}</Link>
      <p className="mt-3 text-sm leading-6 text-[#56615e]">{getSummary(post)}</p>
      <Link href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0a66c2]">Read more <ArrowRight className="h-4 w-4" /></Link>
    </article>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-lg border border-[#dedbd4] bg-white">
      <div className="relative">
        <img src={getImage(post)} alt={post.title} className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#2e4540]"><ImageIcon className="mr-1 inline h-3.5 w-3.5" /> Image</span>
      </div>
      <div className="p-5">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#56615e]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ProfileCard({ post, href }: { post: SitePost; href: string }) {
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="rounded-lg border border-[#dedbd4] bg-white p-6 text-center transition hover:border-[#408175]">
      <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#e5f2ef]">
        {getImages(post)[0] ? <img src={getImages(post)[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[#408175]" />}
      </div>
      <h2 className="mt-4 text-xl font-semibold">{post.title}</h2>
      {role ? <p className="mt-1 text-sm text-[#56615e]">{role}</p> : null}
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#56615e]">{getSummary(post)}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0a66c2]">View profile <ChevronRight className="h-4 w-4" /></span>
    </Link>
  )
}
