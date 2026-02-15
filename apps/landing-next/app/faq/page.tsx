import { HeroBlock } from '@/components/page-primitives';
import { Accordion } from '@/components/ui';
import { faqItems } from '@/lib/content';

export default function FaqPage() {
  return (
    <HeroBlock
      badge="FAQ"
      title="Pertanyaan yang sering ditanyakan"
      description="Jawaban singkat seputar safety, privasi, dan cara menggunakan CurhatIn AI."
    >
      <Accordion
        items={faqItems.map((item) => ({
          ...item,
          content: <p className="text-body text-ink-soft">{item.content}</p>
        }))}
      />
    </HeroBlock>
  );
}
