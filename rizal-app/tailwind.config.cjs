/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            },
            colors: {
                glass: {
                    light: 'rgba(255, 255, 255, 0.65)',
                    dark: 'rgba(15, 23, 42, 0.75)',
                    border: 'rgba(255, 255, 255, 0.18)',
                    'border-dark': 'rgba(255, 255, 255, 0.08)',
                },
                brand: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                },
                surface: {
                    light: '#f8fafc',
                    dark: '#0f172a',
                    'card-light': 'rgba(255, 255, 255, 0.7)',
                    'card-dark': 'rgba(30, 41, 59, 0.7)',
                },
            },
            backdropBlur: {
                glass: '20px',
            },
            animation: {
                'gradient': 'gradientShift 15s ease infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    from: { opacity: '0', transform: 'translateX(-10px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [],
}
