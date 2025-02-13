import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'cbTablet': '768px',
      'cbDesktop': '1024px',
      'cbDesktopM': '1440px',
      'cbDesktopL': '1600px',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
      },
      borderRadius: {
        'cb-sm': '0.625rem',    // 10px
        'cb-base': '0.9375rem', // 15px
        'cb': '1.875rem',       // 30px
        'cb-lg': '2.5rem',      // 40px
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          'cbTablet': '740px',
          'cbDesktop': '980px',
          'cbDesktopM': '1380px',
          'cbDesktopL': '1536px',
        },
      },
    },
  },
  plugins: [],
};

export default config;
