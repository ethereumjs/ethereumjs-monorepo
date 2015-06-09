
var bin = Buffer('e01022dceb8c3202', 'hex') // bin.length => 8
var str = Buffer('haaywurl', 'utf8')        // str.length => 8

bin.toString() //=> '�\u0010"���2\u0002'
str.toString() //=> 'haaywurl'

var iterations = 1000000
console.log( test(bin, iterations)[1]/iterations )
console.log( test(str, iterations)[1]/iterations )

function test(buf, iterations){

  var start = process.hrtime()
  for(var i=0; i<iterations; i++) {
    buf.toString()
  }
  return process.hrtime(start)
  
}
