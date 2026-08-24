import type { AdSkin } from '@/lib/ads/ad-frame'

export const adSkin: AdSkin = {
  radius: '0px',
  border: '1px solid rgba(255,255,255,0.06)',
  shadow: 'none',
  background: '#0a0a0a',
  labelClassName: 'bg-[#c9a96e] text-black',
}

export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '0px', shadow: 'none', border: '1px solid rgba(255,255,255,0.08)' },
  popup: { radius: '0px' },
  header: { radius: '0px', background: '#0a0a0a' },
}

export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
