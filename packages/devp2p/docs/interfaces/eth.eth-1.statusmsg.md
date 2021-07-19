[@ethereumjs/devp2p](../README.md) / [eth](../modules/eth.md) / [ETH](../modules/eth.eth-1.md) / StatusMsg

# Interface: StatusMsg

[eth](../modules/eth.md).[ETH](../modules/eth.eth-1.md).StatusMsg

## Hierarchy

- `Array`<Buffer \| Buffer[]\>

  ↳ **StatusMsg**

## Table of contents

### Properties

- [length](eth.eth-1.statusmsg.md#length)

### Methods

- [[Symbol.iterator]](eth.eth-1.statusmsg.md#[symbol.iterator])
- [[Symbol.unscopables]](eth.eth-1.statusmsg.md#[symbol.unscopables])
- [concat](eth.eth-1.statusmsg.md#concat)
- [copyWithin](eth.eth-1.statusmsg.md#copywithin)
- [entries](eth.eth-1.statusmsg.md#entries)
- [every](eth.eth-1.statusmsg.md#every)
- [fill](eth.eth-1.statusmsg.md#fill)
- [filter](eth.eth-1.statusmsg.md#filter)
- [find](eth.eth-1.statusmsg.md#find)
- [findIndex](eth.eth-1.statusmsg.md#findindex)
- [forEach](eth.eth-1.statusmsg.md#foreach)
- [includes](eth.eth-1.statusmsg.md#includes)
- [indexOf](eth.eth-1.statusmsg.md#indexof)
- [join](eth.eth-1.statusmsg.md#join)
- [keys](eth.eth-1.statusmsg.md#keys)
- [lastIndexOf](eth.eth-1.statusmsg.md#lastindexof)
- [map](eth.eth-1.statusmsg.md#map)
- [pop](eth.eth-1.statusmsg.md#pop)
- [push](eth.eth-1.statusmsg.md#push)
- [reduce](eth.eth-1.statusmsg.md#reduce)
- [reduceRight](eth.eth-1.statusmsg.md#reduceright)
- [reverse](eth.eth-1.statusmsg.md#reverse)
- [shift](eth.eth-1.statusmsg.md#shift)
- [slice](eth.eth-1.statusmsg.md#slice)
- [some](eth.eth-1.statusmsg.md#some)
- [sort](eth.eth-1.statusmsg.md#sort)
- [splice](eth.eth-1.statusmsg.md#splice)
- [toLocaleString](eth.eth-1.statusmsg.md#tolocalestring)
- [toString](eth.eth-1.statusmsg.md#tostring)
- [unshift](eth.eth-1.statusmsg.md#unshift)
- [values](eth.eth-1.statusmsg.md#values)

## Properties

### length

• **length**: `number`

Gets or sets the length of the array. This is a number one higher than the highest element defined in an array.

#### Inherited from

Array.length

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1215

## Methods

### [Symbol.iterator]

▸ **[Symbol.iterator]**(): `IterableIterator`<Buffer \| Buffer[]\>

Iterator

#### Returns

`IterableIterator`<Buffer \| Buffer[]\>

#### Inherited from

Array.\_\_@iterator

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:60

___

### [Symbol.unscopables]

▸ **[Symbol.unscopables]**(): `Object`

Returns an object whose properties have the value 'true'
when they will be absent when used in a 'with' statement.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `copyWithin` | `boolean` |
| `entries` | `boolean` |
| `fill` | `boolean` |
| `find` | `boolean` |
| `findIndex` | `boolean` |
| `keys` | `boolean` |
| `values` | `boolean` |

#### Inherited from

Array.\_\_@unscopables

#### Defined in

node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:94

___

### concat

▸ **concat**(...`items`): (`Buffer` \| `Buffer`[])[]

Combines two or more arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...items` | `ConcatArray`<Buffer \| Buffer[]\>[] | Additional items to add to the end of array1. |

#### Returns

(`Buffer` \| `Buffer`[])[]

#### Inherited from

Array.concat

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1237

▸ **concat**(...`items`): (`Buffer` \| `Buffer`[])[]

Combines two or more arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...items` | (`Buffer` \| `Buffer`[] \| `ConcatArray`<Buffer \| Buffer[]\>)[] | Additional items to add to the end of array1. |

#### Returns

(`Buffer` \| `Buffer`[])[]

#### Inherited from

Array.concat

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1242

___

### copyWithin

▸ **copyWithin**(`target`, `start`, `end?`): [StatusMsg](eth.eth-1.statusmsg.md)

Returns the this object after copying a section of the array identified by start and end
to the same array starting at position target

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `number` | If target is negative, it is treated as length+target where length is the length of the array. |
| `start` | `number` | If start is negative, it is treated as length+start. If end is negative, it is treated as length+end. |
| `end?` | `number` | If not specified, length of the this object is used as its default value. |

#### Returns

[StatusMsg](eth.eth-1.statusmsg.md)

#### Inherited from

Array.copyWithin

#### Defined in

node_modules/typescript/lib/lib.es2015.core.d.ts:64

___

### entries

▸ **entries**(): `IterableIterator`<[`number`, `Buffer` \| `Buffer`[]]\>

Returns an iterable of key, value pairs for every entry in the array

#### Returns

`IterableIterator`<[`number`, `Buffer` \| `Buffer`[]]\>

#### Inherited from

Array.entries

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:65

___

### every

▸ **every**(`callbackfn`, `thisArg?`): `boolean`

Determines whether all the members of an array satisfy the specified test.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`value`: `Buffer` \| `Buffer`[], `index`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => `unknown` | A function that accepts up to three arguments. The every method calls the callbackfn function for each element in the array until the callbackfn returns a value which is coercible to the Boolean value false, or until the end of the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`boolean`

#### Inherited from

Array.every

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1310

___

### fill

▸ **fill**(`value`, `start?`, `end?`): [StatusMsg](eth.eth-1.statusmsg.md)

Returns the this object after filling the section identified by start and end with value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `Buffer` \| `Buffer`[] | value to fill array section with |
| `start?` | `number` | index to start filling the array at. If start is negative, it is treated as length+start where length is the length of the array. |
| `end?` | `number` | index to stop filling the array at. If end is negative, it is treated as length+end. |

#### Returns

[StatusMsg](eth.eth-1.statusmsg.md)

#### Inherited from

Array.fill

#### Defined in

node_modules/typescript/lib/lib.es2015.core.d.ts:53

___

### filter

▸ **filter**<S\>(`callbackfn`, `thisArg?`): `S`[]

Returns the elements of an array that meet the condition specified in a callback function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | `S`: `Buffer` \| `Buffer`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`value`: `Buffer` \| `Buffer`[], `index`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => value is S | A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`S`[]

#### Inherited from

Array.filter

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1337

▸ **filter**(`callbackfn`, `thisArg?`): (`Buffer` \| `Buffer`[])[]

Returns the elements of an array that meet the condition specified in a callback function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`value`: `Buffer` \| `Buffer`[], `index`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => `unknown` | A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

(`Buffer` \| `Buffer`[])[]

#### Inherited from

Array.filter

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1343

___

### find

▸ **find**<S\>(`predicate`, `thisArg?`): `undefined` \| `S`

Returns the value of the first element in the array where predicate is true, and undefined
otherwise.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | `S`: `Buffer` \| `Buffer`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`value`: `Buffer` \| `Buffer`[], `index`: `number`, `obj`: (`Buffer` \| `Buffer`[])[]) => value is S | find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

#### Returns

`undefined` \| `S`

#### Inherited from

Array.find

#### Defined in

node_modules/typescript/lib/lib.es2015.core.d.ts:31

▸ **find**(`predicate`, `thisArg?`): `undefined` \| `Buffer` \| `Buffer`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `predicate` | (`value`: `Buffer` \| `Buffer`[], `index`: `number`, `obj`: (`Buffer` \| `Buffer`[])[]) => `unknown` |
| `thisArg?` | `any` |

#### Returns

`undefined` \| `Buffer` \| `Buffer`[]

#### Inherited from

Array.find

#### Defined in

node_modules/typescript/lib/lib.es2015.core.d.ts:32

___

### findIndex

▸ **findIndex**(`predicate`, `thisArg?`): `number`

Returns the index of the first element in the array where predicate is true, and -1
otherwise.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`value`: `Buffer` \| `Buffer`[], `index`: `number`, `obj`: (`Buffer` \| `Buffer`[])[]) => `unknown` | find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

#### Returns

`number`

#### Inherited from

Array.findIndex

#### Defined in

node_modules/typescript/lib/lib.es2015.core.d.ts:43

___

### forEach

▸ **forEach**(`callbackfn`, `thisArg?`): `void`

Performs the specified action for each element in an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`value`: `Buffer` \| `Buffer`[], `index`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => `void` | A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`void`

#### Inherited from

Array.forEach

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1325

___

### includes

▸ **includes**(`searchElement`, `fromIndex?`): `boolean`

Determines whether an array includes a certain element, returning true or false as appropriate.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `searchElement` | `Buffer` \| `Buffer`[] | The element to search for. |
| `fromIndex?` | `number` | The position in this array at which to begin searching for searchElement. |

#### Returns

`boolean`

#### Inherited from

Array.includes

#### Defined in

node_modules/typescript/lib/lib.es2016.array.include.d.ts:27

___

### indexOf

▸ **indexOf**(`searchElement`, `fromIndex?`): `number`

Returns the index of the first occurrence of a value in an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `searchElement` | `Buffer` \| `Buffer`[] | The value to locate in the array. |
| `fromIndex?` | `number` | The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0. |

#### Returns

`number`

#### Inherited from

Array.indexOf

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1295

___

### join

▸ **join**(`separator?`): `string`

Adds all the elements of an array separated by the specified separator string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `separator?` | `string` | A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma. |

#### Returns

`string`

#### Inherited from

Array.join

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1247

___

### keys

▸ **keys**(): `IterableIterator`<number\>

Returns an iterable of keys in the array

#### Returns

`IterableIterator`<number\>

#### Inherited from

Array.keys

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:70

___

### lastIndexOf

▸ **lastIndexOf**(`searchElement`, `fromIndex?`): `number`

Returns the index of the last occurrence of a specified value in an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `searchElement` | `Buffer` \| `Buffer`[] | The value to locate in the array. |
| `fromIndex?` | `number` | The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array. |

#### Returns

`number`

#### Inherited from

Array.lastIndexOf

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1301

___

### map

▸ **map**<U\>(`callbackfn`, `thisArg?`): `U`[]

Calls a defined callback function on each element of an array, and returns an array that contains the results.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`value`: `Buffer` \| `Buffer`[], `index`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => `U` | A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`U`[]

#### Inherited from

Array.map

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1331

___

### pop

▸ **pop**(): `undefined` \| `Buffer` \| `Buffer`[]

Removes the last element from an array and returns it.

#### Returns

`undefined` \| `Buffer` \| `Buffer`[]

#### Inherited from

Array.pop

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1227

___

### push

▸ **push**(...`items`): `number`

Appends new elements to an array, and returns the new length of the array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...items` | (`Buffer` \| `Buffer`[])[] | New elements of the Array. |

#### Returns

`number`

#### Inherited from

Array.push

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1232

___

### reduce

▸ **reduce**(`callbackfn`): `Buffer` \| `Buffer`[]

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`previousValue`: `Buffer` \| `Buffer`[], `currentValue`: `Buffer` \| `Buffer`[], `currentIndex`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => `Buffer` \| `Buffer`[] | A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array. |

#### Returns

`Buffer` \| `Buffer`[]

#### Inherited from

Array.reduce

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1349

▸ **reduce**(`callbackfn`, `initialValue`): `Buffer` \| `Buffer`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`previousValue`: `Buffer` \| `Buffer`[], `currentValue`: `Buffer` \| `Buffer`[], `currentIndex`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => `Buffer` \| `Buffer`[] |
| `initialValue` | `Buffer` \| `Buffer`[] |

#### Returns

`Buffer` \| `Buffer`[]

#### Inherited from

Array.reduce

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1350

▸ **reduce**<U\>(`callbackfn`, `initialValue`): `U`

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`previousValue`: `U`, `currentValue`: `Buffer` \| `Buffer`[], `currentIndex`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => `U` | A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array. |
| `initialValue` | `U` | If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value. |

#### Returns

`U`

#### Inherited from

Array.reduce

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1356

___

### reduceRight

▸ **reduceRight**(`callbackfn`): `Buffer` \| `Buffer`[]

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`previousValue`: `Buffer` \| `Buffer`[], `currentValue`: `Buffer` \| `Buffer`[], `currentIndex`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => `Buffer` \| `Buffer`[] | A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array. |

#### Returns

`Buffer` \| `Buffer`[]

#### Inherited from

Array.reduceRight

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1362

▸ **reduceRight**(`callbackfn`, `initialValue`): `Buffer` \| `Buffer`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`previousValue`: `Buffer` \| `Buffer`[], `currentValue`: `Buffer` \| `Buffer`[], `currentIndex`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => `Buffer` \| `Buffer`[] |
| `initialValue` | `Buffer` \| `Buffer`[] |

#### Returns

`Buffer` \| `Buffer`[]

#### Inherited from

Array.reduceRight

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1363

▸ **reduceRight**<U\>(`callbackfn`, `initialValue`): `U`

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`previousValue`: `U`, `currentValue`: `Buffer` \| `Buffer`[], `currentIndex`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => `U` | A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array. |
| `initialValue` | `U` | If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value. |

#### Returns

`U`

#### Inherited from

Array.reduceRight

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1369

___

### reverse

▸ **reverse**(): (`Buffer` \| `Buffer`[])[]

Reverses the elements in an Array.

#### Returns

(`Buffer` \| `Buffer`[])[]

#### Inherited from

Array.reverse

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1251

___

### shift

▸ **shift**(): `undefined` \| `Buffer` \| `Buffer`[]

Removes the first element from an array and returns it.

#### Returns

`undefined` \| `Buffer` \| `Buffer`[]

#### Inherited from

Array.shift

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1255

___

### slice

▸ **slice**(`start?`, `end?`): (`Buffer` \| `Buffer`[])[]

Returns a section of an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start?` | `number` | The beginning of the specified portion of the array. |
| `end?` | `number` | The end of the specified portion of the array. This is exclusive of the element at the index 'end'. |

#### Returns

(`Buffer` \| `Buffer`[])[]

#### Inherited from

Array.slice

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1261

___

### some

▸ **some**(`callbackfn`, `thisArg?`): `boolean`

Determines whether the specified callback function returns true for any element of an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`value`: `Buffer` \| `Buffer`[], `index`: `number`, `array`: (`Buffer` \| `Buffer`[])[]) => `unknown` | A function that accepts up to three arguments. The some method calls the callbackfn function for each element in the array until the callbackfn returns a value which is coercible to the Boolean value true, or until the end of the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`boolean`

#### Inherited from

Array.some

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1319

___

### sort

▸ **sort**(`compareFn?`): [StatusMsg](eth.eth-1.statusmsg.md)

Sorts an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compareFn?` | (`a`: `Buffer` \| `Buffer`[], `b`: `Buffer` \| `Buffer`[]) => `number` | Function used to determine the order of the elements. It is expected to return a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order. ```ts [11,2,22,1].sort((a, b) => a - b) ``` |

#### Returns

[StatusMsg](eth.eth-1.statusmsg.md)

#### Inherited from

Array.sort

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1271

___

### splice

▸ **splice**(`start`, `deleteCount?`): (`Buffer` \| `Buffer`[])[]

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount?` | `number` | The number of elements to remove. |

#### Returns

(`Buffer` \| `Buffer`[])[]

#### Inherited from

Array.splice

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1277

▸ **splice**(`start`, `deleteCount`, ...`items`): (`Buffer` \| `Buffer`[])[]

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount` | `number` | The number of elements to remove. |
| `...items` | (`Buffer` \| `Buffer`[])[] | Elements to insert into the array in place of the deleted elements. |

#### Returns

(`Buffer` \| `Buffer`[])[]

#### Inherited from

Array.splice

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1284

___

### toLocaleString

▸ **toLocaleString**(): `string`

Returns a string representation of an array. The elements are converted to string using their toLocalString methods.

#### Returns

`string`

#### Inherited from

Array.toLocaleString

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1223

___

### toString

▸ **toString**(): `string`

Returns a string representation of an array.

#### Returns

`string`

#### Inherited from

Array.toString

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1219

___

### unshift

▸ **unshift**(...`items`): `number`

Inserts new elements at the start of an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...items` | (`Buffer` \| `Buffer`[])[] | Elements to insert at the start of the Array. |

#### Returns

`number`

#### Inherited from

Array.unshift

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1289

___

### values

▸ **values**(): `IterableIterator`<Buffer \| Buffer[]\>

Returns an iterable of values in the array

#### Returns

`IterableIterator`<Buffer \| Buffer[]\>

#### Inherited from

Array.values

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:75
