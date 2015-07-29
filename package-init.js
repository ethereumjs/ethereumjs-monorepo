// Browser environment
if(typeof window !== 'undefined') {
    EthTx = (typeof window.EthTx !== 'undefined') ? window.EthTx : require('ethereumjs-tx');
}


// Node environment
if(typeof global !== 'undefined') {
    EthTx = (typeof global.EthTx !== 'undefined') ? global.EthTx : require('ethereumjs-tx');
}
