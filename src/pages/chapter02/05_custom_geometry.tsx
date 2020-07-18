import * as React from 'react';
import * as Three from 'three';
import { Canvas } from 'react-three-fiber';
import { Stats, TrackballControls } from 'drei';
import { useControl, Controls } from 'react-three-gui';

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
const min = -10;
const max = 10;

const Page = (): JSX.Element => {
  const v1x = useControl('x', {
    group: 'verticies1',
    type: 'number',
    value: 3,
    min,
    max,
  });
  const v1y = useControl('y', {
    group: 'verticies1',
    type: 'number',
    value: 5,
    min,
    max,
  });
  const v1z = useControl('z', {
    group: 'verticies1',
    type: 'number',
    value: 3,
    min,
    max,
  });

  const v2x = useControl('x', {
    group: 'verticies2',
    type: 'number',
    value: 3,
    min,
    max,
  });
  const v2y = useControl('y', {
    group: 'verticies2',
    type: 'number',
    value: 5,
    min,
    max,
  });
  const v2z = useControl('z', {
    group: 'verticies2',
    type: 'number',
    value: 0,
    min,
    max,
  });

  const v3x = useControl('x', {
    group: 'verticies3',
    type: 'number',
    value: 3,
    min,
    max,
  });
  const v3y = useControl('y', {
    group: 'verticies3',
    type: 'number',
    value: 0,
    min,
    max,
  });
  const v3z = useControl('z', {
    group: 'verticies3',
    type: 'number',
    value: 3,
    min,
    max,
  });

  const v4x = useControl('x', {
    group: 'verticies4',
    type: 'number',
    value: 3,
    min,
    max,
  });
  const v4y = useControl('y', {
    group: 'verticies4',
    type: 'number',
    value: 0,
    min,
    max,
  });
  const v4z = useControl('z', {
    group: 'verticies4',
    type: 'number',
    value: 0,
    min,
    max,
  });

  const v5x = useControl('x', {
    group: 'verticies5',
    type: 'number',
    value: 0,
    min,
    max,
  });
  const v5y = useControl('y', {
    group: 'verticies5',
    type: 'number',
    value: 5,
    min,
    max,
  });
  const v5z = useControl('z', {
    group: 'verticies5',
    type: 'number',
    value: 0,
    min,
    max,
  });

  const v6x = useControl('x', {
    group: 'verticies6',
    type: 'number',
    value: 0,
    min,
    max,
  });
  const v6y = useControl('y', {
    group: 'verticies6',
    type: 'number',
    value: 5,
    min,
    max,
  });
  const v6z = useControl('z', {
    group: 'verticies6',
    type: 'number',
    value: 3,
    min,
    max,
  });

  const v7x = useControl('x', {
    group: 'verticies7',
    type: 'number',
    value: 0,
    min,
    max,
  });
  const v7y = useControl('y', {
    group: 'verticies7',
    type: 'number',
    value: 0,
    min,
    max,
  });
  const v7z = useControl('z', {
    group: 'verticies7',
    type: 'number',
    value: 0,
    min,
    max,
  });

  const v8x = useControl('x', {
    group: 'verticies8',
    type: 'number',
    value: 0,
    min,
    max,
  });
  const v8y = useControl('y', {
    group: 'verticies8',
    type: 'number',
    value: 0,
    min,
    max,
  });
  const v8z = useControl('z', {
    group: 'verticies8',
    type: 'number',
    value: 3,
    min,
    max,
  });

  const nGeom = geom.clone();
  React.useEffect(() => {
    const verticies = [
      new Three.Vector3(v1x, v1y, v1z),
      new Three.Vector3(v2x, v2y, v2z),
      new Three.Vector3(v3x, v3y, v3z),
      new Three.Vector3(v4x, v4y, v4z),
      new Three.Vector3(v5x, v5y, v5z),
      new Three.Vector3(v6x, v6y, v6z),
      new Three.Vector3(v7x, v7y, v7z),
      new Three.Vector3(v8x, v8y, v8z),
    ];

    /* eslint-disable functional/immutable-data */
    nGeom.vertices = verticies;
    nGeom.verticesNeedUpdate = true;
    /* eslint-enable functional/immutable-data */
    nGeom.computeFaceNormals();
  }, [
    nGeom,
    v1x,
    v1y,
    v1z,
    v2x,
    v2y,
    v2z,
    v3x,
    v3y,
    v3z,
    v4x,
    v4y,
    v4z,
    v5x,
    v5y,
    v5z,
    v6x,
    v6y,
    v6z,
    v7x,
    v7y,
    v7z,
    v8x,
    v8y,
    v8z,
  ]);

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
      <Controls />
    </>
  );
};

export default Page;
