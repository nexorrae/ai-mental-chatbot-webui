import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { adminNav } from '../data/navigation';
import { Footer, Navbar, OutlinedCard, Button, Input, Toast } from '../components/ui';
import { clearAdminCredentials, hasAdminCredentials, setAdminCredentials } from '../lib/adminAuth';
import { contentApi } from '../lib/contentApi';

export function AdminLayout() {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(() => hasAdminCredentials());
  const [showMobileNav, setShowMobileNav] = useState(false);

  async function submitLogin() {
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setAuthError('Username dan password admin wajib diisi.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    const nextUsername = usernameInput.trim();
    const nextPassword = passwordInput.trim();

    try {
      const response = await fetch(contentApi('/api/articles?includeDraft=true&limit=1'), {
        headers: {
          'x-admin-username': nextUsername,
          'x-admin-password': nextPassword
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setAdminCredentials(nextUsername, nextPassword);
      setUsernameInput('');
      setPasswordInput('');
      setAuthenticated(true);
    } catch {
      setAuthError('Username atau password admin tidak valid.');
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    clearAdminCredentials();
    setAuthenticated(false);
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg text-ink">
        <header className="border-b border-border bg-white">
          <div className="page-shell-narrow flex items-center justify-between gap-3 py-4">
            <p className="inline-flex items-center gap-2 text-h5 font-semibold text-ink">
              <span className="brand-mark brand-mark--xl">
                <img src="/CurhatinAI.png" alt="CurhatIn AI" className="brand-mark__img" />
              </span>
              CurhatIn Admin
            </p>
            <a className="text-caption font-medium text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink" href="/">
              Kembali ke landing
            </a>
          </div>
        </header>

        <main className="page-shell-narrow py-8 sm:py-10">
          <OutlinedCard className="space-y-4">
            <h1 className="text-h4 font-semibold tracking-tight">Login Admin</h1>
            <p className="text-body text-ink-soft">
              Masuk pakai username dan password internal untuk maintenance artikel (create, update, delete).
            </p>
            <Input
              id="admin-username"
              label="Username"
              placeholder="admin username"
              autoComplete="username"
              value={usernameInput}
              onChange={(event) => setUsernameInput(event.target.value)}
            />
            <Input
              id="admin-password"
              label="Password"
              placeholder="admin password"
              type="password"
              autoComplete="current-password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void submitLogin()} disabled={authLoading}>
                {authLoading ? 'Memeriksa...' : 'Login'}
              </Button>
              <a
                href="/articles"
                className="inline-flex h-9 items-center rounded-md border border-border px-3 text-caption font-medium hover:bg-accent"
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
            <a className="text-caption font-medium underline decoration-dotted underline-offset-4" href="/app/chat">
              Buka app user
            </a>
            <Button variant="secondary" className="h-8 px-3 text-caption" onClick={logout}>
              Logout
            </Button>
          </div>
        }
      />

      <div className="page-shell grid gap-4 py-4 md:grid-cols-[240px_1fr]">
        <aside
          className={`space-y-1 rounded-lg border border-border bg-white p-2 ${showMobileNav ? 'block' : 'hidden'} md:block`}
        >
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={() => setShowMobileNav(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                  isActive ? 'bg-accent text-ink' : 'text-ink-soft hover:bg-accent hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </aside>

        <div className="space-y-4">
          <OutlinedCard className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-h6 font-semibold tracking-tight">Admin Console</p>
                <p className="text-caption text-muted">
                  Kelola artikel publik seperti workflow Medium: draft, publish, update, dan delete.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-8 items-center rounded-md border border-border px-3 text-caption font-medium text-ink-soft hover:bg-accent hover:text-ink md:hidden"
                onClick={() => setShowMobileNav((prev) => !prev)}
                aria-expanded={showMobileNav}
              >
                {showMobileNav ? 'Tutup menu' : 'Buka menu'}
              </button>
            </div>
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
