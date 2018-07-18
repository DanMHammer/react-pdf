import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import sourceMaps from 'rollup-plugin-sourcemaps';
import ignore from 'rollup-plugin-ignore';
import pkg from './package.json';

const cjs = {
  exports: 'named',
  format: 'cjs',
  sourcemap: true,
};

const esm = {
  format: 'es',
  sourcemap: true,
};

const getCJS = override => Object.assign({}, cjs, override);
const getESM = override => Object.assign({}, esm, override);

const commonPlugins = [
  sourceMaps(),
  nodeResolve(),
  babel({
    exclude: 'node_modules/**',
    presets: ['stage-0', 'react'],
    plugins: ['external-helpers'],
  }),
];

const configBase = {
  globals: { react: 'React' },
  external: ['fbjs/lib/emptyObject', 'fbjs/lib/warning'].concat(
    Object.keys(pkg.dependencies),
    Object.keys(pkg.peerDependencies),
  ),
  plugins: commonPlugins,
};

const serverConfig = Object.assign({}, configBase, {
  input: './src/node.js',
  output: [
    getESM({ file: 'dist/react-pdf.es.js' }),
    getCJS({ file: 'dist/react-pdf.cjs.js' }),
  ],
  plugins: configBase.plugins.concat(
    replace({
      __SERVER__: JSON.stringify(true),
    }),
  ),
  external: configBase.external.concat(['fs', 'path']),
});

const serverProdConfig = Object.assign({}, serverConfig, {
  output: [
    getESM({ file: 'dist/react-pdf.es.min.js' }),
    getCJS({ file: 'dist/react-pdf.cjs.min.js' }),
  ],
  plugins: serverConfig.plugins.concat(uglify()),
});

const browserConfig = Object.assign({}, configBase, {
  input: './src/dom.js',
  output: [
    getESM({ file: 'dist/react-pdf.browser.es.js' }),
    getCJS({ file: 'dist/react-pdf.browser.cjs.js' }),
  ],
  plugins: configBase.plugins.concat(
    replace({
      __SERVER__: JSON.stringify(false),
      'png-js': 'png-js/png.js',
    }),
    ignore(['fs', 'path']),
  ),
});

const browserProdConfig = Object.assign({}, browserConfig, {
  output: [
    getESM({ file: 'dist/react-pdf.browser.es.min.js' }),
    getCJS({ file: 'dist/react-pdf.browser.cjs.min.js' }),
  ],
  plugins: browserConfig.plugins.concat(uglify()),
});

export default [
  serverConfig,
  serverProdConfig,
  browserConfig,
  browserProdConfig,
];