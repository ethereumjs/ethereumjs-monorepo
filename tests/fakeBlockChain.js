var utils = require('ethereumjs-util');

module.exports = {
  getBlockByNumber: function(n, cb){

    var hash = utils.sha3(utils.bufferToInt(n).toString());

    var block = {
      hash: function(){
        return hash;
      }
    };

    cb(null, block);
  }
};
