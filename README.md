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
team and how to contribute/join see [this document](./README.md).

# TECHNICAL GUIDELINES

## Client Setup

**Running the Client**

Some building blocks for the client have already been implemented or outlined to further build upon.

You can run the current state of the client with:

```shell
node lib/index.js --networkid=1 [--loglevel=debug]
```

Or show the help with
```shell
node lib/index.js help
```

If you want to have verbose logging output for the p2p communication you can use...

```shell
DEBUG=*,-babel [CLIENT_START_COMMAND]
```

for all output or something more targeted by listing the loggers like

```shell
DEBUG=devp2p:rlpx,devp2p:eth,-babel [CLIENT_START_COMMAND]
```

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
- ``Javascript``
- [Tape](https://github.com/substack/tape) for testing
- [Istanbul/nyc](https://istanbul.js.org/) for test coverage
- [standard.js](https://standardjs.com/) for linting/code formatting

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


