/** @type {import('tailwindcss').Config} */
const preset = {
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink-rgb) / <alpha-value>)',
        'ink-soft': 'rgb(var(--color-ink-soft-rgb) / <alpha-value>)',
        muted: 'rgb(var(--color-muted-rgb) / <alpha-value>)',
        paper: 'rgb(var(--color-paper-rgb) / <alpha-value>)',
        bg: 'rgb(var(--color-bg-rgb) / <alpha-value>)',
        border: 'rgb(var(--color-border-rgb) / <alpha-value>)',
        accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
        'brand-green': 'rgb(var(--color-brand-green-rgb) / <alpha-value>)',
        'brand-green-soft': 'rgb(var(--color-brand-green-soft-rgb) / <alpha-value>)',
        'brand-blue': 'rgb(var(--color-brand-blue-rgb) / <alpha-value>)',
        'brand-blue-soft': 'rgb(var(--color-brand-blue-soft-rgb) / <alpha-value>)',
        success: 'rgb(var(--color-success-rgb) / <alpha-value>)',
        warn: 'rgb(var(--color-warn-rgb) / <alpha-value>)',
        error: 'rgb(var(--color-error-rgb) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)']
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
