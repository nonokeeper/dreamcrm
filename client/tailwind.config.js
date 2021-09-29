module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    container: {
      center: true,
      padding: '2rem'
    }
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active', 'checked'],
    fontSize: ['responsive', 'hover', 'focus', 'active', 'checked'],
    fontWeight: ['responsive', 'hover', 'focus'],
    opacity: ({ after }) => after(['disabled']),
    cursor: ({ after }) => after(['disabled'])
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
