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

type AbstractShapeProps = {
  readonly geometry: Three.Geometry | Three.BufferGeometry;
  readonly material: Three.Material;
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly position: [number, number, number];
  readonly castShadow?: boolean;
};

const AbstractShape = ({
  geometry,
  position,
  material,
  castShadow,
}: AbstractShapeProps): JSX.Element => {
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      castShadow={castShadow}
    />
  );
};

const planeWidth = 60;
const planeHeight = 40;

const cylinderGeometry = new Three.CylinderBufferGeometry(1, 4, 4);
const boxGeometry = new Three.BoxBufferGeometry(2, 2, 2);
const sphereGeometry = new Three.SphereBufferGeometry(2);
const icosahedreonGeometry = new Three.IcosahedronBufferGeometry(4);
const convexGeometry = new ConvexGeometry([
  new Three.Vector3(2, 2, 2),
  new Three.Vector3(2, 2, -2),
  new Three.Vector3(-2, 2, -2),
  new Three.Vector3(-2, 2, 2),
  new Three.Vector3(2, -2, 2),
  new Three.Vector3(2, -2, -2),
  new Three.Vector3(-2, -2, -2),
  new Three.Vector3(-2, -2, 2),
]);
const detail = 0.1;
const radius = 3;
const points = new Array(Math.floor(Math.PI / detail))
  .fill(null)
  .map((_, index) => {
    const angle = index * detail;
    return new Three.Vector2(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
    );
  });
const latheGeometry = new Three.LatheBufferGeometry(points, 12);
const octahedronGeometry = new Three.OctahedronBufferGeometry(3);
const parametricGeometry = new Three.ParametricBufferGeometry(
  ParametricGeometries.mobius3d,
  20,
  10,
);
const tetrahedronGeometry = new Three.TetrahedronBufferGeometry(3);
const torusGeometry = new Three.TorusBufferGeometry(3, 1, 10, 10);
const torusKnotGeometry = new Three.TorusKnotBufferGeometry(3, 0.5, 50, 20);
const geoms = [
  cylinderGeometry,
  boxGeometry,
  sphereGeometry,
  icosahedreonGeometry,
  convexGeometry,
  latheGeometry,
  octahedronGeometry,
  parametricGeometry,
  tetrahedronGeometry,
  torusGeometry,
  torusKnotGeometry,
];
const wireframeMaterial = new Three.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true,
});
const colCount = 4;

const Page = (): JSX.Element => {
  const meshes = geoms.map((geometry, index) => {
    return {
      geometry,
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

        {meshes.map(({ geometry, position }, index) => (
          <React.Fragment key={index}>
            <AbstractShape
              geometry={geometry}
              position={position}
              material={
                new Three.MeshLambertMaterial({
                  color: Math.random() * 0xffffff,
                })
              }
              castShadow
            />
            <AbstractShape
              geometry={geometry}
              position={position}
              material={wireframeMaterial}
            />
          </React.Fragment>
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

export default Page;
