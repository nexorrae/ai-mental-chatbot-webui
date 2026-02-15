import { Input, LinkButton, OutlinedCard, Select, Stepper } from '@/components/ui';

const steps = ['Consent', 'Goals', 'Personalisasi'];

export default function OnboardingPersonalizePage() {
  return (
    <section className="section-wrap py-14 md:py-20">
      <div className="mx-auto max-w-3xl space-y-6">
        <Stepper steps={steps} current={2} />
        <OutlinedCard className="space-y-5">
          <h1 className="text-h3 font-extrabold">Personalisasi awal</h1>
          <p className="text-body text-ink-soft">
            Ini membantu CurhatIn menyesuaikan gaya bahasa check-in supaya lebih nyaman untukmu.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Input id="persona-name" label="Nama panggilan" placeholder="Contoh: Gilang" />
            <Select
              id="persona-tone"
              label="Tone respons"
              options={[
                { value: 'warm', label: 'Hangat & lembut' },
                { value: 'direct', label: 'Ringkas & langsung' },
                { value: 'balanced', label: 'Seimbang' }
              ]}
            />
            <Select
              id="persona-frequency"
              label="Frekuensi check-in"
              options={[
                { value: 'daily', label: 'Harian' },
                { value: '3x', label: '3x seminggu' },
                { value: 'weekly', label: 'Mingguan' }
              ]}
            />
            <Select
              id="persona-reminder"
              label="Waktu favorit"
              options={[
                { value: 'morning', label: 'Pagi' },
                { value: 'afternoon', label: 'Siang' },
                { value: 'night', label: 'Malam' }
              ]}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <LinkButton href="/app/chat" variant="primary">
              Selesai & masuk app
            </LinkButton>
            <LinkButton href="/onboarding/goals" variant="ghost">
              Kembali
            </LinkButton>
          </div>
        </OutlinedCard>
      </div>
    </section>
  );
}
