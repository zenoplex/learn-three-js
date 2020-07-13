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

const vetices = [
  new Three.Vector3(1, 3, 1),
  new Three.Vector3(1, 3, -1),
  new Three.Vector3(1, -1, 1),
  new Three.Vector3(1, -1, -1),
  new Three.Vector3(-1, 3, -1),
  new Three.Vector3(-1, 3, 1),
  new Three.Vector3(-1, -1, -1),
  new Three.Vector3(-1, -1, 1),
];

const faces = [
  new Three.Face3(0, 2, 1),
  new Three.Face3(2, 3, 1),
  new Three.Face3(4, 6, 5),
  new Three.Face3(6, 7, 5),
  new Three.Face3(4, 5, 1),
  new Three.Face3(5, 0, 1),
  new Three.Face3(7, 6, 2),
  new Three.Face3(6, 3, 2),
  new Three.Face3(5, 7, 0),
  new Three.Face3(7, 2, 0),
  new Three.Face3(1, 3, 4),
  new Three.Face3(3, 6, 4),
];

const geom = new Three.Geometry();
geom.vertices = vetices;
geom.faces = faces;
geom.computeFaceNormals();

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

const wireframeMaterial = new Three.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true,
});
const lambertMaterial = new Three.MeshLambertMaterial({
  opacity: 0.6,
  color: 0x44ff44,
  transparent: true,
});

const planeWidth = 60;
const planeHeight = 40;

const Page = (): JSX.Element => {
  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [-20, 25, 20],
          // lookAt: (...args) => {console},
        }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <Plain width={planeWidth} height={planeHeight} />

        <AbstractShape geometry={geom} material={wireframeMaterial} />
        <AbstractShape geometry={geom} material={lambertMaterial} castShadow />

        <ambientLight color={0x494949} />
        <spotLight
          color={0xffffff}
          intensity={1}
          distance={180}
          angle={Math.PI / 4}
          position={[-40, 30, 30]}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <TrackballControls />
        <Stats />
      </Canvas>
    </>
  );
};

export default Page;
