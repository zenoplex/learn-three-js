/* eslint-disable @typescript-eslint/no-var-requires */

// required to enable SSR with drei
const withTM = require('next-transpile-modules')([
  'drei',
  'three',
  'postprocessing',
  'react-three-gui',
]);

// eslint-disable-next-line functional/immutable-data
module.exports = withTM();
