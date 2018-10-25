## Modules

<dl>
<dt><a href="#module_blockchain">blockchain</a></dt>
<dd></dd>
<dt><a href="#module_handler">handler</a></dt>
<dd></dd>
<dt><a href="#module_net/peer">net/peer</a></dt>
<dd></dd>
<dt><a href="#module_net">net</a></dt>
<dd></dd>
<dt><a href="#module_net/protocol">net/protocol</a></dt>
<dd></dd>
<dt><a href="#module_net/server">net/server</a></dt>
<dd></dd>
<dt><a href="#module_rpc">rpc</a></dt>
<dd></dd>
<dt><a href="#module_service">service</a></dt>
<dd></dd>
<dt><a href="#module_sync">sync</a></dt>
<dd></dd>
<dt><a href="#module_util">util</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#BoundProtocol">BoundProtocol</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>Binds a protocol implementation to the specified peer</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#define">define(name, path)</a></dt>
<dd><p>Define a library component for lazy loading. Borrowed from
<a href="https://github.com/bcoin-org/bcoin/blob/master/lib/bcoin.js">https://github.com/bcoin-org/bcoin/blob/master/lib/bcoin.js</a></p>
</dd>
<dt><a href="#putBlocks">putBlocks(blocks)</a> ⇒ <code>Promise</code></dt>
<dd><p>Insert new blocks into blockchain</p>
</dd>
<dt><a href="#putHeaders">putHeaders(headers)</a> ⇒ <code>Promise</code></dt>
<dd><p>Insert new headers into blockchain</p>
</dd>
<dt><a href="#define">define(name, path)</a></dt>
<dd><p>Define a library component for lazy loading. Borrowed from
<a href="https://github.com/bcoin-org/bcoin/blob/master/lib/bcoin.js">https://github.com/bcoin-org/bcoin/blob/master/lib/bcoin.js</a></p>
</dd>
</dl>

<a name="module_blockchain"></a>

## blockchain

* [blockchain](#module_blockchain)
    * [.BlockPool](#module_blockchain.BlockPool)
        * [new BlockPool(options)](#new_module_blockchain.BlockPool_new)
        * [.size](#module_blockchain.BlockPool+size) : <code>number</code>
        * [.open()](#module_blockchain.BlockPool+open) ⇒ <code>Promise</code>
        * [.add(blocks)](#module_blockchain.BlockPool+add) ⇒ <code>Promise</code>
    * [.Chain](#module_blockchain.Chain)
        * [new Chain(options)](#new_module_blockchain.Chain_new)
        * [.networkId](#module_blockchain.Chain+networkId) : <code>number</code>
        * [.genesis](#module_blockchain.Chain+genesis) : <code>Object</code>
        * [.headers](#module_blockchain.Chain+headers) : <code>Object</code>
        * [.blocks](#module_blockchain.Chain+blocks) : <code>Object</code>
        * [.open()](#module_blockchain.Chain+open) ⇒ <code>Promise</code>
        * [.close()](#module_blockchain.Chain+close) ⇒ <code>Promise</code>
        * [.update()](#module_blockchain.Chain+update) ⇒ <code>Promise</code>
        * [.getBlocks(block, max, skip, reverse)](#module_blockchain.Chain+getBlocks) ⇒ <code>Promise</code>
        * [.getBlock(blocks)](#module_blockchain.Chain+getBlock) ⇒ <code>Promise</code>
        * [.getHeaders(block, max, skip, reverse)](#module_blockchain.Chain+getHeaders) ⇒ <code>Promise</code>
        * [.getLatestHeader()](#module_blockchain.Chain+getLatestHeader) ⇒ <code>Promise</code>
        * [.getLatestBlock()](#module_blockchain.Chain+getLatestBlock) ⇒ <code>Promise</code>
        * [.getTd(hash)](#module_blockchain.Chain+getTd) ⇒ <code>Promise</code>
    * [.HeaderPool](#module_blockchain.HeaderPool)
        * [.add(headers)](#module_blockchain.HeaderPool+add) ⇒ <code>Promise</code>

<a name="module_blockchain.BlockPool"></a>

### blockchain.BlockPool
Pool of blockchain segments

**Kind**: static class of [<code>blockchain</code>](#module_blockchain)  

* [.BlockPool](#module_blockchain.BlockPool)
    * [new BlockPool(options)](#new_module_blockchain.BlockPool_new)
    * [.size](#module_blockchain.BlockPool+size) : <code>number</code>
    * [.open()](#module_blockchain.BlockPool+open) ⇒ <code>Promise</code>
    * [.add(blocks)](#module_blockchain.BlockPool+add) ⇒ <code>Promise</code>

<a name="new_module_blockchain.BlockPool_new"></a>

#### new BlockPool(options)
Create new block pool


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.chain | <code>Chain</code> | blockchain |
| [options.logger] | <code>Logger</code> | Logger instance |

<a name="module_blockchain.BlockPool+size"></a>

#### blockPool.size : <code>number</code>
Size of pool

**Kind**: instance property of [<code>BlockPool</code>](#module_blockchain.BlockPool)  
<a name="module_blockchain.BlockPool+open"></a>

#### blockPool.open() ⇒ <code>Promise</code>
Open block pool and wait for blockchain to open

**Kind**: instance method of [<code>BlockPool</code>](#module_blockchain.BlockPool)  
<a name="module_blockchain.BlockPool+add"></a>

#### blockPool.add(blocks) ⇒ <code>Promise</code>
Add a blockchain segment to the pool. Returns a promise that resolves once
the segment has been added to the pool. Segments are automatically inserted
into the blockchain once prior gaps are filled.

**Kind**: instance method of [<code>BlockPool</code>](#module_blockchain.BlockPool)  

| Param | Type | Description |
| --- | --- | --- |
| blocks | <code>Array.&lt;Block&gt;</code> | list of sequential blocks |

<a name="module_blockchain.Chain"></a>

### blockchain.Chain
Blockchain

**Kind**: static class of [<code>blockchain</code>](#module_blockchain)  

* [.Chain](#module_blockchain.Chain)
    * [new Chain(options)](#new_module_blockchain.Chain_new)
    * [.networkId](#module_blockchain.Chain+networkId) : <code>number</code>
    * [.genesis](#module_blockchain.Chain+genesis) : <code>Object</code>
    * [.headers](#module_blockchain.Chain+headers) : <code>Object</code>
    * [.blocks](#module_blockchain.Chain+blocks) : <code>Object</code>
    * [.open()](#module_blockchain.Chain+open) ⇒ <code>Promise</code>
    * [.close()](#module_blockchain.Chain+close) ⇒ <code>Promise</code>
    * [.update()](#module_blockchain.Chain+update) ⇒ <code>Promise</code>
    * [.getBlocks(block, max, skip, reverse)](#module_blockchain.Chain+getBlocks) ⇒ <code>Promise</code>
    * [.getBlock(blocks)](#module_blockchain.Chain+getBlock) ⇒ <code>Promise</code>
    * [.getHeaders(block, max, skip, reverse)](#module_blockchain.Chain+getHeaders) ⇒ <code>Promise</code>
    * [.getLatestHeader()](#module_blockchain.Chain+getLatestHeader) ⇒ <code>Promise</code>
    * [.getLatestBlock()](#module_blockchain.Chain+getLatestBlock) ⇒ <code>Promise</code>
    * [.getTd(hash)](#module_blockchain.Chain+getTd) ⇒ <code>Promise</code>

<a name="new_module_blockchain.Chain_new"></a>

#### new Chain(options)
Create new chain


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| [options.db] | <code>LevelDB</code> | database (must implement leveldb interface) |
| [options.common] | <code>Common</code> | common parameters |
| [options.logger] | <code>Logger</code> | Logger instance |

<a name="module_blockchain.Chain+networkId"></a>

#### chain.networkId : <code>number</code>
Network ID

**Kind**: instance property of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+genesis"></a>

#### chain.genesis : <code>Object</code>
Genesis block parameters

**Kind**: instance property of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+headers"></a>

#### chain.headers : <code>Object</code>
Returns properties of the canonical headerchain. The ``latest`` property is
the latest header in the chain, the ``td`` property is the total difficulty of
headerchain, and the ``height`` is the height of the headerchain.

**Kind**: instance property of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+blocks"></a>

#### chain.blocks : <code>Object</code>
Returns properties of the canonical blockchain. The ``latest`` property is
the latest block in the chain, the ``td`` property is the total difficulty of
blockchain, and the ``height`` is the height of the blockchain.

**Kind**: instance property of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+open"></a>

#### chain.open() ⇒ <code>Promise</code>
Open blockchain and wait for database to load

**Kind**: instance method of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+close"></a>

#### chain.close() ⇒ <code>Promise</code>
Close blockchain and database

**Kind**: instance method of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+update"></a>

#### chain.update() ⇒ <code>Promise</code>
Update blockchain properties (latest block, td, height, etc...)

**Kind**: instance method of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+getBlocks"></a>

#### chain.getBlocks(block, max, skip, reverse) ⇒ <code>Promise</code>
Get blocks from blockchain

**Kind**: instance method of [<code>Chain</code>](#module_blockchain.Chain)  

| Param | Type | Description |
| --- | --- | --- |
| block | <code>Buffer</code> \| <code>BN</code> | block hash or number to start from |
| max | <code>number</code> | maximum number of blocks to get |
| skip | <code>number</code> | number of blocks to skip |
| reverse | <code>boolean</code> | get blocks in reverse |

<a name="module_blockchain.Chain+getBlock"></a>

#### chain.getBlock(blocks) ⇒ <code>Promise</code>
Gets a block by its hash or number

**Kind**: instance method of [<code>Chain</code>](#module_blockchain.Chain)  

| Param | Type | Description |
| --- | --- | --- |
| blocks | <code>Buffer</code> \| <code>BN</code> | block hash or number |

<a name="module_blockchain.Chain+getHeaders"></a>

#### chain.getHeaders(block, max, skip, reverse) ⇒ <code>Promise</code>
Get headers from blockchain

**Kind**: instance method of [<code>Chain</code>](#module_blockchain.Chain)  

| Param | Type | Description |
| --- | --- | --- |
| block | <code>Buffer</code> \| <code>BN</code> | block hash or number to start from |
| max | <code>number</code> | maximum number of headers to get |
| skip | <code>number</code> | number of headers to skip |
| reverse | <code>boolean</code> | get headers in reverse |

<a name="module_blockchain.Chain+getLatestHeader"></a>

#### chain.getLatestHeader() ⇒ <code>Promise</code>
Gets the latest header in the canonical chain

**Kind**: instance method of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+getLatestBlock"></a>

#### chain.getLatestBlock() ⇒ <code>Promise</code>
Gets the latest block in the canonical chain

**Kind**: instance method of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+getTd"></a>

#### chain.getTd(hash) ⇒ <code>Promise</code>
Gets total difficulty for a block

**Kind**: instance method of [<code>Chain</code>](#module_blockchain.Chain)  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>Buffer</code> | block hash |

<a name="module_blockchain.HeaderPool"></a>

### blockchain.HeaderPool
Pool of headerchain segments

**Kind**: static class of [<code>blockchain</code>](#module_blockchain)  
<a name="module_blockchain.HeaderPool+add"></a>

#### headerPool.add(headers) ⇒ <code>Promise</code>
Add a headerchain segment to the pool. Returns a promise that resolves once
the segment has been added to the pool. Segments are automatically inserted
into the blockchain once prior gaps are filled.

**Kind**: instance method of [<code>HeaderPool</code>](#module_blockchain.HeaderPool)  

| Param | Type | Description |
| --- | --- | --- |
| headers | <code>Array.&lt;Header&gt;</code> | list of sequential headers |

<a name="module_handler"></a>

## handler

* [handler](#module_handler)
    * [.EthHandler](#module_handler.EthHandler)
        * [new EthHandler(options)](#new_module_handler.EthHandler_new)
        * [.handle(message, peer)](#module_handler.EthHandler+handle) ⇒ <code>Promise</code>
    * [.Handler](#module_handler.Handler)
        * [new Handler(options)](#new_module_handler.Handler_new)
        * [.handle(message, peer)](#module_handler.Handler+handle) ⇒ <code>Promise</code>
    * [.LesHandler](#module_handler.LesHandler)
        * [new LesHandler(options)](#new_module_handler.LesHandler_new)
        * [.handle(message, peer)](#module_handler.LesHandler+handle) ⇒ <code>Promise</code>

<a name="module_handler.EthHandler"></a>

### handler.EthHandler
ETH protocol handler

**Kind**: static class of [<code>handler</code>](#module_handler)  

* [.EthHandler](#module_handler.EthHandler)
    * [new EthHandler(options)](#new_module_handler.EthHandler_new)
    * [.handle(message, peer)](#module_handler.EthHandler+handle) ⇒ <code>Promise</code>

<a name="new_module_handler.EthHandler_new"></a>

#### new EthHandler(options)
Create new handler


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.pool | <code>PeerPool</code> | peer pool |
| options.chain | <code>Chain</code> | blockchain |
| [options.logger] | <code>Logger</code> | Logger instance |

<a name="module_handler.EthHandler+handle"></a>

#### ethHandler.handle(message, peer) ⇒ <code>Promise</code>
Handles incoming ETH request from connected peer

**Kind**: instance method of [<code>EthHandler</code>](#module_handler.EthHandler)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | message object |
| peer | <code>Peer</code> | peer |

<a name="module_handler.Handler"></a>

### handler.Handler
Base class for protocol handlers

**Kind**: static class of [<code>handler</code>](#module_handler)  

* [.Handler](#module_handler.Handler)
    * [new Handler(options)](#new_module_handler.Handler_new)
    * [.handle(message, peer)](#module_handler.Handler+handle) ⇒ <code>Promise</code>

<a name="new_module_handler.Handler_new"></a>

#### new Handler(options)
Create new handler


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.pool | <code>PeerPool</code> | peer pool |
| options.chain | <code>Chain</code> | blockchain |
| [options.logger] | <code>Logger</code> | Logger instance |

<a name="module_handler.Handler+handle"></a>

#### handler.handle(message, peer) ⇒ <code>Promise</code>
Handles incoming request from connected peer

**Kind**: instance method of [<code>Handler</code>](#module_handler.Handler)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | message object |
| peer | <code>Peer</code> | peer |

<a name="module_handler.LesHandler"></a>

### handler.LesHandler
LES protocol handler

**Kind**: static class of [<code>handler</code>](#module_handler)  

* [.LesHandler](#module_handler.LesHandler)
    * [new LesHandler(options)](#new_module_handler.LesHandler_new)
    * [.handle(message, peer)](#module_handler.LesHandler+handle) ⇒ <code>Promise</code>

<a name="new_module_handler.LesHandler_new"></a>

#### new LesHandler(options)
Create new handler


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.pool | <code>PeerPool</code> | peer pool |
| options.chain | <code>Chain</code> | blockchain |
| options.flow | <code>FlowControl</code> | flow control manager |
| [options.logger] | <code>Logger</code> | Logger instance |

<a name="module_handler.LesHandler+handle"></a>

#### lesHandler.handle(message, peer) ⇒ <code>Promise</code>
Handles incoming LES requests from connected peer

**Kind**: instance method of [<code>LesHandler</code>](#module_handler.LesHandler)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | message object |
| peer | <code>Peer</code> | peer |

<a name="module_net/peer"></a>

## net/peer

* [net/peer](#module_net/peer)
    * [.Libp2pPeer](#module_net/peer.Libp2pPeer)
        * [new Libp2pPeer(options)](#new_module_net/peer.Libp2pPeer_new)
        * [.connect()](#module_net/peer.Libp2pPeer+connect) ⇒ <code>Promise</code>
    * [.Peer](#module_net/peer.Peer)
        * [new Peer(options)](#new_module_net/peer.Peer_new)
        * [.idle](#module_net/peer.Peer+idle) : <code>boolean</code>
        * [.idle](#module_net/peer.Peer+idle) : <code>boolean</code>
        * [.bindProtocol(protocol, sender)](#module_net/peer.Peer+bindProtocol) ⇒ <code>Promise</code>
        * [.understands(protocolName)](#module_net/peer.Peer+understands)
    * [.RlpxPeer](#module_net/peer.RlpxPeer)
        * [new RlpxPeer(options)](#new_module_net/peer.RlpxPeer_new)
        * _instance_
            * [.connect()](#module_net/peer.RlpxPeer+connect) ⇒ <code>Promise</code>
        * _static_
            * [.capabilities(protocols)](#module_net/peer.RlpxPeer.capabilities) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.TCP](#module_net/peer.TCP)

<a name="module_net/peer.Libp2pPeer"></a>

### net/peer.Libp2pPeer
Libp2p peer

**Kind**: static class of [<code>net/peer</code>](#module_net/peer)  

* [.Libp2pPeer](#module_net/peer.Libp2pPeer)
    * [new Libp2pPeer(options)](#new_module_net/peer.Libp2pPeer_new)
    * [.connect()](#module_net/peer.Libp2pPeer+connect) ⇒ <code>Promise</code>

<a name="new_module_net/peer.Libp2pPeer_new"></a>

#### new Libp2pPeer(options)
Create new libp2p peer


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.id | <code>string</code> |  | peer id |
| options.multiaddrs | <code>Array.&lt;multiaddr&gt;</code> |  | multiaddrs to listen on (can be a comma separated string or list) |
| [options.protocols] | <code>Array.&lt;Protocols&gt;</code> | <code>[]</code> | supported protocols |
| [options.logger] | <code>Logger</code> |  | Logger instance |

**Example**  
```js
const { Libp2pPeer } = require('./lib/net/peer')
const { Chain } = require('./lib/blockchain')
const { EthProtocol } = require('./lib/net/protocol')

const chain = new Chain()
const protocols = [ new EthProtocol({ chain })]
const id = 'QmWYhkpLFDhQBwHCMSWzEebbJ5JzXWBKLJxjEuiL8wGzUu'
const multiaddrs = [ '/ip4/192.0.2.1/tcp/12345' ]

new Libp2pPeer({ id, multiaddrs, protocols })
  .on('error', (err) => console.log('Error:', err))
  .on('connected', () => console.log('Connected'))
  .on('disconnected', (reason) => console.log('Disconnected:', reason))
  .connect()
```
<a name="module_net/peer.Libp2pPeer+connect"></a>

#### libp2pPeer.connect() ⇒ <code>Promise</code>
Initiate peer connection

**Kind**: instance method of [<code>Libp2pPeer</code>](#module_net/peer.Libp2pPeer)  
<a name="module_net/peer.Peer"></a>

### net/peer.Peer
Network peer

**Kind**: static class of [<code>net/peer</code>](#module_net/peer)  

* [.Peer](#module_net/peer.Peer)
    * [new Peer(options)](#new_module_net/peer.Peer_new)
    * [.idle](#module_net/peer.Peer+idle) : <code>boolean</code>
    * [.idle](#module_net/peer.Peer+idle) : <code>boolean</code>
    * [.bindProtocol(protocol, sender)](#module_net/peer.Peer+bindProtocol) ⇒ <code>Promise</code>
    * [.understands(protocolName)](#module_net/peer.Peer+understands)

<a name="new_module_net/peer.Peer_new"></a>

#### new Peer(options)
Create new peer


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.id | <code>string</code> |  | peer id |
| [options.address] | <code>string</code> |  | peer address |
| [options.inbound] | <code>boolean</code> |  | true if peer initiated connection |
| [options.transport] | <code>string</code> |  | transport name |
| [options.protocols] | <code>Array.&lt;Protocols&gt;</code> | <code>[]</code> | supported protocols |
| [options.logger] | <code>Logger</code> |  | logger instance |

<a name="module_net/peer.Peer+idle"></a>

#### peer.idle : <code>boolean</code>
Get idle state of peer

**Kind**: instance property of [<code>Peer</code>](#module_net/peer.Peer)  
<a name="module_net/peer.Peer+idle"></a>

#### peer.idle : <code>boolean</code>
Set idle state of peer

**Kind**: instance property of [<code>Peer</code>](#module_net/peer.Peer)  
<a name="module_net/peer.Peer+bindProtocol"></a>

#### peer.bindProtocol(protocol, sender) ⇒ <code>Promise</code>
Adds a protocol to this peer given a sender instance. Protocol methods
will be accessible via a field with the same name as protocol. New methods
will be added corresponding to each message defined by the protocol, in
addition to send() and request() methods that takes a message name and message
arguments. send() only sends a message without waiting for a response, whereas
request() also sends the message but will return a promise that resolves with
the response payload.

**Kind**: instance method of [<code>Peer</code>](#module_net/peer.Peer)  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| protocol | <code>Protocol</code> | protocol instance |
| sender | <code>Sender</code> | Sender instance provided by subclass |

**Example**  
```js
await peer.bindProtocol(ethProtocol, sender)
// Example: Directly call message name as a method on the bound protocol
const headers1 = await peer.eth.getBlockHeaders(1, 100, 0, 0)
// Example: Call request() method with message name as first parameter
const headers2 = await peer.eth.request('getBlockHeaders', 1, 100, 0, 0)
// Example: Call send() method with message name as first parameter and
// wait for response message as an event
peer.eth.send('getBlockHeaders', 1, 100, 0, 0)
peer.eth.on('message', ({ data }) => console.log(`Received ${data.length} headers`))
```
<a name="module_net/peer.Peer+understands"></a>

#### peer.understands(protocolName)
Return true if peer understand the specified protocol name

**Kind**: instance method of [<code>Peer</code>](#module_net/peer.Peer)  

| Param | Type |
| --- | --- |
| protocolName | <code>string</code> | 

<a name="module_net/peer.RlpxPeer"></a>

### net/peer.RlpxPeer
Devp2p/RLPx peer

**Kind**: static class of [<code>net/peer</code>](#module_net/peer)  

* [.RlpxPeer](#module_net/peer.RlpxPeer)
    * [new RlpxPeer(options)](#new_module_net/peer.RlpxPeer_new)
    * _instance_
        * [.connect()](#module_net/peer.RlpxPeer+connect) ⇒ <code>Promise</code>
    * _static_
        * [.capabilities(protocols)](#module_net/peer.RlpxPeer.capabilities) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="new_module_net/peer.RlpxPeer_new"></a>

#### new RlpxPeer(options)
Create new devp2p/rlpx peer


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.id | <code>string</code> |  | peer id |
| options.host | <code>string</code> |  | peer hostname or ip address |
| options.port | <code>number</code> |  | peer port |
| [options.protocols] | <code>Array.&lt;Protocols&gt;</code> | <code>[]</code> | supported protocols |
| [options.logger] | <code>Logger</code> |  | Logger instance |

**Example**  
```js
const { RlpxPeer } = require('./lib/net/peer')
const { Chain } = require('./lib/blockchain')
const { EthProtocol } = require('./lib/net/protocol')

const chain = new Chain()
const protocols = [ new EthProtocol({ chain })]
const id = '70180a7fcca96aa013a3609fe7c23cc5c349ba82652c077be6f05b8419040560a622a4fc197a450e5e2f5f28fe6227637ccdbb3f9ba19220d1fb607505ffb455'
const host = '192.0.2.1'
const port = 12345

new RlpxPeer({ id, host, port, protocols })
  .on('error', (err) => console.log('Error:', err))
  .on('connected', () => console.log('Connected'))
  .on('disconnected', (reason) => console.log('Disconnected:', reason))
  .connect()
```
<a name="module_net/peer.RlpxPeer+connect"></a>

#### rlpxPeer.connect() ⇒ <code>Promise</code>
Initiate peer connection

**Kind**: instance method of [<code>RlpxPeer</code>](#module_net/peer.RlpxPeer)  
<a name="module_net/peer.RlpxPeer.capabilities"></a>

#### RlpxPeer.capabilities(protocols) ⇒ <code>Array.&lt;Object&gt;</code>
Return devp2p/rlpx capabilities for the specified protocols

**Kind**: static method of [<code>RlpxPeer</code>](#module_net/peer.RlpxPeer)  
**Returns**: <code>Array.&lt;Object&gt;</code> - capabilities  

| Param | Type | Description |
| --- | --- | --- |
| protocols | <code>Array.&lt;Protocols&gt;</code> | protocol instances |

<a name="module_net/peer.TCP"></a>

### net/peer.TCP
Libp2p Bundle

**Kind**: static constant of [<code>net/peer</code>](#module_net/peer)  
<a name="module_net"></a>

## net

* [net](#module_net)
    * [.PeerPool](#module_net.PeerPool)
        * [new PeerPool(options)](#new_module_net.PeerPool_new)
        * [.peers](#module_net.PeerPool+peers) : <code>Array.&lt;Peer&gt;</code>
        * [.open()](#module_net.PeerPool+open) ⇒ <code>Promise</code>
        * [.close()](#module_net.PeerPool+close) ⇒ <code>Promise</code>
        * [.contains(peer)](#module_net.PeerPool+contains) ⇒ <code>boolean</code>
        * [.idle([filterFn])](#module_net.PeerPool+idle) ⇒ <code>Peer</code>
        * [.ban(peer, maxAge)](#module_net.PeerPool+ban)
        * [.add(peer)](#module_net.PeerPool+add)
        * [.remove(peer)](#module_net.PeerPool+remove)

<a name="module_net.PeerPool"></a>

### net.PeerPool
Pool of connected peers

**Kind**: static class of [<code>net</code>](#module_net)  
**Emits**: <code>event:connected</code>, <code>event:disconnected</code>, <code>event:banned</code>, <code>event:added</code>, <code>event:removed</code>, <code>event:message</code>, <code>message:{protocol}</code>, <code>event:error</code>  

* [.PeerPool](#module_net.PeerPool)
    * [new PeerPool(options)](#new_module_net.PeerPool_new)
    * [.peers](#module_net.PeerPool+peers) : <code>Array.&lt;Peer&gt;</code>
    * [.open()](#module_net.PeerPool+open) ⇒ <code>Promise</code>
    * [.close()](#module_net.PeerPool+close) ⇒ <code>Promise</code>
    * [.contains(peer)](#module_net.PeerPool+contains) ⇒ <code>boolean</code>
    * [.idle([filterFn])](#module_net.PeerPool+idle) ⇒ <code>Peer</code>
    * [.ban(peer, maxAge)](#module_net.PeerPool+ban)
    * [.add(peer)](#module_net.PeerPool+add)
    * [.remove(peer)](#module_net.PeerPool+remove)

<a name="new_module_net.PeerPool_new"></a>

#### new PeerPool(options)
Create new peer pool


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.servers | <code>Array.&lt;Server&gt;</code> | servers to aggregate peers from |
| [options.logger] | <code>Logger</code> | logger instance |

<a name="module_net.PeerPool+peers"></a>

#### peerPool.peers : <code>Array.&lt;Peer&gt;</code>
Connected peers

**Kind**: instance property of [<code>PeerPool</code>](#module_net.PeerPool)  
<a name="module_net.PeerPool+open"></a>

#### peerPool.open() ⇒ <code>Promise</code>
Open pool and make sure all associated servers are also open

**Kind**: instance method of [<code>PeerPool</code>](#module_net.PeerPool)  
<a name="module_net.PeerPool+close"></a>

#### peerPool.close() ⇒ <code>Promise</code>
Close pool

**Kind**: instance method of [<code>PeerPool</code>](#module_net.PeerPool)  
<a name="module_net.PeerPool+contains"></a>

#### peerPool.contains(peer) ⇒ <code>boolean</code>
Return true if pool contains the specified peer

**Kind**: instance method of [<code>PeerPool</code>](#module_net.PeerPool)  

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>Peer</code> \| <code>string</code> | object or peer id |

<a name="module_net.PeerPool+idle"></a>

#### peerPool.idle([filterFn]) ⇒ <code>Peer</code>
Returns a random idle peer from the pool

**Kind**: instance method of [<code>PeerPool</code>](#module_net.PeerPool)  

| Param | Type | Description |
| --- | --- | --- |
| [filterFn] | <code>function</code> | filter function to apply before finding idle peers |

<a name="module_net.PeerPool+ban"></a>

#### peerPool.ban(peer, maxAge)
Ban peer from being added to the pool for a period of time

**Kind**: instance method of [<code>PeerPool</code>](#module_net.PeerPool)  
**Emits**: <code>event:banned</code>  

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>Peer</code> |  |
| maxAge | <code>number</code> | ban period in milliseconds |

<a name="module_net.PeerPool+add"></a>

#### peerPool.add(peer)
Add peer to pool

**Kind**: instance method of [<code>PeerPool</code>](#module_net.PeerPool)  
**Emits**: <code>event:added</code>, <code>event:message</code>, <code>message:{protocol}</code>  

| Param | Type |
| --- | --- |
| peer | <code>Peer</code> | 

<a name="module_net.PeerPool+remove"></a>

#### peerPool.remove(peer)
Remove peer from pool

**Kind**: instance method of [<code>PeerPool</code>](#module_net.PeerPool)  
**Emits**: <code>event:removed</code>  

| Param | Type |
| --- | --- |
| peer | <code>Peer</code> | 

<a name="module_net/protocol"></a>

## net/protocol

* [net/protocol](#module_net/protocol)
    * [.EthProtocol](#module_net/protocol.EthProtocol)
        * [new EthProtocol(options)](#new_module_net/protocol.EthProtocol_new)
        * [.name](#module_net/protocol.EthProtocol+name) : <code>string</code>
        * [.versions](#module_net/protocol.EthProtocol+versions) : <code>Array.&lt;number&gt;</code>
        * [.messages](#module_net/protocol.EthProtocol+messages) : [<code>Array.&lt;Message&gt;</code>](#Protocol..Message)
        * [.open()](#module_net/protocol.EthProtocol+open) ⇒ <code>Promise</code>
        * [.encodeStatus()](#module_net/protocol.EthProtocol+encodeStatus) ⇒ <code>Object</code>
        * [.decodeStatus(status)](#module_net/protocol.EthProtocol+decodeStatus) ⇒ <code>Object</code>
    * [.FlowControl](#module_net/protocol.FlowControl)
        * [.handleReply(peer, bv)](#module_net/protocol.FlowControl+handleReply)
        * [.maxRequestCount(peer, messageName)](#module_net/protocol.FlowControl+maxRequestCount) ⇒ <code>number</code>
        * [.handleRequest(peer, messageName, count)](#module_net/protocol.FlowControl+handleRequest) ⇒ <code>number</code>
    * [.LesProtocol](#module_net/protocol.LesProtocol)
        * [new LesProtocol(options)](#new_module_net/protocol.LesProtocol_new)
        * [.name](#module_net/protocol.LesProtocol+name) : <code>string</code>
        * [.versions](#module_net/protocol.LesProtocol+versions) : <code>Array.&lt;number&gt;</code>
        * [.messages](#module_net/protocol.LesProtocol+messages) : [<code>Array.&lt;Message&gt;</code>](#Protocol..Message)
        * [.open()](#module_net/protocol.LesProtocol+open) ⇒ <code>Promise</code>
        * [.encodeStatus()](#module_net/protocol.LesProtocol+encodeStatus) ⇒ <code>Object</code>
        * [.decodeStatus(status)](#module_net/protocol.LesProtocol+decodeStatus) ⇒ <code>Object</code>
    * [.Libp2pSender](#module_net/protocol.Libp2pSender)
        * [new Libp2pSender(connection)](#new_module_net/protocol.Libp2pSender_new)
        * [.sendStatus(status)](#module_net/protocol.Libp2pSender+sendStatus)
        * [.sendMessage(code, data)](#module_net/protocol.Libp2pSender+sendMessage)
        * [.error(error)](#module_net/protocol.Libp2pSender+error)
    * [.Protocol](#module_net/protocol.Protocol)
        * [new Protocol(options)](#new_module_net/protocol.Protocol_new)
        * [.name](#module_net/protocol.Protocol+name) : <code>string</code>
        * [.versions](#module_net/protocol.Protocol+versions) : <code>Array.&lt;number&gt;</code>
        * [.messages](#module_net/protocol.Protocol+messages) : [<code>Array.&lt;Message&gt;</code>](#Protocol..Message)
        * [.open()](#module_net/protocol.Protocol+open) ⇒ <code>Promise</code>
        * [.encodeStatus()](#module_net/protocol.Protocol+encodeStatus) ⇒ <code>Object</code>
        * [.decodeStatus(status)](#module_net/protocol.Protocol+decodeStatus) ⇒ <code>Object</code>
        * [.encode(message, args)](#module_net/protocol.Protocol+encode) ⇒ <code>\*</code>
        * [.decode(message, payload, bound)](#module_net/protocol.Protocol+decode) ⇒ <code>\*</code>
        * [.bind(peer, sender)](#module_net/protocol.Protocol+bind) ⇒ <code>Promise</code>
    * [.RlpxSender](#module_net/protocol.RlpxSender)
        * [new RlpxSender(rlpxProtocol)](#new_module_net/protocol.RlpxSender_new)
        * [.sendStatus(status)](#module_net/protocol.RlpxSender+sendStatus)
        * [.sendMessage(code, data)](#module_net/protocol.RlpxSender+sendMessage)
    * [.Sender](#module_net/protocol.Sender)
        * [.sendStatus(status)](#module_net/protocol.Sender+sendStatus)
        * [.sendMessage(code, rlpEncodedData)](#module_net/protocol.Sender+sendMessage)

<a name="module_net/protocol.EthProtocol"></a>

### net/protocol.EthProtocol
Implements eth/62 and eth/63 protocols

**Kind**: static class of [<code>net/protocol</code>](#module_net/protocol)  

* [.EthProtocol](#module_net/protocol.EthProtocol)
    * [new EthProtocol(options)](#new_module_net/protocol.EthProtocol_new)
    * [.name](#module_net/protocol.EthProtocol+name) : <code>string</code>
    * [.versions](#module_net/protocol.EthProtocol+versions) : <code>Array.&lt;number&gt;</code>
    * [.messages](#module_net/protocol.EthProtocol+messages) : [<code>Array.&lt;Message&gt;</code>](#Protocol..Message)
    * [.open()](#module_net/protocol.EthProtocol+open) ⇒ <code>Promise</code>
    * [.encodeStatus()](#module_net/protocol.EthProtocol+encodeStatus) ⇒ <code>Object</code>
    * [.decodeStatus(status)](#module_net/protocol.EthProtocol+decodeStatus) ⇒ <code>Object</code>

<a name="new_module_net/protocol.EthProtocol_new"></a>

#### new EthProtocol(options)
Create eth protocol


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.chain | <code>Chain</code> |  | blockchain |
| [options.timeout] | <code>number</code> | <code>5000</code> | handshake timeout in ms |
| [options.logger] | <code>Logger</code> |  | logger instance |

<a name="module_net/protocol.EthProtocol+name"></a>

#### ethProtocol.name : <code>string</code>
Name of protocol

**Kind**: instance property of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  
<a name="module_net/protocol.EthProtocol+versions"></a>

#### ethProtocol.versions : <code>Array.&lt;number&gt;</code>
Protocol versions supported

**Kind**: instance property of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  
<a name="module_net/protocol.EthProtocol+messages"></a>

#### ethProtocol.messages : [<code>Array.&lt;Message&gt;</code>](#Protocol..Message)
Messages defined by this protocol

**Kind**: instance property of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  
<a name="module_net/protocol.EthProtocol+open"></a>

#### ethProtocol.open() ⇒ <code>Promise</code>
Opens protocol and any associated dependencies

**Kind**: instance method of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  
<a name="module_net/protocol.EthProtocol+encodeStatus"></a>

#### ethProtocol.encodeStatus() ⇒ <code>Object</code>
Encodes status into ETH status message payload

**Kind**: instance method of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  
<a name="module_net/protocol.EthProtocol+decodeStatus"></a>

#### ethProtocol.decodeStatus(status) ⇒ <code>Object</code>
Decodes ETH status message payload into a status object

**Kind**: instance method of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  

| Param | Type | Description |
| --- | --- | --- |
| status | <code>Object</code> | status message payload |

<a name="module_net/protocol.FlowControl"></a>

### net/protocol.FlowControl
LES flow control manager

**Kind**: static class of [<code>net/protocol</code>](#module_net/protocol)  

* [.FlowControl](#module_net/protocol.FlowControl)
    * [.handleReply(peer, bv)](#module_net/protocol.FlowControl+handleReply)
    * [.maxRequestCount(peer, messageName)](#module_net/protocol.FlowControl+maxRequestCount) ⇒ <code>number</code>
    * [.handleRequest(peer, messageName, count)](#module_net/protocol.FlowControl+handleRequest) ⇒ <code>number</code>

<a name="module_net/protocol.FlowControl+handleReply"></a>

#### flowControl.handleReply(peer, bv)
Process reply message from an LES peer by updating its BLE value

**Kind**: instance method of [<code>FlowControl</code>](#module_net/protocol.FlowControl)  

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>Peer</code> | LES peer |
| bv | <code>number</code> | latest buffer value |

<a name="module_net/protocol.FlowControl+maxRequestCount"></a>

#### flowControl.maxRequestCount(peer, messageName) ⇒ <code>number</code>
Calculate maximum items that can be requested from an LES peer

**Kind**: instance method of [<code>FlowControl</code>](#module_net/protocol.FlowControl)  
**Returns**: <code>number</code> - maximum count  

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>Peer</code> | LES peer |
| messageName | <code>string</code> | message name |

<a name="module_net/protocol.FlowControl+handleRequest"></a>

#### flowControl.handleRequest(peer, messageName, count) ⇒ <code>number</code>
Calculate new buffer value for an LES peer after an incoming request is
processed. If the new value is negative, the peer should be dropped by the
caller.

**Kind**: instance method of [<code>FlowControl</code>](#module_net/protocol.FlowControl)  
**Returns**: <code>number</code> - new buffer value after request is sent (if negative, drop peer)  

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>Peer</code> | LES peer |
| messageName | <code>string</code> | message name |
| count | <code>number</code> | number of items to request from peer |

<a name="module_net/protocol.LesProtocol"></a>

### net/protocol.LesProtocol
Implements les/1 and les/2 protocols

**Kind**: static class of [<code>net/protocol</code>](#module_net/protocol)  

* [.LesProtocol](#module_net/protocol.LesProtocol)
    * [new LesProtocol(options)](#new_module_net/protocol.LesProtocol_new)
    * [.name](#module_net/protocol.LesProtocol+name) : <code>string</code>
    * [.versions](#module_net/protocol.LesProtocol+versions) : <code>Array.&lt;number&gt;</code>
    * [.messages](#module_net/protocol.LesProtocol+messages) : [<code>Array.&lt;Message&gt;</code>](#Protocol..Message)
    * [.open()](#module_net/protocol.LesProtocol+open) ⇒ <code>Promise</code>
    * [.encodeStatus()](#module_net/protocol.LesProtocol+encodeStatus) ⇒ <code>Object</code>
    * [.decodeStatus(status)](#module_net/protocol.LesProtocol+decodeStatus) ⇒ <code>Object</code>

<a name="new_module_net/protocol.LesProtocol_new"></a>

#### new LesProtocol(options)
Create les protocol


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.chain | <code>Chain</code> |  | blockchain |
| [options.flow] | <code>FlowControl</code> |  | flow control manager. if undefined, header serving will be disabled |
| [options.timeout] | <code>number</code> | <code>5000</code> | handshake timeout in ms |
| [options.logger] | <code>Logger</code> |  | logger instance |

<a name="module_net/protocol.LesProtocol+name"></a>

#### lesProtocol.name : <code>string</code>
Name of protocol

**Kind**: instance property of [<code>LesProtocol</code>](#module_net/protocol.LesProtocol)  
<a name="module_net/protocol.LesProtocol+versions"></a>

#### lesProtocol.versions : <code>Array.&lt;number&gt;</code>
Protocol versions supported

**Kind**: instance property of [<code>LesProtocol</code>](#module_net/protocol.LesProtocol)  
<a name="module_net/protocol.LesProtocol+messages"></a>

#### lesProtocol.messages : [<code>Array.&lt;Message&gt;</code>](#Protocol..Message)
Messages defined by this protocol

**Kind**: instance property of [<code>LesProtocol</code>](#module_net/protocol.LesProtocol)  
<a name="module_net/protocol.LesProtocol+open"></a>

#### lesProtocol.open() ⇒ <code>Promise</code>
Opens protocol and any associated dependencies

**Kind**: instance method of [<code>LesProtocol</code>](#module_net/protocol.LesProtocol)  
<a name="module_net/protocol.LesProtocol+encodeStatus"></a>

#### lesProtocol.encodeStatus() ⇒ <code>Object</code>
Encodes status into LES status message payload

**Kind**: instance method of [<code>LesProtocol</code>](#module_net/protocol.LesProtocol)  
<a name="module_net/protocol.LesProtocol+decodeStatus"></a>

#### lesProtocol.decodeStatus(status) ⇒ <code>Object</code>
Decodes ETH status message payload into a status object

**Kind**: instance method of [<code>LesProtocol</code>](#module_net/protocol.LesProtocol)  

| Param | Type | Description |
| --- | --- | --- |
| status | <code>Object</code> | status message payload |

<a name="module_net/protocol.Libp2pSender"></a>

### net/protocol.Libp2pSender
Libp2p protocol sender

**Kind**: static class of [<code>net/protocol</code>](#module_net/protocol)  
**Emits**: <code>event:message</code>, <code>event:status</code>  

* [.Libp2pSender](#module_net/protocol.Libp2pSender)
    * [new Libp2pSender(connection)](#new_module_net/protocol.Libp2pSender_new)
    * [.sendStatus(status)](#module_net/protocol.Libp2pSender+sendStatus)
    * [.sendMessage(code, data)](#module_net/protocol.Libp2pSender+sendMessage)
    * [.error(error)](#module_net/protocol.Libp2pSender+error)

<a name="new_module_net/protocol.Libp2pSender_new"></a>

#### new Libp2pSender(connection)
Creates a new Libp2p protocol sender


| Param | Type | Description |
| --- | --- | --- |
| connection | <code>Connection</code> | connection to libp2p peer |

<a name="module_net/protocol.Libp2pSender+sendStatus"></a>

#### libp2pSender.sendStatus(status)
Send a status to peer

**Kind**: instance method of [<code>Libp2pSender</code>](#module_net/protocol.Libp2pSender)  

| Param | Type |
| --- | --- |
| status | <code>Object</code> | 

<a name="module_net/protocol.Libp2pSender+sendMessage"></a>

#### libp2pSender.sendMessage(code, data)
Send a message to peer

**Kind**: instance method of [<code>Libp2pSender</code>](#module_net/protocol.Libp2pSender)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>number</code> | message code |
| data | <code>\*</code> | message payload |

<a name="module_net/protocol.Libp2pSender+error"></a>

#### libp2pSender.error(error)
Handle pull stream errors

**Kind**: instance method of [<code>Libp2pSender</code>](#module_net/protocol.Libp2pSender)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>Error</code> | error |

<a name="module_net/protocol.Protocol"></a>

### net/protocol.Protocol
Base class for all wire protocols

**Kind**: static class of [<code>net/protocol</code>](#module_net/protocol)  

* [.Protocol](#module_net/protocol.Protocol)
    * [new Protocol(options)](#new_module_net/protocol.Protocol_new)
    * [.name](#module_net/protocol.Protocol+name) : <code>string</code>
    * [.versions](#module_net/protocol.Protocol+versions) : <code>Array.&lt;number&gt;</code>
    * [.messages](#module_net/protocol.Protocol+messages) : [<code>Array.&lt;Message&gt;</code>](#Protocol..Message)
    * [.open()](#module_net/protocol.Protocol+open) ⇒ <code>Promise</code>
    * [.encodeStatus()](#module_net/protocol.Protocol+encodeStatus) ⇒ <code>Object</code>
    * [.decodeStatus(status)](#module_net/protocol.Protocol+decodeStatus) ⇒ <code>Object</code>
    * [.encode(message, args)](#module_net/protocol.Protocol+encode) ⇒ <code>\*</code>
    * [.decode(message, payload, bound)](#module_net/protocol.Protocol+decode) ⇒ <code>\*</code>
    * [.bind(peer, sender)](#module_net/protocol.Protocol+bind) ⇒ <code>Promise</code>

<a name="new_module_net/protocol.Protocol_new"></a>

#### new Protocol(options)
Create new protocol


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| [options.timeout] | <code>number</code> | <code>5000</code> | handshake timeout in ms |
| [options.logger] | <code>Logger</code> |  | logger instance |

<a name="module_net/protocol.Protocol+name"></a>

#### protocol.name : <code>string</code>
Name of protocol

**Kind**: instance property of [<code>Protocol</code>](#module_net/protocol.Protocol)  
<a name="module_net/protocol.Protocol+versions"></a>

#### protocol.versions : <code>Array.&lt;number&gt;</code>
Protocol versions supported

**Kind**: instance property of [<code>Protocol</code>](#module_net/protocol.Protocol)  
<a name="module_net/protocol.Protocol+messages"></a>

#### protocol.messages : [<code>Array.&lt;Message&gt;</code>](#Protocol..Message)
Messages defined by this protocol

**Kind**: instance property of [<code>Protocol</code>](#module_net/protocol.Protocol)  
<a name="module_net/protocol.Protocol+open"></a>

#### protocol.open() ⇒ <code>Promise</code>
Opens protocol and any associated dependencies

**Kind**: instance method of [<code>Protocol</code>](#module_net/protocol.Protocol)  
<a name="module_net/protocol.Protocol+encodeStatus"></a>

#### protocol.encodeStatus() ⇒ <code>Object</code>
Encodes status into status message payload. Must be implemented by subclass.

**Kind**: instance method of [<code>Protocol</code>](#module_net/protocol.Protocol)  
<a name="module_net/protocol.Protocol+decodeStatus"></a>

#### protocol.decodeStatus(status) ⇒ <code>Object</code>
Decodes status message payload into a status object.  Must be implemented
by subclass.

**Kind**: instance method of [<code>Protocol</code>](#module_net/protocol.Protocol)  

| Param | Type | Description |
| --- | --- | --- |
| status | <code>Object</code> | status message payload |

<a name="module_net/protocol.Protocol+encode"></a>

#### protocol.encode(message, args) ⇒ <code>\*</code>
Encodes message into proper format before sending

**Kind**: instance method of [<code>Protocol</code>](#module_net/protocol.Protocol)  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| message | [<code>Message</code>](#Protocol..Message) | message definition |
| args | <code>\*</code> | message arguments |

<a name="module_net/protocol.Protocol+decode"></a>

#### protocol.decode(message, payload, bound) ⇒ <code>\*</code>
Decodes message payload

**Kind**: instance method of [<code>Protocol</code>](#module_net/protocol.Protocol)  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| message | [<code>Message</code>](#Protocol..Message) | message definition |
| payload | <code>\*</code> | message payload |
| bound | [<code>BoundProtocol</code>](#BoundProtocol) | reference to bound protocol |

<a name="module_net/protocol.Protocol+bind"></a>

#### protocol.bind(peer, sender) ⇒ <code>Promise</code>
Binds this protocol to a given peer using the specified sender to handle
message communication.

**Kind**: instance method of [<code>Protocol</code>](#module_net/protocol.Protocol)  

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>Peer</code> | peer |
| sender | <code>Sender</code> | sender |

<a name="module_net/protocol.RlpxSender"></a>

### net/protocol.RlpxSender
DevP2P/RLPx protocol sender

**Kind**: static class of [<code>net/protocol</code>](#module_net/protocol)  
**Emits**: <code>event:message</code>, <code>event:status</code>  

* [.RlpxSender](#module_net/protocol.RlpxSender)
    * [new RlpxSender(rlpxProtocol)](#new_module_net/protocol.RlpxSender_new)
    * [.sendStatus(status)](#module_net/protocol.RlpxSender+sendStatus)
    * [.sendMessage(code, data)](#module_net/protocol.RlpxSender+sendMessage)

<a name="new_module_net/protocol.RlpxSender_new"></a>

#### new RlpxSender(rlpxProtocol)
Creates a new DevP2P/Rlpx protocol sender


| Param | Type | Description |
| --- | --- | --- |
| rlpxProtocol | <code>Object</code> | protocol object from ethereumjs-devp2p |

<a name="module_net/protocol.RlpxSender+sendStatus"></a>

#### rlpxSender.sendStatus(status)
Send a status to peer

**Kind**: instance method of [<code>RlpxSender</code>](#module_net/protocol.RlpxSender)  

| Param | Type |
| --- | --- |
| status | <code>Object</code> | 

<a name="module_net/protocol.RlpxSender+sendMessage"></a>

#### rlpxSender.sendMessage(code, data)
Send a message to peer

**Kind**: instance method of [<code>RlpxSender</code>](#module_net/protocol.RlpxSender)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>number</code> | message code |
| data | <code>\*</code> | message payload |

<a name="module_net/protocol.Sender"></a>

### net/protocol.Sender
Base class for transport specific message sender/receiver. Subclasses should
emit a message event when the sender receives a new message, and they should
emit a status event when the sender receives a handshake status message

**Kind**: static class of [<code>net/protocol</code>](#module_net/protocol)  
**Emits**: <code>event:message</code>, <code>event:status</code>  

* [.Sender](#module_net/protocol.Sender)
    * [.sendStatus(status)](#module_net/protocol.Sender+sendStatus)
    * [.sendMessage(code, rlpEncodedData)](#module_net/protocol.Sender+sendMessage)

<a name="module_net/protocol.Sender+sendStatus"></a>

#### sender.sendStatus(status)
Send a status to peer

**Kind**: instance method of [<code>Sender</code>](#module_net/protocol.Sender)  
**Access**: protected  

| Param | Type |
| --- | --- |
| status | <code>Object</code> | 

<a name="module_net/protocol.Sender+sendMessage"></a>

#### sender.sendMessage(code, rlpEncodedData)
Send a message to peer

**Kind**: instance method of [<code>Sender</code>](#module_net/protocol.Sender)  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>number</code> | message code |
| rlpEncodedData | <code>Array</code> \| <code>Buffer</code> | rlp encoded message payload |

<a name="module_net/server"></a>

## net/server

* [net/server](#module_net/server)
    * [.Libp2pServer](#module_net/server.Libp2pServer)
        * [new Libp2pServer(options)](#new_module_net/server.Libp2pServer_new)
        * [.name](#module_net/server.Libp2pServer+name) : <code>string</code>
        * [.start()](#module_net/server.Libp2pServer+start) ⇒ <code>Promise</code>
        * [.stop()](#module_net/server.Libp2pServer+stop) ⇒ <code>Promise</code>
        * [.ban(peerId, [maxAge])](#module_net/server.Libp2pServer+ban) ⇒ <code>Promise</code>
        * [.isBanned(peerId)](#module_net/server.Libp2pServer+isBanned) ⇒ <code>Boolean</code>
    * [.RlpxServer](#module_net/server.RlpxServer)
        * [new RlpxServer(options)](#new_module_net/server.RlpxServer_new)
        * [.name](#module_net/server.RlpxServer+name) : <code>string</code>
        * [.start()](#module_net/server.RlpxServer+start) ⇒ <code>Promise</code>
        * [.stop()](#module_net/server.RlpxServer+stop) ⇒ <code>Promise</code>
        * [.ban(peerId, [maxAge])](#module_net/server.RlpxServer+ban) ⇒ <code>Promise</code>
    * [.Server](#module_net/server.Server)
        * [.running](#module_net/server.Server+running) : <code>boolean</code>
        * [.start()](#module_net/server.Server+start) ⇒ <code>Promise</code>
        * [.stop()](#module_net/server.Server+stop) ⇒ <code>Promise</code>
        * [.addProtocols(protocols)](#module_net/server.Server+addProtocols)
        * [.ban(peerId, [maxAge])](#module_net/server.Server+ban) ⇒ <code>Promise</code>

<a name="module_net/server.Libp2pServer"></a>

### net/server.Libp2pServer
Libp2p server

**Kind**: static class of [<code>net/server</code>](#module_net/server)  
**Emits**: <code>event:connected</code>, <code>event:disconnected</code>, <code>event:error</code>  

* [.Libp2pServer](#module_net/server.Libp2pServer)
    * [new Libp2pServer(options)](#new_module_net/server.Libp2pServer_new)
    * [.name](#module_net/server.Libp2pServer+name) : <code>string</code>
    * [.start()](#module_net/server.Libp2pServer+start) ⇒ <code>Promise</code>
    * [.stop()](#module_net/server.Libp2pServer+stop) ⇒ <code>Promise</code>
    * [.ban(peerId, [maxAge])](#module_net/server.Libp2pServer+ban) ⇒ <code>Promise</code>
    * [.isBanned(peerId)](#module_net/server.Libp2pServer+isBanned) ⇒ <code>Boolean</code>

<a name="new_module_net/server.Libp2pServer_new"></a>

#### new Libp2pServer(options)
Create new DevP2P/RLPx server


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| [options.bootnodes] | <code>Array.&lt;Object&gt;</code> |  | list of bootnodes to use for discovery (can be a comma separated string or list) |
| [options.maxPeers] | <code>number</code> | <code>25</code> | maximum peers allowed |
| [options.multiaddrs] | <code>Array.&lt;multiaddr&gt;</code> |  | multiaddrs to listen on (can be a comma separated string or list) |
| [options.key] | <code>Buffer</code> |  | private key to use for server |
| [options.refreshInterval] | <code>number</code> | <code>30000</code> | how often (in ms) to discover new peers |
| [options.logger] | <code>Logger</code> |  | Logger instance |

<a name="module_net/server.Libp2pServer+name"></a>

#### libp2pServer.name : <code>string</code>
Server name

**Kind**: instance property of [<code>Libp2pServer</code>](#module_net/server.Libp2pServer)  
<a name="module_net/server.Libp2pServer+start"></a>

#### libp2pServer.start() ⇒ <code>Promise</code>
Start Libp2p server. Returns a promise that resolves once server has been started.

**Kind**: instance method of [<code>Libp2pServer</code>](#module_net/server.Libp2pServer)  
<a name="module_net/server.Libp2pServer+stop"></a>

#### libp2pServer.stop() ⇒ <code>Promise</code>
Stop Libp2p server. Returns a promise that resolves once server has been stopped.

**Kind**: instance method of [<code>Libp2pServer</code>](#module_net/server.Libp2pServer)  
<a name="module_net/server.Libp2pServer+ban"></a>

#### libp2pServer.ban(peerId, [maxAge]) ⇒ <code>Promise</code>
Ban peer for a specified time

**Kind**: instance method of [<code>Libp2pServer</code>](#module_net/server.Libp2pServer)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| peerId | <code>string</code> |  | id of peer |
| [maxAge] | <code>number</code> | <code>60000</code> | how long to ban peer |

<a name="module_net/server.Libp2pServer+isBanned"></a>

#### libp2pServer.isBanned(peerId) ⇒ <code>Boolean</code>
Check if peer is currently banned

**Kind**: instance method of [<code>Libp2pServer</code>](#module_net/server.Libp2pServer)  
**Returns**: <code>Boolean</code> - true if banned  

| Param | Type | Description |
| --- | --- | --- |
| peerId | <code>string</code> | id of peer |

<a name="module_net/server.RlpxServer"></a>

### net/server.RlpxServer
DevP2P/RLPx server

**Kind**: static class of [<code>net/server</code>](#module_net/server)  
**Emits**: <code>event:connected</code>, <code>event:disconnected</code>, <code>event:error</code>  

* [.RlpxServer](#module_net/server.RlpxServer)
    * [new RlpxServer(options)](#new_module_net/server.RlpxServer_new)
    * [.name](#module_net/server.RlpxServer+name) : <code>string</code>
    * [.start()](#module_net/server.RlpxServer+start) ⇒ <code>Promise</code>
    * [.stop()](#module_net/server.RlpxServer+stop) ⇒ <code>Promise</code>
    * [.ban(peerId, [maxAge])](#module_net/server.RlpxServer+ban) ⇒ <code>Promise</code>

<a name="new_module_net/server.RlpxServer_new"></a>

#### new RlpxServer(options)
Create new DevP2P/RLPx server


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| [options.bootnodes] | <code>Array.&lt;Object&gt;</code> |  | list of bootnodes to use for discovery (can be a comma separated string or list) |
| [options.maxPeers] | <code>number</code> | <code>25</code> | maximum peers allowed |
| [options.port] | <code>number</code> | <code></code> | local port to listen on |
| [options.key] | <code>Buffer</code> |  | private key to use for server |
| [options.clientFilter] | <code>Array.&lt;string&gt;</code> |  | list of supported clients |
| [options.refreshInterval] | <code>number</code> | <code>30000</code> | how often (in ms) to discover new peers |
| [options.logger] | <code>Logger</code> |  | Logger instance |

<a name="module_net/server.RlpxServer+name"></a>

#### rlpxServer.name : <code>string</code>
Server name

**Kind**: instance property of [<code>RlpxServer</code>](#module_net/server.RlpxServer)  
<a name="module_net/server.RlpxServer+start"></a>

#### rlpxServer.start() ⇒ <code>Promise</code>
Start Devp2p/RLPx server. Returns a promise that resolves once server has been started.

**Kind**: instance method of [<code>RlpxServer</code>](#module_net/server.RlpxServer)  
<a name="module_net/server.RlpxServer+stop"></a>

#### rlpxServer.stop() ⇒ <code>Promise</code>
Stop Devp2p/RLPx server. Returns a promise that resolves once server has been stopped.

**Kind**: instance method of [<code>RlpxServer</code>](#module_net/server.RlpxServer)  
<a name="module_net/server.RlpxServer+ban"></a>

#### rlpxServer.ban(peerId, [maxAge]) ⇒ <code>Promise</code>
Ban peer for a specified time

**Kind**: instance method of [<code>RlpxServer</code>](#module_net/server.RlpxServer)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| peerId | <code>string</code> |  | id of peer |
| [maxAge] | <code>number</code> | <code>60000</code> | how long to ban peer |

<a name="module_net/server.Server"></a>

### net/server.Server
Base class for transport specific server implementations.

**Kind**: static class of [<code>net/server</code>](#module_net/server)  

* [.Server](#module_net/server.Server)
    * [.running](#module_net/server.Server+running) : <code>boolean</code>
    * [.start()](#module_net/server.Server+start) ⇒ <code>Promise</code>
    * [.stop()](#module_net/server.Server+stop) ⇒ <code>Promise</code>
    * [.addProtocols(protocols)](#module_net/server.Server+addProtocols)
    * [.ban(peerId, [maxAge])](#module_net/server.Server+ban) ⇒ <code>Promise</code>

<a name="module_net/server.Server+running"></a>

#### server.running : <code>boolean</code>
Check if server is running

**Kind**: instance property of [<code>Server</code>](#module_net/server.Server)  
<a name="module_net/server.Server+start"></a>

#### server.start() ⇒ <code>Promise</code>
Start server. Returns a promise that resolves once server has been started.

**Kind**: instance method of [<code>Server</code>](#module_net/server.Server)  
<a name="module_net/server.Server+stop"></a>

#### server.stop() ⇒ <code>Promise</code>
Stop server. Returns a promise that resolves once server has been stopped.

**Kind**: instance method of [<code>Server</code>](#module_net/server.Server)  
<a name="module_net/server.Server+addProtocols"></a>

#### server.addProtocols(protocols)
Specify which protocols the server must support

**Kind**: instance method of [<code>Server</code>](#module_net/server.Server)  

| Param | Type | Description |
| --- | --- | --- |
| protocols | <code>Array.&lt;Protocol&gt;</code> | protocol classes |

<a name="module_net/server.Server+ban"></a>

#### server.ban(peerId, [maxAge]) ⇒ <code>Promise</code>
Ban peer for a specified time

**Kind**: instance method of [<code>Server</code>](#module_net/server.Server)  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| peerId | <code>string</code> | id of peer |
| [maxAge] | <code>number</code> | how long to ban peer |

<a name="module_rpc"></a>

## rpc

* [rpc](#module_rpc)
    * [.RPCManager](#module_rpc.RPCManager)
        * [.getMethods()](#module_rpc.RPCManager+getMethods) ⇒ <code>Object</code>
    * [.validators](#module_rpc.validators)
        * [.hex(params, index)](#module_rpc.validators.hex)
        * [.blockHash(params, index)](#module_rpc.validators.blockHash)
        * [.bool(params, index)](#module_rpc.validators.bool)
    * [.middleware(method, requiredParamsCount, validators)](#module_rpc.middleware)

<a name="module_rpc.RPCManager"></a>

### rpc.RPCManager
RPC server manager

**Kind**: static class of [<code>rpc</code>](#module_rpc)  
<a name="module_rpc.RPCManager+getMethods"></a>

#### rpcManager.getMethods() ⇒ <code>Object</code>
gets methods for all modules which concat with underscore "_"
e.g. convert getBlockByNumber() in eth module to { eth_getBlockByNumber }

**Kind**: instance method of [<code>RPCManager</code>](#module_rpc.RPCManager)  
**Returns**: <code>Object</code> - methods  
<a name="module_rpc.validators"></a>

### rpc.validators
**Kind**: static property of [<code>rpc</code>](#module_rpc)  

* [.validators](#module_rpc.validators)
    * [.hex(params, index)](#module_rpc.validators.hex)
    * [.blockHash(params, index)](#module_rpc.validators.blockHash)
    * [.bool(params, index)](#module_rpc.validators.bool)

<a name="module_rpc.validators.hex"></a>

#### validators.hex(params, index)
hex validator to ensure has "0x" prefix

**Kind**: static method of [<code>validators</code>](#module_rpc.validators)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Array.&lt;any&gt;</code> | parameters of method |
| index | <code>number</code> | index of parameter |

<a name="module_rpc.validators.blockHash"></a>

#### validators.blockHash(params, index)
hex validator to validate block hash

**Kind**: static method of [<code>validators</code>](#module_rpc.validators)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Array.&lt;any&gt;</code> | parameters of method |
| index | <code>number</code> | index of parameter |

<a name="module_rpc.validators.bool"></a>

#### validators.bool(params, index)
bool validator to check if type is boolean

**Kind**: static method of [<code>validators</code>](#module_rpc.validators)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Array.&lt;any&gt;</code> | parameters of method |
| index | <code>number</code> | index of parameter |

<a name="module_rpc.middleware"></a>

### rpc.middleware(method, requiredParamsCount, validators)
middleware for parameters validation

**Kind**: static method of [<code>rpc</code>](#module_rpc)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>function</code> | function to add middleware |
| requiredParamsCount | <code>number</code> | required parameters count |
| validators | <code>Array.&lt;function()&gt;</code> | array of validator |

<a name="module_service"></a>

## service

* [service](#module_service)
    * [.EthereumService](#module_service.EthereumService)
        * [new EthereumService(options)](#new_module_service.EthereumService_new)
        * [.name](#module_service.EthereumService+name) : <code>string</code>
        * [.protocols()](#module_service.EthereumService+protocols) : <code>Array.&lt;Protocol&gt;</code>
        * [.open()](#module_service.EthereumService+open) ⇒ <code>Promise</code>
        * [.start()](#module_service.EthereumService+start) ⇒ <code>Promise</code>
        * [.stop()](#module_service.EthereumService+stop) ⇒ <code>Promise</code>
    * [.Service](#module_service.Service)
        * [new Service(options)](#new_module_service.Service_new)
        * [.name](#module_service.Service+name) : <code>string</code>
        * [.protocols()](#module_service.Service+protocols) : <code>Array.&lt;Protocol&gt;</code>
        * [.open()](#module_service.Service+open) ⇒ <code>Promise</code>
        * [.start()](#module_service.Service+start) ⇒ <code>Promise</code>
        * [.stop()](#module_service.Service+stop) ⇒ <code>Promise</code>

<a name="module_service.EthereumService"></a>

### service.EthereumService
Ethereum service

**Kind**: static class of [<code>service</code>](#module_service)  

* [.EthereumService](#module_service.EthereumService)
    * [new EthereumService(options)](#new_module_service.EthereumService_new)
    * [.name](#module_service.EthereumService+name) : <code>string</code>
    * [.protocols()](#module_service.EthereumService+protocols) : <code>Array.&lt;Protocol&gt;</code>
    * [.open()](#module_service.EthereumService+open) ⇒ <code>Promise</code>
    * [.start()](#module_service.EthereumService+start) ⇒ <code>Promise</code>
    * [.stop()](#module_service.EthereumService+stop) ⇒ <code>Promise</code>

<a name="new_module_service.EthereumService_new"></a>

#### new EthereumService(options)
Create new ETH service


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.servers | <code>Array.&lt;Server&gt;</code> |  | servers to run service on |
| [options.syncmode] | <code>string</code> | <code>&quot;light&quot;</code> | synchronization mode ('fast' or 'light') |
| [options.lightserv] | <code>boolean</code> | <code>false</code> | serve LES requests |
| [options.common] | <code>Common</code> |  | ethereum network name |
| [options.db] | <code>LevelDB</code> | <code></code> | blockchain database |
| [options.logger] | <code>Logger</code> |  | logger instance |

<a name="module_service.EthereumService+name"></a>

#### ethereumService.name : <code>string</code>
Service name

**Kind**: instance property of [<code>EthereumService</code>](#module_service.EthereumService)  
**Access**: protected  
<a name="module_service.EthereumService+protocols"></a>

#### ethereumService.protocols() : <code>Array.&lt;Protocol&gt;</code>
Returns all protocols required by this service

**Kind**: instance method of [<code>EthereumService</code>](#module_service.EthereumService)  
<a name="module_service.EthereumService+open"></a>

#### ethereumService.open() ⇒ <code>Promise</code>
Open eth service. Must be called before service is started

**Kind**: instance method of [<code>EthereumService</code>](#module_service.EthereumService)  
<a name="module_service.EthereumService+start"></a>

#### ethereumService.start() ⇒ <code>Promise</code>
Starts service and ensures blockchain is synchronized. Returns a promise
that resolves once the service is started and blockchain is in sync.

**Kind**: instance method of [<code>EthereumService</code>](#module_service.EthereumService)  
<a name="module_service.EthereumService+stop"></a>

#### ethereumService.stop() ⇒ <code>Promise</code>
Stop service. Interrupts blockchain synchronization if its in progress.

**Kind**: instance method of [<code>EthereumService</code>](#module_service.EthereumService)  
<a name="module_service.Service"></a>

### service.Service
Base class for all services

**Kind**: static class of [<code>service</code>](#module_service)  

* [.Service](#module_service.Service)
    * [new Service(options)](#new_module_service.Service_new)
    * [.name](#module_service.Service+name) : <code>string</code>
    * [.protocols()](#module_service.Service+protocols) : <code>Array.&lt;Protocol&gt;</code>
    * [.open()](#module_service.Service+open) ⇒ <code>Promise</code>
    * [.start()](#module_service.Service+start) ⇒ <code>Promise</code>
    * [.stop()](#module_service.Service+stop) ⇒ <code>Promise</code>

<a name="new_module_service.Service_new"></a>

#### new Service(options)
Create new service and associated peer pool


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| [options.servers] | <code>Array.&lt;Server&gt;</code> | <code>[]</code> | servers to run service on |
| [options.logger] | <code>Logger</code> |  | logger instance |

<a name="module_service.Service+name"></a>

#### service.name : <code>string</code>
Service name

**Kind**: instance property of [<code>Service</code>](#module_service.Service)  
**Access**: protected  
<a name="module_service.Service+protocols"></a>

#### service.protocols() : <code>Array.&lt;Protocol&gt;</code>
Returns all protocols required by this service

**Kind**: instance method of [<code>Service</code>](#module_service.Service)  
<a name="module_service.Service+open"></a>

#### service.open() ⇒ <code>Promise</code>
Open service. Must be called before service is started

**Kind**: instance method of [<code>Service</code>](#module_service.Service)  
<a name="module_service.Service+start"></a>

#### service.start() ⇒ <code>Promise</code>
Start service

**Kind**: instance method of [<code>Service</code>](#module_service.Service)  
<a name="module_service.Service+stop"></a>

#### service.stop() ⇒ <code>Promise</code>
Start service

**Kind**: instance method of [<code>Service</code>](#module_service.Service)  
<a name="module_sync"></a>

## sync

* [sync](#module_sync)
    * [.FastSynchronizer](#module_sync.FastSynchronizer)
        * [new FastSynchronizer(options)](#new_module_sync.FastSynchronizer_new)
        * [.type](#module_sync.FastSynchronizer+type) ⇒ <code>string</code>
        * [.fetchable()](#module_sync.FastSynchronizer+fetchable) ⇒ <code>boolean</code>
        * [.height(peer)](#module_sync.FastSynchronizer+height) ⇒ <code>Promise</code>
        * [.origin()](#module_sync.FastSynchronizer+origin) ⇒ <code>Promise</code>
        * [.fetch([last])](#module_sync.FastSynchronizer+fetch) ⇒ <code>Promise</code>
        * [.handle(message, peer)](#module_sync.FastSynchronizer+handle) ⇒ <code>Promise</code>
        * [.open()](#module_sync.FastSynchronizer+open) ⇒ <code>Promise</code>
    * [.BlockFetcher](#module_sync.BlockFetcher)
        * [new BlockFetcher(options)](#new_module_sync.BlockFetcher_new)
        * [.before(taskOne, taskTwo)](#module_sync.BlockFetcher+before) ⇒ <code>boolean</code>
        * [.fetch(task, peer)](#module_sync.BlockFetcher+fetch) ⇒ <code>Promise</code>
        * [.process(entry, reply)](#module_sync.BlockFetcher+process)
    * [.Fetcher](#module_sync.Fetcher)
        * [new Fetcher(options)](#new_module_sync.Fetcher_new)
        * [.add(task)](#module_sync.Fetcher+add)
        * [.next()](#module_sync.Fetcher+next)
        * [.handle(reply, peer)](#module_sync.Fetcher+handle)
        * [.error(error, task, peer)](#module_sync.Fetcher+error)
        * [.expire()](#module_sync.Fetcher+expire)
        * [.start()](#module_sync.Fetcher+start) ⇒ <code>Promise</code>
        * [.stop()](#module_sync.Fetcher+stop) ⇒ <code>Promise</code>
        * [.before(taskOne, taskTwo)](#module_sync.Fetcher+before) ⇒ <code>boolean</code>
        * [.fetchable(peer)](#module_sync.Fetcher+fetchable) ⇒ <code>boolean</code>
        * [.fetch(task, peer)](#module_sync.Fetcher+fetch) ⇒ <code>Promise</code>
        * [.process(entry, reply)](#module_sync.Fetcher+process)
    * [.LightSynchronizer](#module_sync.LightSynchronizer)
        * [new LightSynchronizer(options)](#new_module_sync.LightSynchronizer_new)
        * [.type](#module_sync.LightSynchronizer+type) ⇒ <code>string</code>
        * [.fetchable()](#module_sync.LightSynchronizer+fetchable) ⇒ <code>boolean</code>
        * [.origin()](#module_sync.LightSynchronizer+origin) ⇒ <code>Promise</code>
        * [.fetch([last])](#module_sync.LightSynchronizer+fetch) ⇒ <code>Promise</code>
        * [.handle(message, peer)](#module_sync.LightSynchronizer+handle) ⇒ <code>Promise</code>
        * [.open()](#module_sync.LightSynchronizer+open) ⇒ <code>Promise</code>
    * [.HeaderFetcher](#module_sync.HeaderFetcher)
        * [new HeaderFetcher(options)](#new_module_sync.HeaderFetcher_new)
        * [.before(taskOne, taskTwo)](#module_sync.HeaderFetcher+before) ⇒ <code>boolean</code>
        * [.fetch(task, peer)](#module_sync.HeaderFetcher+fetch) ⇒ <code>Promise</code>
        * [.process(entry, reply)](#module_sync.HeaderFetcher+process)
    * [.Synchronizer](#module_sync.Synchronizer)
        * [new Synchronizer(options)](#new_module_sync.Synchronizer_new)
        * [.type](#module_sync.Synchronizer+type) ⇒ <code>string</code>
        * [.open()](#module_sync.Synchronizer+open) ⇒ <code>Promise</code>
        * [.fetchable()](#module_sync.Synchronizer+fetchable) ⇒ <code>boolean</code>
        * [.sync([height])](#module_sync.Synchronizer+sync) ⇒ <code>Promise</code>
        * [.stop()](#module_sync.Synchronizer+stop) ⇒ <code>Promise</code>

<a name="module_sync.FastSynchronizer"></a>

### sync.FastSynchronizer
Implements an ethereum fast sync synchronizer

**Kind**: static class of [<code>sync</code>](#module_sync)  

* [.FastSynchronizer](#module_sync.FastSynchronizer)
    * [new FastSynchronizer(options)](#new_module_sync.FastSynchronizer_new)
    * [.type](#module_sync.FastSynchronizer+type) ⇒ <code>string</code>
    * [.fetchable()](#module_sync.FastSynchronizer+fetchable) ⇒ <code>boolean</code>
    * [.height(peer)](#module_sync.FastSynchronizer+height) ⇒ <code>Promise</code>
    * [.origin()](#module_sync.FastSynchronizer+origin) ⇒ <code>Promise</code>
    * [.fetch([last])](#module_sync.FastSynchronizer+fetch) ⇒ <code>Promise</code>
    * [.handle(message, peer)](#module_sync.FastSynchronizer+handle) ⇒ <code>Promise</code>
    * [.open()](#module_sync.FastSynchronizer+open) ⇒ <code>Promise</code>

<a name="new_module_sync.FastSynchronizer_new"></a>

#### new FastSynchronizer(options)
Create new node


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.pool | <code>PeerPool</code> | peer pool |
| options.chain | <code>Chain</code> | blockchain |
| [options.interval] | <code>number</code> | refresh interval |
| [options.logger] | <code>Logger</code> | Logger instance |

<a name="module_sync.FastSynchronizer+type"></a>

#### fastSynchronizer.type ⇒ <code>string</code>
Returns synchronizer type

**Kind**: instance property of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
**Returns**: <code>string</code> - type  
<a name="module_sync.FastSynchronizer+fetchable"></a>

#### fastSynchronizer.fetchable() ⇒ <code>boolean</code>
Returns true if peer can be used to fetch blocks

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
<a name="module_sync.FastSynchronizer+height"></a>

#### fastSynchronizer.height(peer) ⇒ <code>Promise</code>
Request canonical chain height from peer. Returns a promise that resolves
to the peer's height once it responds with its latest block header.

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  

| Param | Type |
| --- | --- |
| peer | <code>Peer</code> | 

<a name="module_sync.FastSynchronizer+origin"></a>

#### fastSynchronizer.origin() ⇒ <code>Promise</code>
Find an origin peer that contains the highest total difficulty. We will
synchronize to this peer's blockchain. Returns a promise that resolves once
an origin peer is found.

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
**Returns**: <code>Promise</code> - [description]  
<a name="module_sync.FastSynchronizer+fetch"></a>

#### fastSynchronizer.fetch([last]) ⇒ <code>Promise</code>
Fetch all headers from current height up to specified number (last). Returns
a promise that resolves once all headers are downloaded.

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
**Returns**: <code>Promise</code> - Resolves with count of number of headers fetched  

| Param | Type | Description |
| --- | --- | --- |
| [last] | <code>BN</code> | number of last block header to download. If last is not specified, the best height will be used from existing peers. |

<a name="module_sync.FastSynchronizer+handle"></a>

#### fastSynchronizer.handle(message, peer) ⇒ <code>Promise</code>
Handler for incoming requests from connected peers

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | message object |
| peer | <code>Peer</code> | peer |

<a name="module_sync.FastSynchronizer+open"></a>

#### fastSynchronizer.open() ⇒ <code>Promise</code>
Open synchronizer. Must be called before sync() is called

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
<a name="module_sync.BlockFetcher"></a>

### sync.BlockFetcher
Implements an eth/62 based block fetcher

**Kind**: static class of [<code>sync</code>](#module_sync)  

* [.BlockFetcher](#module_sync.BlockFetcher)
    * [new BlockFetcher(options)](#new_module_sync.BlockFetcher_new)
    * [.before(taskOne, taskTwo)](#module_sync.BlockFetcher+before) ⇒ <code>boolean</code>
    * [.fetch(task, peer)](#module_sync.BlockFetcher+fetch) ⇒ <code>Promise</code>
    * [.process(entry, reply)](#module_sync.BlockFetcher+process)

<a name="new_module_sync.BlockFetcher_new"></a>

#### new BlockFetcher(options)
Create new block fetcher


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.pool | <code>PeerPool</code> | peer pool |
| options.sync | <code>Synchronizer</code> | parent synchronizer |
| [options.logger] | <code>Logger</code> | Logger instance |

<a name="module_sync.BlockFetcher+before"></a>

#### blockFetcher.before(taskOne, taskTwo) ⇒ <code>boolean</code>
Prioritizes tasks based on first block number

**Kind**: instance method of [<code>BlockFetcher</code>](#module_sync.BlockFetcher)  
**Returns**: <code>boolean</code> - true if taskOne has a lower first number than taskTwo  

| Param | Type |
| --- | --- |
| taskOne | <code>Object</code> | 
| taskTwo | <code>Object</code> | 

<a name="module_sync.BlockFetcher+fetch"></a>

#### blockFetcher.fetch(task, peer) ⇒ <code>Promise</code>
Fetches blocks for the given task

**Kind**: instance method of [<code>BlockFetcher</code>](#module_sync.BlockFetcher)  
**Returns**: <code>Promise</code> - method must return  

| Param | Type |
| --- | --- |
| task | <code>Object</code> | 
| peer | <code>Peer</code> | 

<a name="module_sync.BlockFetcher+process"></a>

#### blockFetcher.process(entry, reply)
Process fetch reply

**Kind**: instance method of [<code>BlockFetcher</code>](#module_sync.BlockFetcher)  
**Emits**: <code>event:headers</code>  

| Param | Type | Description |
| --- | --- | --- |
| entry | <code>Object</code> | entry object |
| entry.task | <code>Object</code> | fetch task |
| entry.peer | <code>Peer</code> | peer that handled task |
| entry.time | <code>number</code> | time task was generated |
| reply | <code>Object</code> | reply data |

<a name="module_sync.Fetcher"></a>

### sync.Fetcher
Base class for fetchers that retrieve various data from peers. Subclasses must
override the before(), fetch() and process() methods. Tasks can be arbitrary
objects whose structure is defined by subclasses. A priority queue is used to
ensure most important tasks are processed first based on the before() function.

**Kind**: static class of [<code>sync</code>](#module_sync)  

* [.Fetcher](#module_sync.Fetcher)
    * [new Fetcher(options)](#new_module_sync.Fetcher_new)
    * [.add(task)](#module_sync.Fetcher+add)
    * [.next()](#module_sync.Fetcher+next)
    * [.handle(reply, peer)](#module_sync.Fetcher+handle)
    * [.error(error, task, peer)](#module_sync.Fetcher+error)
    * [.expire()](#module_sync.Fetcher+expire)
    * [.start()](#module_sync.Fetcher+start) ⇒ <code>Promise</code>
    * [.stop()](#module_sync.Fetcher+stop) ⇒ <code>Promise</code>
    * [.before(taskOne, taskTwo)](#module_sync.Fetcher+before) ⇒ <code>boolean</code>
    * [.fetchable(peer)](#module_sync.Fetcher+fetchable) ⇒ <code>boolean</code>
    * [.fetch(task, peer)](#module_sync.Fetcher+fetch) ⇒ <code>Promise</code>
    * [.process(entry, reply)](#module_sync.Fetcher+process)

<a name="new_module_sync.Fetcher_new"></a>

#### new Fetcher(options)
Create new fetcher


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.pool | <code>PeerPool</code> | peer pool |
| [options.logger] | <code>Logger</code> | Logger instance |

<a name="module_sync.Fetcher+add"></a>

#### fetcher.add(task)
Add new task to fetcher

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  

| Param | Type |
| --- | --- |
| task | <code>Object</code> | 

<a name="module_sync.Fetcher+next"></a>

#### fetcher.next()
Process next task

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  
<a name="module_sync.Fetcher+handle"></a>

#### fetcher.handle(reply, peer)
Handler for responses from peers. Finds and processes the corresponding
task using the process() method, and resets peer to an idle state.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  

| Param | Type |
| --- | --- |
| reply | <code>Object</code> | 
| peer | <code>Peer</code> | 

<a name="module_sync.Fetcher+error"></a>

#### fetcher.error(error, task, peer)
Handle error

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>Error</code> | error object |
| task | <code>Object</code> | task |
| peer | <code>Peer</code> | peer |

<a name="module_sync.Fetcher+expire"></a>

#### fetcher.expire()
Expires all tasks that have timed out. Peers that take too long to respond
will be banned for 5 minutes. Timeout out tasks will be re-inserted into the
queue.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  
<a name="module_sync.Fetcher+start"></a>

#### fetcher.start() ⇒ <code>Promise</code>
Run the fetcher. Returns a promise that resolves once all tasks are completed.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  
<a name="module_sync.Fetcher+stop"></a>

#### fetcher.stop() ⇒ <code>Promise</code>
Stop the fetcher. Returns a promise that resolves once it is stopped.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  
<a name="module_sync.Fetcher+before"></a>

#### fetcher.before(taskOne, taskTwo) ⇒ <code>boolean</code>
True if taskOne has a higher priority than taskTwo

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  

| Param | Type |
| --- | --- |
| taskOne | <code>Object</code> | 
| taskTwo | <code>Object</code> | 

<a name="module_sync.Fetcher+fetchable"></a>

#### fetcher.fetchable(peer) ⇒ <code>boolean</code>
True if peer can process fetch tasks

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>Peer</code> | candidate peer |

<a name="module_sync.Fetcher+fetch"></a>

#### fetcher.fetch(task, peer) ⇒ <code>Promise</code>
Sends a protocol command to peer for the specified task. Must return a
promise that resolves with the decoded response to the commad.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  

| Param | Type |
| --- | --- |
| task | <code>Object</code> | 
| peer | <code>Peer</code> | 

<a name="module_sync.Fetcher+process"></a>

#### fetcher.process(entry, reply)
Process the reply for the given fetch queue entry

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  

| Param | Type | Description |
| --- | --- | --- |
| entry | <code>Object</code> | entry object |
| entry.task | <code>Object</code> | fetch task |
| entry.peer | <code>Peer</code> | peer that handled task |
| entry.time | <code>number</code> | time task was generated |
| reply | <code>Object</code> | reply data |

<a name="module_sync.LightSynchronizer"></a>

### sync.LightSynchronizer
Implements an ethereum light sync synchronizer

**Kind**: static class of [<code>sync</code>](#module_sync)  

* [.LightSynchronizer](#module_sync.LightSynchronizer)
    * [new LightSynchronizer(options)](#new_module_sync.LightSynchronizer_new)
    * [.type](#module_sync.LightSynchronizer+type) ⇒ <code>string</code>
    * [.fetchable()](#module_sync.LightSynchronizer+fetchable) ⇒ <code>boolean</code>
    * [.origin()](#module_sync.LightSynchronizer+origin) ⇒ <code>Promise</code>
    * [.fetch([last])](#module_sync.LightSynchronizer+fetch) ⇒ <code>Promise</code>
    * [.handle(message, peer)](#module_sync.LightSynchronizer+handle) ⇒ <code>Promise</code>
    * [.open()](#module_sync.LightSynchronizer+open) ⇒ <code>Promise</code>

<a name="new_module_sync.LightSynchronizer_new"></a>

#### new LightSynchronizer(options)
Create new node


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.pool | <code>PeerPool</code> | peer pool |
| options.chain | <code>Chain</code> | blockchain |
| options.flow | <code>FlowControl</code> | flow control manager |
| [options.interval] | <code>number</code> | refresh interval |
| [options.logger] | <code>Logger</code> | Logger instance |

<a name="module_sync.LightSynchronizer+type"></a>

#### lightSynchronizer.type ⇒ <code>string</code>
Returns synchronizer type

**Kind**: instance property of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
**Returns**: <code>string</code> - type  
<a name="module_sync.LightSynchronizer+fetchable"></a>

#### lightSynchronizer.fetchable() ⇒ <code>boolean</code>
Returns true if peer can be used to fetch headers

**Kind**: instance method of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
<a name="module_sync.LightSynchronizer+origin"></a>

#### lightSynchronizer.origin() ⇒ <code>Promise</code>
Find an origin peer that contains the highest total difficulty. We will
synchronize to this peer's blockchain. Returns a promise that resolves once
an origin peer is found.

**Kind**: instance method of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
**Returns**: <code>Promise</code> - Resolves with [ origin peer, height ]  
<a name="module_sync.LightSynchronizer+fetch"></a>

#### lightSynchronizer.fetch([last]) ⇒ <code>Promise</code>
Fetch all headers from current height up to specified number (last). Returns
a promise that resolves once all headers are downloaded.

**Kind**: instance method of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
**Returns**: <code>Promise</code> - Resolves with count of number of headers fetched  

| Param | Type | Description |
| --- | --- | --- |
| [last] | <code>BN</code> | number of last block header to download. If last is not specified, the best height will be used from existing peers. |

<a name="module_sync.LightSynchronizer+handle"></a>

#### lightSynchronizer.handle(message, peer) ⇒ <code>Promise</code>
Handler for incoming requests from connected peers

**Kind**: instance method of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | message object |
| peer | <code>Peer</code> | peer |

<a name="module_sync.LightSynchronizer+open"></a>

#### lightSynchronizer.open() ⇒ <code>Promise</code>
Open synchronizer. Must be called before sync() is called

**Kind**: instance method of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
<a name="module_sync.HeaderFetcher"></a>

### sync.HeaderFetcher
Implements an les/1 based header fetcher

**Kind**: static class of [<code>sync</code>](#module_sync)  

* [.HeaderFetcher](#module_sync.HeaderFetcher)
    * [new HeaderFetcher(options)](#new_module_sync.HeaderFetcher_new)
    * [.before(taskOne, taskTwo)](#module_sync.HeaderFetcher+before) ⇒ <code>boolean</code>
    * [.fetch(task, peer)](#module_sync.HeaderFetcher+fetch) ⇒ <code>Promise</code>
    * [.process(entry, reply)](#module_sync.HeaderFetcher+process)

<a name="new_module_sync.HeaderFetcher_new"></a>

#### new HeaderFetcher(options)
Create new header fetcher


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.pool | <code>PeerPool</code> | peer pool |
| options.flow | <code>FlowControl</code> | flow control manager |
| options.sync | <code>Synchronizer</code> | parent synchronizer |
| [options.logger] | <code>Logger</code> | Logger instance |

<a name="module_sync.HeaderFetcher+before"></a>

#### headerFetcher.before(taskOne, taskTwo) ⇒ <code>boolean</code>
Prioritizes tasks based on first block number

**Kind**: instance method of [<code>HeaderFetcher</code>](#module_sync.HeaderFetcher)  
**Returns**: <code>boolean</code> - true if taskOne has a lower first number than taskTwo  

| Param | Type |
| --- | --- |
| taskOne | <code>Object</code> | 
| taskTwo | <code>Object</code> | 

<a name="module_sync.HeaderFetcher+fetch"></a>

#### headerFetcher.fetch(task, peer) ⇒ <code>Promise</code>
Fetches block headers for the given task

**Kind**: instance method of [<code>HeaderFetcher</code>](#module_sync.HeaderFetcher)  
**Returns**: <code>Promise</code> - method must return  

| Param | Type |
| --- | --- |
| task | <code>Object</code> | 
| peer | <code>Peer</code> | 

<a name="module_sync.HeaderFetcher+process"></a>

#### headerFetcher.process(entry, reply)
Process the getBlockHeaders reply

**Kind**: instance method of [<code>HeaderFetcher</code>](#module_sync.HeaderFetcher)  
**Emits**: <code>event:headers</code>  

| Param | Type | Description |
| --- | --- | --- |
| entry | <code>Object</code> | entry object |
| entry.task | <code>Object</code> | fetch task |
| entry.peer | <code>Peer</code> | peer that handled task |
| entry.time | <code>number</code> | time task was generated |
| reply | <code>Object</code> | reply data |

<a name="module_sync.Synchronizer"></a>

### sync.Synchronizer
Base class for blockchain synchronizers

**Kind**: static class of [<code>sync</code>](#module_sync)  

* [.Synchronizer](#module_sync.Synchronizer)
    * [new Synchronizer(options)](#new_module_sync.Synchronizer_new)
    * [.type](#module_sync.Synchronizer+type) ⇒ <code>string</code>
    * [.open()](#module_sync.Synchronizer+open) ⇒ <code>Promise</code>
    * [.fetchable()](#module_sync.Synchronizer+fetchable) ⇒ <code>boolean</code>
    * [.sync([height])](#module_sync.Synchronizer+sync) ⇒ <code>Promise</code>
    * [.stop()](#module_sync.Synchronizer+stop) ⇒ <code>Promise</code>

<a name="new_module_sync.Synchronizer_new"></a>

#### new Synchronizer(options)
Create new node


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.pool | <code>PeerPool</code> | peer pool |
| options.chain | <code>Chain</code> | blockchain |
| [options.interval] | <code>number</code> | refresh interval |
| [options.logger] | <code>Logger</code> | Logger instance |

<a name="module_sync.Synchronizer+type"></a>

#### synchronizer.type ⇒ <code>string</code>
Returns synchronizer type

**Kind**: instance property of [<code>Synchronizer</code>](#module_sync.Synchronizer)  
**Returns**: <code>string</code> - type  
<a name="module_sync.Synchronizer+open"></a>

#### synchronizer.open() ⇒ <code>Promise</code>
Open synchronizer. Must be called before sync() is called

**Kind**: instance method of [<code>Synchronizer</code>](#module_sync.Synchronizer)  
<a name="module_sync.Synchronizer+fetchable"></a>

#### synchronizer.fetchable() ⇒ <code>boolean</code>
Returns true if peer can be used to fetch data

**Kind**: instance method of [<code>Synchronizer</code>](#module_sync.Synchronizer)  
<a name="module_sync.Synchronizer+sync"></a>

#### synchronizer.sync([height]) ⇒ <code>Promise</code>
Synchronize blockchain. Returns a promise that resolves once chain is
synchronized

**Kind**: instance method of [<code>Synchronizer</code>](#module_sync.Synchronizer)  

| Param | Type | Description |
| --- | --- | --- |
| [height] | <code>BN</code> | number of last block to fetch. Will be discovered from peers if not specified. |

<a name="module_sync.Synchronizer+stop"></a>

#### synchronizer.stop() ⇒ <code>Promise</code>
Stop synchronization. Returns a promise that resolves once its stopped.

**Kind**: instance method of [<code>Synchronizer</code>](#module_sync.Synchronizer)  
<a name="module_util"></a>

## util
<a name="BoundProtocol"></a>

## BoundProtocol ⇐ <code>EventEmitter</code>
Binds a protocol implementation to the specified peer

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [BoundProtocol](#BoundProtocol) ⇐ <code>EventEmitter</code>
    * [new BoundProtocol(options)](#new_BoundProtocol_new)
    * [.send(name, args)](#BoundProtocol+send)
    * [.request(name, args)](#BoundProtocol+request) ⇒ <code>Promise</code>
    * [.addMethods()](#BoundProtocol+addMethods)

<a name="new_BoundProtocol_new"></a>

### new BoundProtocol(options)
Create bound protocol


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.protocol | <code>Protocol</code> | protocol to bind |
| options.peer | <code>Peer</code> | peer that protocol is bound to |
| options.sender | <code>Sender</code> | message sender |

<a name="BoundProtocol+send"></a>

### boundProtocol.send(name, args)
Send message with name and the specified args

**Kind**: instance method of [<code>BoundProtocol</code>](#BoundProtocol)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | message name |
| args | <code>object</code> | message arguments |

<a name="BoundProtocol+request"></a>

### boundProtocol.request(name, args) ⇒ <code>Promise</code>
Returns a promise that resolves with the message payload when a response
to the specified message is received

**Kind**: instance method of [<code>BoundProtocol</code>](#BoundProtocol)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | message to wait for |
| args | <code>object</code> | message arguments |

<a name="BoundProtocol+addMethods"></a>

### boundProtocol.addMethods()
Add a methods to the bound protocol for each protocol message that has a
corresponding response message

**Kind**: instance method of [<code>BoundProtocol</code>](#BoundProtocol)  
<a name="define"></a>

## define(name, path)
Define a library component for lazy loading. Borrowed from
https://github.com/bcoin-org/bcoin/blob/master/lib/bcoin.js

**Kind**: global function  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| path | <code>string</code> | 

<a name="putBlocks"></a>

## putBlocks(blocks) ⇒ <code>Promise</code>
Insert new blocks into blockchain

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| blocks | <code>Array.&lt;Block&gt;</code> | list of blocks to add |

<a name="putHeaders"></a>

## putHeaders(headers) ⇒ <code>Promise</code>
Insert new headers into blockchain

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| headers | <code>Array.&lt;Block.Header&gt;</code> | list of headers to add |

<a name="define"></a>

## define(name, path)
Define a library component for lazy loading. Borrowed from
https://github.com/bcoin-org/bcoin/blob/master/lib/bcoin.js

**Kind**: global function  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| path | <code>string</code> | 

