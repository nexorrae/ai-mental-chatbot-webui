import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { appNav } from '../data/navigation';
import { BreathWidget, Footer, Navbar } from '../components/ui';

export function AppLayout() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const location = useLocation();
  const isChatRoute = location.pathname === '/app/chat';

  if (isChatRoute) {
    return (
      <div className="h-screen overflow-hidden bg-bg text-ink">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar
        title="CurhatIn App"
        links={appNav.slice(0, 6)}
        action={<p className="text-caption font-medium text-muted">Pelan-pelan, kamu aman di sini.</p>}
      />

      <div className="page-shell grid gap-5 py-4 md:grid-cols-[220px_1fr] md:py-6">
        <aside
          className={`space-y-1 rounded-lg border border-border bg-white p-2 ${showMobileNav ? 'block' : 'hidden'} md:block`}
        >
          {appNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setShowMobileNav(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-ink'
                    : 'text-ink-soft hover:bg-accent hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </aside>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-gradient-to-r from-brand-green-soft via-white to-brand-blue-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-h6 font-semibold tracking-tight">Napas dulu, lalu lanjut.</p>
              <p className="text-caption text-muted">Anonymous by default. Login opsional untuk simpan konteks personalmu.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex h-8 items-center rounded-md border border-border px-3 text-caption font-medium text-ink-soft hover:bg-accent hover:text-ink md:hidden"
                onClick={() => setShowMobileNav((prev) => !prev)}
                aria-expanded={showMobileNav}
              >
                {showMobileNav ? 'Tutup menu' : 'Buka menu'}
              </button>
              <a href="/" className="text-caption font-medium text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink">
                Kembali ke landing
              </a>
            </div>
          </div>
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
