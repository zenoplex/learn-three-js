import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import DatGui, {
  DatFolder,
  DatColor,
  DatBoolean,
  DatSelect,
  DatNumber,
} from 'react-dat-gui';
import BasicMaterialPropertyDatFolder from '~/components/BasicMaterialPropertyDatFolder';
import { Stats, TrackballControls } from 'drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const Ground = (): JSX.Element => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[10000, 10000]} />
      <meshPhongMaterial attach="material" color={0xffffff} />
    </mesh>
  );
};

const material = new Three.MeshPhongMaterial({ color: 0x7777ff });

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
      setMaterialGroup(material, result);
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
  const ref = React.useRef<Three.Mesh<Three.Geometry>>();
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
        <mesh ref={ref} material={material} position={[0, 3, 2]}>
          <sphereGeometry attach="geometry" args={[14, 20, 20]} />
        </mesh>
      ) : null}
      {selectedMesh === 'cube' ? (
        <mesh ref={ref} material={material} position={[0, 3, 2]}>
          <boxGeometry attach="geometry" args={[15, 15, 15]} />
        </mesh>
      ) : null}
      {selectedMesh === 'plane' ? (
        <mesh ref={ref} material={material} position={[0, 3, 2]}>
          <planeGeometry attach="geometry" args={[14, 14, 4, 4]} />
        </mesh>
      ) : null}
      <Ground />
      <spotLight
        color={0xffffff}
        position={[0, 30, 60]}
        intensity={0.6}
        castShadow
      />
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    id: material.id,
    uuid: material.uuid,
    name: material.name,
    opacity: material.opacity,
    transparent: material.transparent,
    // overdraw is deprecated
    // overdraw: meshMaterial.overdraw,
    visible: material.visible,
    side: material.side,
    colorWrite: material.colorWrite,
    flatShading: material.flatShading,
    premultipliedAlpha: material.premultipliedAlpha,
    dithering: material.dithering,
    shadowSide: material.shadowSide,
    vertexColors: material.vertexColors,
    fog: material.fog,
    //
    color: `#${material.color.getHexString()}`,
    emissive: `#${material.emissive.getHexString()}`,
    specular: `#${material.specular.getHexString()}`,
    shininess: material.shininess,
    wireframe: material.wireframe,
    wireframeLinewidth: material.wireframeLinewidth,
    //
    selectedMesh: 'sphere' as const,
  });

  React.useEffect(() => {
    /* eslint-disable  functional/immutable-data */
    material.color = new Three.Color(state.color);
    material.emissive = new Three.Color(state.emissive);
    material.specular = new Three.Color(state.specular);
    material.shininess = state.shininess;
    material.wireframe = state.wireframe;
    material.wireframeLinewidth = state.wireframeLinewidth;
    /* eslint-enable  functional/immutable-data */
  }, [
    state.color,
    state.emissive,
    state.shininess,
    state.specular,
    state.wireframe,
    state.wireframeLinewidth,
  ]);

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{
          fov: 45,
          position: [-30, 40, 30],
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000);
        }}>
        <React.Suspense fallback={null}>
          <Scene selectedMesh={state.selectedMesh} />
        </React.Suspense>
        <Stats />
        <TrackballControls />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <BasicMaterialPropertyDatFolder state={state} material={material} />
        <DatFolder title="Three.MeshLambertMaterial" closed={false}>
          <DatColor path="color" />
          <DatColor path="emissive" />
          <DatColor path="specular" />
          <DatNumber path="shininess" min={0} max={100} step={1} />
          <DatBoolean path="wireframe" />
          <DatNumber path="wireframeLinewidth" min={0} max={5} step={0.01} />
        </DatFolder>
        <DatSelect
          path="selectedMesh"
          options={['gopher', 'cube', 'sphere', 'plane']}
        />
      </DatGui>
    </>
  );
};

export default Page;
