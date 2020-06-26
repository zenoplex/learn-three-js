import * as React from 'react';
import dynamic from 'next/dynamic';

const Canvas = dynamic(import('~/components/chapter01/BasicSkeleton'), {
  ssr: false,
});

const BasicSkeleton = (): JSX.Element => {
  return <Canvas />;
};

export default BasicSkeleton;
