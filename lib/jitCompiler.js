var code = new Buffer('600040600055600540600155600440600255', 'hex');
const opcodes = require('./opcodes.js');

var compile = exports.compile = function(byteCode) {
  var code = '';
  var closures = 0;

  //find dynamic code
  for (var i = 0; i < opts.code.length; i++) {
    var curOpCode = opcodes(opts.code[i]).opcode;

    //no destinations into the middle of PUSH
    if (curOpCode === 'PUSH') {
      i += opts.code[i] - 0x5f;
    }

    if (curOpCode === 'JUMPDEST') {
      validJumps.push(i);
    }
  }
}
