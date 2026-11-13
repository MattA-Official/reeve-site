// Serves the prerendered site in .output/public, as a static host would.
// Used by the Playwright tests so they check the files that actually ship.
import { normalize, resolve, sep } from 'node:path'

const root = resolve(import.meta.dir, '..', '.output', 'public')
const port = Number(process.env.PORT ?? 4173)

async function fileFor(pathname: string): Promise<Bun.BunFile | null> {
  const decoded = decodeURIComponent(pathname)
  const target = resolve(root, '.' + normalize(decoded))
  if (target !== root && !target.startsWith(root + sep)) return null

  for (const candidate of [target, `${target}/index.html`, `${target}.html`]) {
    const file = Bun.file(candidate)
    if (await file.exists() && file.size > 0) return file
  }
  return null
}

if (!(await Bun.file(resolve(root, 'index.html')).exists())) {
  console.error(`Nothing to serve: ${root} has no index.html. Run 'bun run generate' first.`)
  process.exit(1)
}

Bun.serve({
  port,
  hostname: '127.0.0.1',
  async fetch(request) {
    const { pathname } = new URL(request.url)
    const file = await fileFor(pathname)
    if (file) return new Response(file)
    return new Response(Bun.file(resolve(root, '404.html')), { status: 404 })
  },
})

console.log(`Serving ${root} on http://127.0.0.1:${port}`)
