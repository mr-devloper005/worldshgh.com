'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-white/[0.04] bg-black pb-8 pt-20">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#5a5448]">the</span>
          <Link href="/articles" className="text-[18px] font-light uppercase tracking-[0.2em] text-[#e8e2d6] transition duration-500 hover:text-[#c9a96e]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Work
          </Link>
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#5a5448]">and</span>
          <Link href="/about" className="text-[18px] font-light uppercase tracking-[0.2em] text-[#e8e2d6] transition duration-500 hover:text-[#c9a96e]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            About
          </Link>
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#5a5448]">me</span>
        </nav>

        <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#5a5448]">or</span>
          <Link href="/contact" className="text-[18px] font-light uppercase tracking-[0.2em] text-[#e8e2d6] transition duration-500 hover:text-[#c9a96e]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Contact
          </Link>
        </nav>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {session ? (
            <>
              <Link href="/create" className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#5a5448] transition hover:text-[#7a7468]">Create</Link>
              <button type="button" onClick={logout} className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#5a5448] transition hover:text-[#7a7468]">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#5a5448] transition hover:text-[#7a7468]">Login</Link>
              <Link href="/signup" className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#5a5448] transition hover:text-[#7a7468]">Register</Link>
            </>
          )}
          <Link href="/search" className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#5a5448] transition hover:text-[#7a7468]">Search</Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <img src="/favicon.png" alt="" className="h-6 w-6 object-contain opacity-50" />
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#3a3428]">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
