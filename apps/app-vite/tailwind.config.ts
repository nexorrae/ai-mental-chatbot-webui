import type { Config } from 'tailwindcss';
import preset from '@curhatin/design-system/preset';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  presets: [preset],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  }
};

export default config;
