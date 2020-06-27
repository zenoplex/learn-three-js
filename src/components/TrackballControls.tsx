import * as React from 'react';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { extend, useThree, useFrame } from 'react-three-fiber';

// Must extends Three to interpret TrackballControls
extend({ TrackballControls });

const Controls = (): JSX.Element => {
  const ref = React.useRef<TrackballControls>();
  const { camera, gl } = useThree();

  useFrame(() => {
    if (ref.current) {
      ref.current.update();
    }
  });

  return (
    // @ts-expect-error
    <trackballControls
      ref={ref}
      args={[camera, gl.domElement]}
      rotateSpeed={1.0}
      zoomSpeed={1.2}
      panSpeed={0.8}
      dynamicDampingFactor={0.3}
      keys={[65, 83, 68]}
    />
  );
};

export default Controls;
