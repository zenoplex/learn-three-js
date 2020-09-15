import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import DatGui, {
  DatFolder,
  DatBoolean,
  DatSelect,
  DatNumber,
} from 'react-dat-gui';
import BasicMaterialPropertyDatFolder from '~/components/BasicMaterialPropertyDatFolder';
import { Stats, TrackballControls } from 'drei';
import vert from '~/shaders/1.vert';
import frag from '~/shaders/1.frag';

const uniforms = {
  time: {
    value: 0.2,
  },
  scale: {
    value: 0.2,
  },
  alpha: {
    value: 0.6,
  },
  resolution: {
    value: new Three.Vector2(),
  },
};

const material = new Three.ShaderMaterial({
  uniforms,
  vertexShader: vert,
  fragmentShader: frag,
  transparent: true,
});

const Scene = (): JSX.Element => {
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
      <mesh ref={ref} material={material} position={[0, 3, 2]}>
        <boxGeometry attach="geometry" args={[15, 15, 15]} />
      </mesh>

      <ambientLight color={0x0c0c0c} />
      <spotLight color={0xffffff} position={[-40, 60, -19]} castShadow />
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
    wireframe: material.wireframe,
    wireframeLinewidth: material.wireframeLinewidth,
  });

  React.useEffect(() => {
    /* eslint-disable  functional/immutable-data */
    material.wireframe = state.wireframe;
    material.wireframeLinewidth = state.wireframeLinewidth;
    /* eslint-enable  functional/immutable-data */
  }, [state.wireframe, state.wireframeLinewidth]);

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
          <Scene />
        </React.Suspense>
        <Stats />
        <TrackballControls />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <BasicMaterialPropertyDatFolder state={state} material={material} />
        <DatFolder title={material.type} closed={false}>
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
