import * as React from 'react';
import dynamic from 'next/dynamic';

const Canvas = dynamic(import('~/components/chapter02/ForcedMaterial'), {
  ssr: false,
});

const Page = (): JSX.Element => {
  return <Canvas />;
};

export default Page;
