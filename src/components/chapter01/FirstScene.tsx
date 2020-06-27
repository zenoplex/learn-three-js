import * as React from 'react';
import * as Three from 'three';
import { Canvas } from 'react-three-fiber';

const FirstScene = (): JSX.Element => {
  return (
    <Canvas
      camera={{
        fov: 45,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000,
        position: [-30, 40, 30],
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new Three.Color(0x000000));
      }}>
      <mesh visible position={[15, 0, 0]} rotation={[-0.5 * Math.PI, 0, 0]}>
        <planeGeometry attach="geometry" args={[60, 20]} />
        <meshBasicMaterial attach="material" color={0xaaaaaa} />
      </mesh>

      <mesh visible position={[-4, 3, 0]}>
        <boxGeometry attach="geometry" args={[4, 4, 4]} />
        <meshBasicMaterial attach="material" color={0xff0000} wireframe />
      </mesh>

      <mesh visible position={[20, 4, 2]}>
        <sphereGeometry attach="geometry" args={[4, 20, 20]} />
        <meshBasicMaterial attach="material" color={0x7777ff} wireframe />
      </mesh>
      <axesHelper args={[20]} />
    </Canvas>
  );
};

export default FirstScene;
