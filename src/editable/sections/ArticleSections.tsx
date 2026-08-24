import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`

  return (
    <main className="min-h-screen bg-black pt-24 text-[#c8c2b6]">
      <section className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#7a7468]">{voice.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-light uppercase tracking-[0.1em] text-[#e8e2d6] sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {voice.headline}
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-[1.9] text-[#7a7468]">{voice.description}</p>

        <form action={basePath} className="mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
          <select name="category" defaultValue={category || 'all'} className="min-w-0 flex-1 border border-white/[0.1] bg-black px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8c2b6] outline-none">
            <option value="all">All categories</option>
            {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
          <button className="border border-[#c9a96e] bg-transparent px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c9a96e] transition duration-500 hover:bg-[#c9a96e] hover:text-black">
            Filter
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
        {posts.length ? (
          <div>
            {posts.map((post, index) => <ArticleListCard key={post.id} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />)}
          </div>
        ) : (
          <div className="border border-white/[0.06] px-8 py-20 text-center">
            <h2 className="text-2xl font-light uppercase tracking-[0.1em] text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>No articles found</h2>
            <p className="mt-3 text-sm text-[#5a5448]">Try another category or return to all articles.</p>
          </div>
        )}

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          {pagination.hasPrevPage ? (
            <Link href={pageHref(page - 1)} className="border border-white/[0.1] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c8c2b6] transition duration-500 hover:border-white/30">
              Previous
            </Link>
          ) : null}
          <span className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#5a5448]">
            Page {page} of {pagination.totalPages || 1}
          </span>
          {pagination.hasNextPage ? (
            <Link href={pageHref(page + 1)} className="border border-white/[0.1] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c8c2b6] transition duration-500 hover:border-white/30">
              Next
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  return (
    <main className="min-h-screen bg-black pt-24 text-[#c8c2b6]">
      <section className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <Link href="/article" className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a7468] transition duration-500 hover:text-[#c9a96e]">
          <ArrowLeft className="h-3 w-3" /> Back to articles
        </Link>

        <h1 className="mt-10 max-w-4xl text-4xl font-light uppercase tracking-[0.08em] text-[#e8e2d6] sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {post?.title || `Article ${slug}`}
        </h1>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20 pt-10 sm:px-8 lg:px-10">
        <div className="border-t border-white/[0.06] pt-8">
          <p className="text-base leading-[1.9] text-[#c8c2b6]">
            {post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}
          </p>
        </div>
      </section>
    </main>
  )
}
