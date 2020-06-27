import * as React from 'react';
import dynamic from 'next/dynamic';

const Canvas = dynamic(import('~/components/chapter01/FirstScene'), {
  ssr: false,
});

const Page = (): JSX.Element => {
  return <Canvas />;
};

export default Page;
