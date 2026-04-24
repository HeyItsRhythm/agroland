/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'slide-out-right': 'slide-out-right 0.3s ease-in forwards',
        'pulse': 'pulse 1.5s infinite',
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
      colors: {
        border: 'var(--color-border)', // light gray
        input: 'var(--color-input)', // pure white
        ring: 'var(--color-ring)', // deep professional blue
        background: 'var(--color-background)', // warm off-white
        foreground: 'var(--color-foreground)', // rich charcoal
        primary: {
          DEFAULT: 'var(--color-primary)', // deep professional blue
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // agricultural green
          foreground: 'var(--color-secondary-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // confident red
          foreground: 'var(--color-destructive-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // very light gray
          foreground: 'var(--color-muted-foreground)', // balanced gray
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // very light gray
          foreground: 'var(--color-accent-foreground)', // rich charcoal
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // pure white
          foreground: 'var(--color-popover-foreground)', // rich charcoal
        },
        card: {
          DEFAULT: 'var(--color-card)', // pure white
          foreground: 'var(--color-card-foreground)', // rich charcoal
        },
        success: {
          DEFAULT: 'var(--color-success)', // vibrant green
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // warm amber
          foreground: 'var(--color-warning-foreground)', // rich charcoal
        },
        error: {
          DEFAULT: 'var(--color-error)', // clear red
          foreground: 'var(--color-error-foreground)', // white
        },
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Source Sans Pro', 'sans-serif'],
        'caption': ['Roboto', 'sans-serif'],
        'data': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'elevation-2': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 300ms ease-in-out',
        'slide-down': 'slideDown 300ms ease-in-out',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}