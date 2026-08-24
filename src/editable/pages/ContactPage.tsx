'use client'

import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'

export default function ContactPage() {
  const contact = pagesContent.contact
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-black pt-28 text-[#c8c2b6]">
        <section className="mx-auto max-w-[800px] px-6 sm:px-8 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#7a7468]">{contact.eyebrow}</p>
          <h1 className="mt-6 text-4xl font-light uppercase tracking-[0.1em] text-[#e8e2d6] sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {contact.title}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-[1.9] text-[#7a7468]">{contact.description}</p>
        </section>

        <section className="mx-auto max-w-[800px] px-6 pb-24 pt-12 sm:px-8 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#5a5448]">{contact.formTitle}</p>
          <EditableContactLeadForm />
        </section>
      </main>
    </EditableSiteShell>
  )
}
