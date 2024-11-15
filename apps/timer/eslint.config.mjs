// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    files: ['**/*.vue'],
    rules: {
      'vue/first-attribute-linebreak': 'off',
    },
  }
)
