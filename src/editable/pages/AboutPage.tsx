import Link from 'next/link'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  const about = pagesContent.about
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-black pt-28 text-[#c8c2b6]">
        <section className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#7a7468]">{about.badge}</p>
          <h1 className="mt-6 max-w-3xl text-4xl font-light uppercase tracking-[0.1em] text-[#e8e2d6] sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {about.title}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-[1.9] text-[#7a7468]">{about.description}</p>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8 lg:px-10">
          <div className="border-t border-white/[0.06] pt-16">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="mt-6 max-w-3xl text-base leading-[1.9] text-[#c8c2b6] first:mt-0">{p}</p>
            ))}
          </div>

          <div className="mt-20 grid gap-0 border-t border-white/[0.06]">
            {about.values.map((value, i) => (
              <div key={value.title} className="border-b border-white/[0.06] py-10">
                <div className="flex items-start gap-6">
                  <span className="shrink-0 text-[11px] font-medium tracking-[0.2em] text-[#5a5448]">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-xl font-light uppercase tracking-[0.1em] text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      {value.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-[1.9] text-[#7a7468]">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/contact" className="inline-flex items-center gap-2 border border-[#c9a96e] px-8 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#c9a96e] transition duration-500 hover:bg-[#c9a96e] hover:text-black">
              Get in touch
            </Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
