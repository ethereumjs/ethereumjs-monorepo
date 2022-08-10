# Example: Light Browser Sync

## Light sync

In this example, we will run two ethereumjs clients. The first will be a full sync client that
connects to the goerli network and starts downloading the blockchain. The second will be a
light client that connects to the first client and syncs headers as they are downloaded.

The first client will use RLPx to connect to the goerli network, but will also provide a libp2p
listener. The second client will use libp2p to connect to the first client.

Run the first client and start downloading blocks:

```
npm run client:start -- --syncmode full --lightserv true  --datadir first --network goerli --transports rlpx libp2p --multiaddrs /ip4/127.0.0.1/tcp/50505/ws
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
npm run client:start -- --syncmode light --network goerli --datadir second --transports libp2p --multiaddrs /ip4/0.0.0.0/tcp/50506 --bootnodes=/ip4/127.0.0.1/tcp/50505/ws/p2p/QmYAuYxw6QX1x5aafs6g3bUrPbMDifP5pDun3N9zbVLpEa
</pre>

Notice that we have to run the second client on port 50506 using the `--multiaddrs /ip4/0.0.0.0/tcp/50506` libp2p option to avoid port conflicts.

## Light sync from within a browser

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
  network: 'goerli',
  syncmode: 'light',
  bootnodes: '/ip4/127.0.0.1/tcp/50505/ws/p2p/QmYAuYxw6QX1x5aafs6g3bUrPbMDifP5pDun3N9zbVLpEa',
})
```

That's it! Now, you should start seeing headers being downloaded to the local storage of your browser. Since IndexDB is being used, even if you close and re-open the browser window, the headers you've downloaded will be saved.

Note: To enable extra debug logs in the browser, add a parameter `debugLogs: 'client:*'` to see all the synchronizer and fetcher logs as well.
![EthereumJS Client Libp2p Browser Syncing](./browser_sync.png?raw=true)
