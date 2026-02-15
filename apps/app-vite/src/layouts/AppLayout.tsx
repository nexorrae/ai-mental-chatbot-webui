import { NavLink, Outlet } from 'react-router-dom';
import { appNav } from '../data/navigation';
import { BreathWidget, Footer, Navbar, OutlinedCard } from '../components/ui';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar
        title="CurhatIn App"
        links={appNav.slice(0, 6)}
        action={<p className="hidden text-caption font-semibold text-muted sm:block">Pelan-pelan, kamu aman di sini.</p>}
      />

      <div className="mx-auto grid w-full max-w-[1200px] gap-4 px-4 py-4 md:grid-cols-[240px_1fr] md:px-8">
        <aside className="space-y-2 rounded-lg border-base border-border bg-paper p-3">
          {appNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-pill border px-3 py-2 text-caption font-semibold ${
                  isActive ? 'border-border bg-ink text-paper' : 'border-transparent hover:border-border hover:bg-accent'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </aside>

        <div className="space-y-4">
          <OutlinedCard className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-h6 font-bold">Napas dulu, lalu lanjut.</p>
              <p className="text-caption text-muted">Satu aksi utama setiap halaman untuk jaga fokus.</p>
            </div>
            <a href="/" className="text-caption font-semibold underline">
              Kembali ke landing
            </a>
          </OutlinedCard>
          <main>
            <Outlet />
          </main>
          <Footer compact />
        </div>
      </div>
      <BreathWidget />
    </div>
  );
}
