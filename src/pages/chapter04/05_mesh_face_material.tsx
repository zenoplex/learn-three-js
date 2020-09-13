import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import DatGui, { DatNumber } from 'react-dat-gui';
import { Stats, TrackballControls } from 'drei';

const materials = [
  new Three.MeshBasicMaterial({ color: 0x009e60 }),
  new Three.MeshBasicMaterial({ color: 0x0051ba }),
  new Three.MeshBasicMaterial({ color: 0xffd500 }),
  new Three.MeshBasicMaterial({ color: 0xff5800 }),
  new Three.MeshBasicMaterial({ color: 0xc41e3a }),
  new Three.MeshBasicMaterial({ color: 0xffffff }),
];

const geometry = new Three.BoxBufferGeometry(2.9, 2.9, 2.9);

const Cube = React.forwardRef(
  (_, ref): JSX.Element => {
    const mesh = React.useMemo(() => {
      const cubes = [...new Array(3)].flatMap((_, x) => {
        return [...new Array(3)].flatMap((_, y) => {
          return [...new Array(3)].flatMap((_, z) => {
            const cube = new Three.Mesh(geometry, materials);
            cube.position.set(x * 3 - 3, y * 3 - 3, z * 3 - 3);
            return cube;
          });
        });
      });

      const group = new Three.Mesh();
      cubes.forEach((item) => group.add(item));
      group.scale.set(2, 2, 2);
      return group;
    }, []);

    return <primitive ref={ref} object={mesh} />;
  },
);
// eslint-disable-next-line functional/immutable-data
Cube.displayName = 'Cube';

type SceneProps = {
  readonly rotationSpeed: number;
};

const Scene = ({ rotationSpeed }: SceneProps): JSX.Element => {
  const ref = React.useRef<Three.Mesh>();
  const step = React.useRef(0);

  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    if (!ref.current) return;

    step.current = step.current + rotationSpeed;
    ref.current.rotation.x = step.current;
    ref.current.rotation.y = step.current;
    ref.current.rotation.z = step.current;
    /* eslint-enable functional/immutable-data */
  });

  return (
    <>
      <Cube ref={ref} />
      <spotLight position={[-40, 60, -10]} color={0xffffff} castShadow />
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    rotationSpeed: 0.02,
  });

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{
          fov: 45,
          position: [-20, 30, 40],
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000);
        }}>
        <React.Suspense fallback={null}>
          <Scene rotationSpeed={state.rotationSpeed} />
        </React.Suspense>
        <Stats />
        <TrackballControls />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatNumber path="rotationSpeed" min={0} max={0.5} step={0.01} />
      </DatGui>
    </>
  );
};

export default Page;
