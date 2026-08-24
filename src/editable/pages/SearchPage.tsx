import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'

  if (index === 0 && image) {
    return (
      <Link href={href} className="group relative col-span-full block min-h-[350px] overflow-hidden lg:min-h-[420px]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 transition duration-700 group-hover:opacity-45 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#c9a96e]">{taskLabel}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-light uppercase tracking-[0.08em] text-[#e8e2d6] sm:text-4xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {post.title}
          </h2>
          {summary ? <p className="mt-3 max-w-xl text-sm leading-[1.8] text-[#7a7468]">{stripHtml(String(summary)).slice(0, 160)}</p> : null}
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className="group flex items-center gap-6 border-b border-white/[0.06] py-5 transition duration-500 hover:border-white/[0.12]">
      <span className="w-10 shrink-0 text-right text-[11px] font-medium tracking-[0.2em] text-[#5a5448]">{String(index + 1).padStart(3, '0')}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">{taskLabel}</p>
        <h2 className="mt-1 text-base font-light uppercase tracking-[0.06em] text-[#c8c2b6] transition duration-500 group-hover:text-[#e8e2d6] sm:text-lg" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {post.title}
        </h2>
      </div>
      <ArrowRight className="hidden h-4 w-4 shrink-0 text-[#5a5448] transition duration-500 group-hover:text-[#c9a96e] sm:block" />
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-black pt-28 text-[#c8c2b6]">
        <section className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#7a7468]">{pagesContent.search.hero.badge}</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-light uppercase tracking-[0.1em] text-[#e8e2d6] sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {pagesContent.search.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-[1.9] text-[#7a7468]">{pagesContent.search.hero.description}</p>

          <form action="/search" className="mt-10 max-w-2xl border border-white/[0.08] p-6">
            <input type="hidden" name="master" value="1" />
            <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
              <Search className="h-4 w-4 text-[#5a5448]" />
              <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-sm text-[#e8e2d6] outline-none placeholder:text-[#5a5448]" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 border border-white/[0.06] px-4 py-3">
                <Filter className="h-3.5 w-3.5 text-[#5a5448]" />
                <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8c2b6] outline-none placeholder:text-[#5a5448]" />
              </div>
              <select name="task" defaultValue={task} className="border border-white/[0.06] bg-black px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8c2b6] outline-none">
                <option value="">All types</option>
                {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
              <button className="border border-[#c9a96e] bg-transparent px-5 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c9a96e] transition duration-500 hover:bg-[#c9a96e] hover:text-black" type="submit">
                Search
              </button>
            </div>
          </form>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-6">
          <Ads slot="header" showLabel eager className="mx-auto w-full" />
        </div>

        <section className="mx-auto max-w-[1200px] px-6 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl px-4 pb-6">
            <Ads slot="in-feed" showLabel eager className="mx-auto w-full" />
          </div>

          <div className="flex items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#5a5448]">{results.length} results</p>
              <h2 className="mt-2 text-2xl font-light uppercase tracking-[0.1em] text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {query ? `Results for "${query}"` : pagesContent.search.resultsTitle}
              </h2>
            </div>
          </div>

          {results.length ? (
            <div className="mt-6">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-10 border border-white/[0.06] px-8 py-20 text-center">
              <h2 className="text-2xl font-light uppercase tracking-[0.1em] text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>No results found</h2>
              <p className="mt-3 text-sm text-[#5a5448]">Try a different keyword or category.</p>
            </div>
          )}

          <div className="mx-auto max-w-6xl px-4 py-6">
            <Ads slot="article-bottom" showLabel eager className="mx-auto w-full" />
          </div>
          <div className="mx-auto max-w-[320px] px-4 py-6">
            <Ads slot="sidebar" showLabel className="mx-auto w-full" />
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-6">
          <Ads slot="footer" showLabel className="mx-auto w-full" />
        </div>
      </main>
    </EditableSiteShell>
  )
}
