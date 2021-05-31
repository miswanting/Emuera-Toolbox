import typescript from '@rollup/plugin-typescript';

export default {
  input: ['src/main.ts'],
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [typescript()],
  external: ['electron', 'path', 'fs', 'chardet', 'iconv-lite']
};