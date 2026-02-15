import { HeroBlock } from '@/components/page-primitives';
import { DesignSystemShowcase } from '@/components/design-system-showcase';

export default function DesignSystemPage() {
  return (
    <HeroBlock
      badge="Design System"
      title="Token + komponen untuk semua halaman"
      description="Satu sistem visual untuk landing, auth, onboarding, app, dan admin agar konsisten di desktop dan mobile."
    >
      <DesignSystemShowcase />
    </HeroBlock>
  );
}
