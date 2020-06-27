import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import Controls from '~/components/TrackballControls';
import dat from 'dat.gui';

type CubeProps = {
  readonly size: number;
};

const useDatGui = () => {
  const [cubeCount, setCubeCount] = React.useState<number>(0);
  const gui = React.useMemo(() => new dat.GUI(), []);

  React.useEffect(() => {
    gui.add({ cubeCount }, 'cubeCount', 0, 100).step(1).onChange(setCubeCount);

    return () => {
      gui.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { cubeCount };
};

const Cube = ({ size }: CubeProps): JSX.Element => {
  return (
    <mesh
      visible
      castShadow
      position={[
        -30 + Math.round(Math.random() * 60),
        Math.round(Math.random() * 5),
        -20 + Math.round(Math.random() * 40),
      ]}>
      <boxGeometry attach="geometry" args={[size, size, size]} />
      <meshLambertMaterial attach="material" color={Math.random() * 0xffffff} />
    </mesh>
  );
};

const Plain = (): JSX.Element => {
  return (
    <mesh
      visible
      position={[0, 0, 0]}
      rotation={[-0.5 * Math.PI, 0, 0]}
      receiveShadow>
      <planeGeometry attach="geometry" args={[60, 40, 1, 1]} />
      <meshLambertMaterial attach="material" color={0xffffff} />
    </mesh>
  );
};

const BasicScene = (): JSX.Element => {
  const [cubes, setCubes] = React.useState<readonly JSX.Element[]>([]);
  const { cubeCount } = useDatGui();

  React.useEffect(() => {
    if (cubes.length < cubeCount) {
      const len = cubeCount - cubes.length;
      const a = Array.from(new Array(len)).map((_, index) => {
        return <Cube size={1} key={cubes.length + index} />;
      });

      setCubes(cubes.concat(a));
    } else if (cubes.length > cubeCount) {
      setCubes(cubes.slice(0, cubeCount));
    }
  }, [cubeCount, cubes]);

  return (
    <Canvas
      camera={{
        fov: 45,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000,
        position: [-30, 40, 30],
      }}
      shadowMap
      onCreated={({ gl }) => {
        gl.setClearColor(new Three.Color(0x000000));
      }}>
      <Plain />

      {cubes}

      <spotLight
        color={0xffffff}
        intensity={1.2}
        distance={150}
        angle={120}
        position={[-40, 60, -10]}
        castShadow
      />

      <ambientLight color={0x3c3c3c} />
      <Controls />
    </Canvas>
  );
};

export default BasicScene;
