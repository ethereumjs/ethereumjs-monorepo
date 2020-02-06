[merkle-patricia-tree](../README.md) › [PrioritizedTaskExecutor](prioritizedtaskexecutor.md)

# Class: PrioritizedTaskExecutor

## Hierarchy

* **PrioritizedTaskExecutor**

## Index

### Constructors

* [constructor](prioritizedtaskexecutor.md#private-constructor)

### Properties

* [currentPoolSize](prioritizedtaskexecutor.md#private-currentpoolsize)
* [maxPoolSize](prioritizedtaskexecutor.md#private-maxpoolsize)
* [queue](prioritizedtaskexecutor.md#private-queue)

### Methods

* [execute](prioritizedtaskexecutor.md#private-execute)

## Constructors

### `Private` constructor

\+ **new PrioritizedTaskExecutor**(`maxPoolSize`: number): *[PrioritizedTaskExecutor](prioritizedtaskexecutor.md)*

*Defined in [prioritizedTaskExecutor.ts:9](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/prioritizedTaskExecutor.ts#L9)*

Executes tasks up to maxPoolSize at a time, other items are put in a priority queue.

**`class`** PrioritizedTaskExecutor

**`prop`** {Number} maxPoolSize The maximum size of the pool

**`prop`** {Number} currentPoolSize The current size of the pool

**`prop`** {Array} queue The task queue

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`maxPoolSize` | number | The maximum size of the pool |

**Returns:** *[PrioritizedTaskExecutor](prioritizedtaskexecutor.md)*

## Properties

### `Private` currentPoolSize

• **currentPoolSize**: *number*

*Defined in [prioritizedTaskExecutor.ts:8](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/prioritizedTaskExecutor.ts#L8)*

___

### `Private` maxPoolSize

• **maxPoolSize**: *number*

*Defined in [prioritizedTaskExecutor.ts:7](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/prioritizedTaskExecutor.ts#L7)*

___

### `Private` queue

• **queue**: *[Task](../interfaces/task.md)[]*

*Defined in [prioritizedTaskExecutor.ts:9](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/prioritizedTaskExecutor.ts#L9)*

## Methods

### `Private` execute

▸ **execute**(`priority`: number, `fn`: Function): *void*

*Defined in [prioritizedTaskExecutor.ts:32](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/prioritizedTaskExecutor.ts#L32)*

Executes the task.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`priority` | number | The priority of the task |
`fn` | Function | The function that accepts the callback, which must be called upon the task completion.  |

**Returns:** *void*
