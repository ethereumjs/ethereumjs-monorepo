/*jslint node: true */
"use strict";

var TrieNode = require('./trieNode');
var ethUtil = require('ethereumjs-util');
var rlp = require('rlp');
var matchingNibbleLength = require('./util').matchingNibbleLength;


exports.prove = function(trie, key, cb) {
    var nodes;

    trie._findPath(key, function(err, node, remaining, stack) {
        if (err) return cb(err);
        if (remaining.length > 0) return cb(new Error("Node does not contain the key"));
        nodes = stack;
        var p=[];
        for (var i=0; i<nodes.length; i++) {
            var rlpNode = nodes[i].serialize();

            if ((rlpNode.length >= 32) || (i === 0)) {
                p.push(rlpNode);
            }
        }
        cb(null, p);
    });
};

exports.verifyProof = function(rootHash, key, proof, cb) {
    key = TrieNode.stringToNibbles(key);
    var wantHash = ethUtil.toBuffer(rootHash);
    for (var i=0; i<proof.length; i++) {
        var p = ethUtil.toBuffer(proof[i]);
        var hash = ethUtil.sha3(proof[i]);
        if (Buffer.compare(hash, wantHash)) {
            return cb(new Error("bad proof node "+i+": hash mismatch"));
        }
        var node = new TrieNode(ethUtil.rlp.decode(p));
        var cld;
        if (node.type === "branch") {
            if (key.length === 0) {
                if (i !== proof.length-1 ) {
                    return cb(new Error("additional nodes at end of proof"));
                }
                return cb(null, node.value);
            }
            cld = node.raw[key[0]];
            key = key.slice(1);
            if (cld.length === 2) {
                var embeddedNode = new TrieNode(cld);
                if (i !== proof.length-1) {
                    return cb(new Error("Key does not match with the proof one"));
                }

                if (matchingNibbleLength(embeddedNode.key, key) != embeddedNode.key.length) {
                    return cb(new Error("Key does not match with the proof one"));
                }
                key = key.slice( embeddedNode.key.length);
                if (key.length !== 0) {
                    return cb(new Error("Key does not match with the proof one"));
                }
                return cb(null, embeddedNode.value);
            } else {
                wantHash = cld;
            }

        } else if ((node.type === "extention") || (node.type === "leaf") ) {
            if (matchingNibbleLength(node.key, key) != node.key.length) {
                return cb(new Error("Key does not match with the proof one"));
            }
            cld = node.value;
            key = key.slice( node.key.length);
            if (key.length === 0) {
                if (i !== proof.length-1) {
                    return cb(new Error("Key does not match with the proof one"));
                }
                return cb(null, cld);
            } else {
                wantHash = cld;
            }
        } else {
            return cb(new Error("Invalid node type"));
        }
    }
    cb(new Error("unexpected end of proof"));
};
