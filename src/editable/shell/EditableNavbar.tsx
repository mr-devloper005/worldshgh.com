'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const baseNavItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Search', href: '/search' },
]

const guestNavItems = [
  ...baseNavItems,
  { label: 'Login', href: '/login' },
  { label: 'Register', href: '/signup' },
]

const memberNavItems = [
  ...baseNavItems,
  { label: 'Create', href: '/create' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = session ? memberNavItems : guestNavItems

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-md">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[98px] items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center border border-[var(--editable-border)] bg-white/70 text-[var(--magazine-ink)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="mx-auto flex items-center text-center lg:mx-0">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-14 w-auto object-contain sm:h-16" />
              <span className="editable-display text-[2.4rem] font-semibold leading-none text-[var(--magazine-accent-deep)] sm:text-[3rem]">
                {SITE_CONFIG.name.split('.')[0]}
              </span>
            </div>
          </Link>

          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-11 w-11 items-center justify-center border border-[var(--editable-border)] bg-white/70 text-[var(--magazine-ink)] transition hover:border-[var(--magazine-accent)] md:inline-flex lg:hidden"
          >
            <Search className="h-4 w-4" />
          </Link>

          <nav className="hidden items-center justify-end gap-4 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-5 text-[0.98rem] font-semibold transition ${
                    active ? 'text-[var(--magazine-ink)]' : 'text-[var(--magazine-ink)]/78 hover:text-[var(--magazine-accent-deep)]'
                  }`}
                >
                  {item.label}
                  {active ? <span className="absolute inset-x-4 bottom-2 h-[3px] bg-[var(--magazine-accent)]" /> : null}
                </Link>
              )
            })}
            {session ? (
              <>
                <span className="max-w-[150px] truncate px-4 py-5 text-[0.98rem] font-semibold text-[var(--magazine-ink)]">
                  {session.name || session.email}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="relative px-4 py-5 text-[0.98rem] font-semibold text-[var(--magazine-ink)]/78 transition hover:text-[var(--magazine-accent-deep)]"
                >
                  Logout
                </button>
              </>
            ) : null}
          </nav>
        </div>

        {open ? (
          <div className="border-t border-[var(--editable-border)] py-4 lg:hidden">
            <div className="grid gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 text-sm font-semibold ${
                      active ? 'bg-[var(--magazine-accent-soft)] text-[var(--magazine-accent-deep)]' : 'text-[var(--magazine-ink)]/82'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              {session ? (
                <>
                  <span className="px-4 py-3 text-sm font-semibold text-[var(--magazine-ink)]">
                    {session.name || session.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                    className="px-4 py-3 text-left text-sm font-semibold text-[var(--magazine-ink)]/82"
                  >
                    Logout
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
