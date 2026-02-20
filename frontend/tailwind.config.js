// FILE PATH: frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                medical: {
                    primary: '#0F4C75',
                    secondary: '#1B6CA8',
                    success: '#10B981',
                    warning: '#F59E0B',
                    danger: '#EF4444',
                    light: '#E8F4F8',
                },
                brand: {
                    purple: '#667eea',
                    indigo: '#764ba2',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'medical': '0 10px 30px rgba(15, 76, 117, 0.1)',
                'medical-lg': '0 20px 40px rgba(15, 76, 117, 0.15)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-in': 'slideIn 0.5s ease-in-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                }
            }
        },
    },
    plugins: [],
}
