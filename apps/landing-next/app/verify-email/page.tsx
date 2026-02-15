import { Badge, Button, OutlinedCard } from '@/components/ui';

export default function VerifyEmailPage() {
  return (
    <section className="section-wrap py-14 md:py-20">
      <OutlinedCard className="mx-auto max-w-xl space-y-5 text-center">
        <Badge tone="accent">Verify Email</Badge>
        <h1 className="text-h3 font-extrabold">Periksa inbox kamu</h1>
        <p className="text-body text-ink-soft">
          Kami telah mengirim tautan verifikasi. Setelah verifikasi, kamu bisa melanjutkan onboarding.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="primary">Saya sudah verifikasi</Button>
          <Button variant="secondary">Kirim ulang email</Button>
        </div>
      </OutlinedCard>
    </section>
  );
}
