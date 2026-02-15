import { Badge } from './ui';
import type { ReactNode } from 'react';

export function HeroBlock({
  badge,
  title,
  description,
  children
}: {
  badge: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto grid w-full max-w-content gap-8 px-4 py-14 md:px-8 md:py-20">
      <Badge tone="accent">{badge}</Badge>
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <h1 className="text-h1 font-extrabold tracking-tight">{title}</h1>
        </div>
        <div className="md:col-span-4">
          <p className="text-body text-ink-soft">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function SectionHeader({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-h2 font-bold tracking-tight">{title}</h2>
      <p className="max-w-2xl text-body text-ink-soft">{description}</p>
    </div>
  );
}
