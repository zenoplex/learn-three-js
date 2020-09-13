import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import DatGui, { DatSelect } from 'react-dat-gui';
import BasicMaterialPropertyDatFolder from '~/components/BasicMaterialPropertyDatFolder';
import { Stats, TrackballControls } from 'drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const Ground = (): JSX.Element => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100, 4, 4]} />
      <meshBasicMaterial attach="material" color={0x7777777} />
    </mesh>
  );
};

const meshMaterial = new Three.MeshNormalMaterial();

const computeNormals = (group: Three.Object3D): void => {
  if (group instanceof Three.Mesh) {
    const tempGeom = new Three.Geometry();
    tempGeom.fromBufferGeometry(group.geometry);
    tempGeom.computeFaceNormals();
    tempGeom.mergeVertices();
    tempGeom.computeVertexNormals();
    // eslint-disable-next-line functional/immutable-data
    tempGeom.normalsNeedUpdate = true;
    // eslint-disable-next-line functional/immutable-data
    group.geometry = tempGeom;
  } else if (group instanceof Three.Group) {
    group.children.forEach((child) => {
      computeNormals(child);
    });
  }
};

const setMaterialGroup = (
  material: Three.Material,
  group: Three.Object3D,
): void => {
  if (group instanceof Three.Mesh) {
    // eslint-disable-next-line functional/immutable-data
    group.material = material;
  } else if (group instanceof Three.Group) {
    group.children.forEach((child) => {
      setMaterialGroup(material, child);
    });
  }
};

const Gopher = React.forwardRef(
  (_, ref): JSX.Element => {
    const result = useLoader(OBJLoader, '/obj/gopher.obj');

    React.useMemo(() => {
      computeNormals(result);
      setMaterialGroup(meshMaterial, result);
    }, [result]);

    return (
      <>
        {result ? (
          <primitive
            ref={ref}
            object={result}
            scale={[5, 5, 5]}
            position={[-10, 0, 0]}
            dispose={null}
          />
        ) : null}
      </>
    );
  },
);
// eslint-disable-next-line functional/immutable-data
Gopher.displayName = 'Gopher';

type SceneProps = {
  readonly selectedMesh: 'gopher' | 'sphere' | 'cube' | 'plane';
};

const Scene = ({ selectedMesh }: SceneProps): JSX.Element => {
  const ref = React.useRef<Three.Object3D>();
  const step = React.useRef(0);
  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    if (!ref.current) return;

    step.current = step.current + 0.01;
    ref.current.rotation.y = step.current;
    /* eslint-enable functional/immutable-data */
  });

  return (
    <>
      {selectedMesh === 'gopher' ? <Gopher ref={ref} /> : null}

      {selectedMesh === 'sphere' ? (
        <mesh ref={ref} material={meshMaterial} position={[0, 3, 2]}>
          <sphereBufferGeometry attach="geometry" args={[14, 20, 20]} />
        </mesh>
      ) : null}
      {selectedMesh === 'cube' ? (
        <mesh ref={ref} material={meshMaterial} position={[0, 3, 2]}>
          <boxGeometry attach="geometry" args={[15, 15, 15]} />
        </mesh>
      ) : null}
      {selectedMesh === 'plane' ? (
        <mesh ref={ref} material={meshMaterial} position={[0, 3, 2]}>
          <planeBufferGeometry attach="geometry" args={[14, 14, 4, 4]} />
        </mesh>
      ) : null}
      <Ground />
      <ambientLight color={0x0c0c0c} />
      <spotLight color={0xffffff} position={[-40, 60, -10]} castShadow />
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    id: meshMaterial.id,
    uuid: meshMaterial.uuid,
    name: meshMaterial.name,
    opacity: meshMaterial.opacity,
    transparent: meshMaterial.transparent,
    // overdraw is deprecated
    // overdraw: meshMaterial.overdraw,
    visible: meshMaterial.visible,
    side: meshMaterial.side,
    colorWrite: meshMaterial.colorWrite,
    flatShading: meshMaterial.flatShading,
    premultipliedAlpha: meshMaterial.premultipliedAlpha,
    dithering: meshMaterial.dithering,
    shadowSide: meshMaterial.shadowSide,
    vertexColors: meshMaterial.vertexColors,
    fog: meshMaterial.fog,
    //
    selectedMesh: 'sphere' as const,
  });

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{
          fov: 45,
          position: [-20, 30, 40],
        }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000);
          // target is set at TrackbakkControl
          // camera.lookAt(0, -100, -10);
          // camera.updateProjectionMatrix();
        }}>
        <React.Suspense fallback={null}>
          <Scene selectedMesh={state.selectedMesh} />
        </React.Suspense>
        <Stats />
        <TrackballControls target={[10, 0, 0]} />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <BasicMaterialPropertyDatFolder state={state} material={meshMaterial} />
        <DatSelect
          path="selectedMesh"
          options={['gopher', 'cube', 'sphere', 'plane']}
        />
      </DatGui>
    </>
  );
};

export default Page;
