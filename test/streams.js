const Trie = require('../index.js');
const async = require('async');
const assert = require('assert');

var trie = new Trie();
var init = [
    { type: 'del', key: 'father' }
  , { type: 'put', key: 'name', value: 'Yuri Irsenovich Kim' }
  , { type: 'put', key: 'dob', value: '16 February 1941' }
  , { type: 'put', key: 'spouse', value: 'Kim Young-sook' }
  , { type: 'put', key: 'occupation', value: 'Clown' }
  , { type: 'put', key: 'nameads', value: 'Yuri Irsenovich Kim' }
  , { type: 'put', key: 'namfde', value: 'Yuri Irsenovich Kim' }
  , { type: 'put', key: 'namsse', value: 'Yuri Irsenovich Kim' }
  , { type: 'put', key: 'dofab', value: '16 February 1941' }
  , { type: 'put', key: 'spoudse', value: 'Kim Young-sook' }
  , { type: 'put', key: 'occupdsation', value: 'Clown' }
  , { type: 'put', key: 'dozzzb', value: '16 February 1941' }
  , { type: 'put', key: 'spouszze', value: 'Kim Young-sook' }
  , { type: 'put', key: 'occupatdfion', value: 'Clown' }
  , { type: 'put', key: 'dssob', value: '16 February 1941' }
  , { type: 'put', key: 'spossuse', value: 'Kim Young-sook' }
  , { type: 'put', key: 'occupssation', value: 'Clown' }
];


var valObj = {};
init.forEach(function(i) {
  if (i.type === 'put') valObj[i.key] = i.value
});

describe('stream test', function() {
  it('should populate trie', function(done) {
    trie.batch(init, function() {
      done();
    })
  });

  it('should fetch all of the nodes', function(done) {
    var stream = trie.createReadStream();
    stream.on('data', function(d) {
      assert(valObj[d.key.toString()] === d.value.toString())
      delete valObj[d.key.toString()];
    });
    stream.on('end', function() {
      var keys = Object.keys(valObj);
      assert(keys.length === 0);
      done();
    });
  });

});
