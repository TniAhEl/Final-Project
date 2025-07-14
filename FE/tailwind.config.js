/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
      "./src/**/*.{js,jsx}", // Cho phép tailwind scan trong src/
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1e40af",
                danger: "#dc2626",
                "brand-yellow": "#facc15",
            },
            fontFamily: {
                hubot: ['Hubot Sans', 'ital'],
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            width: {
                'screen-1/2': '50vw',
            },
            screens: { // break point - reponsive
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
            },
            darkMode: 'class', // hoặc 'media'

        },
    },
    plugins: [
    ],
}
