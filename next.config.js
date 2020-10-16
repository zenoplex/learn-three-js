/* eslint-disable @typescript-eslint/no-var-requires */

// required to enable SSR with drei
const withTM = require('next-transpile-modules')([
  'drei',
  'three',
  'postprocessing',
  'react-three-gui',
  'three-js-csg-es6',
]);

// eslint-disable-next-line functional/immutable-data
module.exports = withTM({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(frag|vert)$/,
      use: [{ loader: 'raw-loader' }],
      exclude: /node_modules/,
    });
    return config;
  },
});
