'use client';

import clsx from 'clsx';
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useEffect,
  useState
} from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

interface LinkButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const buttonClassName = (variant: ButtonVariant, fullWidth: boolean, className?: string) =>
  clsx(
    'inline-flex items-center justify-center rounded-pill border-base px-5 py-2.5 text-button font-semibold transition focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variant === 'primary' && 'border-border bg-ink text-paper hover:translate-y-[-1px]',
    variant === 'secondary' && 'border-border bg-paper text-ink hover:bg-accent',
    variant === 'ghost' && 'border-transparent bg-transparent text-ink hover:bg-accent',
    fullWidth && 'w-full',
    className
  );

export function Button({
  variant = 'primary',
  className,
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClassName(variant, fullWidth, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = 'primary',
  className,
  fullWidth = false,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link href={href} className={buttonClassName(variant, fullWidth, className)} {...props}>
      {children}
    </Link>
  );
}

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'accent' | 'success' | 'warn' | 'error'; }) {
  const toneClass = {
    default: 'bg-paper text-ink border-border',
    accent: 'bg-accent text-ink border-border',
    success: 'bg-[#e8f7ee] text-success border-success',
    warn: 'bg-[#fff5e7] text-warn border-warn',
    error: 'bg-[#ffeceb] text-error border-error'
  }[tone];

  return (
    <span className={clsx('inline-flex items-center rounded-pill border px-3 py-1 text-caption font-semibold', toneClass)}>
      {children}
    </span>
  );
}

export function OutlinedCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-lg border-base border-border bg-paper p-6 shadow-soft', className)}>
      {children}
    </div>
  );
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
      <span className="text-label font-semibold text-ink">{label}</span>
      <input
        id={id}
        className={clsx(
          'w-full rounded-md border-base border-border bg-paper px-4 py-3 text-body text-ink placeholder:text-muted',
          'focus-visible:outline-none',
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
      <span className="text-label font-semibold text-ink">{label}</span>
      <textarea
        id={id}
        className={clsx(
          'min-h-28 w-full resize-y rounded-md border-base border-border bg-paper px-4 py-3 text-body text-ink placeholder:text-muted',
          'focus-visible:outline-none',
          error && 'border-error',
          className
        )}
        {...props}
      />
      {(hint || error) && <span className={clsx('text-caption', error ? 'text-error' : 'text-muted')}>{error ?? hint}</span>}
    </label>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

export function Select({ id, label, hint, error, options, className, ...props }: FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[]; }) {
  return (
    <label htmlFor={id} className="flex w-full flex-col gap-2">
      <span className="text-label font-semibold text-ink">{label}</span>
      <select
        id={id}
        className={clsx(
          'w-full rounded-md border-base border-border bg-paper px-4 py-3 text-body text-ink',
          'focus-visible:outline-none',
          error && 'border-error',
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

interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

export function Tabs({ items, defaultTab }: { items: TabItem[]; defaultTab?: string }) {
  const first = defaultTab ?? items[0]?.id;
  const [active, setActive] = useState(first);

  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Tabs">
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={active === item.id}
            aria-controls={`panel-${item.id}`}
            id={`tab-${item.id}`}
            onClick={() => setActive(item.id)}
            className={clsx(
              'rounded-pill border-base px-4 py-2 text-button font-semibold transition',
              active === item.id ? 'border-border bg-ink text-paper' : 'border-border bg-paper text-ink hover:bg-accent'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <OutlinedCard>
        <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`}>
          {current.panel}
        </div>
      </OutlinedCard>
    </div>
  );
}

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <OutlinedCard key={item.id} className="p-0">
            <h3>
              <button
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-h6 font-semibold"
                aria-expanded={open}
                aria-controls={`accordion-${item.id}`}
              >
                <span>{item.title}</span>
                <span aria-hidden="true">{open ? '-' : '+'}</span>
              </button>
            </h3>
            <div
              id={`accordion-${item.id}`}
              className={clsx('px-5 pb-5 text-body text-ink-soft', open ? 'block' : 'hidden')}
            >
              {item.content}
            </div>
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
      <div className="w-full max-w-xl rounded-lg border-strong border-border bg-paper p-6 shadow-soft" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 id="modal-title" className="text-h5 font-bold">{title}</h3>
            {description && <p className="text-body text-ink-soft">{description}</p>}
          </div>
          <Button variant="ghost" aria-label="Close modal" onClick={onClose}>
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

  return (
    <div className={clsx('rounded-md border-base px-4 py-3 text-caption font-semibold shadow-soft', toneClass)} role="status" aria-live="polite">
      {message}
    </div>
  );
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {steps.map((step, index) => {
        const active = index <= current;
        return (
          <li
            key={step}
            className={clsx(
              'rounded-md border-base px-4 py-3 text-caption font-semibold',
              active ? 'border-border bg-accent text-ink' : 'border-border bg-paper text-muted'
            )}
            aria-current={index === current ? 'step' : undefined}
          >
            {index + 1}. {step}
          </li>
        );
      })}
    </ol>
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
    <OutlinedCard className="space-y-4 text-center">
      <h3 className="text-h5 font-bold">{title}</h3>
      <p className="mx-auto max-w-xl text-body text-ink-soft">{description}</p>
      {action}
      <GroundingCard compact />
    </OutlinedCard>
  );
}

export function LoadingState({ label = 'Menyiapkan ruang tenang untukmu...' }: { label?: string }) {
  return (
    <OutlinedCard className="flex items-center gap-3">
      <span className="h-4 w-4 animate-spin rounded-pill border-2 border-border border-r-transparent" aria-hidden="true" />
      <span className="text-body text-ink-soft">{label}</span>
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
        className="fixed bottom-5 right-5 z-40 rounded-pill border-base border-border bg-paper px-4 py-2 text-caption font-semibold shadow-soft"
        onClick={() => setDismissed(false)}
      >
        Buka latihan napas
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 w-[280px] rounded-lg border-strong border-border bg-paper p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-caption font-bold text-ink">Take a breath - 1 menit</p>
          <p className="text-caption text-muted">Napas dulu, lalu lanjut.</p>
        </div>
          <button aria-label="Dismiss breath widget" onClick={() => setDismissed(true)} className="text-caption font-semibold">
            X
          </button>
      </div>

      <p className="mt-3 text-h6 font-bold">{running ? `${seconds}s tersisa` : 'Siap untuk jeda singkat?'}</p>
      <div className="mt-3 flex gap-2">
        <Button
          variant="primary"
          className="px-4 py-2 text-caption"
          onClick={() => {
            if (!running) setSeconds(60);
            setRunning((prev) => !prev);
          }}
        >
          {running ? 'Pause' : 'Mulai'}
        </Button>
        <Button
          variant="secondary"
          className="px-4 py-2 text-caption"
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

export function GroundingCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className={clsx('rounded-md border-base border-border bg-accent text-left', compact ? 'p-4' : 'p-5')}>
      <p className="text-caption font-bold uppercase tracking-wide">Grounding 5-4-3-2-1</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-caption text-ink-soft">
        <li>5 hal yang kamu lihat.</li>
        <li>4 hal yang kamu rasakan di tubuh.</li>
        <li>3 suara yang kamu dengar.</li>
        <li>2 aroma yang kamu cium.</li>
        <li>1 hal kecil yang kamu syukuri.</li>
      </ul>
    </div>
  );
}

interface BubbleMessage {
  role: 'user' | 'assistant';
  text: string;
}

export function ChatBubbleSet({
  messages = [
    { role: 'user', text: 'Hari ini aku capek banget.' },
    { role: 'assistant', text: 'Terima kasih sudah cerita. Pelan-pelan, kamu aman di sini.' }
  ]
}: {
  messages?: BubbleMessage[];
}) {
  return (
    <div className="space-y-3">
      {messages.map((msg, index) => (
        <div key={`${msg.role}-${index}`} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
          <div
            className={clsx(
              'max-w-[85%] rounded-lg border-base px-4 py-3 text-body',
              msg.role === 'user' ? 'border-border bg-ink text-paper' : 'border-border bg-paper text-ink'
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
  date = 'Minggu, 15 Februari 2026',
  mood = 'Tenang',
  excerpt = 'Aku mencoba melambat hari ini. Tidak semua hal harus selesai sekaligus.'
}: {
  date?: string;
  mood?: string;
  excerpt?: string;
}) {
  return (
    <OutlinedCard className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption font-semibold text-muted">{date}</p>
        <Badge tone="accent">Mood: {mood}</Badge>
      </div>
      <p className="text-body text-ink">{excerpt}</p>
      <Button variant="secondary" className="px-4 py-2 text-caption">Baca lengkap</Button>
    </OutlinedCard>
  );
}

export function MoodPicker({
  onChange
}: {
  onChange?: (mood: string) => void;
}) {
  const moods = ['Lega', 'Tenang', 'Biasa saja', 'Cemas', 'Sedih'];
  const [activeMood, setActiveMood] = useState<string>('Tenang');

  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <button
          key={mood}
          className={clsx(
            'rounded-pill border-base px-4 py-2 text-caption font-semibold',
            activeMood === mood ? 'border-border bg-ink text-paper' : 'border-border bg-paper text-ink hover:bg-accent'
          )}
          onClick={() => {
            setActiveMood(mood);
            onChange?.(mood);
          }}
          aria-pressed={activeMood === mood}
        >
          {mood}
        </button>
      ))}
    </div>
  );
}

export function InsightsChartCard() {
  const data = [
    { label: 'Sen', value: 48 },
    { label: 'Sel', value: 56 },
    { label: 'Rab', value: 52 },
    { label: 'Kam', value: 68 },
    { label: 'Jum', value: 72 },
    { label: 'Sab', value: 61 },
    { label: 'Min', value: 64 }
  ];

  return (
    <OutlinedCard className="space-y-4">
      <div>
        <h3 className="text-h6 font-bold">Pola energi mingguan</h3>
        <p className="text-caption text-muted">Visual ringan untuk melihat ritme harianmu.</p>
      </div>
      <div className="grid grid-cols-7 gap-2" aria-label="Weekly insights chart">
        {data.map((bar) => (
          <div key={bar.label} className="flex flex-col items-center gap-2">
            <div className="flex h-32 w-full items-end rounded-sm border-base border-border bg-bg px-1">
              <div
                className="w-full rounded-sm border border-border bg-accent"
                style={{ height: `${bar.value}%` }}
                aria-label={`${bar.label} ${bar.value}`}
              />
            </div>
            <span className="text-caption font-semibold text-muted">{bar.label}</span>
          </div>
        ))}
      </div>
    </OutlinedCard>
  );
}
