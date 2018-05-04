const hardforkChanges = [
  [ 'chainstart', require('./chainstart.json') ],
  [ 'homestead', require('./homestead.json') ],
  [ 'dao', require('./dao.json') ],
  [ 'tangerineWhistle', require('./tangerineWhistle.json') ],
  [ 'spuriousDragon', require('./spuriousDragon.json') ],
  [ 'byzantium', require('./byzantium.json') ],
  [ 'constantinople', require('./constantinople.json') ],
  [ 'hybridCasper', require('./hybridCasper.json') ]
]

module.exports = hardforkChanges
