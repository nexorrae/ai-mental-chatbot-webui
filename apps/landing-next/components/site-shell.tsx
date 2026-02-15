import Link from 'next/link';
import { BreathWidget, LinkButton } from './ui';
import type { ReactNode } from 'react';

const primaryLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' }
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-30 border-b-base border-border bg-bg/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-content items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link href="/" className="text-h6 font-extrabold tracking-tight">
            curhatinai.com
          </Link>

          <nav aria-label="Primary" className="hidden gap-2 md:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-pill border-base border-transparent px-3 py-2 text-caption font-semibold hover:border-border hover:bg-paper"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LinkButton href="/login" variant="secondary" className="hidden sm:inline-flex">
              Login
            </LinkButton>
            <LinkButton href="/app/chat" variant="primary">
              Masuk ke App
            </LinkButton>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t-base border-border bg-paper">
        <div className="mx-auto grid w-full max-w-content gap-6 px-4 py-10 md:grid-cols-3 md:px-8">
          <div className="space-y-3">
            <p className="text-h6 font-bold">CurhatIn AI</p>
            <p className="text-caption text-muted">
              Pelan-pelan, kamu aman di sini. Platform refleksi dengan pendekatan hangat dan tidak menghakimi.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-caption font-bold uppercase tracking-wide">Navigasi</p>
            <div className="grid grid-cols-2 gap-2 text-caption">
              {primaryLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-caption font-bold uppercase tracking-wide">Safety</p>
            <p className="text-caption text-muted">
              Jika kamu merasa tidak aman, hubungi bantuan profesional atau nomor darurat setempat.
            </p>
            <a
              href="https://www.who.int/teams/mental-health-and-substance-use/suicide-data"
              className="text-caption font-semibold underline"
              target="_blank"
              rel="noreferrer"
            >
              Lihat sumber bantuan krisis
            </a>
          </div>
        </div>
      </footer>
      <BreathWidget />
    </div>
  );
}
