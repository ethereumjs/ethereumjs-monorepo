[**@ethereumjs/devp2p**](../../../README.md)

***

[@ethereumjs/devp2p](../../../README.md) / [ETH](../README.md) / StatusMsg

# Interface: StatusMsg

Defined in: [packages/devp2p/src/protocol/eth.ts:379](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L379)

## Extends

- `Array`\<`Uint8Array` \| `Uint8Array`[]\>

## Indexable

\[`n`: `number`\]: `Uint8Array` \| `Uint8Array`[]

## Properties

### \[unscopables\]

> `readonly` **\[unscopables\]**: `object`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:97

Is an object whose properties have the value 'true'
when they will be absent when used in a 'with' statement.

#### Index Signature

\[`key`: `number`\]: `undefined` \| `boolean`

#### \[unscopables\]?

> `readonly` `optional` **\[unscopables\]**: `boolean`

Is an object whose properties have the value 'true'
when they will be absent when used in a 'with' statement.

#### length?

> `optional` **length**: `boolean`

Gets or sets the length of the array. This is a number one higher than the highest index in the array.

#### \[iterator\]?

> `optional` **\[iterator\]**

#### at?

> `optional` **at**

#### concat?

> `optional` **concat**

#### copyWithin?

> `optional` **copyWithin**

#### entries?

> `optional` **entries**

#### every?

> `optional` **every**

#### fill?

> `optional` **fill**

#### filter?

> `optional` **filter**

#### find?

> `optional` **find**

#### findIndex?

> `optional` **findIndex**

#### flat?

> `optional` **flat**

#### flatMap?

> `optional` **flatMap**

#### forEach?

> `optional` **forEach**

#### includes?

> `optional` **includes**

#### indexOf?

> `optional` **indexOf**

#### join?

> `optional` **join**

#### keys?

> `optional` **keys**

#### lastIndexOf?

> `optional` **lastIndexOf**

#### map?

> `optional` **map**

#### pop?

> `optional` **pop**

#### push?

> `optional` **push**

#### reduce?

> `optional` **reduce**

#### reduceRight?

> `optional` **reduceRight**

#### reverse?

> `optional` **reverse**

#### shift?

> `optional` **shift**

#### slice?

> `optional` **slice**

#### some?

> `optional` **some**

#### sort?

> `optional` **sort**

#### splice?

> `optional` **splice**

#### toLocaleString?

> `optional` **toLocaleString**

#### toString?

> `optional` **toString**

#### unshift?

> `optional` **unshift**

#### values?

> `optional` **values**

#### Inherited from

`Array.[unscopables]`

***

### length

> **length**: `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1305

Gets or sets the length of the array. This is a number one higher than the highest index in the array.

#### Inherited from

`Array.length`

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`Uint8Array` \| `Uint8Array`[]\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:58

Iterator

#### Returns

`IterableIterator`\<`Uint8Array` \| `Uint8Array`[]\>

#### Inherited from

`Array.[iterator]`

***

### at()

> **at**(`index`): `undefined` \| `Uint8Array` \| `Uint8Array`[]

Defined in: packages/devp2p/node\_modules/@types/node/compatibility/indexable.d.ts:7

#### Parameters

##### index

`number`

#### Returns

`undefined` \| `Uint8Array` \| `Uint8Array`[]

#### Inherited from

`Array.at`

***

### concat()

#### Call Signature

> **concat**(...`items`): (`Uint8Array` \| `Uint8Array`[])[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1329

Combines two or more arrays.
This method returns a new array without modifying any existing arrays.

##### Parameters

###### items

...`ConcatArray`\<`Uint8Array` \| `Uint8Array`[]\>[]

Additional arrays and/or items to add to the end of the array.

##### Returns

(`Uint8Array` \| `Uint8Array`[])[]

##### Inherited from

`Array.concat`

#### Call Signature

> **concat**(...`items`): (`Uint8Array` \| `Uint8Array`[])[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1335

Combines two or more arrays.
This method returns a new array without modifying any existing arrays.

##### Parameters

###### items

...(`Uint8Array` \| `Uint8Array`[] \| `ConcatArray`\<`Uint8Array` \| `Uint8Array`[]\>)[]

Additional arrays and/or items to add to the end of the array.

##### Returns

(`Uint8Array` \| `Uint8Array`[])[]

##### Inherited from

`Array.concat`

***

### copyWithin()

> **copyWithin**(`target`, `start`, `end`?): `this`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:62

Returns the this object after copying a section of the array identified by start and end
to the same array starting at position target

#### Parameters

##### target

`number`

If target is negative, it is treated as length+target where length is the
length of the array.

##### start

`number`

If start is negative, it is treated as length+start. If end is negative, it
is treated as length+end.

##### end?

`number`

If not specified, length of the this object is used as its default value.

#### Returns

`this`

#### Inherited from

`Array.copyWithin`

***

### entries()

> **entries**(): `IterableIterator`\<\[`number`, `Uint8Array` \| `Uint8Array`[]\]\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:63

Returns an iterable of key, value pairs for every entry in the array

#### Returns

`IterableIterator`\<\[`number`, `Uint8Array` \| `Uint8Array`[]\]\>

#### Inherited from

`Array.entries`

***

### every()

#### Call Signature

> **every**\<`S`\>(`predicate`, `thisArg`?): `this is S[]`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1412

Determines whether all the members of an array satisfy the specified test.

##### Type Parameters

• **S** *extends* `Uint8Array` \| `Uint8Array`[]

##### Parameters

###### predicate

(`value`, `index`, `array`) => `value is S`

A function that accepts up to three arguments. The every method calls
the predicate function for each element in the array until the predicate returns a value
which is coercible to the Boolean value false, or until the end of the array.

###### thisArg?

`any`

An object to which the this keyword can refer in the predicate function.
If thisArg is omitted, undefined is used as the this value.

##### Returns

`this is S[]`

##### Inherited from

`Array.every`

#### Call Signature

> **every**(`predicate`, `thisArg`?): `boolean`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1421

Determines whether all the members of an array satisfy the specified test.

##### Parameters

###### predicate

(`value`, `index`, `array`) => `unknown`

A function that accepts up to three arguments. The every method calls
the predicate function for each element in the array until the predicate returns a value
which is coercible to the Boolean value false, or until the end of the array.

###### thisArg?

`any`

An object to which the this keyword can refer in the predicate function.
If thisArg is omitted, undefined is used as the this value.

##### Returns

`boolean`

##### Inherited from

`Array.every`

***

### fill()

> **fill**(`value`, `start`?, `end`?): `this`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:51

Changes all array elements from `start` to `end` index to a static `value` and returns the modified array

#### Parameters

##### value

value to fill array section with

`Uint8Array` | `Uint8Array`[]

##### start?

`number`

index to start filling the array at. If start is negative, it is treated as
length+start where length is the length of the array.

##### end?

`number`

index to stop filling the array at. If end is negative, it is treated as
length+end.

#### Returns

`this`

#### Inherited from

`Array.fill`

***

### filter()

#### Call Signature

> **filter**\<`S`\>(`predicate`, `thisArg`?): `S`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1448

Returns the elements of an array that meet the condition specified in a callback function.

##### Type Parameters

• **S** *extends* `Uint8Array` \| `Uint8Array`[]

##### Parameters

###### predicate

(`value`, `index`, `array`) => `value is S`

A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.

###### thisArg?

`any`

An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.

##### Returns

`S`[]

##### Inherited from

`Array.filter`

#### Call Signature

> **filter**(`predicate`, `thisArg`?): (`Uint8Array` \| `Uint8Array`[])[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1454

Returns the elements of an array that meet the condition specified in a callback function.

##### Parameters

###### predicate

(`value`, `index`, `array`) => `unknown`

A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.

###### thisArg?

`any`

An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.

##### Returns

(`Uint8Array` \| `Uint8Array`[])[]

##### Inherited from

`Array.filter`

***

### find()

#### Call Signature

> **find**\<`S`\>(`predicate`, `thisArg`?): `undefined` \| `S`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:29

Returns the value of the first element in the array where predicate is true, and undefined
otherwise.

##### Type Parameters

• **S** *extends* `Uint8Array` \| `Uint8Array`[]

##### Parameters

###### predicate

(`value`, `index`, `obj`) => `value is S`

find calls predicate once for each element of the array, in ascending
order, until it finds one where predicate returns true. If such an element is found, find
immediately returns that element value. Otherwise, find returns undefined.

###### thisArg?

`any`

If provided, it will be used as the this value for each invocation of
predicate. If it is not provided, undefined is used instead.

##### Returns

`undefined` \| `S`

##### Inherited from

`Array.find`

#### Call Signature

> **find**(`predicate`, `thisArg`?): `undefined` \| `Uint8Array` \| `Uint8Array`[]

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:30

##### Parameters

###### predicate

(`value`, `index`, `obj`) => `unknown`

###### thisArg?

`any`

##### Returns

`undefined` \| `Uint8Array` \| `Uint8Array`[]

##### Inherited from

`Array.find`

***

### findIndex()

> **findIndex**(`predicate`, `thisArg`?): `number`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:41

Returns the index of the first element in the array where predicate is true, and -1
otherwise.

#### Parameters

##### predicate

(`value`, `index`, `obj`) => `unknown`

find calls predicate once for each element of the array, in ascending
order, until it finds one where predicate returns true. If such an element is found,
findIndex immediately returns that element index. Otherwise, findIndex returns -1.

##### thisArg?

`any`

If provided, it will be used as the this value for each invocation of
predicate. If it is not provided, undefined is used instead.

#### Returns

`number`

#### Inherited from

`Array.findIndex`

***

### flat()

> **flat**\<`A`, `D`\>(`this`, `depth`?): `FlatArray`\<`A`, `D`\>[]

Defined in: node\_modules/typescript/lib/lib.es2019.array.d.ts:79

Returns a new array with all sub-array elements concatenated into it recursively up to the
specified depth.

#### Type Parameters

• **A**

• **D** *extends* `number` = `1`

#### Parameters

##### this

`A`

##### depth?

`D`

The maximum recursion depth

#### Returns

`FlatArray`\<`A`, `D`\>[]

#### Inherited from

`Array.flat`

***

### flatMap()

> **flatMap**\<`U`, `This`\>(`callback`, `thisArg`?): `U`[]

Defined in: node\_modules/typescript/lib/lib.es2019.array.d.ts:68

Calls a defined callback function on each element of an array. Then, flattens the result into
a new array.
This is identical to a map followed by flat with depth 1.

#### Type Parameters

• **U**

• **This** = `undefined`

#### Parameters

##### callback

(`this`, `value`, `index`, `array`) => `U` \| readonly `U`[]

A function that accepts up to three arguments. The flatMap method calls the
callback function one time for each element in the array.

##### thisArg?

`This`

An object to which the this keyword can refer in the callback function. If
thisArg is omitted, undefined is used as the this value.

#### Returns

`U`[]

#### Inherited from

`Array.flatMap`

***

### forEach()

> **forEach**(`callbackfn`, `thisArg`?): `void`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1436

Performs the specified action for each element in an array.

#### Parameters

##### callbackfn

(`value`, `index`, `array`) => `void`

A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.

##### thisArg?

`any`

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

#### Returns

`void`

#### Inherited from

`Array.forEach`

***

### includes()

> **includes**(`searchElement`, `fromIndex`?): `boolean`

Defined in: node\_modules/typescript/lib/lib.es2016.array.include.d.ts:25

Determines whether an array includes a certain element, returning true or false as appropriate.

#### Parameters

##### searchElement

The element to search for.

`Uint8Array` | `Uint8Array`[]

##### fromIndex?

`number`

The position in this array at which to begin searching for searchElement.

#### Returns

`boolean`

#### Inherited from

`Array.includes`

***

### indexOf()

> **indexOf**(`searchElement`, `fromIndex`?): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1397

Returns the index of the first occurrence of a value in an array, or -1 if it is not present.

#### Parameters

##### searchElement

The value to locate in the array.

`Uint8Array` | `Uint8Array`[]

##### fromIndex?

`number`

The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.

#### Returns

`number`

#### Inherited from

`Array.indexOf`

***

### join()

> **join**(`separator`?): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1340

Adds all the elements of an array into a string, separated by the specified separator string.

#### Parameters

##### separator?

`string`

A string used to separate one element of the array from the next in the resulting string. If omitted, the array elements are separated with a comma.

#### Returns

`string`

#### Inherited from

`Array.join`

***

### keys()

> **keys**(): `IterableIterator`\<`number`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:68

Returns an iterable of keys in the array

#### Returns

`IterableIterator`\<`number`\>

#### Inherited from

`Array.keys`

***

### lastIndexOf()

> **lastIndexOf**(`searchElement`, `fromIndex`?): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1403

Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.

#### Parameters

##### searchElement

The value to locate in the array.

`Uint8Array` | `Uint8Array`[]

##### fromIndex?

`number`

The array index at which to begin searching backward. If fromIndex is omitted, the search starts at the last index in the array.

#### Returns

`number`

#### Inherited from

`Array.lastIndexOf`

***

### map()

> **map**\<`U`\>(`callbackfn`, `thisArg`?): `U`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1442

Calls a defined callback function on each element of an array, and returns an array that contains the results.

#### Type Parameters

• **U**

#### Parameters

##### callbackfn

(`value`, `index`, `array`) => `U`

A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.

##### thisArg?

`any`

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

#### Returns

`U`[]

#### Inherited from

`Array.map`

***

### pop()

> **pop**(): `undefined` \| `Uint8Array` \| `Uint8Array`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1318

Removes the last element from an array and returns it.
If the array is empty, undefined is returned and the array is not modified.

#### Returns

`undefined` \| `Uint8Array` \| `Uint8Array`[]

#### Inherited from

`Array.pop`

***

### push()

> **push**(...`items`): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1323

Appends new elements to the end of an array, and returns the new length of the array.

#### Parameters

##### items

...(`Uint8Array` \| `Uint8Array`[])[]

New elements to add to the array.

#### Returns

`number`

#### Inherited from

`Array.push`

***

### reduce()

#### Call Signature

> **reduce**(`callbackfn`): `Uint8Array` \| `Uint8Array`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1460

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `Uint8Array` \| `Uint8Array`[]

A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.

##### Returns

`Uint8Array` \| `Uint8Array`[]

##### Inherited from

`Array.reduce`

#### Call Signature

> **reduce**(`callbackfn`, `initialValue`): `Uint8Array` \| `Uint8Array`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1461

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `Uint8Array` \| `Uint8Array`[]

###### initialValue

`Uint8Array` | `Uint8Array`[]

##### Returns

`Uint8Array` \| `Uint8Array`[]

##### Inherited from

`Array.reduce`

#### Call Signature

> **reduce**\<`U`\>(`callbackfn`, `initialValue`): `U`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1467

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Type Parameters

• **U**

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `U`

A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.

###### initialValue

`U`

If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.

##### Returns

`U`

##### Inherited from

`Array.reduce`

***

### reduceRight()

#### Call Signature

> **reduceRight**(`callbackfn`): `Uint8Array` \| `Uint8Array`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1473

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `Uint8Array` \| `Uint8Array`[]

A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.

##### Returns

`Uint8Array` \| `Uint8Array`[]

##### Inherited from

`Array.reduceRight`

#### Call Signature

> **reduceRight**(`callbackfn`, `initialValue`): `Uint8Array` \| `Uint8Array`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1474

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `Uint8Array` \| `Uint8Array`[]

###### initialValue

`Uint8Array` | `Uint8Array`[]

##### Returns

`Uint8Array` \| `Uint8Array`[]

##### Inherited from

`Array.reduceRight`

#### Call Signature

> **reduceRight**\<`U`\>(`callbackfn`, `initialValue`): `U`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1480

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Type Parameters

• **U**

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `U`

A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.

###### initialValue

`U`

If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.

##### Returns

`U`

##### Inherited from

`Array.reduceRight`

***

### reverse()

> **reverse**(): (`Uint8Array` \| `Uint8Array`[])[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1345

Reverses the elements in an array in place.
This method mutates the array and returns a reference to the same array.

#### Returns

(`Uint8Array` \| `Uint8Array`[])[]

#### Inherited from

`Array.reverse`

***

### shift()

> **shift**(): `undefined` \| `Uint8Array` \| `Uint8Array`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1350

Removes the first element from an array and returns it.
If the array is empty, undefined is returned and the array is not modified.

#### Returns

`undefined` \| `Uint8Array` \| `Uint8Array`[]

#### Inherited from

`Array.shift`

***

### slice()

> **slice**(`start`?, `end`?): (`Uint8Array` \| `Uint8Array`[])[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1360

Returns a copy of a section of an array.
For both start and end, a negative index can be used to indicate an offset from the end of the array.
For example, -2 refers to the second to last element of the array.

#### Parameters

##### start?

`number`

The beginning index of the specified portion of the array.
If start is undefined, then the slice begins at index 0.

##### end?

`number`

The end index of the specified portion of the array. This is exclusive of the element at the index 'end'.
If end is undefined, then the slice extends to the end of the array.

#### Returns

(`Uint8Array` \| `Uint8Array`[])[]

#### Inherited from

`Array.slice`

***

### some()

> **some**(`predicate`, `thisArg`?): `boolean`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1430

Determines whether the specified callback function returns true for any element of an array.

#### Parameters

##### predicate

(`value`, `index`, `array`) => `unknown`

A function that accepts up to three arguments. The some method calls
the predicate function for each element in the array until the predicate returns a value
which is coercible to the Boolean value true, or until the end of the array.

##### thisArg?

`any`

An object to which the this keyword can refer in the predicate function.
If thisArg is omitted, undefined is used as the this value.

#### Returns

`boolean`

#### Inherited from

`Array.some`

***

### sort()

> **sort**(`compareFn`?): `this`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1371

Sorts an array in place.
This method mutates the array and returns a reference to the same array.

#### Parameters

##### compareFn?

(`a`, `b`) => `number`

Function used to determine the order of the elements. It is expected to return
a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
```ts
[11,2,22,1].sort((a, b) => a - b)
```

#### Returns

`this`

#### Inherited from

`Array.sort`

***

### splice()

#### Call Signature

> **splice**(`start`, `deleteCount`?): (`Uint8Array` \| `Uint8Array`[])[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1378

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

##### Parameters

###### start

`number`

The zero-based location in the array from which to start removing elements.

###### deleteCount?

`number`

The number of elements to remove.

##### Returns

(`Uint8Array` \| `Uint8Array`[])[]

An array containing the elements that were deleted.

##### Inherited from

`Array.splice`

#### Call Signature

> **splice**(`start`, `deleteCount`, ...`items`): (`Uint8Array` \| `Uint8Array`[])[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1386

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

##### Parameters

###### start

`number`

The zero-based location in the array from which to start removing elements.

###### deleteCount

`number`

The number of elements to remove.

###### items

...(`Uint8Array` \| `Uint8Array`[])[]

Elements to insert into the array in place of the deleted elements.

##### Returns

(`Uint8Array` \| `Uint8Array`[])[]

An array containing the elements that were deleted.

##### Inherited from

`Array.splice`

***

### toLocaleString()

> **toLocaleString**(): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1313

Returns a string representation of an array. The elements are converted to string using their toLocaleString methods.

#### Returns

`string`

#### Inherited from

`Array.toLocaleString`

***

### toString()

> **toString**(): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1309

Returns a string representation of an array.

#### Returns

`string`

#### Inherited from

`Array.toString`

***

### unshift()

> **unshift**(...`items`): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1391

Inserts new elements at the start of an array, and returns the new length of the array.

#### Parameters

##### items

...(`Uint8Array` \| `Uint8Array`[])[]

Elements to insert at the start of the array.

#### Returns

`number`

#### Inherited from

`Array.unshift`

***

### values()

> **values**(): `IterableIterator`\<`Uint8Array` \| `Uint8Array`[]\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:73

Returns an iterable of values in the array

#### Returns

`IterableIterator`\<`Uint8Array` \| `Uint8Array`[]\>

#### Inherited from

`Array.values`
