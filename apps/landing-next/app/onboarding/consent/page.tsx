import Link from 'next/link';
import { Button, GroundingCard, OutlinedCard, Stepper } from '@/components/ui';

const steps = ['Consent', 'Goals', 'Personalisasi'];

export default function OnboardingConsentPage() {
  return (
    <section className="section-wrap py-14 md:py-20">
      <div className="mx-auto max-w-3xl space-y-6">
        <Stepper steps={steps} current={0} />
        <OutlinedCard className="space-y-4">
          <h1 className="text-h3 font-extrabold">Sebelum mulai</h1>
          <p className="text-body text-ink-soft">
            CurhatIn AI adalah ruang refleksi. Kami tidak memberikan diagnosis atau janji medis.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-body text-ink-soft">
            <li>Gunakan platform ini untuk refleksi personal dan pengelolaan emosi harian.</li>
            <li>Jika kamu merasa tidak aman, segera hubungi bantuan profesional atau nomor darurat setempat.</li>
            <li>Kamu dapat mengatur privasi, ekspor data, atau hapus data dari Settings kapan saja.</li>
          </ul>
          <GroundingCard />
          <div className="flex flex-wrap gap-2">
            <Link href="/onboarding/goals">
              <Button variant="primary">Saya mengerti, lanjut</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">Kembali ke beranda</Button>
            </Link>
          </div>
        </OutlinedCard>
      </div>
    </section>
  );
}
