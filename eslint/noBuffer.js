// @ts-no-check
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      Identifier: (node) => {
        if (node.name === "Buffer") {
          context.report({
            node: node.parent,
            message: "No Buffers - use Uint8Array instead",
          });
        }
      },
    };
  },
};
