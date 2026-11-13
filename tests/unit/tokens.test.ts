import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { outputPath, renderTokens, sourcePath } from '../../scripts/build-tokens'

const tokensCss = readFileSync(outputPath, 'utf8')
const citationCss = readFileSync(new URL('../../app/assets/css/citation.css', import.meta.url), 'utf8')
const siteCss = readFileSync(new URL('../../app/assets/css/site.css', import.meta.url), 'utf8')

const defined = new Set([...tokensCss.matchAll(/^\s+(--[a-z0-9-]+):/gm)].map(m => m[1]))
// Custom properties the ported stylesheet sets for itself (the tone variables).
const local = new Set([...citationCss.matchAll(/(--[a-z0-9-]+):/g)].map(m => m[1]))
const used = (css: string) => [...new Set([...css.matchAll(/var\((--[a-z0-9-]+)/g)].map(m => m[1]))]

describe('design tokens', () => {
  it('tokens.css is up to date with tokens.json (run `bun run tokens`)', () => {
    expect(tokensCss).toBe(renderTokens(readFileSync(sourcePath, 'utf8')))
  })

  it('every token the stylesheets use is defined', () => {
    const missing = [...used(tokensCss), ...used(citationCss), ...used(siteCss)]
      .filter(name => !defined.has(name) && !local.has(name))
    expect(missing).toEqual([])
  })

  it('no stylesheet loads anything from outside the site', () => {
    for (const css of [tokensCss, citationCss, siteCss]) {
      expect(css).not.toMatch(/@import|https?:\/\//)
    }
  })
})
