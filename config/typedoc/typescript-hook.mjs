import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const ts6Root = path.dirname(require.resolve('typescript-6/package.json'))

/**
 * Redirect `import 'typescript'` to the TypeScript 6 classic compiler API for TypeDoc.
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'typescript') {
    return {
      format: 'commonjs',
      shortCircuit: true,
      url: pathToFileURL(path.join(ts6Root, 'lib', 'typescript.js')).href,
    }
  }
  if (specifier.startsWith('typescript/')) {
    const subpath = specifier.slice('typescript/'.length)
    return {
      format: 'commonjs',
      shortCircuit: true,
      url: pathToFileURL(path.join(ts6Root, subpath)).href,
    }
  }
  return nextResolve(specifier, context)
}
