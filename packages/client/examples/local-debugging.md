# Example: Local Debugging

## Local Connections : EthereumJS <- EthereumJS

For debugging on networking issues there are two custom npm start scripts with appropriate settings.

Start a first client listening on the default port and using the default data directory with:

```shell
DEBUG=devp2p:* npm run client:start:dev1
DEBUG=devp2p:* npm run client:start:dev1 -- --datadir=datadir-dev1
```

Then take the enode address from the started client instance (use `127.0.0.1` for the IP address) and start a second client with:

```shell
DEBUG=devp2p:* npm run client:start:dev2 -- --bootnodes=enode://[DEV1_NODE_ID]@127.0.0.1:30303
```

This second client is using './datadir-dev2' for its data directory.

## Local Connection: EthereumJS <- Geth

To connect Geth to a running EthereumJS instance start a client with:

```shell
DEBUG=devp2p:* npm run client:start:dev1
```

Then connect with your Geth instance via:

```shell
geth --maxpeers=1 --bootnodes=enode://[DEV1_NODE_ID]@127.0.0.1:30303
```

## Local Connection: Geth <- EthereumJS

Start your Geth instance:

```shell
geth [--syncmode=full] [--verbosity=5]
```

Then connect with your EthereumJS instance via:

```shell
DEBUG=devp2p:* npm run client:start:dev2 -- --bootnodes=enode://[GETH_NODE_ID]@127.0.0.1:30303
```
