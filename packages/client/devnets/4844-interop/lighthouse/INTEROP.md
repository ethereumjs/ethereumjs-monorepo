# Build Lighthouse

1.  Install/Upgrade Rust.

- Install -- https://www.rust-lang.org/tools/install -- `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- Upgrade -- `rustup upgrade`

2. Clone Lighthouse repo and switch to this branch - https://github.com/sigp/lighthouse/tree/eip4844
3. From Lighthouse repo root, run

- `make` -- wait a while
- `make install-lcli`

# Configure genesis

In the [devnets/4844-interop/lighthouse] subdirectory, open `vars.env` and update the DATADIR variable to refer to the absolute path to your data directory where all EthereumJS and Lighthouse configuration and data directories will be stored. Scripts below refer to [path/to/ethjs/packages/client/devnets/4844-interop/lighthouse]

Run `setup.sh` to generate genesis parameters. Must be done after each run to update the timestamps for the post merge hardforks.

# Run EthereumJS

```sh
  npm run client:start -- \
  --datadir=/path/to/ethjs/packages/client/devnets/4844-interop/lighthouse/el_data \
  --gethGenesis=/path/to/ethjs/packages/client/devnets/4844-interop/lighthouse/testnet/genesis.json \
  --rpc --rpcEngine --rpcDebug --loglevel=debug \
  --jwt-secret=devnets/4844-interop/config/jwtsecret.txt \
  --mine \
  --unlock=devnets/4844-interop/config/minerKey.txt
```

# Run Lighthouse Beacon Node

```sh
lighthouse \
        --debug-level debug \
        bn \
        --subscribe-all-subnets --datadir /path/to/ethjs/packages/client/devnets/4844-interop/lighthouse/node_1 \
        --testnet-dir /path/to/ethjs/packages/client/devnets/4844-interop/lighthouse/testnet \
        --enable-private-discovery \
        --staking \
        --enr-address 127.0.0.1 \
        --enr-udp-port 9001 \
        --enr-tcp-port 9001 \
        --port 9001 \
        --http-port 3501 \
        --disable-packet-filter \
        --target-peers 1 \
  --execution-endpoint http://127.0.0.1:8551 \
  --execution-jwt /path/to/ethjs/packages/client/devnets/4844-interop/config/jwtsecret.txt
```

# Run Lighthouse Validator

```sh
lighthouse \
        --debug-level debug \
        vc \
        --datadir /path/to/ethjs/packages/client/devnets/4844-interop/lighthouse/node_1 \
        --testnet-dir /path/to/ethjs/packages/client/devnets/4844-interop/lighthouse/testnet \
        --init-slashing-protection \
        --beacon-nodes http://127.0.0.1:3501 \
        --suggested-fee-recipient 0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990 \
```

# Clean-up

Delete `el_data`, `node_1`, and `testnet` directories after each run
