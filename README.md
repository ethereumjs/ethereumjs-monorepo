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

Current development stage: ``CONCEPTION``

# MAIN FOKUS

Main goal of this project is to develop an Ethereum main net light client as well 
as a full client with fast-sync support.

The **light client** shall be developed towards a stage where it is production-ready and
security-audited and therefor fully usable on the main net. It is intended for the 
mid-term future that the light client can also be used in a browser context. This can
be thought along on a sideline though, during development it is sufficient to stay in a ``Node.js``
context.

There are some uncertainties around the intended development stage of the **full client**
regarding performance and questions how to deal with the lack of 
(historical) fork-rule suppport of the underlying [VM](https://github.com/ethereumjs/ethereumjs-vm)
implementation. Full client support shall therefor be brought to an *EXPERIMENTAL* stage
where it is possible to sync the main chain up to a post-Byzantium state and then process
transactions and store the results. This will already be valuable for experimentation and
testing purposes. Where and if to proceed from there will be decided in a later stage.

## SIDE FOKUS

``ethereumjs-client`` will be classical main chain implementation - [py-EVM](https://github.com/ethereum/py-evm) is maybe the most appropriate project to compare with here - and there won't be too much room
for additional experimentation or further-going feature requests at least during the first development 
period.

There are three noteworthy exceptions from this base line:

**libp2p**: There has been a lot of expressed interest in ``libp2p`` support for client
communications in the past by various parts of the community. If there is enough capacity this can
be investigated on a side track during client development and implemented in a modular 
way as an alternative to the classic [devp2p](https://github.com/ethereumjs/ethereumjs-devp2p) 
networking communication.

**sharding**: It is possible to implement aspects of sharding specification along the way.
Be aware though that this is still subject to heavy change and should also be added in
ways not hindering the main net client development. This is also limited to the main chain
parts of sharding, so e.g. developing a stateless client will be another separate project
(where there is definitely a need for, so if you want to go more into research, pick up on
this one! :-)).

**casper**: Same for Casper PoS implementation additions.

# DEVELOPMENT STAGES

The project will go through the following development stages:

``CONCEPTION``

This is the project start and will mainly be done by the initiator of the project ([HolgerD77](https://github.com/holgerd77)). During this period the various tasks will be
worked out in the form of issues down to a granularity-level where they are implementable
by various independent contributors. A project plan will be layed out grouping the tasks
and showing work dependencies and giving an overall impression what has to be done to 
successfully finish the project. There will be also an information description (this document :-))
of the organizational parts of the project.

**Goals**: A task list and project plan for discussion

**Duration**: 1-2 weeks

**How to contribute**: This is not yet the time for contributing. Please be patient for another
week or two until we have something to discuss.


``CONCEPTION ANALYSIS``

This is the time to discuss the way the project is conceptualized and the way the project plan
is layed out. Feel free to join! It will be especially valuable if you deep-dive into the various
issues and have a look at questions like:

- Is this way to implement stuff realistic/can it be working?
- Is the new module well-placed within the overall structural architecture?
- Does the scope of module responsibilities make sense?
- Is there already some library which does this work, are the external libs/devs proposed adequate?
- ...

*Note*: Please don't do the discussion on a work issue in the issue itself (so that we can keep a 
  relatively clean issue boilerplate which we can be used when the actual work starts), but open a **new
  issue for conception analysis**, label it appropriately and reference the work issue.

At the end we will hopefully have a work plan everyone is happy with and which serves as a solid
basis for implementation.

**Goals**: A task list and project plan for implementation

**Duration**: 1-2 weeks

**How to contribute**: YEAH, YEAH, contribute now!! :-) Feel free to join the discussion.
 

``IN DEVELOPMENT``

Oh my, now there really is some work to be done. Feel free to grab an issue you want to work on.
Many issues will be in a dependency-order-line, so start with issues which doesn't depend on other
unfinished issues.

If you have chosen your issue please drop a note on the issue page that you will start working
on the issue. If you plan to do your implementation in another way as described in the issue
please present your idea there first so there won't be any conflicts/unnecessary discussions
later on merging.

**Goals:**: All aspects/components of both the light and the full client implementation should be
in a workable state.

**Duration**: 4+ months

**How to contribute**: Grab yourself an issue and start hacking (after reading the above :-))

``PRE-ALPHA``

Oh my oh my. This is still a bit far away. But we should finally come to a point where we can
actually release some stuff.

Further release stages to be determined.

# COMMUNITY PROJECT

Many of the JS developers currently hired by the foundation are working on other projects, so this
has to be a project strongly driven forward by the community. This necessarily doesn't has to be a
bad thing though, since there is strong demand for a Javascript client by the community and it
will be easier to grab and integrate the different needs if various parts of the community are
involved. This will generally a really exciting project to work on. There will be an ongoing 
project management and coordination provided by [HolgerD77](https://github.com/holgerd77) who
is working for the foundation as a Javascript developer and has been deep insights of the JS
implementations of the VM, the networking communication layer and most of the other parts.

If you are an organization or a company being a part of the Ethereum ecosystem, consider giving
interested developers some free time to work on this. If you are a developer ask your company
or org if they want support you with contributing. You are of course also very welcome as a
single/independent developer!

This is an inclusive project and everyone is invited to join regardless of gender, race, religion, 
philosophy, ethnic origin, age, physical ability or sexual orientation.

**TEAM STRUCTURE**

There are two stages of team-coupling :-) which come with different permissions on ``GitHub``:

**Contributor**: You can always contribute to the project. Just do a PR from your own fork 
with the added commits containing your work.

**Team Member**: After you have proven that you more-or-less know what you are doing :-), can communicate 
about your stuff and have done some meaningful contributions you can become a member of the team with
full repository read/write access. There also needs to be some consensus from the current team
members on when/how the team is expanded. It is expected from team members that they commit
to the project for some reasonable amount of time (2+ months).

# TECHNICAL GUIDELINES

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

**Branch Structure**

Development will take place via feature branches being merged against a protected ``master``
branch. Always develop on branch also when being on your own fork, use meaningful branch
names like ``new-debug-cl-option`` or ``fixed-this-really-annoying-bug``.

**Testing**

No meaningful new PR will be accepted without associated tests (exceptions might be done on 
a case-by-case basis). Test coverage should not increase (significantly) by a new PR. 
You might also want to consider writing your tests first and then directly push them,
since this would be a good starting point for discussing the scope/implementation of a feature.

THERE IS PROBABLY SOME STUFF MISSING HERE.

