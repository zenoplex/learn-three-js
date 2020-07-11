import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import { Stats, TrackballControls } from 'drei';
import dynamic from 'next/dynamic';

const DatGui = dynamic(() => import('~/components/DatGui'), { ssr: false });

type CubeProps = {
  readonly size: number;
  readonly color: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly position: [number, number, number];
  readonly rotationSpeed: number;
};

const Cube = ({
  size,
  color,
  position,
  rotationSpeed,
}: CubeProps): JSX.Element => {
  const ref = React.useRef<Three.Mesh>();
  useFrame(() => {
    if (ref.current) {
      /* eslint-disable functional/immutable-data */
      ref.current.rotation.x += rotationSpeed;
      ref.current.rotation.y += rotationSpeed;
      ref.current.rotation.z += rotationSpeed;
      /* eslint-enable functional/immutable-data */
    }
  });

  return (
    <mesh ref={ref} visible castShadow position={position}>
      <boxGeometry attach="geometry" args={[size, size, size]} />
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  );
};

type PlaneProps = {
  readonly width: number;
  readonly height: number;
};

const Plain = ({ width, height }: PlaneProps): JSX.Element => {
  return (
    <mesh
      visible
      position={[0, 0, 0]}
      rotation={[-0.5 * Math.PI, 0, 0]}
      receiveShadow>
      <planeGeometry attach="geometry" args={[width, height, 1, 1]} />
      <meshLambertMaterial attach="material" color={0xffffff} />
    </mesh>
  );
};

type CubuData = {
  readonly size: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly position: [number, number, number];
  readonly color: number;
};

const planeWidth = 60;
const planeHeight = 40;

const datGuiOptions = {
  rotationSpeed: { min: 0, max: 0.5 },
};

const Page = (): JSX.Element => {
  const [cubes, setCubes] = React.useState<readonly CubuData[]>([]);
  const [state, setState] = React.useState({
    cubeCount: 0,
    rotationSpeed: 0.02,
  });

  React.useEffect(() => {
    const updateCubes = (): readonly CubuData[] => {
      if (cubes.length === state.cubeCount) return cubes;

      const newCubes =
        cubes.length < state.cubeCount
          ? cubes.concat(
              new Array(state.cubeCount - cubes.length).fill(null).map(() => {
                return {
                  size: Math.ceil(Math.random() * 3),
                  position: [
                    -30 + Math.round(Math.random() * planeWidth),
                    Math.round(Math.random() * 5),
                    -20 + Math.round(Math.random() * planeHeight),
                  ],
                  color: Math.random() * 0xffffff,
                };
              }),
            )
          : cubes.slice(0, state.cubeCount);
      return newCubes;
    };

    const updatedCubes = updateCubes();

    updatedCubes.map((cube) => ({
      ...cube,
      rotationSpeed: state.rotationSpeed,
    }));

    setCubes(updatedCubes);
  }, [cubes, state.cubeCount, state.rotationSpeed]);

  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [-30, 40, 30],
        }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <Plain width={planeWidth} height={planeHeight} />
        {cubes.map(({ size, color, position }, index) => {
          return (
            <Cube
              key={index}
              size={size}
              color={color}
              position={position}
              rotationSpeed={state.rotationSpeed}
            />
          );
        })}
        <spotLight
          color={0xffffff}
          intensity={1.2}
          distance={150}
          angle={120}
          position={[-40, 60, -10]}
          castShadow
        />
        <ambientLight color={0x3c3c3c} />
        <TrackballControls />
        <Stats />
      </Canvas>
      {/* @ts-expect-error jsx generics not working after dynamic */}
      <DatGui<typeof state>
        data={state}
        onChange={setState}
        options={datGuiOptions}
      />
    </>
  );
};

export default Page;
