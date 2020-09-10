import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import DatGui, {
  DatString,
  DatNumber,
  DatColor,
  DatBoolean,
  DatFolder,
  DatSelect,
} from 'react-dat-gui';
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

const meshMaterial = new Three.MeshBasicMaterial({
  color: 0x7777ff,
  name: 'Basic Material',
  flatShading: true,
});

const Gopher = React.forwardRef(
  (_, ref): JSX.Element => {
    const result = useLoader(OBJLoader, '/obj/gopher.obj');

    React.useMemo(() => {
      /* eslint-disable functional/immutable-data */
      result.traverse((child) => {
        if (child instanceof Three.Mesh) {
          child.material = meshMaterial;
        }
      });
      /* eslint-enable functional/immutable-data */
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

type SketchProps = {
  readonly selectedMesh: 'gopher' | 'sphere' | 'cube' | 'plane';
};

const Sketch = ({ selectedMesh }: SketchProps): JSX.Element => {
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
          <boxBufferGeometry attach="geometry" args={[15, 15, 15]} />
        </mesh>
      ) : null}
      {selectedMesh === 'plane' ? (
        <mesh ref={ref} material={meshMaterial} position={[0, 3, 2]}>
          <planeBufferGeometry attach="geometry" args={[14, 14, 4, 4]} />
        </mesh>
      ) : null}
      <Ground />
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
    wireframe: false,
    //
    color: `#${meshMaterial.color.getHexString()}`,
    //
    selectedMesh: 'sphere' as const,
  });

  React.useEffect(() => {
    /* eslint-disable functional/immutable-data */
    meshMaterial.opacity = state.opacity;
    meshMaterial.transparent = state.transparent;
    meshMaterial.visible = state.visible;
    meshMaterial.side = state.side;
    meshMaterial.colorWrite = state.colorWrite;
    meshMaterial.flatShading = state.flatShading;
    meshMaterial.premultipliedAlpha = state.premultipliedAlpha;
    meshMaterial.dithering = state.dithering;
    meshMaterial.shadowSide = state.shadowSide;
    meshMaterial.vertexColors = state.vertexColors;
    meshMaterial.fog = state.fog;
    meshMaterial.wireframe = state.wireframe;

    meshMaterial.color = new Three.Color(state.color);
    /* eslint-enable functional/immutable-data */
  }, [
    state.color,
    state.colorWrite,
    state.dithering,
    state.flatShading,
    state.fog,
    state.opacity,
    state.premultipliedAlpha,
    state.shadowSide,
    state.side,
    state.transparent,
    state.vertexColors,
    state.visible,
    state.wireframe,
  ]);

  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          position: [-20, 50, 40],
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000);
        }}>
        <React.Suspense fallback={null}>
          <Sketch selectedMesh={state.selectedMesh} />
        </React.Suspense>
        <Stats />
        <TrackballControls />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatFolder title="Three.Material" closed={false}>
          <DatString path="id" />
          <DatString path="uuid" />
          <DatString path="name" />
          <DatNumber path="opacity" min={0} max={1} step={0.01} />
          <DatBoolean path="transparent" />
          <DatBoolean path="visible" />
          <DatSelect
            path="side"
            options={[Three.FrontSide, Three.BackSide, Three.DoubleSide]}
          />
          <DatBoolean path="premultipliedAlpha" />
          <DatBoolean path="dithering" />
          <DatSelect
            path="shadowSide"
            options={[null, Three.FrontSide, Three.BackSide, Three.DoubleSide]}
          />
          <DatSelect
            path="vertexColors"
            options={[Three.NoColors, Three.FaceColors, Three.VertexColors]}
          />
          <DatBoolean path="wireframe" />
        </DatFolder>
        <DatFolder title="Three.MeshBasicMaterial" closed>
          <DatColor path="color" />
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
