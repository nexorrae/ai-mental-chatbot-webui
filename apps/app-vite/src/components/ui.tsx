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
  return (
    <header className="border-b-base border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/app/chat" className="text-h6 font-extrabold tracking-tight">
          {title}
        </Link>
        <nav className="hidden gap-2 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-pill border-base border-transparent px-3 py-2 text-caption font-semibold hover:border-border hover:bg-paper"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {action}
      </div>
    </header>
  );
}

export function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={clsx('border-t-base border-border bg-paper', compact ? 'mt-4' : 'mt-8')}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-2 px-4 py-4 md:px-8">
        <p className="text-caption text-muted">Pelan-pelan, kamu aman di sini.</p>
        <a
          href="https://www.who.int/teams/mental-health-and-substance-use/suicide-data"
          className="text-caption font-semibold underline"
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
        'inline-flex items-center justify-center rounded-pill border-base px-5 py-2.5 text-button font-semibold transition',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' && 'border-border bg-ink text-paper hover:translate-y-[-1px]',
        variant === 'secondary' && 'border-border bg-paper text-ink hover:bg-accent',
        variant === 'ghost' && 'border-transparent bg-transparent text-ink hover:bg-accent',
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
    default: 'bg-paper text-ink border-border',
    accent: 'bg-accent text-ink border-border',
    success: 'bg-[#e8f7ee] text-success border-success',
    warn: 'bg-[#fff5e7] text-warn border-warn',
    error: 'bg-[#ffeceb] text-error border-error'
  }[tone];

  return <span className={clsx('inline-flex rounded-pill border px-3 py-1 text-caption font-semibold', toneClass)}>{children}</span>;
}

export function OutlinedCard({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx('rounded-lg border-base border-border bg-paper p-5 shadow-soft', className)}>{children}</section>;
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export function Input({ id, label, hint, error, className, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className="flex w-full flex-col gap-2">
      <span className="text-label font-semibold">{label}</span>
      <input
        id={id}
        className={clsx(
          'w-full rounded-md border-base border-border bg-paper px-4 py-3 text-body text-ink placeholder:text-muted',
          error && 'border-error',
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
    <label htmlFor={id} className="flex w-full flex-col gap-2">
      <span className="text-label font-semibold">{label}</span>
      <textarea
        id={id}
        className={clsx('min-h-24 w-full rounded-md border-base border-border bg-paper px-4 py-3 text-body', error && 'border-error', className)}
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
    <label htmlFor={id} className="flex w-full flex-col gap-2">
      <span className="text-label font-semibold">{label}</span>
      <select id={id} className={clsx('w-full rounded-md border-base border-border bg-paper px-4 py-3 text-body', error && 'border-error', className)} {...props}>
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
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Tabs">
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={active === item.id}
            className={clsx(
              'rounded-pill border-base px-4 py-2 text-caption font-semibold',
              active === item.id ? 'border-border bg-ink text-paper' : 'border-border bg-paper text-ink hover:bg-accent'
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
              className="flex w-full items-center justify-between px-4 py-3 text-left text-body font-semibold"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg border-strong border-border bg-paper p-6" role="dialog" aria-modal="true">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-h5 font-bold">{title}</h3>
            {description && <p className="text-caption text-muted">{description}</p>}
          </div>
          <Button variant="ghost" onClick={onClose}>
            Tutup
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message, tone = 'default' }: { message: string; tone?: 'default' | 'success' | 'warn' | 'error' }) {
  const toneClass = {
    default: 'border-border bg-paper text-ink',
    success: 'border-success bg-[#e8f7ee] text-success',
    warn: 'border-warn bg-[#fff5e7] text-warn',
    error: 'border-error bg-[#ffeceb] text-error'
  }[tone];

  return <div className={clsx('rounded-md border-base px-4 py-3 text-caption font-semibold shadow-soft', toneClass)}>{message}</div>;
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={step}
          aria-current={index === current ? 'step' : undefined}
          className={clsx(
            'rounded-md border-base px-3 py-2 text-caption font-semibold',
            index <= current ? 'border-border bg-accent text-ink' : 'border-border bg-paper text-muted'
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
    <div className={clsx('rounded-md border-base border-border bg-accent', compact ? 'p-3' : 'p-4')}>
      <p className="text-caption font-bold uppercase tracking-wide">Grounding 5-4-3-2-1</p>
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
      <h3 className="text-h5 font-bold">{title}</h3>
      <p className="text-body text-ink-soft">{description}</p>
      {action}
      <GroundingCard compact />
    </OutlinedCard>
  );
}

export function LoadingState({ label = 'Memuat...' }: { label?: string }) {
  return (
    <OutlinedCard className="flex items-center gap-3">
      <span className="h-4 w-4 animate-spin rounded-pill border-2 border-border border-r-transparent" />
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
        className="fixed bottom-4 right-4 z-40 rounded-pill border-base border-border bg-paper px-4 py-2 text-caption font-semibold shadow-soft"
      >
        Buka "Take a breath"
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[280px] rounded-lg border-strong border-border bg-paper p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-caption font-bold">Take a breath - 1 menit</p>
          <p className="text-caption text-muted">Napas dulu, lalu lanjut.</p>
        </div>
        <button onClick={() => setDismissed(true)} aria-label="Dismiss widget" className="text-caption">
          X
        </button>
      </div>
      <p className="mt-2 text-body font-semibold">{running ? `${seconds}s tersisa` : 'Siap jeda?'}</p>
      <div className="mt-2 flex gap-2">
        <Button
          variant="primary"
          className="px-3 py-1.5 text-caption"
          onClick={() => {
            if (!running) setSeconds(60);
            setRunning((prev) => !prev);
          }}
        >
          {running ? 'Pause' : 'Mulai'}
        </Button>
        <Button
          variant="secondary"
          className="px-3 py-1.5 text-caption"
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
          <div className={clsx('max-w-[85%] rounded-lg border-base px-4 py-3 text-body', msg.role === 'user' ? 'border-border bg-ink text-paper' : 'border-border bg-paper text-ink')}>
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
        <h3 className="text-h6 font-bold">{title}</h3>
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
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <button
          key={mood}
          aria-pressed={active === mood}
          onClick={() => {
            setActive(mood);
            onSelect?.(mood);
          }}
          className={clsx('rounded-pill border-base px-4 py-2 text-caption font-semibold', active === mood ? 'border-border bg-ink text-paper' : 'border-border bg-paper text-ink hover:bg-accent')}
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
        <h3 className="text-h6 font-bold">Pola Mingguan</h3>
        <p className="text-caption text-muted">Representasi sederhana level energi dan suasana hati.</p>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div className="flex h-28 w-full items-end rounded-sm border border-border bg-bg px-1">
              <div className="w-full rounded-sm bg-accent" style={{ height: `${value}%` }} />
            </div>
            <span className="text-[10px] font-semibold text-muted">{['S', 'S', 'R', 'K', 'J', 'S', 'M'][index]}</span>
          </div>
        ))}
      </div>
    </OutlinedCard>
  );
}
