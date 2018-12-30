## Modules

<dl>
<dt><a href="#module_blockchain">blockchain</a></dt>
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
<dt><a href="#module_sync/fetcher">sync/fetcher</a></dt>
<dd></dd>
<dt><a href="#module_sync">sync</a></dt>
<dd></dd>
<dt><a href="#module_util">util</a></dt>
<dd></dd>
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
        * [.size](#module_net.PeerPool+size) : <code>number</code>
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
    * [.size](#module_net.PeerPool+size) : <code>number</code>
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


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.servers | <code>Array.&lt;Server&gt;</code> |  | servers to aggregate peers from |
| [options.maxPeers] | <code>number</code> | <code>25</code> | maximum peers allowed |
| [options.logger] | <code>Logger</code> |  | logger instance |

<a name="module_net.PeerPool+peers"></a>

#### peerPool.peers : <code>Array.&lt;Peer&gt;</code>
Connected peers

**Kind**: instance property of [<code>PeerPool</code>](#module_net.PeerPool)  
<a name="module_net.PeerPool+size"></a>

#### peerPool.size : <code>number</code>
Number of peers in pool

**Kind**: instance property of [<code>PeerPool</code>](#module_net.PeerPool)  
<a name="module_net.PeerPool+open"></a>

#### peerPool.open() ⇒ <code>Promise</code>
Open pool

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
    * [.BoundProtocol](#module_net/protocol.BoundProtocol)
        * [new BoundProtocol(options)](#new_module_net/protocol.BoundProtocol_new)
        * [.send(name, args)](#module_net/protocol.BoundProtocol+send)
        * [.request(name, args)](#module_net/protocol.BoundProtocol+request) ⇒ <code>Promise</code>
        * [.addMethods()](#module_net/protocol.BoundProtocol+addMethods)
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

<a name="module_net/protocol.BoundProtocol"></a>

### net/protocol.BoundProtocol
Binds a protocol implementation to the specified peer

**Kind**: static class of [<code>net/protocol</code>](#module_net/protocol)  

* [.BoundProtocol](#module_net/protocol.BoundProtocol)
    * [new BoundProtocol(options)](#new_module_net/protocol.BoundProtocol_new)
    * [.send(name, args)](#module_net/protocol.BoundProtocol+send)
    * [.request(name, args)](#module_net/protocol.BoundProtocol+request) ⇒ <code>Promise</code>
    * [.addMethods()](#module_net/protocol.BoundProtocol+addMethods)

<a name="new_module_net/protocol.BoundProtocol_new"></a>

#### new BoundProtocol(options)
Create bound protocol


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.protocol | <code>Protocol</code> | protocol to bind |
| options.peer | <code>Peer</code> | peer that protocol is bound to |
| options.sender | <code>Sender</code> | message sender |

<a name="module_net/protocol.BoundProtocol+send"></a>

#### boundProtocol.send(name, args)
Send message with name and the specified args

**Kind**: instance method of [<code>BoundProtocol</code>](#module_net/protocol.BoundProtocol)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | message name |
| args | <code>object</code> | message arguments |

<a name="module_net/protocol.BoundProtocol+request"></a>

#### boundProtocol.request(name, args) ⇒ <code>Promise</code>
Returns a promise that resolves with the message payload when a response
to the specified message is received

**Kind**: instance method of [<code>BoundProtocol</code>](#module_net/protocol.BoundProtocol)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | message to wait for |
| args | <code>object</code> | message arguments |

<a name="module_net/protocol.BoundProtocol+addMethods"></a>

#### boundProtocol.addMethods()
Add a methods to the bound protocol for each protocol message that has a
corresponding response message

**Kind**: instance method of [<code>BoundProtocol</code>](#module_net/protocol.BoundProtocol)  
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
| bound | <code>BoundProtocol</code> | reference to bound protocol |

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
        * [.running](#module_net/server.Server+running) ⇒ <code>boolean</code>
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
    * [.running](#module_net/server.Server+running) ⇒ <code>boolean</code>
    * [.start()](#module_net/server.Server+start) ⇒ <code>Promise</code>
    * [.stop()](#module_net/server.Server+stop) ⇒ <code>Promise</code>
    * [.addProtocols(protocols)](#module_net/server.Server+addProtocols)
    * [.ban(peerId, [maxAge])](#module_net/server.Server+ban) ⇒ <code>Promise</code>

<a name="module_net/server.Server+running"></a>

#### server.running ⇒ <code>boolean</code>
Check if server is running

**Kind**: instance property of [<code>Server</code>](#module_net/server.Server)  
**Returns**: <code>boolean</code> - true if server is running  
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
        * [.open()](#module_service.EthereumService+open) ⇒ <code>Promise</code>
        * [.start()](#module_service.EthereumService+start) ⇒ <code>Promise</code>
        * [.stop()](#module_service.EthereumService+stop) ⇒ <code>Promise</code>
    * [.FastEthereumService](#module_service.FastEthereumService)
        * [new FastEthereumService(options)](#new_module_service.FastEthereumService_new)
        * [.protocols](#module_service.FastEthereumService+protocols) : <code>Array.&lt;Protocol&gt;</code>
        * [.handle(message, protocol, peer)](#module_service.FastEthereumService+handle) ⇒ <code>Promise</code>
        * [.handleEth(message, peer)](#module_service.FastEthereumService+handleEth) ⇒ <code>Promise</code>
        * [.handleLes(message, peer)](#module_service.FastEthereumService+handleLes) ⇒ <code>Promise</code>
    * [.LightEthereumService](#module_service.LightEthereumService)
        * [new LightEthereumService(options)](#new_module_service.LightEthereumService_new)
        * [.protocols](#module_service.LightEthereumService+protocols) : <code>Array.&lt;Protocol&gt;</code>
        * [.handle(message, protocol, peer)](#module_service.LightEthereumService+handle) ⇒ <code>Promise</code>
    * [.Service](#module_service.Service)
        * [new Service(options)](#new_module_service.Service_new)
        * [.name](#module_service.Service+name) : <code>string</code>
        * [.protocols](#module_service.Service+protocols) : <code>Array.&lt;Protocol&gt;</code>
        * [.open()](#module_service.Service+open) ⇒ <code>Promise</code>
        * [.close()](#module_service.Service+close) ⇒ <code>Promise</code>
        * [.start()](#module_service.Service+start) ⇒ <code>Promise</code>
        * [.stop()](#module_service.Service+stop) ⇒ <code>Promise</code>
        * [.handle(message, protocol, peer)](#module_service.Service+handle) ⇒ <code>Promise</code>

<a name="module_service.EthereumService"></a>

### service.EthereumService
Ethereum service

**Kind**: static class of [<code>service</code>](#module_service)  

* [.EthereumService](#module_service.EthereumService)
    * [new EthereumService(options)](#new_module_service.EthereumService_new)
    * [.name](#module_service.EthereumService+name) : <code>string</code>
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
| [options.chain] | <code>Chain</code> |  | blockchain |
| [options.db] | <code>LevelDB</code> | <code></code> | blockchain database |
| [options.common] | <code>Common</code> |  | ethereum network name |
| [options.minPeers] | <code>number</code> | <code>3</code> | number of peers needed before syncing |
| [options.maxPeers] | <code>number</code> | <code>25</code> | maximum peers allowed |
| [options.timeout] | <code>number</code> |  | protocol timeout |
| [options.interval] | <code>number</code> |  | sync retry interval |
| [options.logger] | <code>Logger</code> |  | logger instance |

<a name="module_service.EthereumService+name"></a>

#### ethereumService.name : <code>string</code>
Service name

**Kind**: instance property of [<code>EthereumService</code>](#module_service.EthereumService)  
**Access**: protected  
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
<a name="module_service.FastEthereumService"></a>

### service.FastEthereumService
Ethereum service

**Kind**: static class of [<code>service</code>](#module_service)  

* [.FastEthereumService](#module_service.FastEthereumService)
    * [new FastEthereumService(options)](#new_module_service.FastEthereumService_new)
    * [.protocols](#module_service.FastEthereumService+protocols) : <code>Array.&lt;Protocol&gt;</code>
    * [.handle(message, protocol, peer)](#module_service.FastEthereumService+handle) ⇒ <code>Promise</code>
    * [.handleEth(message, peer)](#module_service.FastEthereumService+handleEth) ⇒ <code>Promise</code>
    * [.handleLes(message, peer)](#module_service.FastEthereumService+handleLes) ⇒ <code>Promise</code>

<a name="new_module_service.FastEthereumService_new"></a>

#### new FastEthereumService(options)
Create new ETH service


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.servers | <code>Array.&lt;Server&gt;</code> |  | servers to run service on |
| [options.lightserv] | <code>boolean</code> | <code>false</code> | serve LES requests |
| [options.chain] | <code>Chain</code> |  | blockchain |
| [options.common] | <code>Common</code> |  | ethereum network name |
| [options.minPeers] | <code>number</code> | <code>3</code> | number of peers needed before syncing |
| [options.maxPeers] | <code>number</code> | <code>25</code> | maximum peers allowed |
| [options.interval] | <code>number</code> |  | sync retry interval |
| [options.logger] | <code>Logger</code> |  | logger instance |

<a name="module_service.FastEthereumService+protocols"></a>

#### fastEthereumService.protocols : <code>Array.&lt;Protocol&gt;</code>
Returns all protocols required by this service

**Kind**: instance property of [<code>FastEthereumService</code>](#module_service.FastEthereumService)  
<a name="module_service.FastEthereumService+handle"></a>

#### fastEthereumService.handle(message, protocol, peer) ⇒ <code>Promise</code>
Handles incoming message from connected peer

**Kind**: instance method of [<code>FastEthereumService</code>](#module_service.FastEthereumService)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | message object |
| protocol | <code>string</code> | protocol name |
| peer | <code>Peer</code> | peer |

<a name="module_service.FastEthereumService+handleEth"></a>

#### fastEthereumService.handleEth(message, peer) ⇒ <code>Promise</code>
Handles incoming ETH message from connected peer

**Kind**: instance method of [<code>FastEthereumService</code>](#module_service.FastEthereumService)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | message object |
| peer | <code>Peer</code> | peer |

<a name="module_service.FastEthereumService+handleLes"></a>

#### fastEthereumService.handleLes(message, peer) ⇒ <code>Promise</code>
Handles incoming LES message from connected peer

**Kind**: instance method of [<code>FastEthereumService</code>](#module_service.FastEthereumService)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | message object |
| peer | <code>Peer</code> | peer |

<a name="module_service.LightEthereumService"></a>

### service.LightEthereumService
Ethereum service

**Kind**: static class of [<code>service</code>](#module_service)  

* [.LightEthereumService](#module_service.LightEthereumService)
    * [new LightEthereumService(options)](#new_module_service.LightEthereumService_new)
    * [.protocols](#module_service.LightEthereumService+protocols) : <code>Array.&lt;Protocol&gt;</code>
    * [.handle(message, protocol, peer)](#module_service.LightEthereumService+handle) ⇒ <code>Promise</code>

<a name="new_module_service.LightEthereumService_new"></a>

#### new LightEthereumService(options)
Create new ETH service


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.servers | <code>Array.&lt;Server&gt;</code> |  | servers to run service on |
| [options.chain] | <code>Chain</code> |  | blockchain |
| [options.common] | <code>Common</code> |  | ethereum network name |
| [options.minPeers] | <code>number</code> | <code>3</code> | number of peers needed before syncing |
| [options.maxPeers] | <code>number</code> | <code>25</code> | maximum peers allowed |
| [options.interval] | <code>number</code> |  | sync retry interval |
| [options.logger] | <code>Logger</code> |  | logger instance |

<a name="module_service.LightEthereumService+protocols"></a>

#### lightEthereumService.protocols : <code>Array.&lt;Protocol&gt;</code>
Returns all protocols required by this service

**Kind**: instance property of [<code>LightEthereumService</code>](#module_service.LightEthereumService)  
<a name="module_service.LightEthereumService+handle"></a>

#### lightEthereumService.handle(message, protocol, peer) ⇒ <code>Promise</code>
Handles incoming message from connected peer

**Kind**: instance method of [<code>LightEthereumService</code>](#module_service.LightEthereumService)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | message object |
| protocol | <code>string</code> | protocol name |
| peer | <code>Peer</code> | peer |

<a name="module_service.Service"></a>

### service.Service
Base class for all services

**Kind**: static class of [<code>service</code>](#module_service)  

* [.Service](#module_service.Service)
    * [new Service(options)](#new_module_service.Service_new)
    * [.name](#module_service.Service+name) : <code>string</code>
    * [.protocols](#module_service.Service+protocols) : <code>Array.&lt;Protocol&gt;</code>
    * [.open()](#module_service.Service+open) ⇒ <code>Promise</code>
    * [.close()](#module_service.Service+close) ⇒ <code>Promise</code>
    * [.start()](#module_service.Service+start) ⇒ <code>Promise</code>
    * [.stop()](#module_service.Service+stop) ⇒ <code>Promise</code>
    * [.handle(message, protocol, peer)](#module_service.Service+handle) ⇒ <code>Promise</code>

<a name="new_module_service.Service_new"></a>

#### new Service(options)
Create new service and associated peer pool


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| [options.servers] | <code>Array.&lt;Server&gt;</code> | <code>[]</code> | servers to run service on |
| [options.maxPeers] | <code>number</code> | <code>25</code> | maximum peers allowed |
| [options.logger] | <code>Logger</code> |  | logger instance |

<a name="module_service.Service+name"></a>

#### service.name : <code>string</code>
Service name

**Kind**: instance property of [<code>Service</code>](#module_service.Service)  
**Access**: protected  
<a name="module_service.Service+protocols"></a>

#### service.protocols : <code>Array.&lt;Protocol&gt;</code>
Returns all protocols required by this service

**Kind**: instance property of [<code>Service</code>](#module_service.Service)  
<a name="module_service.Service+open"></a>

#### service.open() ⇒ <code>Promise</code>
Open service. Must be called before service is running

**Kind**: instance method of [<code>Service</code>](#module_service.Service)  
<a name="module_service.Service+close"></a>

#### service.close() ⇒ <code>Promise</code>
Close service.

**Kind**: instance method of [<code>Service</code>](#module_service.Service)  
<a name="module_service.Service+start"></a>

#### service.start() ⇒ <code>Promise</code>
Start service

**Kind**: instance method of [<code>Service</code>](#module_service.Service)  
<a name="module_service.Service+stop"></a>

#### service.stop() ⇒ <code>Promise</code>
Start service

**Kind**: instance method of [<code>Service</code>](#module_service.Service)  
<a name="module_service.Service+handle"></a>

#### service.handle(message, protocol, peer) ⇒ <code>Promise</code>
Handles incoming request from connected peer

**Kind**: instance method of [<code>Service</code>](#module_service.Service)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | message object |
| protocol | <code>string</code> | protocol name |
| peer | <code>Peer</code> | peer |

<a name="module_sync/fetcher"></a>

## sync/fetcher

* [sync/fetcher](#module_sync/fetcher)
    * [.BlockFetcher](#module_sync/fetcher.BlockFetcher)
        * [new BlockFetcher(options)](#new_module_sync/fetcher.BlockFetcher_new)
        * [.tasks()](#module_sync/fetcher.BlockFetcher+tasks) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.request(job)](#module_sync/fetcher.BlockFetcher+request) ⇒ <code>Promise</code>
        * [.process(job, result)](#module_sync/fetcher.BlockFetcher+process) ⇒ <code>\*</code>
        * [.store(blocks)](#module_sync/fetcher.BlockFetcher+store) ⇒ <code>Promise</code>
        * [.peer(job)](#module_sync/fetcher.BlockFetcher+peer) ⇒ <code>Peer</code>
    * [.Fetcher](#module_sync/fetcher.Fetcher)
        * [new Fetcher(options)](#new_module_sync/fetcher.Fetcher_new)
        * [.tasks()](#module_sync/fetcher.Fetcher+tasks) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.enqueue(job)](#module_sync/fetcher.Fetcher+enqueue)
        * [.dequeue()](#module_sync/fetcher.Fetcher+dequeue)
        * [._read()](#module_sync/fetcher.Fetcher+_read)
        * [.next()](#module_sync/fetcher.Fetcher+next)
        * [.error(error, task, peer)](#module_sync/fetcher.Fetcher+error)
        * [.write()](#module_sync/fetcher.Fetcher+write)
        * [.fetch()](#module_sync/fetcher.Fetcher+fetch) ⇒ <code>Promise</code>
        * [.peer(job)](#module_sync/fetcher.Fetcher+peer) ⇒ <code>Peer</code>
        * [.request(job)](#module_sync/fetcher.Fetcher+request) ⇒ <code>Promise</code>
        * [.process(job, peer, reply)](#module_sync/fetcher.Fetcher+process)
        * [.expire()](#module_sync/fetcher.Fetcher+expire)
        * [.store(result)](#module_sync/fetcher.Fetcher+store) ⇒ <code>Promise</code>
    * [.HeaderFetcher](#module_sync/fetcher.HeaderFetcher)
        * [new HeaderFetcher(options)](#new_module_sync/fetcher.HeaderFetcher_new)
        * [.request(job)](#module_sync/fetcher.HeaderFetcher+request) ⇒ <code>Promise</code>
        * [.process(job, result)](#module_sync/fetcher.HeaderFetcher+process) ⇒ <code>\*</code>
        * [.store(headers)](#module_sync/fetcher.HeaderFetcher+store) ⇒ <code>Promise</code>
        * [.peer(job)](#module_sync/fetcher.HeaderFetcher+peer) ⇒ <code>Peer</code>

<a name="module_sync/fetcher.BlockFetcher"></a>

### sync/fetcher.BlockFetcher
Implements an eth/62 based block fetcher

**Kind**: static class of [<code>sync/fetcher</code>](#module_sync/fetcher)  

* [.BlockFetcher](#module_sync/fetcher.BlockFetcher)
    * [new BlockFetcher(options)](#new_module_sync/fetcher.BlockFetcher_new)
    * [.tasks()](#module_sync/fetcher.BlockFetcher+tasks) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.request(job)](#module_sync/fetcher.BlockFetcher+request) ⇒ <code>Promise</code>
    * [.process(job, result)](#module_sync/fetcher.BlockFetcher+process) ⇒ <code>\*</code>
    * [.store(blocks)](#module_sync/fetcher.BlockFetcher+store) ⇒ <code>Promise</code>
    * [.peer(job)](#module_sync/fetcher.BlockFetcher+peer) ⇒ <code>Peer</code>

<a name="new_module_sync/fetcher.BlockFetcher_new"></a>

#### new BlockFetcher(options)
Create new block fetcher


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.pool | <code>PeerPool</code> |  | peer pool |
| options.chain | <code>Chain</code> |  | blockchain |
| options.first | <code>BN</code> |  | block number to start fetching from |
| options.count | <code>BN</code> |  | how many blocks to fetch |
| [options.timeout] | <code>number</code> |  | fetch task timeout |
| [options.banTime] | <code>number</code> |  | how long to ban misbehaving peers |
| [options.interval] | <code>number</code> |  | retry interval |
| [options.maxPerRequest] | <code>number</code> | <code>128</code> | max items per request |
| [options.logger] | <code>Logger</code> |  | Logger instance |

<a name="module_sync/fetcher.BlockFetcher+tasks"></a>

#### blockFetcher.tasks() ⇒ <code>Array.&lt;Object&gt;</code>
Generate list of tasks to fetch

**Kind**: instance method of [<code>BlockFetcher</code>](#module_sync/fetcher.BlockFetcher)  
**Returns**: <code>Array.&lt;Object&gt;</code> - tasks  
<a name="module_sync/fetcher.BlockFetcher+request"></a>

#### blockFetcher.request(job) ⇒ <code>Promise</code>
Requests blocks associated with this job

**Kind**: instance method of [<code>BlockFetcher</code>](#module_sync/fetcher.BlockFetcher)  

| Param | Type |
| --- | --- |
| job | <code>Object</code> | 

<a name="module_sync/fetcher.BlockFetcher+process"></a>

#### blockFetcher.process(job, result) ⇒ <code>\*</code>
Process fetch result

**Kind**: instance method of [<code>BlockFetcher</code>](#module_sync/fetcher.BlockFetcher)  
**Returns**: <code>\*</code> - results of processing job or undefined if job not finished  

| Param | Type | Description |
| --- | --- | --- |
| job | <code>Object</code> | fetch job |
| result | <code>Object</code> | fetch result |

<a name="module_sync/fetcher.BlockFetcher+store"></a>

#### blockFetcher.store(blocks) ⇒ <code>Promise</code>
Store fetch result. Resolves once store operation is complete.

**Kind**: instance method of [<code>BlockFetcher</code>](#module_sync/fetcher.BlockFetcher)  

| Param | Type | Description |
| --- | --- | --- |
| blocks | <code>Array.&lt;Block&gt;</code> | fetch result |

<a name="module_sync/fetcher.BlockFetcher+peer"></a>

#### blockFetcher.peer(job) ⇒ <code>Peer</code>
Returns a peer that can process the given job

**Kind**: instance method of [<code>BlockFetcher</code>](#module_sync/fetcher.BlockFetcher)  

| Param | Type | Description |
| --- | --- | --- |
| job | <code>Object</code> | job |

<a name="module_sync/fetcher.Fetcher"></a>

### sync/fetcher.Fetcher
Base class for fetchers that retrieve various data from peers. Subclasses must
request() and process() methods. Tasks can be arbitrary objects whose structure
is defined by subclasses. A priority queue is used to ensure tasks are fetched
inorder.

**Kind**: static class of [<code>sync/fetcher</code>](#module_sync/fetcher)  

* [.Fetcher](#module_sync/fetcher.Fetcher)
    * [new Fetcher(options)](#new_module_sync/fetcher.Fetcher_new)
    * [.tasks()](#module_sync/fetcher.Fetcher+tasks) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.enqueue(job)](#module_sync/fetcher.Fetcher+enqueue)
    * [.dequeue()](#module_sync/fetcher.Fetcher+dequeue)
    * [._read()](#module_sync/fetcher.Fetcher+_read)
    * [.next()](#module_sync/fetcher.Fetcher+next)
    * [.error(error, task, peer)](#module_sync/fetcher.Fetcher+error)
    * [.write()](#module_sync/fetcher.Fetcher+write)
    * [.fetch()](#module_sync/fetcher.Fetcher+fetch) ⇒ <code>Promise</code>
    * [.peer(job)](#module_sync/fetcher.Fetcher+peer) ⇒ <code>Peer</code>
    * [.request(job)](#module_sync/fetcher.Fetcher+request) ⇒ <code>Promise</code>
    * [.process(job, peer, reply)](#module_sync/fetcher.Fetcher+process)
    * [.expire()](#module_sync/fetcher.Fetcher+expire)
    * [.store(result)](#module_sync/fetcher.Fetcher+store) ⇒ <code>Promise</code>

<a name="new_module_sync/fetcher.Fetcher_new"></a>

#### new Fetcher(options)
Create new fetcher


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.pool | <code>PeerPool</code> |  | peer pool |
| [options.timeout] | <code>number</code> |  | fetch task timeout |
| [options.banTime] | <code>number</code> |  | how long to ban misbehaving peers |
| [options.maxQueue] | <code>number</code> |  | max write queue size |
| [options.maxPerRequest] | <code>number</code> | <code>128</code> | max items per request |
| [options.interval] | <code>number</code> |  | retry interval |
| [options.logger] | <code>Logger</code> |  | Logger instance |

<a name="module_sync/fetcher.Fetcher+tasks"></a>

#### fetcher.tasks() ⇒ <code>Array.&lt;Object&gt;</code>
Generate list of tasks to fetch

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  
**Returns**: <code>Array.&lt;Object&gt;</code> - tasks  
<a name="module_sync/fetcher.Fetcher+enqueue"></a>

#### fetcher.enqueue(job)
Enqueue job

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  

| Param | Type |
| --- | --- |
| job | <code>Object</code> | 

<a name="module_sync/fetcher.Fetcher+dequeue"></a>

#### fetcher.dequeue()
Dequeue all done tasks that completed in order

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  
<a name="module_sync/fetcher.Fetcher+_read"></a>

#### fetcher._read()
Implements Readable._read() by pushing completed tasks to the read queue

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  
<a name="module_sync/fetcher.Fetcher+next"></a>

#### fetcher.next()
Process next task

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  
<a name="module_sync/fetcher.Fetcher+error"></a>

#### fetcher.error(error, task, peer)
Handle error

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>Error</code> | error object |
| task | <code>Object</code> | task |
| peer | <code>Peer</code> | peer |

<a name="module_sync/fetcher.Fetcher+write"></a>

#### fetcher.write()
Setup writer pipe and start writing fetch results. A pipe is used in order
to support backpressure from storing results.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  
<a name="module_sync/fetcher.Fetcher+fetch"></a>

#### fetcher.fetch() ⇒ <code>Promise</code>
Run the fetcher. Returns a promise that resolves once all tasks are completed.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  
<a name="module_sync/fetcher.Fetcher+peer"></a>

#### fetcher.peer(job) ⇒ <code>Peer</code>
Returns a peer that can process the given job

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  

| Param | Type | Description |
| --- | --- | --- |
| job | <code>Object</code> | job |

<a name="module_sync/fetcher.Fetcher+request"></a>

#### fetcher.request(job) ⇒ <code>Promise</code>
Request results from peer for the given job. Resolves with the raw result.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  

| Param | Type |
| --- | --- |
| job | <code>Object</code> | 

<a name="module_sync/fetcher.Fetcher+process"></a>

#### fetcher.process(job, peer, reply)
Process the reply for the given job

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  

| Param | Type | Description |
| --- | --- | --- |
| job | <code>Object</code> | fetch job |
| peer | <code>Peer</code> | peer that handled task |
| reply | <code>Object</code> | reply data |

<a name="module_sync/fetcher.Fetcher+expire"></a>

#### fetcher.expire()
Expire job that has timed out and ban associated peer. Timed out tasks will
be re-inserted into the queue.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  
<a name="module_sync/fetcher.Fetcher+store"></a>

#### fetcher.store(result) ⇒ <code>Promise</code>
Store fetch result. Resolves once store operation is complete.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync/fetcher.Fetcher)  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>Object</code> | fetch result |

<a name="module_sync/fetcher.HeaderFetcher"></a>

### sync/fetcher.HeaderFetcher
Implements an les/1 based header fetcher

**Kind**: static class of [<code>sync/fetcher</code>](#module_sync/fetcher)  

* [.HeaderFetcher](#module_sync/fetcher.HeaderFetcher)
    * [new HeaderFetcher(options)](#new_module_sync/fetcher.HeaderFetcher_new)
    * [.request(job)](#module_sync/fetcher.HeaderFetcher+request) ⇒ <code>Promise</code>
    * [.process(job, result)](#module_sync/fetcher.HeaderFetcher+process) ⇒ <code>\*</code>
    * [.store(headers)](#module_sync/fetcher.HeaderFetcher+store) ⇒ <code>Promise</code>
    * [.peer(job)](#module_sync/fetcher.HeaderFetcher+peer) ⇒ <code>Peer</code>

<a name="new_module_sync/fetcher.HeaderFetcher_new"></a>

#### new HeaderFetcher(options)
Create new header fetcher


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.pool | <code>PeerPool</code> |  | peer pool |
| options.first | <code>BN</code> |  | header number to start fetching from |
| options.count | <code>BN</code> |  | how many headers to fetch |
| options.flow | <code>FlowControl</code> |  | flow control manager |
| [options.timeout] | <code>number</code> |  | fetch task timeout |
| [options.banTime] | <code>number</code> |  | how long to ban misbehaving peers |
| [options.interval] | <code>number</code> |  | retry interval |
| [options.maxPerRequest] | <code>number</code> | <code>192</code> | max items per request |
| [options.logger] | <code>Logger</code> |  | Logger instance |

<a name="module_sync/fetcher.HeaderFetcher+request"></a>

#### headerFetcher.request(job) ⇒ <code>Promise</code>
Requests block headers for the given task

**Kind**: instance method of [<code>HeaderFetcher</code>](#module_sync/fetcher.HeaderFetcher)  

| Param | Type |
| --- | --- |
| job | <code>Object</code> | 

<a name="module_sync/fetcher.HeaderFetcher+process"></a>

#### headerFetcher.process(job, result) ⇒ <code>\*</code>
Process fetch result

**Kind**: instance method of [<code>HeaderFetcher</code>](#module_sync/fetcher.HeaderFetcher)  
**Returns**: <code>\*</code> - results of processing job or undefined if job not finished  

| Param | Type | Description |
| --- | --- | --- |
| job | <code>Object</code> | fetch job |
| result | <code>Object</code> | fetch result |

<a name="module_sync/fetcher.HeaderFetcher+store"></a>

#### headerFetcher.store(headers) ⇒ <code>Promise</code>
Store fetch result. Resolves once store operation is complete.

**Kind**: instance method of [<code>HeaderFetcher</code>](#module_sync/fetcher.HeaderFetcher)  

| Param | Type | Description |
| --- | --- | --- |
| headers | <code>Array.&lt;Header&gt;</code> | fetch result |

<a name="module_sync/fetcher.HeaderFetcher+peer"></a>

#### headerFetcher.peer(job) ⇒ <code>Peer</code>
Returns a peer that can process the given job

**Kind**: instance method of [<code>HeaderFetcher</code>](#module_sync/fetcher.HeaderFetcher)  

| Param | Type | Description |
| --- | --- | --- |
| job | <code>Object</code> | job |

<a name="module_sync"></a>

## sync

* [sync](#module_sync)
    * [.FastSynchronizer](#module_sync.FastSynchronizer)
        * [.type](#module_sync.FastSynchronizer+type) ⇒ <code>string</code>
        * [.syncable()](#module_sync.FastSynchronizer+syncable) ⇒ <code>boolean</code>
        * [.best(min)](#module_sync.FastSynchronizer+best) ⇒ <code>Peer</code>
        * [.latest()](#module_sync.FastSynchronizer+latest) ⇒ <code>Promise</code>
        * [.syncWithPeer(peer)](#module_sync.FastSynchronizer+syncWithPeer) ⇒ <code>Promise</code>
        * [.sync()](#module_sync.FastSynchronizer+sync) ⇒ <code>Promise</code>
        * [.announced(announcements, peer)](#module_sync.FastSynchronizer+announced) ⇒ <code>Promise</code>
        * [.open()](#module_sync.FastSynchronizer+open) ⇒ <code>Promise</code>
        * [.stop()](#module_sync.FastSynchronizer+stop) ⇒ <code>Promise</code>
    * [.LightSynchronizer](#module_sync.LightSynchronizer)
        * [.type](#module_sync.LightSynchronizer+type) ⇒ <code>string</code>
        * [.syncable()](#module_sync.LightSynchronizer+syncable) ⇒ <code>boolean</code>
        * [.best()](#module_sync.LightSynchronizer+best) ⇒ <code>Peer</code>
        * [.syncWithPeer(peer)](#module_sync.LightSynchronizer+syncWithPeer) ⇒ <code>Promise</code>
        * [.sync()](#module_sync.LightSynchronizer+sync) ⇒ <code>Promise</code>
        * [.open()](#module_sync.LightSynchronizer+open) ⇒ <code>Promise</code>
        * [.stop()](#module_sync.LightSynchronizer+stop) ⇒ <code>Promise</code>
    * [.Synchronizer](#module_sync.Synchronizer)
        * [new Synchronizer(options)](#new_module_sync.Synchronizer_new)
        * [.type](#module_sync.Synchronizer+type) ⇒ <code>string</code>
        * [.open()](#module_sync.Synchronizer+open) ⇒ <code>Promise</code>
        * [.syncable()](#module_sync.Synchronizer+syncable) ⇒ <code>boolean</code>
        * [.start()](#module_sync.Synchronizer+start) ⇒ <code>Promise</code>
        * [.stop()](#module_sync.Synchronizer+stop) ⇒ <code>Promise</code>

<a name="module_sync.FastSynchronizer"></a>

### sync.FastSynchronizer
Implements an ethereum fast sync synchronizer

**Kind**: static class of [<code>sync</code>](#module_sync)  

* [.FastSynchronizer](#module_sync.FastSynchronizer)
    * [.type](#module_sync.FastSynchronizer+type) ⇒ <code>string</code>
    * [.syncable()](#module_sync.FastSynchronizer+syncable) ⇒ <code>boolean</code>
    * [.best(min)](#module_sync.FastSynchronizer+best) ⇒ <code>Peer</code>
    * [.latest()](#module_sync.FastSynchronizer+latest) ⇒ <code>Promise</code>
    * [.syncWithPeer(peer)](#module_sync.FastSynchronizer+syncWithPeer) ⇒ <code>Promise</code>
    * [.sync()](#module_sync.FastSynchronizer+sync) ⇒ <code>Promise</code>
    * [.announced(announcements, peer)](#module_sync.FastSynchronizer+announced) ⇒ <code>Promise</code>
    * [.open()](#module_sync.FastSynchronizer+open) ⇒ <code>Promise</code>
    * [.stop()](#module_sync.FastSynchronizer+stop) ⇒ <code>Promise</code>

<a name="module_sync.FastSynchronizer+type"></a>

#### fastSynchronizer.type ⇒ <code>string</code>
Returns synchronizer type

**Kind**: instance property of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
**Returns**: <code>string</code> - type  
<a name="module_sync.FastSynchronizer+syncable"></a>

#### fastSynchronizer.syncable() ⇒ <code>boolean</code>
Returns true if peer can be used for syncing

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
<a name="module_sync.FastSynchronizer+best"></a>

#### fastSynchronizer.best(min) ⇒ <code>Peer</code>
Finds the best peer to sync with. We will synchronize to this peer's
blockchain. Returns null if no valid peer is found

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  

| Param | Type | Description |
| --- | --- | --- |
| min | <code>number</code> | minimum numbers of peers to search |

<a name="module_sync.FastSynchronizer+latest"></a>

#### fastSynchronizer.latest() ⇒ <code>Promise</code>
Get latest header of peer

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
**Returns**: <code>Promise</code> - Resolves with header  
<a name="module_sync.FastSynchronizer+syncWithPeer"></a>

#### fastSynchronizer.syncWithPeer(peer) ⇒ <code>Promise</code>
Sync all blocks and state from peer starting from current height.

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
**Returns**: <code>Promise</code> - Resolves when sync completed  

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>Peer</code> | remote peer to sync with |

<a name="module_sync.FastSynchronizer+sync"></a>

#### fastSynchronizer.sync() ⇒ <code>Promise</code>
Fetch all blocks from current height up to highest found amongst peers and
fetch entire recent state trie

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
**Returns**: <code>Promise</code> - Resolves with true if sync successful  
<a name="module_sync.FastSynchronizer+announced"></a>

#### fastSynchronizer.announced(announcements, peer) ⇒ <code>Promise</code>
Chain was updated

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  

| Param | Type | Description |
| --- | --- | --- |
| announcements | <code>Array.&lt;Object&gt;</code> | new block hash announcements |
| peer | <code>Peer</code> | peer |

<a name="module_sync.FastSynchronizer+open"></a>

#### fastSynchronizer.open() ⇒ <code>Promise</code>
Open synchronizer. Must be called before sync() is called

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
<a name="module_sync.FastSynchronizer+stop"></a>

#### fastSynchronizer.stop() ⇒ <code>Promise</code>
Stop synchronization. Returns a promise that resolves once its stopped.

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
<a name="module_sync.LightSynchronizer"></a>

### sync.LightSynchronizer
Implements an ethereum light sync synchronizer

**Kind**: static class of [<code>sync</code>](#module_sync)  

* [.LightSynchronizer](#module_sync.LightSynchronizer)
    * [.type](#module_sync.LightSynchronizer+type) ⇒ <code>string</code>
    * [.syncable()](#module_sync.LightSynchronizer+syncable) ⇒ <code>boolean</code>
    * [.best()](#module_sync.LightSynchronizer+best) ⇒ <code>Peer</code>
    * [.syncWithPeer(peer)](#module_sync.LightSynchronizer+syncWithPeer) ⇒ <code>Promise</code>
    * [.sync()](#module_sync.LightSynchronizer+sync) ⇒ <code>Promise</code>
    * [.open()](#module_sync.LightSynchronizer+open) ⇒ <code>Promise</code>
    * [.stop()](#module_sync.LightSynchronizer+stop) ⇒ <code>Promise</code>

<a name="module_sync.LightSynchronizer+type"></a>

#### lightSynchronizer.type ⇒ <code>string</code>
Returns synchronizer type

**Kind**: instance property of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
**Returns**: <code>string</code> - type  
<a name="module_sync.LightSynchronizer+syncable"></a>

#### lightSynchronizer.syncable() ⇒ <code>boolean</code>
Returns true if peer can be used for syncing

**Kind**: instance method of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
<a name="module_sync.LightSynchronizer+best"></a>

#### lightSynchronizer.best() ⇒ <code>Peer</code>
Finds the best peer to sync with. We will synchronize to this peer's
blockchain. Returns null if no valid peer is found

**Kind**: instance method of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
<a name="module_sync.LightSynchronizer+syncWithPeer"></a>

#### lightSynchronizer.syncWithPeer(peer) ⇒ <code>Promise</code>
Sync all headers and state from peer starting from current height.

**Kind**: instance method of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
**Returns**: <code>Promise</code> - Resolves when sync completed  

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>Peer</code> | remote peer to sync with |

<a name="module_sync.LightSynchronizer+sync"></a>

#### lightSynchronizer.sync() ⇒ <code>Promise</code>
Fetch all headers from current height up to highest found amongst peers

**Kind**: instance method of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
**Returns**: <code>Promise</code> - Resolves with true if sync successful  
<a name="module_sync.LightSynchronizer+open"></a>

#### lightSynchronizer.open() ⇒ <code>Promise</code>
Open synchronizer. Must be called before sync() is called

**Kind**: instance method of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
<a name="module_sync.LightSynchronizer+stop"></a>

#### lightSynchronizer.stop() ⇒ <code>Promise</code>
Stop synchronization. Returns a promise that resolves once its stopped.

**Kind**: instance method of [<code>LightSynchronizer</code>](#module_sync.LightSynchronizer)  
<a name="module_sync.Synchronizer"></a>

### sync.Synchronizer
Base class for blockchain synchronizers

**Kind**: static class of [<code>sync</code>](#module_sync)  

* [.Synchronizer](#module_sync.Synchronizer)
    * [new Synchronizer(options)](#new_module_sync.Synchronizer_new)
    * [.type](#module_sync.Synchronizer+type) ⇒ <code>string</code>
    * [.open()](#module_sync.Synchronizer+open) ⇒ <code>Promise</code>
    * [.syncable()](#module_sync.Synchronizer+syncable) ⇒ <code>boolean</code>
    * [.start()](#module_sync.Synchronizer+start) ⇒ <code>Promise</code>
    * [.stop()](#module_sync.Synchronizer+stop) ⇒ <code>Promise</code>

<a name="new_module_sync.Synchronizer_new"></a>

#### new Synchronizer(options)
Create new node


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.pool | <code>PeerPool</code> |  | peer pool |
| options.chain | <code>Chain</code> |  | blockchain |
| options.flow | <code>FlowControl</code> |  | flow control manager |
| [options.minPeers] | <code>number</code> | <code>3</code> | number of peers needed before syncing |
| [options.interval] | <code>number</code> |  | refresh interval |
| [options.logger] | <code>Logger</code> |  | Logger instance |

<a name="module_sync.Synchronizer+type"></a>

#### synchronizer.type ⇒ <code>string</code>
Returns synchronizer type

**Kind**: instance property of [<code>Synchronizer</code>](#module_sync.Synchronizer)  
**Returns**: <code>string</code> - type  
<a name="module_sync.Synchronizer+open"></a>

#### synchronizer.open() ⇒ <code>Promise</code>
Open synchronizer. Must be called before sync() is called

**Kind**: instance method of [<code>Synchronizer</code>](#module_sync.Synchronizer)  
<a name="module_sync.Synchronizer+syncable"></a>

#### synchronizer.syncable() ⇒ <code>boolean</code>
Returns true if peer can be used for syncing

**Kind**: instance method of [<code>Synchronizer</code>](#module_sync.Synchronizer)  
<a name="module_sync.Synchronizer+start"></a>

#### synchronizer.start() ⇒ <code>Promise</code>
Start synchronization

**Kind**: instance method of [<code>Synchronizer</code>](#module_sync.Synchronizer)  
<a name="module_sync.Synchronizer+stop"></a>

#### synchronizer.stop() ⇒ <code>Promise</code>
Stop synchronization. Returns a promise that resolves once its stopped.

**Kind**: instance method of [<code>Synchronizer</code>](#module_sync.Synchronizer)  
<a name="module_util"></a>

## util
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

