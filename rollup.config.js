export default {
  input: ['src/main.ts'],
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  external: ['electron', 'path','fs']
};