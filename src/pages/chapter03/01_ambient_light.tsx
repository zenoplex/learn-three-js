import * as React from 'react';
import { Canvas } from 'react-three-fiber';
import * as Three from 'three';
import DatGui, { DatNumber, DatColor, DatBoolean } from 'react-dat-gui';

const BoundingWallMaterial = new Three.MeshPhongMaterial({ color: 0xa0522d });

const BoundingWall = (): JSX.Element => {
  return (
    <>
      {/* left wall */}
      <mesh position={[15, 1, -25]} material={BoundingWallMaterial}>
        <boxBufferGeometry attach="geometry" args={[70, 2, 2]} />
      </mesh>
      {/* right wall */}
      <mesh position={[15, 1, 25]} material={BoundingWallMaterial}>
        <boxBufferGeometry attach="geometry" args={[70, 2, 2]} />
      </mesh>
      {/* top wall */}
      <mesh position={[-19, 1, 0]} material={BoundingWallMaterial}>
        <boxBufferGeometry attach="geometry" args={[2, 2, 50]} />
      </mesh>
      {/* bottom wall */}
      <mesh position={[49, 1, 0]} material={BoundingWallMaterial}>
        <boxBufferGeometry attach="geometry" args={[2, 2, 50]} />
      </mesh>
    </>
  );
};

const Ground = (): JSX.Element => {
  return (
    <>
      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[15, 0, 0]}
        receiveShadow>
        <planeBufferGeometry attach="geometry" args={[70, 50]} />
        <meshPhongMaterial attach="material" color={0x9acd32} />
      </mesh>
    </>
  );
};

const House = (): JSX.Element => {
  return (
    <>
      {/* Roof */}
      <mesh position={[25, 8, 0]} receiveShadow castShadow>
        <coneBufferGeometry attach="geometry" args={[5, 4]} />
        <meshPhongMaterial attach="material" color={0x8b7213} />
      </mesh>
      {/* Base */}
      <mesh position={[25, 3, 0]} receiveShadow castShadow>
        <cylinderBufferGeometry attach="geometry" args={[5, 5, 6]} />
        <meshPhongMaterial attach="material" color={0xffe4c4} />
      </mesh>
    </>
  );
};

const Tree = (): JSX.Element => {
  return (
    <>
      {/* trunk */}
      <mesh position={[-10, 4, 0]} receiveShadow castShadow>
        <boxBufferGeometry attach="geometry" args={[1, 8, 1]} />
        <meshPhongMaterial attach="material" color={0x8b4513} />
      </mesh>
      {/* leaves */}
      <mesh position={[-10, 12, 0]} receiveShadow castShadow>
        <sphereBufferGeometry attach="geometry" args={[4]} />
        <meshPhongMaterial attach="material" color={0x00ff00} />
      </mesh>
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    intensity: 1,
    ambientColor: '#606008',
    disableSpotLight: false,
  });

  return (
    <>
      <Canvas
        shadowMap
        camera={{
          fov: 45,
          position: [-30, 40, 30],
          near: 0.1,
          far: 1000,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <BoundingWall />
        <Ground />
        <House />
        <Tree />
        <spotLight
          color={0xffffff}
          intensity={1}
          distance={180}
          angle={Math.PI / 4}
          shadowMapWidth={2048}
          shadowMapHeight={2048}
          position={[-30, 40, -10]}
          castShadow
          visible={!state.disableSpotLight}
        />
        <ambientLight color={state.ambientColor} intensity={state.intensity} />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatNumber path="intensity" min={0} max={3} step={0.1} />
        <DatColor path="ambientColor" />
        <DatBoolean path="disableSpotLight" />
      </DatGui>
    </>
  );
};

export default Page;
