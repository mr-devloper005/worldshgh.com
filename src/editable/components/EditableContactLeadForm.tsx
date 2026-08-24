'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks. Your message has been received.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 border border-white/[0.08] bg-[#0a0a0a] p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email address" placeholder="you@example.com" required />
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field name="phone" label="Phone number" placeholder="Optional" />
        <Field name="subject" label="Subject" placeholder="How can we help?" />
      </div>
      <label className="mt-5 grid gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">
        Message
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us what you need help with..."
          className="border border-white/[0.08] bg-transparent px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#e8e2d6] outline-none transition placeholder:text-[#5a5448] focus:border-[#c9a96e]"
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {message ? (
        <div className={`mt-6 flex items-start gap-3 px-5 py-4 text-sm font-medium ${status === 'success' ? 'border border-emerald-800/40 bg-emerald-950/30 text-emerald-300' : 'border border-red-800/40 bg-red-950/30 text-red-300'}`}>
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : null}
          <span>{message}</span>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 border border-[#c9a96e] bg-transparent text-[11px] font-medium uppercase tracking-[0.3em] text-[#c9a96e] transition duration-500 hover:bg-[#c9a96e] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send message
      </button>
    </form>
  )
}

function Field({ name, label, type = 'text', placeholder, required = false }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a7468]">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 border border-white/[0.08] bg-transparent px-4 text-sm font-normal normal-case tracking-normal text-[#e8e2d6] outline-none transition placeholder:text-[#5a5448] focus:border-[#c9a96e]"
      />
    </label>
  )
}
