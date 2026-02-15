import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/components/site-shell';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://curhatinai.com'),
  title: {
    default: 'CurhatIn AI | Ruang Refleksi yang Aman',
    template: '%s | CurhatIn AI'
  },
  description:
    'CurhatIn AI adalah ruang refleksi yang hangat, privat, dan tidak menghakimi untuk membantu kamu menulis, bernapas, dan memahami pola emosimu.',
  openGraph: {
    title: 'CurhatIn AI',
    description: 'Ruang refleksi yang aman dan berempati.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="paper-texture">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
