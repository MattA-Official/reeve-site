// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    // Vendored skills are upstream files; see .claude/skills/VENDORED.md.
    ignores: ['.claude/skills/**'],
  },
)
