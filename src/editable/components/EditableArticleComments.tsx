'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'

type Comment = { id: string; name: string; comment: string; createdAt: string }

const storageKey = (slug: string) => `editable:article-comments:${slug}`

function timeAgo(value?: string) {
  if (!value) return ''
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(1, Math.floor((Date.now() - then) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return new Date(then).toLocaleDateString()
}

function initial(name: string) {
  return (name.trim()[0] || 'G').toUpperCase()
}

export function EditableArticleComments({ slug, comments = [] }: { slug: string; comments?: Comment[] }) {
  const [stored, setStored] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug))
      setStored(raw ? (JSON.parse(raw) as Comment[]) : [])
    } catch {
      setStored([])
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setStored(next)
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
    } catch {
      /* storage unavailable */
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    const entry: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Guest',
      comment: body,
      createdAt: new Date().toISOString(),
    }
    persist([entry, ...stored])
    setText('')
  }

  const all = useMemo(() => [...stored, ...comments], [stored, comments])

  return (
    <section className="mt-14 border-t border-white/[0.06] pt-10">
      <div className="flex items-center gap-2 text-lg font-light uppercase tracking-[0.08em] text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        <MessageCircle className="h-5 w-5 text-[#c9a96e]" /> Comments
        <span className="text-[#5a5448]">({all.length})</span>
      </div>

      <form onSubmit={submit} className="mt-6 border border-white/[0.08] bg-[#0a0a0a] p-5">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="h-11 w-full border border-white/[0.08] bg-transparent px-4 text-sm text-[#e8e2d6] outline-none transition placeholder:text-[#5a5448] focus:border-[#c9a96e]"
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          maxLength={1500}
          className="mt-3 w-full resize-y border border-white/[0.08] bg-transparent px-4 py-3 text-sm leading-[1.8] text-[#e8e2d6] outline-none transition placeholder:text-[#5a5448] focus:border-[#c9a96e]"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 border border-[#c9a96e] px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c9a96e] transition duration-500 hover:bg-[#c9a96e] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> Post comment
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-0">
        {all.map((comment) => (
          <div key={comment.id} className="border-b border-white/[0.06] py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#c9a96e]/30 text-sm font-medium text-[#c9a96e]">
                {initial(comment.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#e8e2d6]">{comment.name || 'Guest'}</p>
                {comment.createdAt ? <p className="text-[11px] tracking-[0.1em] text-[#5a5448]">{timeAgo(comment.createdAt)}</p> : null}
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-[1.8] text-[#7a7468]">{comment.comment}</p>
          </div>
        ))}
        {!all.length ? <p className="text-sm text-[#5a5448]">Be the first to comment.</p> : null}
      </div>
    </section>
  )
}
