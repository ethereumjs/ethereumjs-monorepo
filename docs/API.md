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
<dt><a href="#module_node">node</a></dt>
<dd></dd>
<dt><a href="#module_rpc">rpc</a></dt>
<dd></dd>
<dt><a href="#module_sync">sync</a></dt>
<dd></dd>
</dl>

<a name="module_blockchain"></a>

## blockchain

* [blockchain](#module_blockchain)
    * [.BlockPool](#module_blockchain.BlockPool)
        * [new BlockPool(options)](#new_module_blockchain.BlockPool_new)
        * [.open()](#module_blockchain.BlockPool+open) ⇒ <code>Promise</code>
        * [.add(blocks)](#module_blockchain.BlockPool+add) ⇒ <code>Promise</code>
    * [.Chain](#module_blockchain.Chain)
        * [new Chain(options)](#new_module_blockchain.Chain_new)
        * [.networkId](#module_blockchain.Chain+networkId) : <code>number</code>
        * [.genesis](#module_blockchain.Chain+genesis) : <code>Object</code>
        * [.td](#module_blockchain.Chain+td) : <code>BN</code>
        * [.latest](#module_blockchain.Chain+latest) : <code>Block</code>
        * [.height](#module_blockchain.Chain+height) : <code>BN</code>
        * [.db](#module_blockchain.Chain+db) : <code>Object</code>
        * [.open()](#module_blockchain.Chain+open) ⇒ <code>Promise</code>
        * [.close()](#module_blockchain.Chain+close) ⇒ <code>Promise</code>
        * [.update()](#module_blockchain.Chain+update) ⇒ <code>Promise</code>
        * [.add()](#module_blockchain.Chain+add) ⇒ <code>Promise</code>

<a name="module_blockchain.BlockPool"></a>

### blockchain.BlockPool
Pool of blockchain segment

**Kind**: static class of [<code>blockchain</code>](#module_blockchain)  

* [.BlockPool](#module_blockchain.BlockPool)
    * [new BlockPool(options)](#new_module_blockchain.BlockPool_new)
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
    * [.td](#module_blockchain.Chain+td) : <code>BN</code>
    * [.latest](#module_blockchain.Chain+latest) : <code>Block</code>
    * [.height](#module_blockchain.Chain+height) : <code>BN</code>
    * [.db](#module_blockchain.Chain+db) : <code>Object</code>
    * [.open()](#module_blockchain.Chain+open) ⇒ <code>Promise</code>
    * [.close()](#module_blockchain.Chain+close) ⇒ <code>Promise</code>
    * [.update()](#module_blockchain.Chain+update) ⇒ <code>Promise</code>
    * [.add()](#module_blockchain.Chain+add) ⇒ <code>Promise</code>

<a name="new_module_blockchain.Chain_new"></a>

#### new Chain(options)
Create new chain


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| [options.dataDir] | <code>string</code> | <code>&quot;./chaindata&quot;</code> | data directory path |
| [options.network] | <code>string</code> | <code>&quot;mainnet&quot;</code> | ethereum network name |
| [options.logger] | <code>Logger</code> |  | Logger instance |

<a name="module_blockchain.Chain+networkId"></a>

#### chain.networkId : <code>number</code>
Network ID

**Kind**: instance property of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+genesis"></a>

#### chain.genesis : <code>Object</code>
Genesis block parameters

**Kind**: instance property of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+td"></a>

#### chain.td : <code>BN</code>
Total difficulty of canonical chain

**Kind**: instance property of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+latest"></a>

#### chain.latest : <code>Block</code>
Latest block in canonical chain

**Kind**: instance property of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+height"></a>

#### chain.height : <code>BN</code>
Blockchain height

**Kind**: instance property of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_blockchain.Chain+db"></a>

#### chain.db : <code>Object</code>
Blockchain database

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
<a name="module_blockchain.Chain+add"></a>

#### chain.add() ⇒ <code>Promise</code>
Insert new blocks into blockchain

**Kind**: instance method of [<code>Chain</code>](#module_blockchain.Chain)  
<a name="module_net/peer"></a>

## net/peer

* [net/peer](#module_net/peer)
    * [.Peer](#module_net/peer.Peer)
        * [new Peer(options)](#new_module_net/peer.Peer_new)
        * [.id](#module_net/peer.Peer+id)
        * [.address](#module_net/peer.Peer+address)
        * [.server](#module_net/peer.Peer+server)
        * [.logger](#module_net/peer.Peer+logger)
        * [.protocols](#module_net/peer.Peer+protocols)
        * [.idle](#module_net/peer.Peer+idle) : <code>boolean</code>
        * [.idle](#module_net/peer.Peer+idle) : <code>boolean</code>
        * [.addProtocol(protocol)](#module_net/peer.Peer+addProtocol)
        * [.understands(protocolName)](#module_net/peer.Peer+understands)
    * [.RlpxPeer](#module_net/peer.RlpxPeer)
        * [new RlpxPeer(options)](#new_module_net/peer.RlpxPeer_new)
        * [.connect()](#module_net/peer.RlpxPeer+connect) ⇒ <code>Promise</code>

<a name="module_net/peer.Peer"></a>

### net/peer.Peer
Network peer

**Kind**: static class of [<code>net/peer</code>](#module_net/peer)  

* [.Peer](#module_net/peer.Peer)
    * [new Peer(options)](#new_module_net/peer.Peer_new)
    * [.id](#module_net/peer.Peer+id)
    * [.address](#module_net/peer.Peer+address)
    * [.server](#module_net/peer.Peer+server)
    * [.logger](#module_net/peer.Peer+logger)
    * [.protocols](#module_net/peer.Peer+protocols)
    * [.idle](#module_net/peer.Peer+idle) : <code>boolean</code>
    * [.idle](#module_net/peer.Peer+idle) : <code>boolean</code>
    * [.addProtocol(protocol)](#module_net/peer.Peer+addProtocol)
    * [.understands(protocolName)](#module_net/peer.Peer+understands)

<a name="new_module_net/peer.Peer_new"></a>

#### new Peer(options)
Create new peer


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.id | <code>string</code> | peer id |
| options.address | <code>string</code> | peer address |
| [options.server] | <code>Server</code> | parent server |
| [options.logger] | <code>Logger</code> | logger instance |

<a name="module_net/peer.Peer+id"></a>

#### peer.id
[id description]

**Kind**: instance property of [<code>Peer</code>](#module_net/peer.Peer)  
**Properties**

| Name | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="module_net/peer.Peer+address"></a>

#### peer.address
**Kind**: instance property of [<code>Peer</code>](#module_net/peer.Peer)  
**Properties**

| Name | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="module_net/peer.Peer+server"></a>

#### peer.server
**Kind**: instance property of [<code>Peer</code>](#module_net/peer.Peer)  
**Properties**

| Name | Type |
| --- | --- |
| server | <code>Server</code> | 

<a name="module_net/peer.Peer+logger"></a>

#### peer.logger
**Kind**: instance property of [<code>Peer</code>](#module_net/peer.Peer)  
**Properties**

| Name | Type |
| --- | --- |
| logger | <code>Logger</code> | 

<a name="module_net/peer.Peer+protocols"></a>

#### peer.protocols
**Kind**: instance property of [<code>Peer</code>](#module_net/peer.Peer)  
**Properties**

| Name | Type |
| --- | --- |
| protocols | <code>Array.&lt;Protocol&gt;</code> | 

<a name="module_net/peer.Peer+idle"></a>

#### peer.idle : <code>boolean</code>
Get idle state of peer

**Kind**: instance property of [<code>Peer</code>](#module_net/peer.Peer)  
<a name="module_net/peer.Peer+idle"></a>

#### peer.idle : <code>boolean</code>
Set idle state of peer

**Kind**: instance property of [<code>Peer</code>](#module_net/peer.Peer)  
<a name="module_net/peer.Peer+addProtocol"></a>

#### peer.addProtocol(protocol)
Add a new protocol to peer

**Kind**: instance method of [<code>Peer</code>](#module_net/peer.Peer)  

| Param | Type |
| --- | --- |
| protocol | <code>Protocol</code> | 

<a name="module_net/peer.Peer+understands"></a>

#### peer.understands(protocolName)
Return true if peer understand the specified protocol name

**Kind**: instance method of [<code>Peer</code>](#module_net/peer.Peer)  

| Param | Type |
| --- | --- |
| protocolName | <code>string</code> | 

<a name="module_net/peer.RlpxPeer"></a>

### net/peer.RlpxPeer
Network peer

**Kind**: static class of [<code>net/peer</code>](#module_net/peer)  

* [.RlpxPeer](#module_net/peer.RlpxPeer)
    * [new RlpxPeer(options)](#new_module_net/peer.RlpxPeer_new)
    * [.connect()](#module_net/peer.RlpxPeer+connect) ⇒ <code>Promise</code>

<a name="new_module_net/peer.RlpxPeer_new"></a>

#### new RlpxPeer(options)
Create new devp2p/rlpx peer


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.id | <code>string</code> | peer id |
| options.address | <code>string</code> | peer address |
| options.port | <code>number</code> | peer port |
| [options.logger] | <code>Logger</code> | Logger instance |
| [options.privateKey] | <code>Buffer</code> | private key |

<a name="module_net/peer.RlpxPeer+connect"></a>

#### rlpxPeer.connect() ⇒ <code>Promise</code>
Initiate peer connection

**Kind**: instance method of [<code>RlpxPeer</code>](#module_net/peer.RlpxPeer)  
**Returns**: <code>Promise</code> - [description]  
<a name="module_net"></a>

## net

* [net](#module_net)
    * [.PeerPool](#module_net.PeerPool)
        * [new PeerPool(options)](#new_module_net.PeerPool_new)
        * [.peers](#module_net.PeerPool+peers) : <code>Array.&lt;Peer&gt;</code>
        * [.open()](#module_net.PeerPool+open) ⇒ <code>Promise</code>
        * [.contains(peer)](#module_net.PeerPool+contains) ⇒ <code>boolean</code>
        * [.idle()](#module_net.PeerPool+idle) ⇒ <code>Peer</code>
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
    * [.contains(peer)](#module_net.PeerPool+contains) ⇒ <code>boolean</code>
    * [.idle()](#module_net.PeerPool+idle) ⇒ <code>Peer</code>
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
| options.protocols | <code>Array.&lt;string&gt;</code> | peers must support all of these protocols |
| [options.logger] | <code>Logger</code> | logger instance |

<a name="module_net.PeerPool+peers"></a>

#### peerPool.peers : <code>Array.&lt;Peer&gt;</code>
Connected peers

**Kind**: instance property of [<code>PeerPool</code>](#module_net.PeerPool)  
<a name="module_net.PeerPool+open"></a>

#### peerPool.open() ⇒ <code>Promise</code>
Open pool and make sure all associated servers are also open

**Kind**: instance method of [<code>PeerPool</code>](#module_net.PeerPool)  
**Returns**: <code>Promise</code> - [description]  
<a name="module_net.PeerPool+contains"></a>

#### peerPool.contains(peer) ⇒ <code>boolean</code>
Return true if pool contains the specified peer

**Kind**: instance method of [<code>PeerPool</code>](#module_net.PeerPool)  

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>Peer</code> \| <code>string</code> | object or peer id |

<a name="module_net.PeerPool+idle"></a>

#### peerPool.idle() ⇒ <code>Peer</code>
Returns a random idle peer from the pool

**Kind**: instance method of [<code>PeerPool</code>](#module_net.PeerPool)  
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
        * [new EthProtocol(sender)](#new_module_net/protocol.EthProtocol_new)
        * _instance_
            * [.name](#module_net/protocol.EthProtocol+name) : <code>string</code>
            * [.version](#module_net/protocol.EthProtocol+version) : <code>number</code>
            * [.status](#module_net/protocol.EthProtocol+status) : <code>Object</code>
            * [.td](#module_net/protocol.EthProtocol+td) : <code>BN</code>
            * [.head](#module_net/protocol.EthProtocol+head) : <code>Buffer</code>
            * [.handshake(chain)](#module_net/protocol.EthProtocol+handshake) ⇒ <code>Promise</code>
            * [.getBlockHeaders(block, maxHeaders, skip, reverse)](#module_net/protocol.EthProtocol+getBlockHeaders)
            * [.getBlockBodies(hashes)](#module_net/protocol.EthProtocol+getBlockBodies)
        * _static_
            * [.codes](#module_net/protocol.EthProtocol.codes) : <code>Object</code>
    * [.Protocol](#module_net/protocol.Protocol)
        * [new Protocol(sender)](#new_module_net/protocol.Protocol_new)
        * [.response(code)](#module_net/protocol.Protocol+response) ⇒ <code>Promise</code>
    * [.RlpxSender](#module_net/protocol.RlpxSender)
        * [new RlpxSender(rlpxProtocol)](#new_module_net/protocol.RlpxSender_new)
        * [.sendStatus(status)](#module_net/protocol.RlpxSender+sendStatus)
        * [.sendMessage(code, rlpEncodedData)](#module_net/protocol.RlpxSender+sendMessage)
    * [.Sender](#module_net/protocol.Sender)
        * [.sendStatus(status)](#module_net/protocol.Sender+sendStatus)
        * [.sendMessage(code, rlpEncodedData)](#module_net/protocol.Sender+sendMessage)

<a name="module_net/protocol.EthProtocol"></a>

### net/protocol.EthProtocol
Implements eth/62 and eth/63 protocols

**Kind**: static class of [<code>net/protocol</code>](#module_net/protocol)  

* [.EthProtocol](#module_net/protocol.EthProtocol)
    * [new EthProtocol(sender)](#new_module_net/protocol.EthProtocol_new)
    * _instance_
        * [.name](#module_net/protocol.EthProtocol+name) : <code>string</code>
        * [.version](#module_net/protocol.EthProtocol+version) : <code>number</code>
        * [.status](#module_net/protocol.EthProtocol+status) : <code>Object</code>
        * [.td](#module_net/protocol.EthProtocol+td) : <code>BN</code>
        * [.head](#module_net/protocol.EthProtocol+head) : <code>Buffer</code>
        * [.handshake(chain)](#module_net/protocol.EthProtocol+handshake) ⇒ <code>Promise</code>
        * [.getBlockHeaders(block, maxHeaders, skip, reverse)](#module_net/protocol.EthProtocol+getBlockHeaders)
        * [.getBlockBodies(hashes)](#module_net/protocol.EthProtocol+getBlockBodies)
    * _static_
        * [.codes](#module_net/protocol.EthProtocol.codes) : <code>Object</code>

<a name="new_module_net/protocol.EthProtocol_new"></a>

#### new EthProtocol(sender)
Create eth protocol


| Param | Type |
| --- | --- |
| sender | <code>Sender</code> | 

<a name="module_net/protocol.EthProtocol+name"></a>

#### ethProtocol.name : <code>string</code>
Name of protocol

**Kind**: instance property of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  
<a name="module_net/protocol.EthProtocol+version"></a>

#### ethProtocol.version : <code>number</code>
Protocol version

**Kind**: instance property of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  
<a name="module_net/protocol.EthProtocol+status"></a>

#### ethProtocol.status : <code>Object</code>
Protocol handshake status

**Kind**: instance property of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  
<a name="module_net/protocol.EthProtocol+td"></a>

#### ethProtocol.td : <code>BN</code>
Total difficulty for peer's canonical chain

**Kind**: instance property of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  
<a name="module_net/protocol.EthProtocol+head"></a>

#### ethProtocol.head : <code>Buffer</code>
Hash of peer's latest block

**Kind**: instance property of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  
<a name="module_net/protocol.EthProtocol+handshake"></a>

#### ethProtocol.handshake(chain) ⇒ <code>Promise</code>
Perform handshake

**Kind**: instance method of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  

| Param | Type |
| --- | --- |
| chain | <code>Chain</code> | 

<a name="module_net/protocol.EthProtocol+getBlockHeaders"></a>

#### ethProtocol.getBlockHeaders(block, maxHeaders, skip, reverse)
Get a sequence of block headers. A BLOCK_HEADERS message is emitted when
results are returned from peer.

**Kind**: instance method of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  

| Param | Type | Description |
| --- | --- | --- |
| block | <code>BN</code> \| <code>Buffer</code> | block number or hash |
| maxHeaders | <code>number</code> | maximum number of heads to fetch |
| skip | <code>number</code> | blocks to skip between headers |
| reverse | <code>boolean</code> | decreasing header numbers if reverse is 1 |

<a name="module_net/protocol.EthProtocol+getBlockBodies"></a>

#### ethProtocol.getBlockBodies(hashes)
Get a sequence of block bodies. A BLOCK_BODIES message is emitted when
results are returned from peer.

**Kind**: instance method of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  

| Param | Type | Description |
| --- | --- | --- |
| hashes | <code>Array.&lt;Buffer&gt;</code> | Array of hashes to fetch bodies for |

<a name="module_net/protocol.EthProtocol.codes"></a>

#### EthProtocol.codes : <code>Object</code>
Message code constants for eth/62 and eth/63

**Kind**: static property of [<code>EthProtocol</code>](#module_net/protocol.EthProtocol)  
<a name="module_net/protocol.Protocol"></a>

### net/protocol.Protocol
Base class for all wire protocols

**Kind**: static class of [<code>net/protocol</code>](#module_net/protocol)  

* [.Protocol](#module_net/protocol.Protocol)
    * [new Protocol(sender)](#new_module_net/protocol.Protocol_new)
    * [.response(code)](#module_net/protocol.Protocol+response) ⇒ <code>Promise</code>

<a name="new_module_net/protocol.Protocol_new"></a>

#### new Protocol(sender)
Create new protocol


| Param | Type |
| --- | --- |
| sender | <code>Sender</code> | 

<a name="module_net/protocol.Protocol+response"></a>

#### protocol.response(code) ⇒ <code>Promise</code>
Returns a promise that resolves with the message payload when the specified
message code is received

**Kind**: instance method of [<code>Protocol</code>](#module_net/protocol.Protocol)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>number</code> | message code to wait for |

<a name="module_net/protocol.RlpxSender"></a>

### net/protocol.RlpxSender
DevP2P/RLPx protocol sender

**Kind**: static class of [<code>net/protocol</code>](#module_net/protocol)  
**Emits**: <code>event:message</code>, <code>event:status</code>  

* [.RlpxSender](#module_net/protocol.RlpxSender)
    * [new RlpxSender(rlpxProtocol)](#new_module_net/protocol.RlpxSender_new)
    * [.sendStatus(status)](#module_net/protocol.RlpxSender+sendStatus)
    * [.sendMessage(code, rlpEncodedData)](#module_net/protocol.RlpxSender+sendMessage)

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

#### rlpxSender.sendMessage(code, rlpEncodedData)
Send a message to peer

**Kind**: instance method of [<code>RlpxSender</code>](#module_net/protocol.RlpxSender)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>number</code> | message code |
| rlpEncodedData | <code>Array</code> \| <code>Buffer</code> | rlp encoded message payload |

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
    * [.RlpxServer](#module_net/server.RlpxServer)
        * [new RlpxServer(options)](#new_module_net/server.RlpxServer_new)
        * [.name](#module_net/server.RlpxServer+name) : <code>string</code>
        * [.open()](#module_net/server.RlpxServer+open) ⇒ <code>Promise</code>
        * [.ban(peerId, [maxAge])](#module_net/server.RlpxServer+ban) ⇒ <code>Promise</code>
    * [.Server](#module_net/server.Server)
        * [.open()](#module_net/server.Server+open) ⇒ <code>Promise</code>
        * [.ban(peerId, [maxAge])](#module_net/server.Server+ban) ⇒ <code>Promise</code>

<a name="module_net/server.RlpxServer"></a>

### net/server.RlpxServer
DevP2P/RLPx server

**Kind**: static class of [<code>net/server</code>](#module_net/server)  
**Emits**: <code>event:connected</code>, <code>event:disconnected</code>, <code>event:error</code>  

* [.RlpxServer](#module_net/server.RlpxServer)
    * [new RlpxServer(options)](#new_module_net/server.RlpxServer_new)
    * [.name](#module_net/server.RlpxServer+name) : <code>string</code>
    * [.open()](#module_net/server.RlpxServer+open) ⇒ <code>Promise</code>
    * [.ban(peerId, [maxAge])](#module_net/server.RlpxServer+ban) ⇒ <code>Promise</code>

<a name="new_module_net/server.RlpxServer_new"></a>

#### new RlpxServer(options)
Create new DevP2P/RLPx server


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.bootnodes | <code>Array.&lt;Object&gt;</code> |  | list of bootnodes to use for discovery |
| [options.maxPeers] | <code>number</code> | <code>25</code> | maximum peers allowed |
| [options.localPort] | <code>number</code> | <code></code> | local port to listen on |
| [options.privateKey] | <code>Buffer</code> |  | private key to use for server |
| [options.clientFilter] | <code>Array.&lt;string&gt;</code> |  | list of supported clients |
| [options.refreshInterval] | <code>number</code> | <code>30000</code> | how often (in ms) to discover new peers |
| [options.logger] | <code>Logger</code> |  | Logger instance |

<a name="module_net/server.RlpxServer+name"></a>

#### rlpxServer.name : <code>string</code>
Server name

**Kind**: instance property of [<code>RlpxServer</code>](#module_net/server.RlpxServer)  
<a name="module_net/server.RlpxServer+open"></a>

#### rlpxServer.open() ⇒ <code>Promise</code>
Open RLPx server. Must be called before performing other operations.

**Kind**: instance method of [<code>RlpxServer</code>](#module_net/server.RlpxServer)  
**Returns**: <code>Promise</code> - [description]  
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
    * [.open()](#module_net/server.Server+open) ⇒ <code>Promise</code>
    * [.ban(peerId, [maxAge])](#module_net/server.Server+ban) ⇒ <code>Promise</code>

<a name="module_net/server.Server+open"></a>

#### server.open() ⇒ <code>Promise</code>
Open server and get ready for new connections

**Kind**: instance method of [<code>Server</code>](#module_net/server.Server)  
**Returns**: <code>Promise</code> - [description]  
**Access**: protected  
<a name="module_net/server.Server+ban"></a>

#### server.ban(peerId, [maxAge]) ⇒ <code>Promise</code>
Ban peer for a specified time

**Kind**: instance method of [<code>Server</code>](#module_net/server.Server)  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| peerId | <code>string</code> | id of peer |
| [maxAge] | <code>number</code> | how long to ban peer |

<a name="module_node"></a>

## node

* [node](#module_node)
    * [.FastSyncNode](#module_node.FastSyncNode)
        * [new FastSyncNode(options)](#new_module_node.FastSyncNode_new)
        * [.open()](#module_node.FastSyncNode+open) ⇒ <code>Promise</code>
        * [.sync()](#module_node.FastSyncNode+sync) ⇒ <code>Promise</code>
    * [.Node](#module_node.Node)
        * [new Node(options)](#new_module_node.Node_new)
        * [.open()](#module_node.Node+open) ⇒ <code>Promise</code>
        * [.sync()](#module_node.Node+sync) ⇒ <code>Promise</code>

<a name="module_node.FastSyncNode"></a>

### node.FastSyncNode
Implements an ethereum fast sync node

**Kind**: static class of [<code>node</code>](#module_node)  

* [.FastSyncNode](#module_node.FastSyncNode)
    * [new FastSyncNode(options)](#new_module_node.FastSyncNode_new)
    * [.open()](#module_node.FastSyncNode+open) ⇒ <code>Promise</code>
    * [.sync()](#module_node.FastSyncNode+sync) ⇒ <code>Promise</code>

<a name="new_module_node.FastSyncNode_new"></a>

#### new FastSyncNode(options)
Create new node


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| [options.network] | <code>string</code> | <code>&quot;mainnet&quot;</code> | ethereum network name |
| [options.transports] | <code>Array.&lt;string&gt;</code> | <code>rlpx</code> | names of supported transports |
| [options.dataDir] | <code>string</code> | <code>&quot;./chaindata&quot;</code> | data directory path |
| [options.maxPeers] | <code>number</code> | <code>25</code> | maximum peers allowed |
| [options.localPort] | <code>number</code> | <code></code> | local port to listen on |
| [options.privateKey] | <code>Buffer</code> |  | private key to use for server |
| [options.clientFilter] | <code>Array.&lt;string&gt;</code> |  | list of supported clients |
| [options.refreshInterval] | <code>number</code> | <code>30000</code> | how often to discover new peers |
| [options.logger] | <code>Logger</code> |  | Logger instance |

<a name="module_node.FastSyncNode+open"></a>

#### fastSyncNode.open() ⇒ <code>Promise</code>
Open fast sync node and wait for all components to initialize

**Kind**: instance method of [<code>FastSyncNode</code>](#module_node.FastSyncNode)  
<a name="module_node.FastSyncNode+sync"></a>

#### fastSyncNode.sync() ⇒ <code>Promise</code>
Run blockchain synchronization. Returns a promise that resolves once chain
is synchronized

**Kind**: instance method of [<code>FastSyncNode</code>](#module_node.FastSyncNode)  
<a name="module_node.Node"></a>

### node.Node
Base class for ethereum node implementations

**Kind**: static class of [<code>node</code>](#module_node)  

* [.Node](#module_node.Node)
    * [new Node(options)](#new_module_node.Node_new)
    * [.open()](#module_node.Node+open) ⇒ <code>Promise</code>
    * [.sync()](#module_node.Node+sync) ⇒ <code>Promise</code>

<a name="new_module_node.Node_new"></a>

#### new Node(options)
Create new node


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | constructor parameters |
| options.logger | <code>Logger</code> | Logger instance |
| options.network | <code>string</code> | ethereum network name |
| options.transports | <code>Array.&lt;string&gt;</code> | names of supported transports |
| options.dataDir | <code>string</code> | data directory path |
| options.maxPeers | <code>number</code> | maximum peers allowed |
| options.localPort | <code>number</code> | local port to listen on |
| options.privateKey | <code>Buffer</code> | private key to use for server |
| options.clientFilter | <code>Array.&lt;string&gt;</code> | list of supported clients |
| options.refreshInterval | <code>number</code> | how often to discover new peers |

<a name="module_node.Node+open"></a>

#### node.open() ⇒ <code>Promise</code>
Open node and wait for all components to initialize

**Kind**: instance method of [<code>Node</code>](#module_node.Node)  
**Access**: protected  
<a name="module_node.Node+sync"></a>

#### node.sync() ⇒ <code>Promise</code>
Run blockchain synchronization. Returns a promise that resolves once chain
is synchronized

**Kind**: instance method of [<code>Node</code>](#module_node.Node)  
**Access**: protected  
<a name="module_rpc"></a>

## rpc

* [rpc](#module_rpc)
    * [.RPCManager](#module_rpc.RPCManager)
        * [.getMethods()](#module_rpc.RPCManager+getMethods) ⇒ <code>Object</code>
    * [.validators](#module_rpc.validators)
        * [.hex(params, index)](#module_rpc.validators.hex)
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
    * [.bool(params, index)](#module_rpc.validators.bool)

<a name="module_rpc.validators.hex"></a>

#### validators.hex(params, index)
hex validator to ensure has "0x" prefix

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

<a name="module_sync"></a>

## sync

* [sync](#module_sync)
    * [.FastSynchronizer](#module_sync.FastSynchronizer)
        * [new FastSynchronizer(options)](#new_module_sync.FastSynchronizer_new)
        * [.open()](#module_sync.FastSynchronizer+open) ⇒ <code>Promise</code>
        * [.height(peer)](#module_sync.FastSynchronizer+height) ⇒ <code>Promise</code>
        * [.origin()](#module_sync.FastSynchronizer+origin) ⇒ <code>Promise</code>
        * [.fetch(first, last)](#module_sync.FastSynchronizer+fetch) ⇒ <code>Promise</code>
        * [.sync()](#module_sync.FastSynchronizer+sync) ⇒ <code>Promise</code>
    * [.HeaderFetcher](#module_sync.HeaderFetcher)
        * [.before(taskOne, taskTwo)](#module_sync.HeaderFetcher+before) ⇒ <code>boolean</code>
        * [.fetch(task, peer)](#module_sync.HeaderFetcher+fetch)
        * [.process(task, payload)](#module_sync.HeaderFetcher+process)
    * [.Fetcher](#module_sync.Fetcher)
        * [new Fetcher(options)](#new_module_sync.Fetcher_new)
        * [.add(task)](#module_sync.Fetcher+add)
        * [.next()](#module_sync.Fetcher+next)
        * [.handle(message, peer)](#module_sync.Fetcher+handle)
        * [.expire()](#module_sync.Fetcher+expire)
        * [.run()](#module_sync.Fetcher+run) ⇒ <code>Promise</code>
        * [.before(taskOne, taskTwo)](#module_sync.Fetcher+before) ⇒ <code>boolean</code>
        * [.fetch(task, peer)](#module_sync.Fetcher+fetch)
        * [.process(task, payload)](#module_sync.Fetcher+process)
    * [.Synchronizer](#module_sync.Synchronizer)

<a name="module_sync.FastSynchronizer"></a>

### sync.FastSynchronizer
Implements an ethereum fast sync synchronizer

**Kind**: static class of [<code>sync</code>](#module_sync)  

* [.FastSynchronizer](#module_sync.FastSynchronizer)
    * [new FastSynchronizer(options)](#new_module_sync.FastSynchronizer_new)
    * [.open()](#module_sync.FastSynchronizer+open) ⇒ <code>Promise</code>
    * [.height(peer)](#module_sync.FastSynchronizer+height) ⇒ <code>Promise</code>
    * [.origin()](#module_sync.FastSynchronizer+origin) ⇒ <code>Promise</code>
    * [.fetch(first, last)](#module_sync.FastSynchronizer+fetch) ⇒ <code>Promise</code>
    * [.sync()](#module_sync.FastSynchronizer+sync) ⇒ <code>Promise</code>

<a name="new_module_sync.FastSynchronizer_new"></a>

#### new FastSynchronizer(options)
Create new node


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | constructor parameters |
| options.pool | <code>PeerPool</code> |  | peer pool |
| options.chain | <code>Chain</code> |  | blockchain |
| [options.minPeers] | <code>number</code> | <code>2</code> | minimum peers needed for synchronization |
| [options.logger] | <code>Logger</code> |  | Logger instance |

<a name="module_sync.FastSynchronizer+open"></a>

#### fastSynchronizer.open() ⇒ <code>Promise</code>
Open fast sync synchronizer and wait for all components to initialize

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

#### fastSynchronizer.fetch(first, last) ⇒ <code>Promise</code>
Fetch all headers with block numbers ranings from first to last. Returns a
promise that resolves once all headers are downloaded. TO DO: Actually insert
headers into the blockchain.

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  

| Param | Type | Description |
| --- | --- | --- |
| first | <code>BN</code> | number of first block header |
| last | <code>BN</code> | number of last block header |

<a name="module_sync.FastSynchronizer+sync"></a>

#### fastSynchronizer.sync() ⇒ <code>Promise</code>
Synchronization blockchain. Returns a promise that resolves once chain
is synchronized

**Kind**: instance method of [<code>FastSynchronizer</code>](#module_sync.FastSynchronizer)  
<a name="module_sync.HeaderFetcher"></a>

### sync.HeaderFetcher
Implements an eth/62 based header fetcher

**Kind**: static class of [<code>sync</code>](#module_sync)  

* [.HeaderFetcher](#module_sync.HeaderFetcher)
    * [.before(taskOne, taskTwo)](#module_sync.HeaderFetcher+before) ⇒ <code>boolean</code>
    * [.fetch(task, peer)](#module_sync.HeaderFetcher+fetch)
    * [.process(task, payload)](#module_sync.HeaderFetcher+process)

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

#### headerFetcher.fetch(task, peer)
Fetches block headers for the given task

**Kind**: instance method of [<code>HeaderFetcher</code>](#module_sync.HeaderFetcher)  

| Param | Type |
| --- | --- |
| task | <code>Object</code> | 
| peer | <code>Peer</code> | 

<a name="module_sync.HeaderFetcher+process"></a>

#### headerFetcher.process(task, payload)
Process the message payload for the getBlockHeaders response

**Kind**: instance method of [<code>HeaderFetcher</code>](#module_sync.HeaderFetcher)  
**Emits**: <code>event:headers</code>  

| Param | Type | Description |
| --- | --- | --- |
| task | <code>Object</code> |  |
| payload | <code>Array</code> | rlp encoded payload |

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
    * [.handle(message, peer)](#module_sync.Fetcher+handle)
    * [.expire()](#module_sync.Fetcher+expire)
    * [.run()](#module_sync.Fetcher+run) ⇒ <code>Promise</code>
    * [.before(taskOne, taskTwo)](#module_sync.Fetcher+before) ⇒ <code>boolean</code>
    * [.fetch(task, peer)](#module_sync.Fetcher+fetch)
    * [.process(task, payload)](#module_sync.Fetcher+process)

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

#### fetcher.handle(message, peer)
Handler for messages sent from peers. Finds and processes the corresponding
task using the process() method, and resets peer to an idle state.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  

| Param | Type |
| --- | --- |
| message | <code>Object</code> | 
| peer | <code>Peer</code> | 

<a name="module_sync.Fetcher+expire"></a>

#### fetcher.expire()
Expires all tasks that have timed out. Peers that take too long to respond
will be banned for 5 minutes. Timeout out tasks will be re-inserted into the
queue.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  
<a name="module_sync.Fetcher+run"></a>

#### fetcher.run() ⇒ <code>Promise</code>
Run the fetcher. Returns a promise that resolves once all tasks are completed.

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  
<a name="module_sync.Fetcher+before"></a>

#### fetcher.before(taskOne, taskTwo) ⇒ <code>boolean</code>
True if taskOne has a higher priority than taskTwo

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  

| Param | Type |
| --- | --- |
| taskOne | <code>Object</code> | 
| taskTwo | <code>Object</code> | 

<a name="module_sync.Fetcher+fetch"></a>

#### fetcher.fetch(task, peer)
Fetches data from peer for the specified task

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  

| Param | Type |
| --- | --- |
| task | <code>Object</code> | 
| peer | <code>Peer</code> | 

<a name="module_sync.Fetcher+process"></a>

#### fetcher.process(task, payload)
Process the message payload for the given task

**Kind**: instance method of [<code>Fetcher</code>](#module_sync.Fetcher)  

| Param | Type | Description |
| --- | --- | --- |
| task | <code>Object</code> |  |
| payload | <code>Array</code> | rlp encoded payload |

<a name="module_sync.Synchronizer"></a>

### sync.Synchronizer
Base class for blockchain synchronizers

**Kind**: static class of [<code>sync</code>](#module_sync)  
