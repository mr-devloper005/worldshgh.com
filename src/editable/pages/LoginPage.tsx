import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  const auth = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className="flex min-h-screen items-center justify-center bg-black px-6 pt-20 text-[#c8c2b6]">
        <div className="w-full max-w-md py-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#7a7468]">{auth.badge}</p>
          <h1 className="mt-4 text-3xl font-light uppercase tracking-[0.1em] text-[#e8e2d6]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {auth.title}
          </h1>
          <p className="mt-4 text-sm leading-[1.9] text-[#7a7468]">{auth.description}</p>
          <EditableLocalLoginForm />
          <p className="mt-6 text-center text-sm text-[#5a5448]">
            <Link href="/signup" className="text-[#c9a96e] transition duration-500 hover:text-[#d4b87a]">{auth.createCta}</Link>
          </p>
        </div>
      </main>
    </EditableSiteShell>
  )
}
