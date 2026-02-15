/** @type {import('tailwindcss').Config} */
const preset = {
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        muted: 'var(--color-muted)',
        paper: 'var(--color-paper)',
        bg: 'var(--color-bg)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        'brand-green': 'var(--color-brand-green)',
        'brand-green-soft': 'var(--color-brand-green-soft)',
        'brand-blue': 'var(--color-brand-blue)',
        'brand-blue-soft': 'var(--color-brand-blue-soft)',
        success: 'var(--color-success)',
        warn: 'var(--color-warn)',
        error: 'var(--color-error)'
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)'
      },
      borderWidth: {
        strong: 'var(--border-strong)',
        base: 'var(--border-default)'
      },
      boxShadow: {
        soft: 'var(--shadow-soft)'
      },
      fontSize: {
        h1: 'var(--text-h1)',
        h2: 'var(--text-h2)',
        h3: 'var(--text-h3)',
        h4: 'var(--text-h4)',
        h5: 'var(--text-h5)',
        h6: 'var(--text-h6)',
        body: 'var(--text-body)',
        caption: 'var(--text-caption)',
        button: 'var(--text-button)',
        label: 'var(--text-label)'
      },
      maxWidth: {
        content: 'var(--container-xl)'
      }
    }
  }
};

export default preset;
