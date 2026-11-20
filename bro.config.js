const webpack = require('webpack')
const pkg = require('./package.json')

const babelOptions = {
  presets: [
    ['@babel/preset-env', { targets: 'defaults' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
}

module.exports = {
  apiPath: 'stubs/api',
  htmlTemplatePath: 'bro.html',
  webpackConfig: {
    output: {
      publicPath: `/static/${pkg.name}/${process.env.VERSION || pkg.version}/`,
    },
    plugins: [new webpack.ProvidePlugin({ React: 'react' })],
  },
  navigations: {
    'atlas.main': '/atlas-travel',
  },
  features: {
    atlas: {
      'trip.gigachat.enabled': { value: 'true' },
    },
  },
  config: {
    'atlas.api': '/api',
  },
}
