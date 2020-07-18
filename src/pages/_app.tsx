import * as React from 'react';
import { AppProps } from 'next/app';
import './global.css';
import 'react-dat-gui/dist/index.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />;
};
export default App;
