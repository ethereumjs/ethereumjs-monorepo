# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) 
(modification: no type change headlines) and this project adheres to 
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [3.0.0] - 2018-05-18
This release comes with heavy internal changes bringing Geth DB compatibility to the
``ethereumjs-blockchain`` library. For a full list of changes and associated discussion
see PR [#47](https://github.com/ethereumjs/ethereumjs-blockchain/pull/47)
(thanks to @vpulim for this amazing work!). To test iterating through your local Geth
chaindata DB you can run the [example](https://github.com/ethereumjs/ethereumjs-blockchain#example)
in the README file.

This allows for various new use cases of the library in the areas of testing, simulation or
running actual blockchain data from a Geth node through the VM. The Geth data model used is
not compatible with the old format where chaindata and metadata have been stored separately on two leveldb
instances, so it is not possible to load an old DB with the new library version (if this causes
problems for you get in touch on GitHub or Gitter!).

Summary of the changes:
- New unified constructor where ``detailsDB`` and ``blockDB`` are replaced by a single ``db`` reference
- Deprecation of the ``getDetails()`` method now returning an empty object
- ``td`` and ``height`` are not stored in the db as meta info but computed as needed
- Block headers and body are stored under two separate keys
- Changes have been made to properly rebuild the chain and number/hash mappings as a result of forks and deletions
- A write-through cache has been added to reduce database reads
- Similar to geth, we now defend against selfish mining vulnerability 
- Added many more tests to increase coverage to over 90%
- Updated docs to reflect the API changes
- Updated library dependencies

[3.0.0]: https://github.com/ethereumjs/ethereumjs-blockchain/compare/v2.1.0...v3.0.0

## [2.1.0] - 2017-10-11
- ``Metro-Byzantium`` compatible
- Updated ``ethereumjs-block`` dependency (new difficulty formula / difficulty bomb delay)

[2.1.0]: https://github.com/ethereumjs/ethereumjs-blockchain/compare/v2.0.2...v2.1.0

## [2.0.2] - 2017-09-19
- Tightened dependencies to prevent the ``2.0.x`` version of the library to break
  after ``ethereumjs`` Byzantium library updates

[2.0.2]: https://github.com/ethereumjs/ethereumjs-blockchain/compare/v2.0.1...v2.0.2

## [2.0.1] - 2017-09-14
- Fixed severe bug adding blocks before blockchain init is complete

[2.0.1]: https://github.com/ethereumjs/ethereumjs-blockchain/compare/v2.0.0...v2.0.1

## [2.0.0] - 2017-01-01
- Split ``db`` into ``blockDB`` and ``detailsDB`` (breaking)

[2.0.0]: https://github.com/ethereumjs/ethereumjs-blockchain/compare/v1.4.2...v2.0.0

## [1.4.2] - 2016-12-29
- New ``getBlocks`` API method
- Testing improvements

[1.4.2]: https://github.com/ethereumjs/ethereumjs-blockchain/compare/v1.4.1...v1.4.2

## [1.4.1] - 2016-03-01
- Update dependencies to support Windows

[1.4.1]: https://github.com/ethereumjs/ethereumjs-blockchain/compare/v1.4.0...v1.4.1

## [1.4.0] - 2016-01-09
- Bump dependencies

[1.4.0]: https://github.com/ethereumjs/ethereumjs-blockchain/compare/v1.3.4...v1.4.0


## Older releases:

- [1.3.4](https://github.com/ethereumjs/ethereumjs-blockchain/compare/v1.3.3...v1.3.4) - 2016-01-08
- [1.3.3](https://github.com/ethereumjs/ethereumjs-blockchain/compare/v1.3.2...v1.3.3) - 2015-11-27
- [1.3.2](https://github.com/ethereumjs/ethereumjs-blockchain/compare/v1.3.1...v1.3.2) - 2015-11-27
- [1.3.1](https://github.com/ethereumjs/ethereumjs-blockchain/compare/v1.2.0...v1.3.1) - 2015-10-23
- 1.2.0 - 2015-10-01


