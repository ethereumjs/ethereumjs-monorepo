// @ts-no-check
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      Identifier: function (node) {
        if (node.name === 'Buffer') {
          if (
            (node.parent.property.type === 'Identifier' && node.parent.property.name === 'from') ||
            (node.parent.property.type === 'Identifier' &&
              node.parent.property.name.includes('alloc'))
          ) {
            context.report({
              node: node.parent,
              message: 'No Buffer constructors - use Uint8Array instead',
            })
          }
        }
      },
    }
  },
}
