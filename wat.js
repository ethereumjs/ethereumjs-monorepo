StateTrie = require('./index')
through2 = require('through2')
rlp = require('rlp')
TrieNode = require('./trieNode')
trie = new StateTrie()

var init = [
  { type: 'put', key: 'name', value: 'Yuri Irsenovich Kim' },
  { type: 'put', key: 'dob', value: '16 February 1941' },
  { type: 'put', key: 'spouse', value: 'Kim Young-sook' },
  { type: 'put', key: 'occupation', value: 'Clown' },
  { type: 'put', key: 'nameads', value: 'Yuri Irsenovich Kim' },
  { type: 'put', key: 'namfde', value: 'Yuri Irsenovich Kim' },
  { type: 'put', key: 'namsse', value: 'Yuri Irsenovich Kim' },
  { type: 'put', key: 'dofab', value: '16 February 1941' },
  { type: 'put', key: 'spoudse', value: 'Kim Young-sook' },
  { type: 'put', key: 'occupdsation', value: 'Clown' },
  { type: 'put', key: 'dozzzb', value: '16 February 1941' },
  { type: 'put', key: 'spouszze', value: 'Kim Young-sook' },
  { type: 'put', key: 'occupatdfion', value: 'Clown' },
  { type: 'put', key: 'dssob', value: '16 February 1941' },
  { type: 'put', key: 'spossuse', value: 'Kim Young-sook' },
  { type: 'put', key: 'occupssation', value: 'Clown' },
];

trie.batch(init, function(){
  walkToKVs(trie)
  // walkTrie(trie)
})

// trie.put('dag', 'snakes', function(){
// trie.put('dog', 'jokes', function(){
// trie.put('dogs', 'cars', function(){
// trie.put('dogies', 'dinos', function(){
// trie.get('dogies', function(err, val){
//   console.log(val.toString())
//   console.log('====================')
//   // dumpTrie(trie)
//   walkTrie(trie)
//   // searchTrie(trie)
//   // walkToKVs(trie)
//   // getPath(trie, 'dogies')
// })
// })
// })
// })
// })

function getPath(trie, key) {
  trie._findPath(key, function(){
    console.log(arguments)
  })
}

function walkTrie(trie) {
  trie._walkTrie(trie.root, function (root, node, key, walkController) {
    // if (Buffer.isBuffer(root)) {
    //   console.log('node:', node.type, root.toString('hex'))
    // } else {
    //   console.log('embedded:', node.type)
    // }
    var val = node.value && node.value.toString()
    console.log((Buffer.isBuffer(root) ? 'node ':'embed '),node.type,TrieNode.nibblesToBuffer(key).toString(), val)
    walkController.next()
  }, function () {
    console.log('end--')
  })
}

function walkToKVs(trie) {
  trie._walkTrie(trie.root, function (root, node, key, walkController) {
    if (node.type === 'leaf') {
      console.log('"'+TrieNode.nibblesToBuffer(key).toString()+'": "'+node.value.toString()+'"')
    } else if (node.type === 'branch') {
      var value = node.value;
      if (node.value) console.log('"'+TrieNode.nibblesToBuffer(key).toString()+'": "'+node.value.toString()+'"')
    }
    walkController.next()
  }, function () {
    console.log('end--')
  })
}

function searchTrie(trie) {
  trie._findAll(trie.root, function (root, val, key, onDone) {
    console.log('node!',key)
    onDone()
  }, function () {
    console.log('end--')
  })
}

function dumpTrie(trie) {
  console.log('root: '+trie.root.toString('hex')+'\n')

  trie._db.createReadStream()
  .pipe(through2.obj(function(data, enc, cb){
    var rlpObj = rlp.decode(data.value)
    var node = new TrieNode(rlpObj)
    var output = 'node\n'
    output += ' root: '+data.key.toString('hex')+'\n'
    // output += ' key: ...'+'\n'
    output += ' value: '+data.value.toString('hex')+'\n'
    // output += ' rlp: '+rlpObj.toString('hex')+'\n'
    output += ' node: '+node.type+'\n'

    // if (node.type === 'branch') {
    //   child = node.getValue(0)
    //   output += ' branch[00]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(1)
    //   output += ' branch[01]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(2)
    //   output += ' branch[02]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(3)
    //   output += ' branch[03]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(4)
    //   output += ' branch[04]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(5)
    //   output += ' branch[05]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(6)
    //   output += ' branch[06]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(7)
    //   output += ' branch[07]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(8)
    //   output += ' branch[08]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(9)
    //   output += ' branch[09]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(10)
    //   output += ' branch[10]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(11)
    //   output += ' branch[11]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(12)
    //   output += ' branch[12]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(13)
    //   output += ' branch[13]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(14)
    //   output += ' branch[14]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(15)
    //   output += ' branch[15]: '+(child && new TrieNode(child)) +'\n'
    //   child = node.getValue(16)
    //   output += ' branch[16]: '+(child && new TrieNode(child)) +'\n'
    // }

    this.push(output)
    cb()
  }))
  .pipe(process.stdout)
}