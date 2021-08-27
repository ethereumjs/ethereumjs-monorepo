
## Examples of running the client

### Example 1: Light sync

In this example, we will run two ethereumjs-clients. The first will be a full sync client that
will connect to the rinkeby network and start downloading the blockchain. The second will be a
light client that connects to the first client and syncs headers as they are downloaded.

The first client will use RLPx to connect to the rinkeby network, but will also provide a libp2p
listener. The second client will use libp2p to connect to the first client.

Run the first client and start downloading blocks:

```
ethereumjs --syncmode full --lightserv true  --datadir first --network rinkeby --transports rlpx libp2p --multiaddrs /ip4/127.0.0.1/tcp/50505/ws
```

Output:

<pre>
...
INFO [10-24|11:42:26] Listener up transport=rlpx url=enode://1c3a3d70e9fb7c274355b7ffbbb34465576ecec7ab275947fd4bdc7ddcd19320dfb61b210cbacc0702011aea6971204d4309cf9cc1856fce4887145962281907@[::]:30303
INFO [10-24|11:37:48] Listener up transport=libp2p url=<b>/ip4/127.0.0.1/tcp/50505/ws/p2p/QmYAuYxw6QX1x5aafs6g3bUrPbMDifP5pDun3N9zbVLpEa</b>
...
</pre>

Copy the libp2p URL from the output. In this example, the url is `/ip4/127.0.0.1/tcp/50505/ws/p2p/QmYAuYxw6QX1x5aafs6g3bUrPbMDifP5pDun3N9zbVLpEa` but it will be different in your case.

Wait until a few thousand blocks are downloaded and then run the second client in a new terminal, using the url above to connect to the first client:

<pre>
ethereumjs --syncmode light --network rinkeby --datadir second --transports libp2p --multiaddrs /ip4/0.0.0.0/tcp/50506 --bootnodes=<b>/ip4/127.0.0.1/tcp/50505/ws/p2p/QmYAuYxw6QX1x5aafs6g3bUrPbMDifP5pDun3N9zbVLpEa</b>
</pre>

Notice that we have to run the second client on port 50506 using the `--multiaddrs /ip4/0.0.0.0/tcp/50506` libp2p option to avoid port conflicts.

### Example 2: Light sync from within a browser

In this example, we will again perform a light sync by connecting to the first client from above. However, this time we will connect directly to the first client from within a browser window using libp2p websockets.

First, let's make the bundle:

```
git clone https://github.com/ethereumjs/ethereumjs-monorepo
cd ethereumjs-monorepo
npm i
cd packages/client
npm run build:browser
```

This will create the file `dist/bundle.js`. Now, we will create an`index.html` file that serves it up on `http://localhost:8080`.

```
echo '<script src="/dist/bundle.js"></script>' > index.html
npm i -g http-server
http-server
```

Now, open a new browser window and navigate to `http://localhost:8080`. Open the developer console in your browser and run the following command to start syncing to the first client. Again, remember to change the value of bootnodes to match the url of the first client from above:

```js
ethereumjs.run({
  network: 'rinkeby',
  syncmode: 'light',
  bootnodes: '/ip4/127.0.0.1/tcp/50505/ws/p2p/QmYAuYxw6QX1x5aafs6g3bUrPbMDifP5pDun3N9zbVLpEa',
  discDns: false
})
```

That's it! Now, you should start seeing headers being downloaded to the local storage of your browser. Since IndexDB is being used, even if you close and re-open the browser window, the headers you've downloaded will be saved.

![EthereumJS Client Libp2p Browser Syncing](./browser_sync.png?raw=true)

### Example 3: Running a private network with geth

In this example, we import the genesis parameters for a private Proof-of-Authority network using the geth genesis parameters format and then sync our client with a geth instance that is sealing blocks.

First, create a signer account and place in the `data` directory to use with geth to seal blocks following [these instructions](https://geth.ethereum.org/docs/interface/managing-your-accounts).

Next, open [these genesis parameters](./test/testdata/poa.json) and replace "728bb68502bfcd91ce4c7a692a0c0773ced5cff" with your signer address in both the `extradata` property and in the `alloc` section.

Second, get geth configured to use the genesis parameters file just updated.

`geth init --datadir data poa.json`

Now, let's run geth and ensure that its sealing blocks.  Note, geth will prompt you for a password to unlock your signer account.

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
