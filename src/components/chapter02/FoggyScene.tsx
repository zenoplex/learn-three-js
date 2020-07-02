import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import Controls from '~/components/TrackballControls';
import dat from 'dat.gui';
import { Stats } from 'drei';

const useDatGui = (): {
  readonly cubeCount: number;
  readonly rotationSpeed: number;
} => {
  const [rotationSpeed, setRotationSpeed] = React.useState<number>(0.02);
  const [cubeCount, setCubeCount] = React.useState<number>(0);
  const gui = React.useMemo(() => new dat.GUI(), []);

  React.useEffect(() => {
    gui
      .add({ rotationSpeed }, 'rotationSpeed', 0, 0.5)
      .onChange(setRotationSpeed);
    gui.add({ cubeCount }, 'cubeCount', 0, 1000).step(1).onChange(setCubeCount);

    return () => {
      gui.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { cubeCount, rotationSpeed };
};

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

const BasicScene = (): JSX.Element => {
  const [cubes, setCubes] = React.useState<readonly CubuData[]>([]);
  const { cubeCount, rotationSpeed } = useDatGui();

  React.useEffect(() => {
    const updateCubes = (): readonly CubuData[] => {
      if (cubes.length === cubeCount) return cubes;

      const newCubes =
        cubes.length < cubeCount
          ? cubes.concat(
              new Array(cubeCount - cubes.length).fill(null).map(() => {
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
          : cubes.slice(0, cubeCount);
      return newCubes;
    };

    const updatedCubes = updateCubes();

    updatedCubes.map((cube) => ({ ...cube, rotationSpeed }));

    setCubes(updatedCubes);
  }, [cubeCount, cubes, rotationSpeed]);

  return (
    <Canvas
      camera={{
        fov: 45,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000,
        position: [-40, 20, 40],
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
            rotationSpeed={rotationSpeed}
          />
        );
      })}
      <ambientLight color={0x0c0c0c} />
      <spotLight
        color={0xffffff}
        intensity={1}
        distance={150}
        angle={120}
        position={[-40, 60, -10]}
        castShadow
      />
      <fog attach="fog" args={[0xffffff, 10, 100]} />
      <Controls />
      <Stats />
    </Canvas>
  );
};

export default BasicScene;
