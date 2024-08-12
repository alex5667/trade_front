import { COLORS } from '@/constants/color.constants'
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: 'class',
  mode: 'jit',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'shadow-inset-center': {
          '0%': {
            boxShadow: 'inset 0 0 0 0 rgba(0, 0, 0, 0)',
          },
          '100%': {
            boxShadow: 'inset 0 0 25px 0px rgba(0, 0, 0)',
          },
        },
      },
      spacing: {
        0.5: '0.5rem',
        base: '1rem',
        layout: '1.4rem',
        'big-layout': '2.3rem'
      },
      animation: {
        'shadow-inset-center': 'shadow-inset-center 0.3s ease-in-out both',
      }, transitionDuration: {
        DEFAULT: '266ms'
      },
      screens: {
        sm: '576px',
        'sm-max': { max: '576px' },
        md: '768px',
        'md-max': { max: '768px' },
        lg: '992px',
        'lg-max': { max: '992px' },
        xl: '1200px',
        'xl-max': { max: '1200px' },
        '2xl': '1320px',
        '2xl-max': { max: '1320px' },
        '3xl': '1600px',
        '3xl-max': { max: '1600px' },
        '4xl': '1850px',
        '4xl-max': { max: '1850px' }
      },
      borderRadius: {
        sm: '4px',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.18rem',
        xl: '1.25rem',
        '1.5xl': '1.5rem',
        '2xl': '1.82rem',
        '3xl': '2rem',
        '4xl': '2.66rem',
        '5xl': '3.56rem',
        '6xl': '4.44rem',
        '7xl': '5.33rem',
        '8xl': '7.1rem',
        '9xl': '9.5rem'
      },
      colors: COLORS,
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
