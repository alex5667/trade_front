import type { Config } from "tailwindcss"
import { COLORS } from './src/constants/color.constants'

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
      letterSpacing: {
        tight: '-0.02em',
        normal: '0em',
        wide: '0.1em',
        'extra-wide': '0.25em',
      },
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
      animation: {
        'shadow-inset-center': 'shadow-inset-center 0.3s ease-in-out both',
      },
      spacing: {
        0.5: '0.5rem',
        base: '1rem',
        layout: '1.4rem',
        'big-layout': '2.3rem'
      },

      transitionDuration: {
        DEFAULT: '266ms'
      },
      screens: {
        sm: '576px',
        'sm-max': { max: '576px' },
        md: '767.98px',
        'md-max': { max: '767.98px' },
        lg: '991.98px',
        'lg-max': { max: '991.98px' },
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
    colors: {
      white: '#ffffff',
      lightPrimary: '#F4F7FE',
      blueSecondary: '#4318FF',
      brandLinear: '#868CFF',
      transparent: 'transparent',
      gray: {
        50: '#F5F6FA',
        100: '#EEF0F6',
        200: '#DADEEC',
        300: '#C9D0E3',
        400: '#B0BBD5',
        500: '#B5BED9',
        600: '#A3AED0',
        700: '#707eae',
        800: '#2D396B',
        900: '#1B2559'
      },
      navy: {
        50: '#d0dcfb',
        100: '#aac0fe',
        200: '#a3b9f8',
        300: '#728fea',
        400: '#3652ba',
        500: '#1b3bbb',
        600: '#24388a',
        700: '#1B254B',
        800: '#111c44',
        900: '#0b1437'
      },
      red: {
        50: '#ee5d501a',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#f53939',
        600: '#ea0606',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d'
      },
      orange: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12'
      },
      amber: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f'
      },
      yellow: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#fbcf33',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12'
      },
      lime: {
        50: '#f7fee7',
        100: '#ecfccb',
        200: '#d9f99d',
        300: '#bef264',
        400: '#98ec2d',
        500: '#82d616',
        600: '#65a30d',
        700: '#4d7c0f',
        800: '#3f6212',
        900: '#365314'
      },
      green: {
        50: '#05cd991a',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#17ad37',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
      },
      teal: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a'
      },
      cyan: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#21d4fd',
        500: '#17c1e8',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63'
      },
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2152ff',
        700: '#1d4ed8',
        800: '#344e86',
        900: '#00007d'
      },
      indigo: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81'
      },
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7928ca',
        800: '#6b21a8',
        900: '#581c87'
      },
      pink: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ff0080',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843'
      },
      background: {
        100: 'rgb(244 247 254)',
        900: '#070f2e'
      },
      brand: {
        50: '#E9E3FF',
        100: '#C0B8FE',
        200: '#A195FD',
        300: '#8171FC',
        400: '#7551FF',
        500: '#422AFB',
        600: '#3311DB',
        700: '#2111A5',
        800: '#190793',
        900: '#11047A'
      },
      horizonGreen: {
        50: '#E1FFF4',
        100: '#BDFFE7',
        200: '#7BFECE',
        300: '#39FEB6',
        400: '#01F99E',
        500: '#01B574',
        600: '#01935D',
        700: '#016B44',
        800: '#00472D',
        900: '#002417'
      },
      horizonOrange: {
        50: '#FFF7EB',
        100: '#FFF1DB',
        200: '#FFE2B8',
        300: '#FFD28F',
        400: '#FFC46B',
        500: '#FFB547',
        600: '#FF9B05',
        700: '#C27400',
        800: '#855000',
        900: '#422800',
        950: '#1F1200'
      },
      horizonRed: {
        50: '#FCE8E8',
        100: '#FAD1D1',
        200: '#F4A4A4',
        300: '#EF7676',
        400: '#EA4848',
        500: '#E31A1A',
        600: '#B71515',
        700: '#891010',
        800: '#5B0B0B',
        900: '#2E0505',
        950: '#170303'
      },
      horizonBlue: {
        50: '#EBEFFF',
        100: '#D6DFFF',
        200: '#ADBFFF',
        300: '#8AA3FF',
        400: '#6183FF',
        500: '#3965FF',
        600: '#0036FA',
        700: '#0029BD',
        800: '#001B7A',
        900: '#000D3D',
        950: '#00071F'
      },
      horizonTeal: {
        50: '#EBFAF8',
        100: '#D7F4F2',
        200: '#AAE9E4',
        300: '#82DED6',
        400: '#59D4C9',
        500: '#33C3B7',
        600: '#299E94',
        700: '#1F756E',
        800: '#144D48',
        900: '#0B2826',
        950: '#051413'
      },
      horizonPurple: {
        50: '#EFEBFF',
        100: '#E9E3FF',
        200: '#422AFB',
        300: '#422AFB',
        400: '#7551FF',
        500: '#422AFB',
        600: '#3311DB',
        700: '#02044A',
        800: '#190793',
        900: '#11047A'
      },
      shadow: {
        100: 'var(--shadow-100)',
        500: 'rgba(112, 144, 176, 0.08)'
      },

    }
  },
  plugins: [],
}
export default config
