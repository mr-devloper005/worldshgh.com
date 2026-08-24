'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
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
    <header className="fixed left-0 right-0 top-0 z-50 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <img src="/favicon.png" alt="" className="h-7 w-7 object-contain" />
          <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#e8e2d6] transition duration-500 group-hover:text-[#c9a96e]">
            {SITE_CONFIG.name.replace(/\.com$/i, '')}
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-[#c8c2b6] transition hover:text-[#e8e2d6] lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] font-medium uppercase tracking-[0.3em] transition duration-500 ${
                  active ? 'text-[#c9a96e]' : 'text-[#7a7468] hover:text-[#e8e2d6]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          {session ? (
            <>
              <span className="max-w-[120px] truncate text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8c2b6]">
                {session.name || session.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a7468] transition duration-500 hover:text-[#c9a96e]"
              >
                Logout
              </button>
            </>
          ) : null}
        </nav>
      </div>

      {open ? (
        <div className="border-t border-white/[0.06] px-6 py-6 lg:hidden">
          <div className="grid gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 text-[11px] font-medium uppercase tracking-[0.3em] ${
                    active ? 'text-[#c9a96e]' : 'text-[#7a7468]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <>
                <span className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8c2b6]">
                  {session.name || session.email}
                </span>
                <button
                  type="button"
                  onClick={() => { logout(); setOpen(false) }}
                  className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a7468]"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
