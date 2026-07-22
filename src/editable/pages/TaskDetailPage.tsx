import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, BriefcaseBusiness, Download, ExternalLink, FileText, Globe2, Image as ImageIcon, Mail, MoreHorizontal, Phone, Tag, UserRound } from 'lucide-react'
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
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
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
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[#f3f2ef] text-[#0b0909]">
        <DetailLayout task={task} post={post} related={related} />
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-semibold text-[#56615e] transition hover:text-[#0a66c2]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
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

  return (
    <>
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Ads slot="header" showLabel eager className="mx-auto w-full" />
    </div>

    <section className="mx-auto grid max-w-[var(--editable-container)] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
      <article className="min-w-0 overflow-hidden rounded-lg border border-[#dedbd4] bg-white">
        <div className="p-4 sm:p-5">
          <BackLink task={task} />
          <div className="mt-6 flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e5f2ef]">
              {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <IconForTask task={task} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold">{post.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-[#666]">{categoryOf(post, taskConfig?.label || 'Post')} · {SITE_CONFIG.name}</p>
            </div>
            <MoreHorizontal className="h-5 w-5 text-[#333]" />
          </div>
        </div>

        <div className="px-4 pb-5 sm:px-5">
          <p className="text-sm font-semibold text-[#408175]">{theme.kicker}</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{post.title}</h1>
          {leadText(post) ? <p className="mt-4 text-lg leading-8 text-[#363c3a]">{leadText(post)}</p> : null}
          {task !== 'profile' ? <InfoChips items={[address, phone, email, website].filter(Boolean)} /> : null}
        </div>

        {task === 'profile' ? <ProfileHero post={post} /> : null}
        {task === 'pdf' && fileUrl ? <DocumentPreview post={post} fileUrl={fileUrl} /> : null}
        {task !== 'pdf' ? <MediaBlock task={task} post={post} images={images} /> : null}

        <div className="mx-auto max-w-6xl px-4 py-6">
          <Ads slot="in-feed" showLabel eager className="mx-auto w-full" />
        </div>

        <div className="px-4 py-5 sm:px-5">
          <BodyContent post={post} />
          {task !== 'profile' ? <ContactAction website={website} phone={phone} email={email} fileUrl={task === 'pdf' ? fileUrl : ''} /> : null}
        </div>

      </article>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <SidePanel title={`More in ${taskConfig?.label || 'Posts'}`} related={related} task={task} />
        <div className="rounded-lg border border-[#dedbd4] bg-white p-6">
          <h2 className="text-2xl font-normal">About this post</h2>
          <div className="mt-5 grid gap-3 text-sm text-[#56615e]">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[#408175]" /> {categoryOf(post, taskConfig?.label || 'Post')}</p>
            <p className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4 text-[#408175]" /> {SITE_CONFIG.name}</p>
          </div>
        </div>
      </aside>
    </section>

    </>
  )
}

function IconForTask({ task }: { task: TaskKey }) {
  const className = 'h-7 w-7 text-[#408175]'
  if (task === 'profile') return <UserRound className={className} />
  if (task === 'listing' || task === 'classified') return <BriefcaseBusiness className={className} />
  if (task === 'image') return <ImageIcon className={className} />
  if (task === 'sbm') return <Bookmark className={className} />
  return <FileText className={className} />
}

function InfoChips({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {items.slice(0, 4).map((item) => (
        <span key={item} className="rounded-full border border-[#dedbd4] px-3 py-1.5 text-xs font-semibold text-[#56615e]">{item}</span>
      ))}
    </div>
  )
}

function MediaBlock({ task, post, images }: { task: TaskKey; post: SitePost; images: string[] }) {
  const gallery = images.length ? images : [placeholder]
  if (task === 'image') {
    return (
      <div className="grid gap-2 bg-[#f3f2ef] p-2 sm:grid-cols-2">
        {gallery.slice(0, 4).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] w-full rounded-sm object-cover" />)}
      </div>
    )
  }
  if (task === 'sbm') return null
  return <img src={gallery[0]} alt={post.title} className="max-h-[620px] w-full bg-[#d9d9d9] object-cover" />
}

function ProfileHero({ post }: { post: SitePost }) {
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <div className="border-y border-[#e7e5df] bg-[#eef3f7] p-6 text-center">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-white">
        {getImages(post)[0] ? <img src={getImages(post)[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-12 w-12 text-[#408175]" />}
      </div>
      <h2 className="mt-4 text-2xl font-semibold">{post.title}</h2>
      {role ? <p className="mt-1 text-sm text-[#56615e]">{role}</p> : null}
    </div>
  )
}

function DocumentPreview({ post, fileUrl }: { post: SitePost; fileUrl: string }) {
  return (
    <div className="border-y border-[#e7e5df] bg-[#f8fafb]">
      <div className="flex items-center justify-between gap-3 p-4">
        <span className="text-sm font-semibold">Document preview</span>
        <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-4 py-2 text-xs font-semibold text-white">Open <Download className="h-4 w-4" /></Link>
      </div>
      <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[70vh] w-full bg-white" />
    </div>
  )
}

function BodyContent({ post }: { post: SitePost }) {
  return (
    <div
      className="article-content max-w-none text-[1rem] leading-8 text-[#0b0909]"
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function ContactAction({ website, phone, email, fileUrl }: { website?: string; phone?: string; email?: string; fileUrl?: string }) {
  if (!website && !phone && !email && !fileUrl) return null
  return (
    <div className="mt-6 flex flex-wrap gap-2.5">
      {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-4 py-2.5 text-sm font-semibold text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
      {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-4 py-2.5 text-sm font-semibold text-white">Download <Download className="h-4 w-4" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[#0b0909] px-4 py-2.5 text-sm font-semibold"><Phone className="h-4 w-4" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[#0b0909] px-4 py-2.5 text-sm font-semibold"><Mail className="h-4 w-4" /> Email</a> : null}
    </div>
  )
}

function SidePanel({ title, related, task }: { title: string; related: SitePost[]; task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="rounded-lg border border-[#dedbd4] bg-white p-6">
      <h2 className="text-2xl font-normal">{title}</h2>
      <div className="mt-5 grid gap-1">
        {related.length ? related.map((item) => (
          <Link key={item.id || item.slug} href={`${taskConfig?.route || `/${task}`}/${item.slug}`} className="flex items-center justify-between gap-3 py-3 text-sm font-semibold">
            <span className="line-clamp-2">{item.title}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-[#666]" />
          </Link>
        )) : <p className="text-sm leading-6 text-[#56615e]">More posts will appear here as the section grows.</p>}
      </div>
    </div>
  )
}
