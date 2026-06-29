'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const baseLinks = [
  ['Home', '/'],
  ['About', '/about'],
  ['Contact', '/contact'],
  ['Search', '/search'],
]

const guestLinks = [
  ...baseLinks,
  ['Login', '/login'],
  ['Register', '/signup'],
]

const memberLinks = [
  ...baseLinks,
  ['Create', '/create'],
]

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`inline-flex items-center font-bold leading-none text-[#0a66c2] ${small ? 'text-base' : 'text-xl'}`}>
      <span>{SITE_CONFIG.name.replace(/\.com$/i, '')}</span>
      <span className="ml-0.5 rounded-[2px] bg-[#0a66c2] px-0.5 text-[0.72em] font-extrabold leading-tight text-white">in</span>
    </span>
  )
}

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const links = session ? memberLinks : guestLinks

  return (
    <footer className="bg-[#f3f2ef] text-[#0b0909]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_2fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex">
            <BrandMark />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#65615c]">{globalContent.footer?.description || SITE_CONFIG.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Links</h3>
          <div className="mt-3 grid gap-2">
            {links.map(([label, href]) => (
              <Link key={`${label}-${href}`} href={href} className="text-sm text-[#4f5654] transition hover:text-[#0a66c2]">
                {label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="text-left text-sm text-[#4f5654] transition hover:text-[#0a66c2]">
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-[#dedbd4] bg-white">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-xs text-[#65615c] sm:px-6 lg:px-8">
          <BrandMark small />
          <span>&copy; {year}</span>
          {links.map(([label, href]) => (
            <Link key={`${label}-${href}`} href={href}>
              {label}
            </Link>
          ))}
          {session ? <button type="button" onClick={logout}>Logout</button> : null}
        </div>
      </div>
    </footer>
  )
}
