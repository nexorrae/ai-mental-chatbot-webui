import { HeroBlock } from '@/components/page-primitives';
import { Button, Input, OutlinedCard, Textarea } from '@/components/ui';

export default function ContactPage() {
  return (
    <HeroBlock
      badge="Contact"
      title="Bicarakan kebutuhan timmu"
      description="Hubungi kami untuk kerja sama komunitas, kampus, atau organisasi yang butuh ruang refleksi digital."
    >
      <div className="grid gap-4 md:grid-cols-12">
        <OutlinedCard className="space-y-4 md:col-span-7">
          <Input id="contact-name" label="Nama" placeholder="Nama lengkap" />
          <Input id="contact-email" label="Email" type="email" placeholder="nama@email.com" />
          <Textarea id="contact-message" label="Pesan" placeholder="Ceritakan kebutuhanmu" />
          <Button variant="primary">Kirim pesan</Button>
        </OutlinedCard>

        <OutlinedCard className="space-y-3 md:col-span-5">
          <h3 className="text-h5 font-bold">Support Hours</h3>
          <p className="text-body text-ink-soft">Senin - Jumat, 09.00 - 18.00 WIB</p>
          <p className="text-body text-ink-soft">Jika kamu merasa tidak aman, hubungi bantuan profesional atau nomor darurat setempat.</p>
        </OutlinedCard>
      </div>
    </HeroBlock>
  );
}
