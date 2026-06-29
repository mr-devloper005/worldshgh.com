'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass = 'h-12 rounded-full border border-[#dedbd4] bg-white px-4 text-sm text-[#0b0909] outline-none transition placeholder:text-[#8a8a8a] focus:border-[#0b0909]'
const textAreaClass = 'rounded-lg border border-[#dedbd4] bg-white px-4 py-3 text-sm text-[#0b0909] outline-none transition placeholder:text-[#8a8a8a] focus:border-[#0b0909]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const task = (enabledTasks[0]?.key || 'article') as TaskKey
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-white text-[#0b0909]">
          <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-16 sm:px-6 md:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-20">
            <div className="flex min-h-72 items-center justify-center rounded-t-full bg-[#dcebf7] text-[#408175]">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div className="self-center">
              <p className="text-sm font-semibold text-[#408175]">{pagesContent.create.locked.badge}</p>
              <h1 className="mt-3 max-w-[580px] text-[2.75rem] font-normal leading-[1.18] sm:text-5xl lg:text-[3.45rem]">{pagesContent.create.locked.title}</h1>
              <p className="mt-5 max-w-xl text-xl leading-8 text-[#65615c]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#004182]">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[#0b0909] bg-white px-6 py-3 text-sm font-semibold transition hover:bg-[#f3f2ef]">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#0b0909]">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-20">
          <aside>
            <p className="text-sm font-semibold text-[#408175]">{pagesContent.create.hero.badge}</p>
            <h1 className="mt-3 max-w-[580px] text-[2.75rem] font-normal leading-[1.18] sm:text-5xl lg:text-[3.45rem]">
              Create content for every active section
            </h1>
            <p className="mt-5 max-w-xl text-xl leading-8 text-[#65615c]">{pagesContent.create.hero.description}</p>
          </aside>

          <form onSubmit={submit} className="rounded-lg border border-[#dedbd4] bg-[#f3f2ef] p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#408175]">Create {activeTask?.label || 'post'}</p>
                <h2 className="mt-1 text-3xl font-normal">{pagesContent.create.formTitle}</h2>
              </div>
              <span className="rounded-full border border-[#dedbd4] bg-white px-4 py-2 text-sm font-semibold">{session.name}</span>
            </div>

            <div className="mt-6 grid gap-4">
              <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
              </div>
              <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
              <textarea className={`${textAreaClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
              <textarea className={`${textAreaClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
            </div>

            {created ? (
              <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <p className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                <p className="mt-1 text-sm opacity-80">{created.title}</p>
              </div>
            ) : null}

            <button type="submit" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0a66c2] px-6 text-sm font-semibold text-white transition hover:bg-[#004182]">
              <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
            </button>
          </form>
        </section>
      </main>
    </EditableSiteShell>
  )
}
