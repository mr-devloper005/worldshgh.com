import Link from 'next/link'
import { ArrowRight, BookOpen, BriefcaseBusiness, Building2, ChevronRight, GraduationCap, MessageCircle, PenLine, Sparkles, UserRound, UsersRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function contentOf(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function clean(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function excerpt(post?: SitePost | null, limit = 130) {
  const content = contentOf(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    'Open the post to read the full update and follow the conversation.'
  const text = clean(raw)
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text
}

function categoryOf(post?: SitePost | null, fallback = 'Top Content') {
  const content = contentOf(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || fallback
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

const topics = ['Career', 'Productivity', 'Finance', 'Writing', 'Research', 'Education', 'Technology', 'Leadership', 'Community', 'Publishing']
const games = ['Drafts', 'Ideas', 'Reviews', 'Comments', 'Topics', 'Saved Reads']

function TopicPills({ items, limit }: { items: string[]; limit?: number }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.slice(0, limit || items.length).map((item) => (
        <Link key={item} href={`/search?q=${encodeURIComponent(item)}`} className="rounded-full border border-[#0b0909] bg-white px-6 py-3 text-sm font-semibold text-[#202124] transition hover:bg-[#f3f2ef]">
          {item}
        </Link>
      ))}
    </div>
  )
}

function HeroIllustration({ posts, primaryTask, primaryRoute }: { posts: SitePost[]; primaryTask: TaskKey; primaryRoute: string }) {
  const featured = posts.slice(0, 3)
  return (
    <div className="relative min-h-[430px] overflow-hidden">
      <div className="absolute right-0 top-5 h-[390px] w-[390px] rounded-full bg-[#e7f2f6]" />
      <div className="absolute right-10 top-16 h-[320px] w-[300px] rounded-t-full bg-[#fff1d6]" />
      <div className="absolute right-16 top-24 grid w-[240px] grid-cols-2 gap-2">
        {featured.map((post, index) => (
          <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className={`group overflow-hidden rounded-sm bg-white shadow-sm ${index === 0 ? 'col-span-2 h-36' : 'h-28'}`}>
            <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </Link>
        ))}
        {!featured.length ? (
          <>
            <div className="col-span-2 h-36 bg-[#b5b9f0]" />
            <div className="h-28 bg-[#408175]" />
            <div className="h-28 bg-[#2e4540]" />
          </>
        ) : null}
      </div>
      <div className="absolute bottom-8 left-6 h-48 w-36 rounded-t-full bg-[#2e4540]" />
      <div className="absolute bottom-0 left-16 h-28 w-24 bg-[#6f7b61]" />
      <div className="absolute bottom-20 left-20 h-20 w-20 rounded-full bg-[#513227]" />
      <div className="absolute bottom-28 left-36 h-14 w-32 rotate-[-8deg] rounded-md bg-[#d9e8ea]" />
      <div className="absolute bottom-1 left-8 h-3 w-28 rounded-full bg-[#d8a08c]" />
      <div className="absolute bottom-10 right-2 h-24 w-20 rounded-t-full bg-[#b8c7be]" />
    </div>
  )
}

function FeedPreview({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block rounded-lg border border-[#dedbd4] bg-white transition hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-start gap-3 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e5f2ef]">
          <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{post.title}</p>
          <p className="mt-0.5 text-xs text-[#666]">{categoryOf(post)} · {SITE_CONFIG.name}</p>
        </div>
      </div>
      <p className="px-4 pb-4 text-sm leading-6 text-[#0b0909]">{excerpt(post, 145)}</p>
      <div className="aspect-[16/10] overflow-hidden bg-[#eef3f7]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  return (
    <section className="bg-white">
      <div className={`grid min-h-[650px] items-center gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20 ${container}`}>
        <div>
          <h1 className="max-w-[580px] text-[2.75rem] font-normal leading-[1.18] text-[#0b0909] sm:text-5xl lg:text-[3.45rem]">
            Explore ideas and grow your professional network
          </h1>
        </div>
        <HeroIllustration posts={pool} primaryTask={primaryTask} primaryRoute={primaryRoute} />
      </div>
    </section>
  )
}

export function EditableStoryRail(_props: HomeSectionProps) {
  return (
    <section className="bg-[#f3f2ef]">
      <div className={`grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr] ${container}`}>
        <div>
          <h2 className="max-w-md text-3xl font-normal leading-tight sm:text-4xl">Explore top {SITE_CONFIG.name.replace(/\.com$/i, '')} content</h2>
          <p className="mt-4 max-w-md text-xl leading-8">Discover relevant posts and thoughtful perspectives, curated by topic in one place.</p>
        </div>
        <TopicPills items={topics} />
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  return (
    <>
      <section className="bg-[#ece7df]">
        <div className={`py-16 text-center ${container}`}>
          <h2 className="text-3xl font-normal text-[#9f3b20]">Publish your work for more people to see</h2>
          <Link href="/create" className="mt-8 inline-flex rounded-full border border-[#0a66c2] px-6 py-3 text-sm font-semibold text-[#0a66c2] transition hover:bg-white">Create a post</Link>
        </div>
      </section>

      <section className="bg-white">
        <div className={`grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr] ${container}`}>
          <div>
            <h2 className="max-w-md text-3xl font-normal leading-tight sm:text-4xl">Keep your mind sharp with fresh ideas</h2>
            <p className="mt-4 max-w-md text-xl leading-8">Take a break and explore quick reads, comments, and conversation starters.</p>
          </div>
          <TopicPills items={games} />
        </div>
      </section>

      {pool.length ? (
        <section className="bg-[#f3f2ef]">
          <div className={`grid gap-8 py-16 lg:grid-cols-[1fr_1fr] ${container}`}>
            <div className="rounded-lg bg-white p-8">
              <PenLine className="h-8 w-8 text-[#408175]" />
              <h2 className="mt-5 text-3xl font-normal leading-tight">Connect with people who can help</h2>
              <Link href="/search" className="mt-8 inline-flex rounded-full border border-[#0b0909] px-6 py-3 text-sm font-semibold">Find people you know</Link>
            </div>
            <div className="grid gap-5">
              {pool.slice(0, 2).map((post) => (
                <FeedPreview key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

function CompactCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const mode = index % 5
  if (mode === 0) {
    return (
      <Link href={href} className="group grid overflow-hidden rounded-lg border border-[#dedbd4] bg-white md:grid-cols-[220px_1fr]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full min-h-[170px] w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="p-5">
          <p className="text-xs font-semibold uppercase text-[#408175]">{categoryOf(post)}</p>
          <h3 className="mt-2 text-xl font-semibold leading-snug">{post.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#65615c]">{excerpt(post, 160)}</p>
        </div>
      </Link>
    )
  }
  if (mode === 1) {
    return (
      <Link href={href} className="group block rounded-lg border border-[#dedbd4] bg-white p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5f2ef] text-sm font-bold text-[#2e4540]">{index + 1}</span>
          <div>
            <p className="text-xs font-semibold uppercase text-[#408175]">{categoryOf(post)}</p>
            <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-[#0a66c2]">{post.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#65615c]">{excerpt(post, 110)}</p>
          </div>
        </div>
      </Link>
    )
  }
  if (mode === 2) {
    return (
      <Link href={href} className="group block overflow-hidden rounded-lg border border-[#dedbd4] bg-white">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="p-5">
          <h3 className="text-lg font-semibold leading-snug">{post.title}</h3>
          <p className="mt-2 text-sm text-[#65615c]">{categoryOf(post)}</p>
        </div>
      </Link>
    )
  }
  return <FeedPreview post={post} href={href} />
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections = timeSections.length ? timeSections : [{ key: 'latest', posts, href: primaryRoute }]
  const visible = sections.filter((section) => section.posts.length).slice(0, 2)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, sectionIndex) => (
        <section key={section.key} className={sectionIndex % 2 ? 'bg-[#f3f2ef]' : 'bg-white'}>
          <div className={`py-16 ${container}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#408175]">Top Content</p>
                <h2 className="mt-2 text-3xl font-normal">Featured reads</h2>
              </div>
              <Link href="/search" className="inline-flex items-center gap-1 rounded-full border border-[#0b0909] px-5 py-2.5 text-sm font-semibold">Show all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {section.posts.slice(0, 6).map((post, index) => (
                <CompactCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="overflow-hidden bg-white">
      <div className={`grid gap-8 py-20 lg:grid-cols-[0.75fr_1.25fr] ${container}`}>
        <div className="rounded-lg bg-[#f3f2ef] p-8">
          <h2 className="text-3xl font-normal text-[#9f3b20]">Who is {SITE_CONFIG.name.replace(/\.com$/i, '')} for?</h2>
          <p className="mt-4 text-lg">Anyone looking to publish, learn, connect, or build a stronger professional presence.</p>
          {['Find a writer or classmate', 'Share a new search', 'Build aportfolio'].map((item) => (
            <Link key={item} href="/search" className="mt-4 flex items-center justify-between bg-[#e9e5df] px-5 py-4 text-lg">
              {item} <ChevronRight className="h-5 w-5" />
            </Link>
          ))}
        </div>
        <div className="relative min-h-[360px] overflow-hidden rounded-t-full bg-[#dcebf7]">
          <div className="absolute inset-x-0 bottom-0 grid h-44 grid-cols-5">
            <div className="bg-[#f2c2b5]" />
            <div className="bg-[#c7d8d5]" />
            <div className="bg-[#b5b9f0]" />
            <div className="bg-[#d7eadf]" />
            <div className="bg-[#f5d3b8]" />
          </div>
          {[UsersRound, BookOpen, GraduationCap, BriefcaseBusiness, MessageCircle, Sparkles, Building2, UserRound].map((Icon, index) => (
            <div key={index} className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#408175] shadow-sm" style={{ left: `${8 + (index % 4) * 22}%`, top: `${34 + Math.floor(index / 4) * 22}%` }}>
              <Icon className="h-6 w-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
