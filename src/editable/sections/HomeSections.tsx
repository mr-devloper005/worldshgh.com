import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditablePostImage, getEditableExcerpt, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-10'

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

function categoryOf(post?: SitePost | null, fallback = 'Featured') {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || fallback
}

const floatingPositions = [
  { top: '8%', left: '5%', width: '22%', aspectRatio: '4/3', zIndex: 2 },
  { top: '4%', left: '32%', width: '14%', aspectRatio: '3/4', zIndex: 3 },
  { top: '12%', left: '50%', width: '18%', aspectRatio: '1/1', zIndex: 1 },
  { top: '5%', left: '72%', width: '16%', aspectRatio: '4/3', zIndex: 2 },
  { top: '55%', left: '8%', width: '18%', aspectRatio: '3/4', zIndex: 1 },
  { top: '48%', left: '30%', width: '22%', aspectRatio: '16/10', zIndex: 3 },
  { top: '52%', left: '56%', width: '15%', aspectRatio: '3/4', zIndex: 2 },
  { top: '45%', left: '76%', width: '18%', aspectRatio: '4/3', zIndex: 1 },
]

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const siteName = SITE_CONFIG.name.replace(/\.com$/i, '')

  return (
    <section className="relative min-h-screen overflow-hidden bg-black pt-20">
      <div className="absolute inset-0">
        {pool.slice(0, 8).map((post, i) => {
          const pos = floatingPositions[i] || floatingPositions[0]
          return (
            <Link
              key={post.id || post.slug}
              href={postHref(primaryTask, post, primaryRoute)}
              className="group absolute overflow-hidden transition-all duration-700 hover:z-10"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
                aspectRatio: pos.aspectRatio,
                zIndex: pos.zIndex,
                animation: `float-drift ${6 + i * 0.7}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <img
                src={getEditablePostImage(post)}
                alt={post.title}
                className="h-full w-full object-cover opacity-35 transition duration-700 group-hover:opacity-60 group-hover:scale-105"
              />
            </Link>
          )
        })}
        {!pool.length ? (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const pos = floatingPositions[i]
              return (
                <div
                  key={i}
                  className="absolute bg-[#111111]"
                  style={{
                    top: pos.top, left: pos.left, width: pos.width,
                    aspectRatio: pos.aspectRatio, zIndex: pos.zIndex,
                    animation: `float-drift ${6 + i * 0.7}s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              )
            })}
          </>
        ) : null}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.5em] text-[#7a7468]">Welcome</p>
          <h1 className="mt-6 leading-[1.3]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            <span className="block text-[11px] font-medium uppercase tracking-[0.5em] text-[#7a7468]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>to</span>
            <span className="mt-2 block text-4xl font-light uppercase tracking-[0.15em] text-[#e8e2d6] sm:text-5xl lg:text-6xl">
              {siteName}&apos;s
            </span>
            <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.5em] text-[#7a7468]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>universe of</span>
            <span className="mt-2 block text-3xl font-light uppercase tracking-[0.12em] text-[#c8c2b6] sm:text-4xl lg:text-5xl">
              Articles
            </span>
            <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.5em] text-[#7a7468]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>and</span>
            <span className="mt-2 block text-3xl font-light uppercase tracking-[0.12em] text-[#c8c2b6] sm:text-4xl lg:text-5xl">
              Creative Profiles
            </span>
          </h1>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 z-10 text-center">
        <Link
          href={primaryRoute}
          className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#7a7468] transition duration-500 hover:text-[#c9a96e]"
        >
          Scroll to explore
        </Link>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  if (!pool.length) return null

  return (
    <section className="border-t border-white/[0.04] bg-black py-20 sm:py-28">
      <div className={container}>
        <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#7a7468]">The Work</p>
        <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.1em] text-[#e8e2d6] sm:text-4xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Featured Articles
        </h2>
      </div>
      <div className="mt-12 flex snap-x gap-6 overflow-x-auto px-6 pb-4 sm:px-8 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pool.slice(0, 8).map((post, i) => (
          <Link
            key={post.id || post.slug}
            href={postHref(primaryTask, post, primaryRoute)}
            className="group w-[220px] shrink-0 snap-start sm:w-[280px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">{String(i + 1).padStart(3, '0')}</p>
                <h3 className="mt-2 line-clamp-2 text-base font-light uppercase tracking-[0.06em] text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {post.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const featured = pool[0]
  const side = pool.slice(1, 4)

  return (
    <>
      {featured ? (
        <section className="border-t border-white/[0.04] bg-black">
          <div className={`grid gap-0 lg:grid-cols-2 ${container} !px-0`}>
            <Link href={postHref(primaryTask, featured, primaryRoute)} className="group relative min-h-[500px] overflow-hidden lg:min-h-[600px]">
              <img src={getEditablePostImage(featured)} alt={featured.title} className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-700 group-hover:opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#c9a96e]">Featured</p>
                <h2 className="mt-4 max-w-lg text-3xl font-light uppercase tracking-[0.08em] text-[#e8e2d6] sm:text-4xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-[1.8] text-[#7a7468]">{getEditableExcerpt(featured, 140)}</p>
              </div>
            </Link>

            <div className="flex flex-col divide-y divide-white/[0.04]">
              {side.map((post, i) => (
                <Link
                  key={post.id || post.slug}
                  href={postHref(primaryTask, post, primaryRoute)}
                  className="group flex flex-1 items-center gap-6 p-8 transition duration-500 hover:bg-white/[0.02] sm:p-10"
                >
                  <span className="shrink-0 text-[11px] font-medium tracking-[0.2em] text-[#5a5448]">{String(i + 2).padStart(3, '0')}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">{categoryOf(post)}</p>
                    <h3 className="mt-2 line-clamp-2 text-lg font-light uppercase tracking-[0.06em] text-[#c8c2b6] transition duration-500 group-hover:text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      {post.title}
                    </h3>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#5a5448] transition duration-500 group-hover:text-[#c9a96e]" />
                </Link>
              ))}
              {!side.length ? (
                <div className="flex flex-1 items-center justify-center p-10">
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#5a5448]">More content coming soon</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-white/[0.04] bg-black py-20 sm:py-28">
        <div className={`${container} text-center`}>
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#7a7468]">For Freelancers</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-light uppercase tracking-[0.1em] text-[#e8e2d6] sm:text-3xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            A space where your work gets the presentation it deserves
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/create" className="inline-flex items-center gap-2 border border-[#c9a96e] bg-transparent px-8 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c9a96e] transition duration-500 hover:bg-[#c9a96e] hover:text-black">
              Start creating
            </Link>
            <Link href="/search" className="inline-flex items-center gap-2 border border-white/[0.15] bg-transparent px-8 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c8c2b6] transition duration-500 hover:border-white/40">
              Browse all
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections = timeSections.length ? timeSections : [{ key: 'latest', posts, href: primaryRoute }]
  const visible = sections.filter((s) => s.posts.length).slice(0, 2)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section) => (
        <section key={section.key} className="border-t border-white/[0.04] bg-black py-16 sm:py-24">
          <div className={container}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#7a7468]">Latest</p>
                <h2 className="mt-3 text-2xl font-light uppercase tracking-[0.1em] text-[#e8e2d6] sm:text-3xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  Recent Work
                </h2>
              </div>
              <Link href="/search" className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7a7468] transition duration-500 hover:text-[#c9a96e]">
                View all <ArrowRight className="ml-1 inline h-3 w-3" />
              </Link>
            </div>

            <div className="mt-10">
              {section.posts.slice(0, 8).map((post, index) => (
                <Link
                  key={post.id || post.slug}
                  href={postHref(primaryTask, post, primaryRoute)}
                  className="group grid items-center gap-6 border-b border-white/[0.06] py-5 transition duration-500 hover:border-white/[0.12] sm:grid-cols-[60px_1fr_180px_auto]"
                >
                  <span className="hidden text-right text-[11px] font-medium tracking-[0.2em] text-[#5a5448] sm:block">
                    {String(index + 1).padStart(3, '0')}
                  </span>
                  <h3 className="text-base font-light uppercase tracking-[0.06em] text-[#c8c2b6] transition duration-500 group-hover:text-[#e8e2d6] sm:text-lg" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {post.title}
                  </h3>
                  <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-[#5a5448] sm:block">
                    {categoryOf(post)}
                  </span>
                  <ArrowRight className="hidden h-4 w-4 text-[#5a5448] transition duration-500 group-hover:text-[#c9a96e] sm:block" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}

export function EditableHomeCta() {
  const siteName = SITE_CONFIG.name.replace(/\.com$/i, '')

  return (
    <section className="border-t border-white/[0.04] bg-black py-24 sm:py-32">
      <div className={`${container} text-center`}>
        <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#c9a96e]">Join the Community</p>
        <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-light uppercase tracking-[0.1em] text-[#e8e2d6] sm:text-4xl lg:text-5xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Who is {siteName} for?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-[1.9] text-[#7a7468]">
          Freelancers, writers, designers, consultants, and independent professionals who want their work discovered and appreciated.
        </p>

        <div className="mx-auto mt-14 grid max-w-3xl gap-0 border-t border-white/[0.06]">
          {['Share your articles and essays', 'Build your creative profile', 'Connect with like-minded people'].map((item, i) => (
            <Link
              key={item}
              href="/search"
              className="group flex items-center justify-between border-b border-white/[0.06] px-6 py-5 transition duration-500 hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-5">
                <span className="text-[11px] font-medium tracking-[0.2em] text-[#5a5448]">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base font-light uppercase tracking-[0.06em] text-[#c8c2b6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{item}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-[#5a5448] transition duration-500 group-hover:text-[#c9a96e]" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
