import { Button, Input, OutlinedCard } from '@/components/ui';

export default function ForgotPasswordPage() {
  return (
    <section className="section-wrap py-14 md:py-20">
      <OutlinedCard className="mx-auto max-w-lg space-y-5">
        <header className="space-y-2 text-center">
          <h1 className="text-h3 font-extrabold">Reset password</h1>
          <p className="text-body text-ink-soft">Masukkan email, kami kirim tautan reset.</p>
        </header>

        <form className="space-y-4" aria-label="Forgot password form">
          <Input id="forgot-email" label="Email" type="email" placeholder="nama@email.com" />
          <Button fullWidth variant="primary">
            Kirim tautan reset
          </Button>
        </form>
      </OutlinedCard>
    </section>
  );
}
