'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function LanguageSwitcher({ lang }: { lang: string }) {
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(locale: string) {
    const newPath = pathname.replace(`/${lang}`, `/${locale}`)
    router.push(newPath)
  }

  return (
    <div
      className="flex items-center rounded-full p-0.5 text-xs font-bold"
      style={{
        background: 'rgba(92,31,31,0.08)',
        border: '1px solid rgba(92,31,31,0.1)',
      }}
    >
      {(['mn', 'en'] as const).map((locale) => (
        <button
          key={locale}
          onClick={() => switchTo(locale)}
          className="px-3 py-1.5 rounded-full transition-all tracking-widest uppercase"
          style={
            lang === locale
              ? {
                  background: '#5C1F1F',
                  color: '#FAF6EE',
                }
              : {
                  color: '#9B7B6B',
                }
          }
          onMouseEnter={(e) => {
            if (lang !== locale)
              (e.currentTarget as HTMLButtonElement).style.color = '#5C1F1F'
          }}
          onMouseLeave={(e) => {
            if (lang !== locale)
              (e.currentTarget as HTMLButtonElement).style.color = '#9B7B6B'
          }}
        >
          {locale}
        </button>
      ))}
    </div>
  )
}
