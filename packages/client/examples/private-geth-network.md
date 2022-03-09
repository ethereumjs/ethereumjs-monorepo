# Example: Private Geth Network

## Running a private network with geth

In this example, we import the genesis parameters for a private Proof-of-Authority network using the geth genesis parameters format and then sync our client with a geth instance that is sealing blocks.

First, create a signer account and place in the `data` directory to use with geth to seal blocks following [these instructions](https://geth.ethereum.org/docs/interface/managing-your-accounts).

Next, open [these genesis parameters](../test/testdata/geth-genesis/poa.json) and replace "728bb68502bfcd91ce4c7a692a0c0773ced5cff0" with your signer address in both the `extraData` property and in the `alloc` section.

Second, get geth configured to use the genesis parameters file just updated.

`geth init --datadir data poa.json`

Now, let's run geth and ensure that its sealing blocks. Note, geth will prompt you for a password to unlock your signer account.

`geth --datadir data --nat extip:[your local ip address here] --networkid 15470 --unlock [the signer account you created] --mine --nodiscover`

You should start seeing logs like below:

```bash
INFO [08-26|09:13:16.218] Commit new mining work                   number=1 sealhash=b6eb1d..65ac14 uncles=0 txs=0 gas=0 fees=0 elapsed="91.644µs"
INFO [08-26|09:13:16.218] Successfully sealed new block            number=1 sealhash=b6eb1d..65ac14 hash=0fa2b5..d62aec elapsed="382.998µs"
INFO [08-26|09:13:16.218] 🔨 mined potential block                  number=1 hash=0fa2b5..d62aec
INFO [08-26|09:13:16.218] Commit new mining work                   number=2 sealhash=6111ce..1521f3 uncles=0 txs=0 gas=0 fees=0 elapsed="285.226µs"
```

Next, let's get the geth `enode` address as follows:

`geth attach data/geth.ipc`

Then, execute this command in the geth javascript console: `admin.nodeInfo` and copy the enode address.

Start the ethereumjs client with the custom genesis parameters:

`npm run client:start -- --gethGenesis=path/to/poa.json --bootnodes=[enode address of your geth node] --port=30305`

Shortly, you should start seeing the client produce logs showing it importing and executing blocks produced by the geth client!

```bash
INFO [08-26|09:22:46] Imported blocks count=2 number=26 hash=da44b792... hardfork=tangerineWhistle peers=1
```
