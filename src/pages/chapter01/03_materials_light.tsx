import * as React from 'react';
import * as Three from 'three';
import { Canvas } from 'react-three-fiber';

const Plain = (): JSX.Element => {
  return (
    <mesh
      visible
      position={[15, 0, 0]}
      rotation={[-0.5 * Math.PI, 0, 0]}
      receiveShadow>
      <planeGeometry attach="geometry" args={[60, 20]} />
      <meshLambertMaterial attach="material" color={0xaaaaaa} />
    </mesh>
  );
};

const Cube = (): JSX.Element => {
  return (
    <mesh visible position={[-4, 2, 0]} castShadow>
      <boxGeometry attach="geometry" args={[4, 4, 4]} />
      <meshLambertMaterial attach="material" color={0xff0000} />
    </mesh>
  );
};

const Sphere = (): JSX.Element => {
  return (
    <mesh visible position={[20, 4, 2]} castShadow>
      <sphereGeometry attach="geometry" args={[4, 20, 20]} />
      <meshLambertMaterial attach="material" color={0x7777ff} />
    </mesh>
  );
};

const Page = (): JSX.Element => {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 1000,
        position: [-30, 40, 30],
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new Three.Color(0x000000));
      }}>
      <Plain />
      <Cube />
      <Sphere />

      <spotLight
        color={0xffffff}
        position={[-40, 40, -15]}
        castShadow
        shadowMapWidth={1024}
        shadowMapHeight={1024}
        shadowCameraFar={130}
        shadowCameraNear={40}
      />

      <ambientLight color={0x353535} />
    </Canvas>
  );
};

export default Page;
