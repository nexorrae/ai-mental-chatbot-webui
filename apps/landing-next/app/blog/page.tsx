import Link from 'next/link';
import { HeroBlock } from '@/components/page-primitives';
import { OutlinedCard } from '@/components/ui';
import { blogPosts } from '@/lib/content';

export default function BlogPage() {
  return (
    <HeroBlock
      badge="Blog"
      title="Artikel refleksi yang ringkas"
      description="Konten dukungan ringan untuk membantu kamu menyusun jeda dan rutinitas sehat."
    >
      <div className="three-col-grid">
        {blogPosts.map((post) => (
          <OutlinedCard key={post.slug} className="space-y-3">
            <p className="text-caption font-semibold text-muted">{post.date}</p>
            <h3 className="text-h6 font-bold">{post.title}</h3>
            <p className="text-body text-ink-soft">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-caption font-semibold underline">
              Baca artikel
            </Link>
          </OutlinedCard>
        ))}
      </div>
    </HeroBlock>
  );
}
