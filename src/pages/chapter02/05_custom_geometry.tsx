import * as React from 'react';
import * as Three from 'three';
import { Canvas } from 'react-three-fiber';
import { Stats, TrackballControls } from 'drei';
import DatGui, { DatNumber, DatFolder } from 'react-dat-gui';

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

const verticies = [
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
/* eslint-disable functional/immutable-data */
geom.vertices = verticies;
geom.faces = faces;
/* eslint-enable functional/immutable-data */
geom.computeFaceNormals();

type AbstractShapeProps = {
  readonly geometry: Three.Geometry | Three.BufferGeometry;
  readonly material: Three.Material;
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly position?: [number, number, number];
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
  const [state, setState] = React.useState({
    v1: { x: 3, y: 5, z: 3 },
    v2: { x: 3, y: 5, z: 0 },
    v3: { x: 3, y: 0, z: 3 },
    v4: { x: 3, y: 0, z: 0 },
    v5: { x: 0, y: 5, z: 0 },
    v6: { x: 0, y: 5, z: 3 },
    v7: { x: 0, y: 0, z: 0 },
    v8: { x: 0, y: 0, z: 3 },
  });

  // const nGeom = React.useMemo(() => geom.clone(), []);
  const nGeom = geom.clone();

  const verticies = Object.keys(state).map((key) => {
    const { x, y, z } = state[key];
    return new Three.Vector3(x, y, z);
  });

  /* eslint-disable functional/immutable-data */
  nGeom.vertices = verticies;
  nGeom.verticesNeedUpdate = true;
  /* eslint-enable functional/immutable-data */
  nGeom.computeFaceNormals();

  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [-20, 25, 20],
        }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <Plain width={planeWidth} height={planeHeight} />

        <AbstractShape geometry={nGeom} material={wireframeMaterial} />
        <AbstractShape geometry={nGeom} material={lambertMaterial} castShadow />

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
      <DatGui data={state} onUpdate={setState}>
        {Object.keys(state).map((key) => {
          const vertex = state[key];
          if (!vertex) return null;
          return (
            <DatFolder key={key} title={key} closed>
              <DatNumber
                path={`${key}.x`}
                label="x"
                min={-10}
                max={10}
                step={0.1}
              />
              <DatNumber
                path={`${key}.y`}
                label="y"
                min={-10}
                max={10}
                step={0.1}
              />
              <DatNumber
                path={`${key}.z`}
                label="z"
                min={-10}
                max={10}
                step={0.1}
              />
            </DatFolder>
          );
        })}
      </DatGui>
    </>
  );
};

export default Page;
