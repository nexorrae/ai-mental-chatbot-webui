import { NavLink, Outlet } from 'react-router-dom';
import { adminNav } from '../data/navigation';
import { Footer, Navbar, OutlinedCard } from '../components/ui';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar
        title="CurhatIn Admin"
        links={adminNav}
        action={<a className="text-caption font-semibold underline" href="/app/chat">Buka app user</a>}
      />

      <div className="mx-auto grid w-full max-w-[1200px] gap-4 px-4 py-4 md:grid-cols-[240px_1fr] md:px-8">
        <aside className="space-y-2 rounded-lg border-base border-border bg-paper p-3">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
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
          <OutlinedCard className="space-y-1">
            <p className="text-h6 font-bold">Admin Console</p>
            <p className="text-caption text-muted">Kelola keselamatan produk, moderasi konten, dan konfigurasi operasional.</p>
          </OutlinedCard>
          <main>
            <Outlet />
          </main>
          <Footer compact />
        </div>
      </div>
    </div>
  );
}
