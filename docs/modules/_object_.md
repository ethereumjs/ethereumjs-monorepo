[ethereumjs-util](../README.md) › ["object"](_object_.md)

# Module: "object"

## Index

### Functions

* [defineProperties](_object_.md#const-defineproperties)

## Functions

### `Const` defineProperties

▸ **defineProperties**(`self`: any, `fields`: any, `data?`: any): *void*

*Defined in [object.ts:17](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/object.ts#L17)*

Defines properties on a `Object`. It make the assumption that underlying data is binary.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`self` | any | the `Object` to define properties on |
`fields` | any | an array fields to define. Fields can contain: * `name` - the name of the properties * `length` - the number of bytes the field can have * `allowLess` - if the field can be less than the length * `allowEmpty` |
`data?` | any | data to be validated against the definitions |

**Returns:** *void*
