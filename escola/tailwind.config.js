/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: ['./index.html', './src/**/*.{js,ts}'],
  corePlugins: {
    preflight: false,
  },
}
