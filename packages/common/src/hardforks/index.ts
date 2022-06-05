import { createRequire } from 'module'
import { Hardfork } from '../enums.js'

const require = createRequire(import.meta.url)

export const hardforks: Array<[Hardfork, any]> = [
  [Hardfork.Chainstart, require('./chainstart.json')],
  [Hardfork.Homestead, require('./homestead.json')],
  [Hardfork.Dao, require('./dao.json')],
  [Hardfork.TangerineWhistle, require('./tangerineWhistle.json')],
  [Hardfork.SpuriousDragon, require('./spuriousDragon.json')],
  [Hardfork.Byzantium, require('./byzantium.json')],
  [Hardfork.Constantinople, require('./constantinople.json')],
  [Hardfork.Petersburg, require('./petersburg.json')],
  [Hardfork.Istanbul, require('./istanbul.json')],
  [Hardfork.MuirGlacier, require('./muirGlacier.json')],
  [Hardfork.Berlin, require('./berlin.json')],
  [Hardfork.London, require('./london.json')],
  [Hardfork.Shanghai, require('./shanghai.json')],
  [Hardfork.ArrowGlacier, require('./arrowGlacier.json')],
  [Hardfork.MergeForkIdTransition, require('./mergeForkIdTransition.json')],
  [Hardfork.Merge, require('./merge.json')],
]
