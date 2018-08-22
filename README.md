# SYNOPSIS

[![Build Status](https://travis-ci.org/ethereumjs/ethereumjs-client.svg?branch=master)](https://travis-ci.org/ethereumjs/ethereumjs-client)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/ethereumjs-client.svg?style=flat-square)](https://coveralls.io/r/ethereumjs/ethereumjs-client)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Gitter](https://img.shields.io/gitter/room/ethereum/ethereumjs.svg?style=flat-square)](https://gitter.im/ethereum/ethereumjs)

This is the work repository for the EthereumJS main chain client implementation project.
This is a community project. See [Development Stages](https://github.com/ethereumjs/ethereumjs-client#development-stages) for idea
about the current project status, [issues](https://github.com/ethereumjs/ethereumjs-client/issues)
for open issues and a project layout and read through [Community Project](https://github.com/ethereumjs/ethereumjs-client#community-project)
if you want to join.

See [Technical Guidelines](https://github.com/ethereumjs/ethereumjs-client#technical-guidelines) if
you directly want to dive into development info.

Current development stage: ``CONCEPT ANALYSIS / EARLY DEVELOPMENT``

# PROJECT SUMMARY

For a summary of the project focus, some outline of a roadmap and information on the
team and how to contribute/join see [this document](./PROJECT.md).

# TECHNICAL GUIDELINES

## Client Setup

**Installing the Client**

```shell
npm install -g ethereumjs-client
```

**Running the Client**

Some building blocks for the client have already been implemented or outlined to further build upon.

You can run the current state of the client with:

```shell
ethereumjs --network=mainnet [--loglevel=debug]
```

Or show the help with
```shell
ethereumjs help
```

If you want to have verbose logging output for the p2p communication you can use...

```shell
DEBUG=*,-babel [CLIENT_START_COMMAND]
```

for all output or something more targeted by listing the loggers like

```shell
DEBUG=devp2p:rlpx,devp2p:eth,-babel [CLIENT_START_COMMAND]
```

## API

[API Reference](./docs/API.md)

## Environment / Ecosystem

**EthereumJS Ecosystem**

This project will be embedded in the EthereumJS ecosystem and many submodules already exist and
can be used within the project, have a look e.g. at [ethereumjs-block](https://github.com/ethereumjs/ethereumjs-block), [ethereumjs-vm](https://github.com/ethereumjs/ethereumjs-vm), the
[merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree) or the
[ethereumjs-devp2p](https://github.com/ethereumjs/ethereumjs-devp2p) implementation.

To play well together within a client context, many sub module libraries need enhancements,
e.g. to create a common logging context. There are also larger building blocks still
missing, e.g. the [Node Discovery V5](https://github.com/ethereumjs/ethereumjs-devp2p/issues/19)
p2p implementation being necessary for a proper working light client sync. Due to the distributed
nature of EthereumJS there will be internal (to be done in this repo) and external issues
(to be done in other EthereumJS repos) to be worked on.

All (hopefully :-)) issues referring to the client implementation will be provided with a
``ethereumjs-client`` label which should be discoverable with a label search on GitHub:

- [Show external issues](https://github.com/search?utf8=%E2%9C%93&q=org%3Aethereumjs+label%3Aethereumjs-client&type=Issues&ref=advsearch&l=&l=)

**Basic Environment**

For library development the following basic environment is targeted. Some base requirements
like the testing tool arise from the need of maintaining a somewhat unified EthereumJS environment
where developers can switch between with some ease without the need to learn (too much) new
tooling.

- ``Node.js``
- ``Javascript`` (ES6)
- [Tape](https://github.com/substack/tape) for testing
- [Istanbul/nyc](https://istanbul.js.org/) for test coverage
- [standard.js](https://standardjs.com/) for linting/code formatting

## Design

**Goals**

Contributors should aim to achieve the following goals when making design decisions:

- **Loosely coupled components**: Components should require as little knowledge of the definitions of
other components as possible. This reduces dependencies between PRs and encourages contributors
to work in parallel. It also improves extensibility of the code as new features like sharding
and libp2p support are added.
- **Easily tested**: The design should make testing of individual components as easy as possible.
This goes hand in hand with the previous goal of loose coupling.
- **Readable code**: More readable code should encourage more contributions from the community and help
with bug fixing.
- **Well documented**: Similar to above, this will help both contributors and users of the project.

The current design tries to achieves the goals of loose coupling and ease of testing by using an
event-driven architecture where possible. Readability is improved by using features of JavaScript
ES6 such as classes, async/await, promises, arrow functions, for...of, template literals and
destructuring assignment among others. Shorter names are used when possible and long functions are
broken up into smaller helpers, along with JSDoc annotations for most methods and parameters.
Documentation is auto-generated from JSDoc comments and many examples of usage are provided (TO DO).

We will now briefly describe the directory structure and main components of the Ethereumjs client
to help contributors better understand how the project is organized.

**Directory structure**

- ``/bin`` Contains the CLI script for the ``ethereumjs`` command
- ``/docs`` Contains auto-generated API docs as well as other supporting documentation
- ``/lib/blockchain`` Contains the ``Chain``, ``BlockPool`` and ``HeaderPool`` classes.
- ``/lib/net`` Contains all of the network layer classes including ``Peer``, ``Protocol`` and its subclasses,
  ``Server`` and its subclasses, and ``PeerPool``.
- ``/lib/service`` Contains the various services. Currently, only ``EthService`` is implemented.
- ``/lib/rpc`` Contains the RPC server (optionally) embedded in the client.
- ``/lib/sync`` Contains the various chain synchronizers. Currently, only ``FastSynchronizer`` is implemented.
- ``/tests`` Contains test cases, testing helper functions, mocks and test data

**Components**

- ``Chain`` [**In Progress**] This class represents the blockchain and is a wrapper around
``ethereumjs-blockchain``. It handles creation of the data directory, provides basic blockchain operations
and maintains an updated current state of the blockchain, including current height, total difficulty, and
latest block.
- ``BlockPool`` [**In Progress**] This class holds segments of the blockchain that have been downloaded
from other peers. Once valid, sequential segments are available, they are automatically added to the
blockchain
    - ``HeaderPool`` [**In Progress**] This is a subclass of ``BlockPool`` that holds header segments instead of
    block segments. It is useful for light syncs when downloading sequential headers in parallel.
- ``Server`` This class represents a server that discovers new peers and handles incoming and dropped
connections. When a new peer connects, the ``Server`` class will negotiate protocols and emit a ``connected``
event with a new ``Peer``instance. The peer will have properties corresponding to each protocol. For example,
if a new peer understands the ``eth`` protocol, it will contain an ``eth`` property that provides all ``eth``
protocol methods (for example: ``peer.eth.getBlockHeaders()``)
    - ``RlpxServer`` [**In Progress**] Subclass of ``Server`` that implements the ``devp2p/rlpx`` transport.
    - ``Libp2pServer`` [**Not Started**] Subclass of ``Server`` that implements the ``libp2p`` transport.
- ``Peer`` Represents a network peer. Instances of ``Peer`` are generated by the ``Server``
subclasses and contain instances of supported protocol classes as properties. Instances of ``Peer`` subclasses can also be used to directly connect to other nodes via the ``connect()`` method. Peers emit ``message`` events
whenever a new message is received using any of the supported protocols.
    - ``RlpxPeer`` [**In Progress**] Subclass of ``Peer`` that implements the ``devp2p/rlpx`` transport.
    - ``Libp2pPeer`` [**Not Started**] Subclass of ``Peer`` that implements the ``libp2p`` transport.
- ``Protocol`` [**In Progress**] This class and subclasses provide a user-friendly wrapper around the
low level ethereum protocols such as ``eth/62``, ``eth/62`` and ``les/2``. Subclasses must define the messages provided by the protocol.
    - ``EthProtocol`` [**In Progress**] Implements the ``eth/62`` and ``eth/63`` protocols.
    - ``LesProtocol`` [**In Progress**] Implements the ``les/2`` protocol.
    - ``ShhProtocol`` [**Not Started**] Implements the whisper protocol.
- ``PeerPool`` [**In Progress**] Represents a pool of network peers. ``PeerPool`` instances emit ``added``
and ``removed`` events when new peers are added and removed and also emit the ``message`` event whenever
any of the peers in the pool emit a message. Each ``Service`` has an associated ``PeerPool`` and they are used primarily by ``Synchronizer``s to help with blockchain synchronization.
- ``Synchronizer`` Subclasses of this class implements a specific blockchain synchronization strategy. They
also make use of subclasses of the ``Fetcher`` class that help fetch headers and bodies from pool peers.
    - ``FastSynchronizer`` [**Not Started**] Implements fast syncing of the blockchain
    - ``LightSynchronizer`` [**In Progress**] Implements light syncing of the blockchain
- ``Service`` Subclasses of ``Service`` will implement specific functionality of a ``Node``. For example, the ``EthService`` will synchronize the blockchain using the fast or light sync protocols. Each service must specify which protocols it needs and define a ``start()`` and ``stop()`` function.
    - ``EthService`` [**In Progress**] Implementation of an ethereum fast sync and light sync node.
    - ``ShhService`` [**Not Started**] Implementation of an ethereum whisper node.    
- ``Node`` [**In Progress**] Represents the top-level ethereum node, and is responsible for managing the lifecycle of included services.
- ``RPCManager`` [**In Progress**] Implements an embedded JSON-RPC server to handle incoming RPC requests.

## Contribution Guidelines
**Communication** This is distributed team effort. If you plan to take on larger issues
always pre-announce your work intention on the issue page and drop a short note on what
you are planning to do. If there is no issue for the stuff you want to work on create one
and describe the problem and outline the intended implementation before start working.

**Branch Structure**

Development will take place via feature branches being merged against a protected ``master``
branch. Always develop on branch also when being on your own fork, use meaningful branch
names like ``new-debug-cl-option`` or ``fixed-this-really-annoying-bug``.

**Testing**

No meaningful new PR will be accepted without associated tests (exceptions might be done on
a case-by-case basis). Test coverage should not increase (significantly) by a new PR.
You might also want to consider writing your tests first and then directly push them,
since this would be a good starting point for discussing the scope/implementation of a feature.
