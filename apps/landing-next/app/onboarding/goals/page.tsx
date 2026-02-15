import Link from 'next/link';
import { Button, OutlinedCard, Stepper } from '@/components/ui';

const steps = ['Consent', 'Goals', 'Personalisasi'];
const goals = [
  {
    key: 'stress',
    title: 'Mengelola stres',
    description: 'Bikin ritme check-in yang membantu tubuh dan pikiran melambat.'
  },
  {
    key: 'overthinking',
    title: 'Mengurangi overthinking',
    description: 'Belajar memilah pikiran yang bisa ditindaklanjuti dan yang perlu dilepas.'
  },
  {
    key: 'sleep',
    title: 'Tidur lebih teratur',
    description: 'Bangun ritual tenang sebelum tidur dengan jurnal 5 menit.'
  }
];

export default function OnboardingGoalsPage() {
  return (
    <section className="section-wrap py-14 md:py-20">
      <div className="mx-auto max-w-4xl space-y-6">
        <Stepper steps={steps} current={1} />
        <h1 className="text-h3 font-extrabold">Pilih fokus utama kamu</h1>
        <div className="three-col-grid">
          {goals.map((goal) => (
            <OutlinedCard key={goal.key} className="space-y-3">
              <h2 className="text-h6 font-bold">{goal.title}</h2>
              <p className="text-body text-ink-soft">{goal.description}</p>
              <Button variant="secondary">Pilih</Button>
            </OutlinedCard>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/onboarding/personalize">
            <Button variant="primary">Lanjut personalisasi</Button>
          </Link>
          <Link href="/onboarding/consent">
            <Button variant="ghost">Kembali</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
