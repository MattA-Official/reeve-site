// Generates app/assets/css/tokens.css from design/citation/tokens.json.
// Run with `bun run tokens`; tests/unit/tokens.test.ts fails when the output is stale.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

interface Token { name: string, value: string }
interface TypeStyle { name: string, fontSize: string, lineHeight: number, fontWeight: number, letterSpacing?: string }
interface Tokens {
  version: number
  color: { tokens: Token[] }
  type: { families: Record<string, string>, groups: { name: string, styles: TypeStyle[] }[] }
  spacing: { tokens: Token[] }
  radius: { tokens: Token[] }
  shadow: { tokens: Token[] }
  size: { tokens: Token[] }
  timing: { tokens: Token[] }
}

// The brand book keeps two control edges below the 3:1 WCAG asks for (see their usage notes in
// tokens.json). The site uses the replacement values those notes give.
export const contrastFixes: Record<string, string> = {
  'border-control': '#636975',
  'back-input-border': '#85827A',
}

export const sourcePath = fileURLToPath(new URL('../design/citation/tokens.json', import.meta.url))
export const outputPath = fileURLToPath(new URL('../app/assets/css/tokens.css', import.meta.url))

export function renderTokens(json: string): string {
  const t = JSON.parse(json) as Tokens
  const lines: string[] = []
  const block = (title: string, tokens: Token[]) => {
    lines.push(``, `  /* ${title} */`)
    // `{name}` in a value refers to another token.
    for (const { name, value } of tokens) lines.push(`  --${name}: ${value.replace(/\{([a-z0-9-]+)\}/g, 'var(--$1)')};`)
  }
  block('colour (dark theme only)', t.color.tokens.map(tok => ({ ...tok, value: contrastFixes[tok.name] ?? tok.value })))
  lines.push(``, `  /* font families */`)
  for (const [name, value] of Object.entries(t.type.families)) lines.push(`  --font-${name}: ${value};`)
  for (const group of t.type.groups) {
    lines.push(``, `  /* type: ${group.name.toLowerCase()} */`)
    for (const s of group.styles) {
      lines.push(`  --type-${s.name}-size: ${s.fontSize};`)
      lines.push(`  --type-${s.name}-leading: ${s.lineHeight};`)
      lines.push(`  --type-${s.name}-weight: ${s.fontWeight};`)
      if (s.letterSpacing) lines.push(`  --type-${s.name}-tracking: ${s.letterSpacing};`)
    }
  }
  block('spacing', t.spacing.tokens)
  block('radius', t.radius.tokens)
  block('shadow', t.shadow.tokens)
  block('size', t.size.tokens)
  block('timing', t.timing.tokens)
  return [
    `/* Generated from design/citation/tokens.json by scripts/build-tokens.ts. Do not edit by hand. */`,
    `:root {`,
    `  color-scheme: dark;`,
    ...lines,
    `}`,
    ``,
  ].join('\n')
}

if (import.meta.main) {
  writeFileSync(outputPath, renderTokens(readFileSync(sourcePath, 'utf8')))
  console.log(`Wrote ${outputPath}`)
}
