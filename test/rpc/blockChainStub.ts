export function blockChain(options: any) {
  const block = {
    toJSON: () => ({
      number: options.number || 444444,
      hash: options.hash || '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf',
      transactions: options.transactions || [
        { hash: '0x0be3065cf288b071ccff922c1c601e2e5628d488b66e781c260ecee36054a2dc' },
      ],
    }),
  }
  return {
    getBlock: async function (_data: any) {
      return Promise.resolve(block)
    },
  }
}
