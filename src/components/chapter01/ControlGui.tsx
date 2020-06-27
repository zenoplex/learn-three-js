import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import useDatGui from '~/hooks/useDatGui';

const Plain = (): JSX.Element => {
  return (
    <mesh
      visible
      position={[15, 0, 0]}
      rotation={[-0.5 * Math.PI, 0, 0]}
      receiveShadow>
      <planeGeometry attach="geometry" args={[60, 20, 1, 1]} />
      <meshLambertMaterial attach="material" color={0xffffff} />
    </mesh>
  );
};

type CubeProps = {
  readonly rotationSpeed?: number;
};

const Cube = ({ rotationSpeed = 0.02 }: CubeProps): JSX.Element => {
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
    <mesh ref={ref} visible position={[-4, 4, 0]} castShadow>
      <boxGeometry attach="geometry" args={[4, 4, 4]} />
      <meshLambertMaterial attach="material" color={0xff0000} />
    </mesh>
  );
};

type SphereProps = {
  readonly bouncingSpeed?: number;
};

const Sphere = ({ bouncingSpeed = 0.04 }: SphereProps): JSX.Element => {
  const stepRef = React.useRef<number>(0);
  const meshRef = React.useRef<Three.Mesh>();
  useFrame(() => {
    if (meshRef.current) {
      /* eslint-disable functional/immutable-data */
      meshRef.current.position.x = 20 + 10 * Math.cos(stepRef.current);
      meshRef.current.position.y = 2 + 10 * Math.abs(Math.sin(stepRef.current));
      stepRef.current += bouncingSpeed;
      /* eslint-enable functional/immutable-data */
    }
  });

  return (
    <mesh ref={meshRef} visible position={[20, 4, 2]} castShadow>
      <sphereGeometry attach="geometry" args={[4, 20, 20]} />
      <meshLambertMaterial attach="material" color={0x7777ff} />
    </mesh>
  );
};

const ControlGui = (): JSX.Element => {
  const { rotationSpeed, bouncingSpeed } = useDatGui();

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
      <Cube rotationSpeed={rotationSpeed} />
      <Sphere bouncingSpeed={bouncingSpeed} />

      <spotLight color={0xffffff} position={[-10, 20, -5]} castShadow />

      <ambientLight color={0x353535} />
    </Canvas>
  );
};

export default ControlGui;
