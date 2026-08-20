[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getKeys

# Function: getKeys()

> **getKeys**(`params`, `key`, `allowEmpty?`): `string`[]

Defined in: [packages/util/src/internal.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L151)

Collect string values for `key` from each object in `params`.

## Parameters

### params

`Record`\<`string`, `string`\>[]

### key

`string`

### allowEmpty?

`boolean`

When true, missing values become empty strings instead of throwing

## Returns

`string`[]

## Example

```js
getKeys([{a: '1', b: '2'}, {a: '3', b: '4'}], 'a') => ['1', '3']
```

## Throws

If `params` is not an array or a selected value is not a string
