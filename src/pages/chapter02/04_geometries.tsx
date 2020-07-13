import * as React from 'react';
import * as Three from 'three';
import { Canvas } from 'react-three-fiber';
import { Stats, TrackballControls } from 'drei';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries';

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

type MeshProps = {
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly position: [number, number, number];
};

const Cylinder = ({ position }: MeshProps): JSX.Element => {
  // Note: Do not memoize like this unless needed. Its better to have variable outside react
  const geom = React.useMemo(
    () => new Three.CylinderBufferGeometry(1, 4, 4),
    [],
  );

  return (
    <>
      <mesh position={position} geometry={geom} castShadow>
        <meshLambertMaterial
          attach="material"
          color={Math.random() * 0xffffff}
        />
      </mesh>
      <mesh position={position} geometry={geom}>
        <meshBasicMaterial attach="material" color={0x000000} wireframe />
      </mesh>
    </>
  );
};

const Box = ({ position }: MeshProps): JSX.Element => {
  const geom = React.useMemo(() => new Three.BoxBufferGeometry(2, 2, 2), []);

  return (
    <>
      <mesh geometry={geom} position={position} castShadow>
        <meshLambertMaterial
          attach="material"
          color={Math.random() * 0xffffff}
        />
      </mesh>
      <mesh geometry={geom} position={position}>
        <meshBasicMaterial attach="material" color={0x000000} wireframe />
      </mesh>
    </>
  );
};

const Sphere = ({ position }: MeshProps): JSX.Element => {
  const geom = React.useMemo(() => new Three.SphereBufferGeometry(2), []);
  return (
    <>
      <mesh geometry={geom} position={position} castShadow>
        <meshLambertMaterial
          attach="material"
          color={Math.random() * 0xffffff}
        />
      </mesh>
      <mesh geometry={geom} position={position}>
        <meshBasicMaterial attach="material" color={0x000000} wireframe />
      </mesh>
    </>
  );
};

const Icosahedron = ({ position }: MeshProps): JSX.Element => {
  const geom = React.useMemo(() => new Three.IcosahedronBufferGeometry(4), []);
  return (
    <>
      <mesh geometry={geom} position={position} castShadow>
        <meshLambertMaterial
          attach="material"
          color={Math.random() * 0xffffff}
        />
      </mesh>
      <mesh geometry={geom} position={position}>
        <meshBasicMaterial attach="material" color={0x000000} wireframe />
      </mesh>
    </>
  );
};

const Convex = ({ position }: MeshProps): JSX.Element => {
  const geom = React.useMemo(() => {
    const points = [
      new Three.Vector3(2, 2, 2),
      new Three.Vector3(2, 2, -2),
      new Three.Vector3(-2, 2, -2),
      new Three.Vector3(-2, 2, 2),
      new Three.Vector3(2, -2, 2),
      new Three.Vector3(2, -2, -2),
      new Three.Vector3(-2, -2, -2),
      new Three.Vector3(-2, -2, 2),
    ];
    return new ConvexGeometry(points);
  }, []);

  return (
    <>
      <mesh geometry={geom} position={position} castShadow>
        <meshLambertMaterial
          attach="material"
          color={Math.random() * 0xffffff}
        />
      </mesh>
      <mesh geometry={geom} position={position}>
        <meshBasicMaterial attach="material" color={0x000000} wireframe />
      </mesh>
    </>
  );
};

const Lathe = ({ position }: MeshProps): JSX.Element => {
  const detail = 0.1;
  const radius = 3;

  const geom = React.useMemo(() => {
    const points = new Array(Math.floor(Math.PI / detail))
      .fill(null)
      .map((_, index) => {
        const angle = index * detail;
        return new Three.Vector2(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
        );
      });

    return new Three.LatheBufferGeometry(points, 12);
  }, []);

  return (
    <>
      <mesh geometry={geom} position={position} castShadow>
        <meshLambertMaterial
          attach="material"
          color={Math.random() * 0xffffff}
        />
      </mesh>
      <mesh geometry={geom} position={position}>
        <meshBasicMaterial attach="material" color={0x000000} wireframe />
      </mesh>
    </>
  );
};

const Octahedron = ({ position }: MeshProps): JSX.Element => {
  const geom = React.useMemo(() => new Three.OctahedronGeometry(3), []);
  return (
    <>
      <mesh geometry={geom} position={position} castShadow>
        <meshLambertMaterial
          attach="material"
          color={Math.random() * 0xffffff}
        />
      </mesh>
      <mesh geometry={geom} position={position}>
        <meshBasicMaterial attach="material" color={0x000000} wireframe />
      </mesh>
    </>
  );
};

const Parametric = ({ position }: MeshProps): JSX.Element => {
  const geom = React.useMemo(
    () => new Three.ParametricGeometry(ParametricGeometries.mobius3d, 20, 10),
    [],
  );

  return (
    <>
      <mesh geometry={geom} position={position} castShadow>
        <meshLambertMaterial
          attach="material"
          color={Math.random() * 0xffffff}
        />
      </mesh>
      <mesh geometry={geom} position={position}>
        <meshBasicMaterial attach="material" color={0x000000} wireframe />
      </mesh>
    </>
  );
};

const Tetrahedron = ({ position }: MeshProps): JSX.Element => {
  const geom = React.useMemo(() => new Three.TetrahedronGeometry(3), []);
  return (
    <>
      <mesh geometry={geom} position={position} castShadow>
        <meshLambertMaterial
          attach="material"
          color={Math.random() * 0xffffff}
        />
      </mesh>
      <mesh geometry={geom} position={position}>
        <meshBasicMaterial attach="material" color={0x000000} wireframe />
      </mesh>
    </>
  );
};

const Torus = ({ position }: MeshProps): JSX.Element => {
  const geom = React.useMemo(() => new Three.TorusGeometry(3, 1, 10, 10), []);
  return (
    <>
      <mesh geometry={geom} position={position} castShadow>
        <meshLambertMaterial
          attach="material"
          color={Math.random() * 0xffffff}
        />
      </mesh>
      <mesh geometry={geom} position={position}>
        <meshBasicMaterial attach="material" color={0x000000} wireframe />
      </mesh>
    </>
  );
};

const TorusKnot = ({ position }: MeshProps): JSX.Element => {
  const geom = React.useMemo(
    () => new Three.TorusKnotGeometry(3, 0.5, 50, 20),
    [],
  );
  return (
    <>
      <mesh geometry={geom} position={position} castShadow>
        <meshLambertMaterial
          attach="material"
          color={Math.random() * 0xffffff}
        />
      </mesh>
      <mesh geometry={geom} position={position}>
        <meshBasicMaterial attach="material" color={0x000000} wireframe />
      </mesh>
    </>
  );
};

const planeWidth = 60;
const planeHeight = 40;

const colCount = 4;

const Page = (): JSX.Element => {
  const meshes = [
    Cylinder,
    Box,
    Sphere,
    Icosahedron,
    Convex,
    Lathe,
    Octahedron,
    Parametric,
    Tetrahedron,
    Torus,
    TorusKnot,
  ].map((mesh, index) => {
    return {
      Component: mesh,
      position: [
        -24 + (index % colCount) * 12,
        4,
        -8 + Math.floor(index / colCount) * 12,
        // eslint-disable-next-line functional/prefer-readonly-type
      ] as [number, number, number],
    };
  });

  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [-50, 30, 20],
          // lookAt: (...args) => {console},
        }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <Plain width={planeWidth} height={planeHeight} />

        {meshes.map(({ Component, position }, index) => (
          <Component key={index} position={position} />
        ))}

        <ambientLight color={0x555555} />
        <spotLight
          color={0xffffff}
          intensity={1.2}
          distance={150}
          angle={Math.PI / 4}
          position={[-40, 30, 30]}
          castShadow
          decay={2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <TrackballControls />
        <Stats />
      </Canvas>
    </>
  );
};

new Three.SpotLight();

export default Page;
