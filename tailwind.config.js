/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontSize: {
      xl: ["1.25rem", "1.5rem"], // 20/24
      lg: ["1.125rem", "1.5rem"], // 18/24
      md: ["1rem", "1.25rem"], // 16/20
      sm: ["0.875rem", "1.125rem"], // 14/18
      xs: ["0.75rem", "1rem"], // 12/16
    },
    extend: {},
  },
  plugins: [],
}

