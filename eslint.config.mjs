import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  formatters: true,
  rules: {
    'no-console': 'warn',
    'curly': ['error', 'multi-line', 'consistent'],
  },
})
