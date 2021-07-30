[ethereumjs-util](../README.md) / object

# Module: object

## Table of contents

### Functions

- [defineProperties](object.md#defineproperties)

## Functions

### defineProperties

▸ `Const` **defineProperties**(`self`, `fields`, `data?`): `void`

Defines properties on a `Object`. It make the assumption that underlying data is binary.

**`deprecated`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `self` | `any` | the `Object` to define properties on |
| `fields` | `any` | an array fields to define. Fields can contain: * `name` - the name of the properties * `length` - the number of bytes the field can have * `allowLess` - if the field can be less than the length * `allowEmpty` |
| `data?` | `any` | data to be validated against the definitions |

#### Returns

`void`

#### Defined in

[packages/util/src/object.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/object.ts#L17)
