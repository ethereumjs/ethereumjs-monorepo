import typescript from 'rollup-plugin-typescript2';

const packageJson = require('./package.json');

const externals = {
    ...packageJson.devDependencies,
    ...packageJson.dependencies
  };
 
  export default {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs', // commonJS
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm', // ES Modules
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
      }),
    ],
    external: [...Object.keys(externals), 'buffer', 'ethereum-cryptography/secp256k1', 'ethereum-cryptography/keccak', 'ethereum-cryptography/utils']
  };