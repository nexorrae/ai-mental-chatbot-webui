import clsx from 'clsx';
import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useEffect,
  useState
} from 'react';
import { Link } from 'react-router-dom';

export function Navbar({
  title,
  links,
  action
}: {
  title: string;
  links: Array<{ to: string; label: string }>;
  action?: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-white/95 backdrop-blur">
      <div className="page-shell flex items-center justify-between gap-3 py-3">
        <Link
          to="/app/chat"
          className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.015em] text-ink"
          onClick={() => setMobileOpen(false)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-accent text-[12px] text-ink-soft">
            C
          </span>
          {title}
        </Link>
        <nav className="hidden gap-1 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:bg-accent hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex md:items-center">{action}</div>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-ink md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="navbar-mobile-menu"
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {mobileOpen ? (
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
              <path d="M4 6H16M4 10H16M4 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
      {mobileOpen ? (
        <div id="navbar-mobile-menu" className="border-t border-border md:hidden">
          <div className="page-shell space-y-1 py-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-[14px] font-medium text-ink-soft hover:bg-accent hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            {action ? <div className="border-t border-border pt-3">{action}</div> : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={clsx('border-t border-border bg-white', compact ? 'mt-4' : 'mt-8')}>
      <div className="page-shell flex flex-col gap-2 py-4">
        <p className="text-caption text-muted">Pelan-pelan, kamu aman di sini.</p>
        <a
          href="https://www.who.int/teams/mental-health-and-substance-use/suicide-data"
          className="text-caption font-medium underline decoration-dotted underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          Jika kamu merasa tidak aman, hubungi bantuan profesional/nomor darurat setempat.
        </a>
      </div>
    </footer>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', fullWidth = false, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex h-9 items-center justify-center rounded-md border px-3.5 text-button font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' && 'border-[#191919] bg-[#191919] text-white hover:bg-[#111111]',
        variant === 'secondary' && 'border-border bg-white text-ink-soft hover:bg-accent hover:text-ink',
        variant === 'ghost' && 'border-transparent bg-transparent text-ink-soft hover:bg-accent hover:text-ink',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = 'default'
}: {
  children: ReactNode;
  tone?: 'default' | 'accent' | 'success' | 'warn' | 'error';
}) {
  const toneClass = {
    default: 'bg-white text-ink-soft border-border',
    accent: 'bg-accent text-ink-soft border-border',
    success: 'bg-[#edf7f5] text-[#0f7b6c] border-[#ccebe7]',
    warn: 'bg-[#fff7eb] text-[#8a5c13] border-[#f2dfc0]',
    error: 'bg-[#fef1f1] text-[#b42318] border-[#f5d2d0]'
  }[tone];

  return <span className={clsx('inline-flex rounded-md border px-2.5 py-1 text-[11px] font-medium', toneClass)}>{children}</span>;
}

export function OutlinedCard({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx('rounded-lg border border-border bg-white p-4 shadow-soft sm:p-5', className)}>{children}</section>;
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export function Input({ id, label, hint, error, className, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className="flex w-full flex-col gap-1.5">
      <span className="text-label font-medium text-ink-soft">{label}</span>
      <input
        id={id}
        className={clsx(
          'h-10 w-full rounded-md border border-border bg-white px-3 text-[15px] text-ink placeholder:text-muted',
          'focus-visible:border-[#c7c7c7] focus-visible:ring-2 focus-visible:ring-black/5',
          error && 'border-error focus-visible:border-error',
          className
        )}
        {...props}
      />
      {(hint || error) && <span className={clsx('text-caption', error ? 'text-error' : 'text-muted')}>{error ?? hint}</span>}
    </label>
  );
}

export function Textarea({ id, label, hint, error, className, ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label htmlFor={id} className="flex w-full flex-col gap-1.5">
      <span className="text-label font-medium text-ink-soft">{label}</span>
      <textarea
        id={id}
        className={clsx(
          'min-h-24 w-full rounded-md border border-border bg-white px-3 py-2.5 text-[15px]',
          'focus-visible:border-[#c7c7c7] focus-visible:ring-2 focus-visible:ring-black/5',
          error && 'border-error focus-visible:border-error',
          className
        )}
        {...props}
      />
      {(hint || error) && <span className={clsx('text-caption', error ? 'text-error' : 'text-muted')}>{error ?? hint}</span>}
    </label>
  );
}

export function Select({
  id,
  label,
  options,
  hint,
  error,
  className,
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ value: string; label: string }> }) {
  return (
    <label htmlFor={id} className="flex w-full flex-col gap-1.5">
      <span className="text-label font-medium text-ink-soft">{label}</span>
      <select
        id={id}
        className={clsx(
          'h-10 w-full rounded-md border border-border bg-white px-3 text-[15px]',
          'focus-visible:border-[#c7c7c7] focus-visible:ring-2 focus-visible:ring-black/5',
          error && 'border-error focus-visible:border-error',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(hint || error) && <span className={clsx('text-caption', error ? 'text-error' : 'text-muted')}>{error ?? hint}</span>}
    </label>
  );
}

export function Tabs({ items }: { items: Array<{ id: string; label: string; panel: ReactNode }> }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  const selected = items.find((item) => item.id === active) ?? items[0];

  return (
    <div className="space-y-4">
      <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="tablist" aria-label="Tabs">
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={active === item.id}
            className={clsx(
              'shrink-0 rounded-md border px-3 py-1.5 text-caption font-medium',
              active === item.id ? 'border-border bg-accent text-ink' : 'border-border bg-white text-ink-soft hover:bg-accent hover:text-ink'
            )}
            onClick={() => setActive(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <OutlinedCard>{selected?.panel}</OutlinedCard>
    </div>
  );
}

export function Accordion({ items }: { items: Array<{ id: string; title: string; content: ReactNode }> }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <OutlinedCard key={item.id} className="p-0">
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left text-body font-medium"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
            >
              <span>{item.title}</span>
              <span>{open ? '-' : '+'}</span>
            </button>
            {open && <div className="px-4 pb-4 text-body text-ink-soft">{item.content}</div>}
          </OutlinedCard>
        );
      })}
    </div>
  );
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-3 sm:items-center sm:p-4">
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-white p-4 shadow-soft sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-h5 font-semibold">{title}</h3>
            {description && <p className="text-caption text-muted">{description}</p>}
          </div>
          <Button variant="ghost" className="h-8 px-2.5 text-caption" onClick={onClose}>
            Tutup
          </Button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto sm:max-h-none">{children}</div>
      </div>
    </div>
  );
}

export function Toast({ message, tone = 'default' }: { message: string; tone?: 'default' | 'success' | 'warn' | 'error' }) {
  const toneClass = {
    default: 'border-border bg-white text-ink',
    success: 'border-[#ccebe7] bg-[#edf7f5] text-[#0f7b6c]',
    warn: 'border-[#f2dfc0] bg-[#fff7eb] text-[#8a5c13]',
    error: 'border-[#f5d2d0] bg-[#fef1f1] text-[#b42318]'
  }[tone];

  return <div className={clsx('rounded-md border px-3 py-2 text-caption font-medium shadow-soft', toneClass)}>{message}</div>;
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={step}
          aria-current={index === current ? 'step' : undefined}
          className={clsx(
            'rounded-md border px-3 py-2 text-caption font-medium',
            index <= current ? 'border-border bg-accent text-ink' : 'border-border bg-white text-muted'
          )}
        >
          {index + 1}. {step}
        </li>
      ))}
    </ol>
  );
}

export function GroundingCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className={clsx('rounded-md border border-border bg-accent', compact ? 'p-3' : 'p-4')}>
      <p className="text-caption font-semibold uppercase tracking-wide">Grounding 5-4-3-2-1</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-caption text-ink-soft">
        <li>5 hal yang kamu lihat.</li>
        <li>4 hal yang kamu rasakan di tubuh.</li>
        <li>3 suara yang kamu dengar.</li>
        <li>2 aroma yang kamu cium.</li>
        <li>1 hal yang kamu syukuri.</li>
      </ul>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <OutlinedCard className="space-y-3 text-center">
      <h3 className="text-h5 font-semibold tracking-tight">{title}</h3>
      <p className="text-body text-ink-soft">{description}</p>
      {action}
      <GroundingCard compact />
    </OutlinedCard>
  );
}

export function LoadingState({ label = 'Memuat...' }: { label?: string }) {
  return (
    <OutlinedCard className="flex items-center gap-3">
      <span className="h-4 w-4 animate-spin rounded-pill border-2 border-[#cfcfcf] border-r-transparent" />
      <span className="text-caption text-muted">{label}</span>
    </OutlinedCard>
  );
}

export function BreathWidget() {
  const [dismissed, setDismissed] = useState(false);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed bottom-4 right-4 z-40 rounded-md border border-border bg-white px-3 py-2 text-caption font-medium shadow-soft"
      >
        Buka "Take a breath"
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 rounded-lg border border-border bg-white p-4 shadow-soft sm:left-auto sm:w-[300px]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-caption font-semibold">Take a breath - 1 menit</p>
          <p className="text-caption text-muted">Napas dulu, lalu lanjut.</p>
        </div>
        <button onClick={() => setDismissed(true)} aria-label="Dismiss widget" className="text-caption">
          X
        </button>
      </div>
      <p className="mt-2 text-body font-medium">{running ? `${seconds}s tersisa` : 'Siap jeda?'}</p>
      <div className="mt-2 flex gap-2">
        <Button
          variant="primary"
          className="h-8 px-3 text-caption"
          onClick={() => {
            if (!running) setSeconds(60);
            setRunning((prev) => !prev);
          }}
        >
          {running ? 'Pause' : 'Mulai'}
        </Button>
        <Button
          variant="secondary"
          className="h-8 px-3 text-caption"
          onClick={() => {
            setRunning(false);
            setSeconds(60);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

export function ChatBubbleSet({
  messages
}: {
  messages?: Array<{ role: 'user' | 'assistant'; text: string }>;
}) {
  const list =
    messages ?? [
      { role: 'assistant', text: 'Halo, terima kasih sudah datang. Bagaimana keadaanmu hari ini?' },
      { role: 'user', text: 'Lumayan penuh, tapi mau coba cerita pelan-pelan.' }
    ];

  return (
    <div className="space-y-2">
      {list.map((msg, index) => (
        <div key={`${msg.role}-${index}`} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
          <div
            className={clsx(
              'max-w-[92%] rounded-lg border px-4 py-3 text-body sm:max-w-[85%]',
              msg.role === 'user' ? 'border-[#191919] bg-[#191919] text-white' : 'border-border bg-white text-ink'
            )}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export function JournalEntryCard({
  title = 'Catatan hari ini',
  content = 'Aku mencoba memperlambat ritme. Hari ini cukup satu langkah kecil.',
  mood = 'Tenang'
}: {
  title?: string;
  content?: string;
  mood?: string;
}) {
  return (
    <OutlinedCard className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-h6 font-semibold tracking-tight">{title}</h3>
        <Badge tone="accent">{mood}</Badge>
      </div>
      <p className="text-body text-ink-soft">{content}</p>
      <Button variant="secondary">Buka entri</Button>
    </OutlinedCard>
  );
}

export function MoodPicker({
  onSelect
}: {
  onSelect?: (value: string) => void;
}) {
  const moods = ['Lega', 'Tenang', 'Biasa', 'Cemas', 'Sedih'];
  const [active, setActive] = useState('Tenang');

  return (
    <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
      {moods.map((mood) => (
        <button
          key={mood}
          aria-pressed={active === mood}
          onClick={() => {
            setActive(mood);
            onSelect?.(mood);
          }}
          className={clsx(
            'shrink-0 rounded-md border px-3 py-1.5 text-caption font-medium',
            active === mood ? 'border-border bg-accent text-ink' : 'border-border bg-white text-ink-soft hover:bg-accent hover:text-ink'
          )}
        >
          {mood}
        </button>
      ))}
    </div>
  );
}

export function InsightsChartCard() {
  const data = [45, 50, 55, 62, 58, 68, 60];

  return (
    <OutlinedCard className="space-y-4">
      <div>
        <h3 className="text-h6 font-semibold tracking-tight">Pola Mingguan</h3>
        <p className="text-caption text-muted">Representasi sederhana level energi dan suasana hati.</p>
      </div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[360px] grid-cols-7 gap-2">
          {data.map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className="flex h-28 w-full items-end rounded-sm border border-border bg-bg px-1">
                <div className="w-full rounded-sm bg-accent" style={{ height: `${value}%` }} />
              </div>
              <span className="text-[10px] font-semibold text-muted">{['S', 'S', 'R', 'K', 'J', 'S', 'M'][index]}</span>
            </div>
          ))}
        </div>
      </div>
    </OutlinedCard>
  );
}
