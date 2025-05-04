[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getKeys

# Function: getKeys()

> **getKeys**(`params`, `key`, `allowEmpty?`): `string`[]

Defined in: [packages/util/src/internal.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L183)

Returns the keys from an array of objects.

## Parameters

### params

`Record`\<`string`, `string`\>[]

### key

`string`

### allowEmpty?

`boolean`

## Returns

`string`[]

## Example

```js
getKeys([{a: '1', b: '2'}, {a: '3', b: '4'}], 'a') => ['1', '3']
````
@param  params
@param  key
@param  allowEmpty
@returns output just a simple array of output keys
