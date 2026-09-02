/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Palette premium editoriale: avorio, bordeaux, oro
                ivory: {
                    50: '#FDFCF9',
                    100: '#FAF7F0',
                    200: '#F3EEE2',
                    300: '#E9E1D0',
                },
                wine: {
                    950: '#1E0A10',
                    900: '#2C1018',
                    800: '#3E1823',
                    700: '#571F2E',
                    600: '#71273A',
                },
                brass: {
                    300: '#E5C88F',
                    400: '#D4AF6A',
                    500: '#C9A050',
                    600: '#B08840',
                },
                ink: {
                    900: '#191511',
                    700: '#3A342C',
                    500: '#6B6255',
                    400: '#857B6C',
                },
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            letterSpacing: {
                widest2: '0.2em',
            },
            boxShadow: {
                'soft': '0 2px 24px rgba(30, 10, 16, 0.06)',
                'card': '0 4px 32px rgba(30, 10, 16, 0.08)',
                'lift': '0 12px 40px rgba(30, 10, 16, 0.12)',
            },
            keyframes: {
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'fade-up': 'fade-up 0.5s ease-out both',
            },
        },
    },
    plugins: [],
}