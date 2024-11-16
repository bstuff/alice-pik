import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import daisyui, { Config as DaisyUIConfig } from 'daisyui';
import daisyuiThemes from 'daisyui/src/theming/themes';

import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiThemes['light'],
          info: '#0167FF',
          'info-content': '#FFFFFF',
          success: '#24B500',
          'success-content': '#FFFFFF',
          error: '#EA3323',
          'error-content': '#FFFFFF',
        },
      },
      'dark',
    ],
    // disable fallback colors, they are defined in app/index.css
    base: false,
  } satisfies DaisyUIConfig,
  theme: {
    extend: {
      boxShadow: {
        right: '10px 0px 14px 0px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        sans: ['"Inter Tight"', '"Inter"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        black: '#18212B',
        gray: '#546880',
        'gray-light': '#ECF0FA',
        'gray-lighter': '#F4F6FB',
        blue: '#0063F6',
        purple: '#4F4CD4',

        '93a3b4': '#93A3B4',
        dcdde8: '#DCDDE8',
        e2f9eb: '#E2F9EB',
      },
    },
  },
  plugins: [
    daisyui,
    plugin(function ({ addComponents }) {
      addComponents({
        '@supports not (color: oklch(0 0 0))': [
          { '.btn-inverse': { '-BtnColor': 'var(--fallback-bc)' } } as unknown as string,
        ],
        '.btn-inverse': {
          '-TwTextOpacity': '1',
          color: 'var(--fallback-b1,oklch(var(--b1)/var(--tw-text-opacity)))',
          outlineColor: 'var(--fallback-bc,oklch(var(--bc)/1))',
        },
        '@supports (color: oklch(0 0 0))': [
          { '.btn-inverse': { '-BtnColor': 'var(--bc)' } } as unknown as string,
        ],

        '.vs-content-container': {
          '@apply w-full px-4 sm:px-5 xl:max-w-screen-xl 2xl:max-w-screen-2xl': '',
        },
        '.scroll-shadow-box': {
          '@apply relative': '',
          '--shadow-left-opacity': '0',
          '--shadow-right-opacity': '0',
        },
        '.scroll-shadow-box:before, .scroll-shadow-box:after': {
          content: '""',
          '@apply absolute h-full w-[10px] z-[1] top-0 transition duration-300': '',
        },
        '.scroll-shadow-box:before': {
          opacity: 'var(--shadow-left-opacity)',
          background: 'linear-gradient(90deg, rgba(0, 0, 0, .15), transparent)',
          '@apply left-0': '',
        },
        '.scroll-shadow-box:after': {
          opacity: 'var(--shadow-right-opacity)',
          background: 'linear-gradient(270deg, rgba(0, 0, 0, .15), transparent)',
          '@apply right-0': '',
        },
      });
    }),
  ],
} satisfies Config;
