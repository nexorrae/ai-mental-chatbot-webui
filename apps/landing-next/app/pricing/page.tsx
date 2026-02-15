import { HeroBlock } from '@/components/page-primitives';
import { Badge, Button, LinkButton, OutlinedCard } from '@/components/ui';
import { pricingPlans } from '@/lib/content';

export default function PricingPage() {
  return (
    <>
      <HeroBlock
        badge="Pricing"
        title="Harga sederhana, tanpa jebakan"
        description="Pilih paket sesuai ritme refleksimu. Upgrade atau downgrade kapan pun."
      >
        <div className="three-col-grid">
          {pricingPlans.map((plan, index) => (
            <OutlinedCard key={plan.name} className="space-y-4">
              {index === 1 && <Badge tone="accent">Paling populer</Badge>}
              <div>
                <h3 className="text-h5 font-bold">{plan.name}</h3>
                <p className="text-h4 font-extrabold">{plan.price}</p>
                <p className="text-caption text-muted">{plan.note}</p>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-body text-ink-soft">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Button variant={index === 1 ? 'primary' : 'secondary'} fullWidth>
                Pilih paket
              </Button>
            </OutlinedCard>
          ))}
        </div>
      </HeroBlock>

      <section className="section-wrap pb-20">
        <OutlinedCard className="space-y-3 text-center">
          <h2 className="text-h4 font-bold">Butuh paket organisasi?</h2>
          <p className="text-body text-ink-soft">
            Dashboard admin dan kontrol kebijakan untuk kampus, komunitas, atau perusahaan.
          </p>
          <div className="flex justify-center">
            <LinkButton href="/contact" variant="primary">
              Hubungi tim
            </LinkButton>
          </div>
        </OutlinedCard>
      </section>
    </>
  );
}
