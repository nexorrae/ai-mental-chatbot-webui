import Link from 'next/link';
import { Button, Input, OutlinedCard, Select } from '@/components/ui';

export default function RegisterPage() {
  return (
    <section className="section-wrap py-14 md:py-20">
      <OutlinedCard className="mx-auto max-w-xl space-y-5">
        <header className="space-y-2 text-center">
          <h1 className="text-h3 font-extrabold">Buat akun baru</h1>
          <p className="text-body text-ink-soft">Mulai perjalanan refleksi yang lebih terstruktur.</p>
        </header>

        <form className="grid gap-4" aria-label="Register form">
          <Input id="register-name" label="Nama panggilan" placeholder="Nama" />
          <Input id="register-email" label="Email" type="email" placeholder="nama@email.com" />
          <Input id="register-password" label="Password" type="password" placeholder="Minimal 8 karakter" />
          <Select
            id="register-goal"
            label="Fokus utama"
            options={[
              { value: 'stress', label: 'Mengelola stres' },
              { value: 'overthinking', label: 'Mengurangi overthinking' },
              { value: 'sleep', label: 'Tidur lebih teratur' }
            ]}
          />
          <Button variant="primary" fullWidth>
            Daftar
          </Button>
        </form>

        <p className="text-center text-caption text-muted">
          Dengan mendaftar, kamu menyetujui kebijakan privasi dan pedoman safety.
        </p>

        <p className="text-center text-caption">
          Sudah punya akun? <Link href="/login" className="underline">Login</Link>
        </p>
      </OutlinedCard>
    </section>
  );
}
