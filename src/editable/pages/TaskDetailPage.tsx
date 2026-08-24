import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Download, ExternalLink, Globe2, Mail, Phone, Star, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  return <TaskDetailView task={task} post={post} related={related} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const dedupeUrls = (urls: Array<string | null | undefined>): string[] =>
  Array.from(new Set(urls.map((url) => (typeof url === 'string' ? url.trim() : '')).filter((url) => url.length > 0)))

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return dedupeUrls([...media, ...images, ...singleImages]).filter(Boolean).slice(0, 12)
}

const placeholder = '/placeholder.svg?height=900&width=1200'

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'
const linkifyMarkdown = (value: string) => value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) => linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})
const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value.split(/\n{2,}/).map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`).join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const decodeEntities = (value: string) => value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
const stripHtml = (value: string) => decodeEntities(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()
const comparableText = (value: string) => stripHtml(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()

const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  const leadKey = comparableText(lead)
  return leadKey && comparableText(getBody(post)).includes(leadKey) ? '' : lead
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

export function TaskDetailView({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-black pt-20 text-[#c8c2b6]">
        {task === 'profile'
          ? <ProfileDetailLayout task={task} post={post} related={related} />
          : <DetailLayout task={task} post={post} related={related} />}
      </main>
    </EditableSiteShell>
  )
}

function ratingFromPost(post: SitePost) {
  const seed = `${post.slug || ''}${post.id || ''}${post.title || ''}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  const normalized = Math.abs(hash % 1200) / 1000
  const value = 3.8 + normalized
  return Math.min(4.9, Math.round(value * 10) / 10)
}

function RatingStars({ value }: { value: number }) {
  const filled = Math.round(value)
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-3.5 w-3.5 ${i < filled ? 'fill-[#c9a96e] text-[#c9a96e]' : 'text-[#3a3428]'}`} />
        ))}
      </div>
      <span className="text-[10px] font-medium tracking-[0.2em] text-[#7a7468]">{value.toFixed(1)}</span>
    </div>
  )
}

function ProfileDetailLayout({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  const images = getImages(post)
  const website = getField(post, ['website', 'url', 'link'])
  const category = categoryOf(post, taskConfig?.label || 'Profile')
  const rating = ratingFromPost(post)

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-6 py-8 sm:px-8 lg:px-10">
        <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a7468] transition duration-500 hover:text-[#c9a96e]">
          <ArrowLeft className="h-3 w-3" /> Back to {taskConfig?.label || 'profiles'}
        </Link>

        <div className="mt-12 text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-white/[0.08]">
            {images[0] ? <img src={images[0]} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-12 w-12 text-[#5a5448]" />}
          </div>
          <h1 className="mt-8 text-4xl font-light uppercase tracking-[0.1em] text-[#e8e2d6] sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <RatingStars value={rating} />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#5a5448]">{category}</span>
          </div>
          {website ? (
            <div className="mt-8">
              <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[#c9a96e] px-8 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c9a96e] transition duration-500 hover:bg-[#c9a96e] hover:text-black">
                Visit website <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {images.slice(0, 3).map((image, index) => (
              <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden">
                <img src={image} alt={`${post.title} ${index + 1}`} className="absolute inset-0 h-full w-full object-cover opacity-60" />
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-6 pb-20 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10">
        <div className="border-t border-white/[0.06] pt-10">
          <BodyContent post={post} />
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Ads slot="sidebar" showLabel className="mx-auto w-full" />
          <NextProjectPanel related={related} task={task} />
        </aside>
      </section>
    </>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a7468] transition duration-500 hover:text-[#c9a96e]">
      <ArrowLeft className="h-3 w-3" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function DetailLayout({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  const images = getImages(post)
  const website = getField(post, ['website', 'url', 'link'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const address = getField(post, ['address', 'location', 'city'])
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const heroImage = images[0] || placeholder

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Ads slot="header" showLabel eager className="mx-auto w-full" />
      </div>

      <section className="relative min-h-[50vh] overflow-hidden">
        <img src={heroImage} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-16 pt-12 sm:px-8 lg:px-10">
          <BackLink task={task} />
          <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.4em] text-[#c9a96e]">{theme.kicker}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-light uppercase tracking-[0.08em] text-[#e8e2d6] sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {post.title}
          </h1>
          {leadText(post) ? <p className="mt-6 max-w-2xl text-base leading-[1.9] text-[#c8c2b6]/80">{leadText(post)}</p> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">{categoryOf(post, taskConfig?.label || 'Post')}</span>
            {address ? <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#5a5448]">{address}</span> : null}
          </div>
        </div>
      </section>

      {task === 'pdf' && fileUrl ? <DocumentPreview post={post} fileUrl={fileUrl} /> : null}

      {task === 'image' && images.length > 0 ? (
        <section className="mx-auto max-w-[1200px] px-6 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-3 sm:grid-cols-2">
            {images.slice(0, 4).map((image, index) => (
              <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden">
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-[1200px] gap-10 px-6 pb-16 pt-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10">
        <div className="border-t border-white/[0.06] pt-10">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <Ads slot="in-feed" showLabel eager className="mx-auto w-full" />
          </div>

          <BodyContent post={post} />
          {task !== 'profile' ? <ContactAction website={website} phone={phone} email={email} fileUrl={task === 'pdf' ? fileUrl : ''} /> : null}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Ads slot="sidebar" showLabel className="mx-auto w-full" />
          <NextProjectPanel related={related} task={task} />
          <div className="border border-white/[0.06] p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">About</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5a5448]">
              <p className="inline-flex items-center gap-2"><Tag className="h-3.5 w-3.5 text-[#c9a96e]" /> {categoryOf(post, taskConfig?.label || 'Post')}</p>
              <p className="inline-flex items-center gap-2"><Globe2 className="h-3.5 w-3.5 text-[#c9a96e]" /> {SITE_CONFIG.name}</p>
            </div>
          </div>
        </aside>
      </section>

      {related.length ? (
        <section className="border-t border-white/[0.04] bg-black py-20 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#7a7468]">Next</p>
          <h2 className="mt-3 text-3xl font-light uppercase tracking-[0.1em] text-[#e8e2d6] sm:text-4xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {related[0].title}
          </h2>
          <Link href={`${taskConfig?.route || `/${task}`}/${related[0].slug}`} className="group mt-8 inline-block overflow-hidden">
            <div className="relative aspect-[16/9] w-[340px] overflow-hidden sm:w-[480px]">
              {getImages(related[0])[0] ? (
                <img src={getImages(related[0])[0]} alt={related[0].title} className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:opacity-60 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 bg-[#111111]" />
              )}
            </div>
          </Link>
        </section>
      ) : null}
    </>
  )
}

function DocumentPreview({ post, fileUrl }: { post: SitePost; fileUrl: string }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 sm:px-8 lg:px-10">
      <div className="border border-white/[0.06]">
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">Document preview</span>
          <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[#c9a96e] px-5 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a96e] transition duration-500 hover:bg-[#c9a96e] hover:text-black">
            Open <Download className="h-3 w-3" />
          </Link>
        </div>
        <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[70vh] w-full bg-[#0a0a0a]" />
      </div>
    </div>
  )
}

function BodyContent({ post }: { post: SitePost }) {
  return (
    <div
      className="article-content max-w-none text-base leading-[1.9] text-[#c8c2b6]"
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function ContactAction({ website, phone, email, fileUrl }: { website?: string; phone?: string; email?: string; fileUrl?: string }) {
  if (!website && !phone && !email && !fileUrl) return null
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[#c9a96e] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c9a96e] transition duration-500 hover:bg-[#c9a96e] hover:text-black">Website <ExternalLink className="h-3 w-3" /></Link> : null}
      {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[#c9a96e] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c9a96e] transition duration-500 hover:bg-[#c9a96e] hover:text-black">Download <Download className="h-3 w-3" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 border border-white/[0.15] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c8c2b6] transition duration-500 hover:border-white/40"><Phone className="h-3 w-3" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 border border-white/[0.15] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c8c2b6] transition duration-500 hover:border-white/40"><Mail className="h-3 w-3" /> Email</a> : null}
    </div>
  )
}

function NextProjectPanel({ related, task }: { related: SitePost[]; task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  if (!related.length) return null
  return (
    <div className="border border-white/[0.06] p-6">
      <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">More</p>
      <div className="mt-4 grid gap-1">
        {related.map((item) => (
          <Link key={item.id || item.slug} href={`${taskConfig?.route || `/${task}`}/${item.slug}`} className="group flex items-center justify-between gap-3 py-3 transition duration-500">
            <span className="line-clamp-2 text-sm font-light text-[#c8c2b6] transition duration-500 group-hover:text-[#e8e2d6]">{item.title}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#5a5448] transition duration-500 group-hover:text-[#c9a96e]" />
          </Link>
        ))}
      </div>
    </div>
  )
}
