var levelup = require('levelup');
var rlp = require('rlp');
var db = levelup('./ethereum/state');

var g = new Buffer('31084baadee0d3c5c81464ed15df96bbe08f8c91239fd4703653f5904c63c38f', 'hex');

/*
db.createReadStream({
    keyEncoding: 'binary',
    valueEncoding: 'binary'
  })
    .on('data', function (data) {
       //   console.log(data.key.toString('hex'))
        })
  .on('error', function (err) {
        console.log('Oh my!', err)
      })
  .on('close', function () {
        console.log('Stream closed')
      })
  .on('end', function () {
        console.log('Stream closed')
      })
*/

var root = '2f4399b08efe68945c1cf90ffe85bbe3ce978959da753f9e649f034015b8817d';
db.get(new Buffer(root, 'hex'), {
  encoding: 'binary'
}, function (err, value) {
  var decoded = rlp.decode(value);
  console.log(decoded);
  console.log('done');
  for (var i = 0; i < decoded.length; i++) {
    if (decoded[i].length > 9000) {
      db.get(decoded[i], {
        encoding: 'binary'
      },
      function (err, value) {
        console.log('xxxxxxxxxxxxxx');
        var decoded2 = rlp.decode(value);
        console.log(decoded2);
        if(decoded2.length ==2){
          console.log('yyyyyyyyyyyyy');
          console.log(decoded2[1].toString('hex'));
          console.log(rlp.decode(decoded2[1]));
        }
      });
    }
  }
});
