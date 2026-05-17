import type { Config } from 'tailwindcss';
import preset from '@curhatin/design-system/preset';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  presets: [preset],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)']
      }
    }
  }
};

export default config;
