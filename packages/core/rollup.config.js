import babel from 'rollup-plugin-babel'
import flow from 'rollup-plugin-flow'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  plugins: [
    flow(),
    babel({
      babelrc: false,
      presets: [ ['env', { modules: false, exclude: ['transform-regenerator'] }] ],
      plugins: ['transform-object-rest-spread', 'external-helpers'],
      exclude: ['node_modules/**']
    })
  ],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ]
}
