import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { adminNav } from '../data/navigation';
import { Footer, Navbar, OutlinedCard, Button, Input, Toast } from '../components/ui';
import { clearAdminToken, hasAdminToken, setAdminToken } from '../lib/adminAuth';

export function AdminLayout() {
  const [tokenInput, setTokenInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(() => hasAdminToken());

  function submitLogin() {
    if (!tokenInput.trim()) {
      setAuthError('Masukkan admin token terlebih dahulu.');
      return;
    }
    setAdminToken(tokenInput);
    setTokenInput('');
    setAuthError(null);
    setAuthenticated(true);
  }

  function logout() {
    clearAdminToken();
    setAuthenticated(false);
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg text-ink">
        <header className="border-b border-[#e8ece9] bg-white">
          <div className="mx-auto flex w-full max-w-[920px] items-center justify-between gap-3 px-4 py-4 md:px-8">
            <p className="text-h5 font-extrabold text-[#1f5f56]">CurhatIn Admin</p>
            <a className="text-caption font-semibold text-[#2a9d8f]" href="/">
              Kembali ke landing
            </a>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[920px] px-4 py-10 md:px-8">
          <OutlinedCard className="space-y-4">
            <h1 className="text-h4 font-extrabold">Login Admin</h1>
            <p className="text-body text-ink-soft">
              Masukkan admin token untuk maintenance artikel (create, update, delete) layaknya CMS.
            </p>
            <Input
              id="admin-token"
              label="Admin Token"
              placeholder="Masukkan ADMIN_API_TOKEN"
              type="password"
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={submitLogin}>Login</Button>
              <a
                href="/articles"
                className="inline-flex items-center rounded-pill border-base border-border px-4 py-2 text-caption font-semibold"
              >
                Lihat articles public
              </a>
            </div>
            {authError ? <Toast message={authError} tone="error" /> : null}
          </OutlinedCard>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar
        title="CurhatIn Admin"
        links={adminNav}
        action={
          <div className="flex items-center gap-2">
            <a className="text-caption font-semibold underline" href="/app/chat">
              Buka app user
            </a>
            <Button variant="secondary" className="px-3 py-1.5 text-caption" onClick={logout}>
              Logout
            </Button>
          </div>
        }
      />

      <div className="mx-auto grid w-full max-w-[1200px] gap-4 px-4 py-4 md:grid-cols-[240px_1fr] md:px-8">
        <aside className="space-y-2 rounded-[16px] border border-[#e7ece9] bg-white p-3">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `block rounded-pill border px-3 py-2 text-caption font-semibold ${
                  isActive ? 'border-border bg-ink text-paper' : 'border-transparent hover:border-border/40 hover:bg-accent'
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
            <p className="text-caption text-muted">
              Kelola artikel publik seperti workflow Medium: draft, publish, update, dan delete.
            </p>
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
