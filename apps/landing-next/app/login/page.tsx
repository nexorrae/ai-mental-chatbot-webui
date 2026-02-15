import Link from 'next/link';
import { Button, Input, OutlinedCard } from '@/components/ui';

export default function LoginPage() {
  return (
    <section className="section-wrap py-14 md:py-20">
      <OutlinedCard className="mx-auto max-w-lg space-y-5">
        <header className="space-y-2 text-center">
          <h1 className="text-h3 font-extrabold">Masuk ke CurhatIn</h1>
          <p className="text-body text-ink-soft">Pelan-pelan, kamu aman di sini.</p>
        </header>

        <form className="space-y-4" aria-label="Login form">
          <Input id="login-email" label="Email" type="email" placeholder="nama@email.com" />
          <Input id="login-password" label="Password" type="password" placeholder="********" />
          <Button variant="primary" fullWidth>
            Login
          </Button>
        </form>

        <div className="flex items-center justify-between gap-2 text-caption">
          <Link href="/forgot-password" className="underline">Lupa password</Link>
          <Link href="/register" className="underline">Belum punya akun?</Link>
        </div>
      </OutlinedCard>
    </section>
  );
}
