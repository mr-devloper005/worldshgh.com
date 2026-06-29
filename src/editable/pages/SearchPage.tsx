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

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
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
  const strong = index % 5 === 0

  return (
    <Link href={href} className={`group block overflow-hidden rounded-lg border border-[#dedbd4] bg-white transition hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] ${strong ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`overflow-hidden bg-[#eef3f7] ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      ) : null}
      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase text-[#408175]">{taskLabel}</p>
        <h2 className="mt-2 line-clamp-3 text-xl font-semibold leading-snug text-[#0b0909]">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#65615c]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0a66c2]">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
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
      <main className="min-h-screen bg-white text-[#0b0909]">
        <section className="bg-white">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-20">
            <div>
              <p className="text-sm font-semibold text-[#408175]">{pagesContent.search.hero.badge}</p>
              <h1 className="mt-3 max-w-[580px] text-[2.75rem] font-normal leading-[1.18] sm:text-5xl lg:text-[3.45rem]">
                Search stories and resources
              </h1>
              <p className="mt-5 max-w-xl text-xl leading-8 text-[#65615c]">{pagesContent.search.hero.description}</p>
            </div>

            <form action="/search" className="self-center rounded-lg border border-[#dedbd4] bg-[#f3f2ef] p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex h-12 items-center gap-3 rounded-full border border-[#0b0909] bg-white px-4">
                <Search className="h-4 w-4 text-[#666]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8a8a8a]" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex h-12 items-center gap-2 rounded-full border border-[#dedbd4] bg-white px-4">
                  <Filter className="h-4 w-4 text-[#666]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8a8a8a]" />
                </label>
                <select name="task" defaultValue={task} className="h-12 rounded-full border border-[#dedbd4] bg-white px-4 text-sm font-semibold outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0a66c2] px-6 text-sm font-semibold text-white transition hover:bg-[#004182]" type="submit">
                Search
              </button>
            </form>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-6">
          <Ads slot="header" showLabel eager className="mx-auto w-full" />
        </div>

        <section className="bg-[#f3f2ef]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl px-4 pb-6">
              <Ads slot="in-feed" showLabel eager className="mx-auto w-full" />
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#408175]">{results.length} results</p>
                <h2 className="mt-2 text-3xl font-normal">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
              </div>
              <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-[#0b0909] bg-white px-5 py-2.5 text-sm font-semibold">
                Browse latest <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {results.length ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
              </div>
            ) : (
              <div className="mt-8 rounded-lg border border-dashed border-[#dedbd4] bg-white p-10 text-center">
                <p className="text-2xl font-semibold">No matching posts found.</p>
                <p className="mt-3 text-sm text-[#65615c]">Try a different keyword, task type, or category.</p>
              </div>
            )}

            <div className="mx-auto max-w-6xl px-4 py-6">
              <Ads slot="article-bottom" showLabel eager className="mx-auto w-full" />
            </div>

            <div className="mx-auto max-w-[320px] px-4 py-6">
              <Ads slot="sidebar" showLabel className="mx-auto w-full" />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-6">
          <Ads slot="footer" showLabel className="mx-auto w-full" />
        </div>
      </main>
    </EditableSiteShell>
  )
}
