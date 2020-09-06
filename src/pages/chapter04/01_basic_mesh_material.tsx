import * as React from 'react';
import * as Three from 'three';
import { Canvas } from 'react-three-fiber';
import DatGui, {
  DatString,
  DatNumber,
  DatColor,
  DatBoolean,
  DatFolder,
  DatSelect,
} from 'react-dat-gui';
import { Stats, TrackballControls } from 'drei';

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
  });

  React.useEffect(() => {
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
          <mesh material={meshMaterial} position={[0, 3, 2]}>
            <sphereBufferGeometry attach="geometry" args={[14, 20, 20]} />
          </mesh>
          <mesh material={meshMaterial} position={[0, 3, 2]}>
            <boxBufferGeometry attach="geometry" args={[15, 15, 15]} />
          </mesh>
          <mesh material={meshMaterial} position={[0, 3, 2]}>
            <planeBufferGeometry attach="geometry" args={[14, 14, 4, 4]} />
          </mesh>
          <Ground />
          <spotLight color={0xffffff} position={[-40, 60, -10]} castShadow />
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
          <DatNumber path="overdraw" min={0} max={1} step={0.01} />
          <DatBoolean path="visible" />
          {/* <DatSelect path="side" /> */}
          <DatBoolean path="premultipliedAlpha" />
          <DatBoolean path="dithering" />
          <DatSelect
            path="shadowSide"
            options={['FrontSize', 'BackSide', 'BothSides']}
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
      </DatGui>
    </>
  );
};

export default Page;
