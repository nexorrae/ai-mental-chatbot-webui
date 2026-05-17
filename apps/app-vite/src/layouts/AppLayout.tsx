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
          className={`space-y-1 rounded-md border border-border bg-paper/95 p-2 shadow-soft ${showMobileNav ? 'block' : 'hidden'} md:block`}
        >
          {appNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setShowMobileNav(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-green text-paper shadow-soft'
                    : 'text-ink-soft hover:bg-brand-green-soft hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </aside>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-md border border-border bg-paper/95 px-4 py-3 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-h6 font-semibold tracking-tight">Napas dulu, lalu lanjut.</p>
              <p className="text-caption text-muted">Anonymous by default. Login opsional untuk simpan konteks personalmu.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex h-8 items-center rounded-md border border-border bg-paper px-3 text-xs font-semibold text-ink shadow-sm hover:bg-bg md:hidden"
                onClick={() => setShowMobileNav((prev) => !prev)}
                aria-expanded={showMobileNav}
              >
                {showMobileNav ? 'Tutup menu' : 'Buka menu'}
              </button>
              <a href="/" className="text-caption font-semibold text-brand-green underline decoration-dotted underline-offset-4 hover:text-[#3f560d]">
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
