import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import DatGui, {
  DatFolder,
  DatNumber,
  DatBoolean,
  DatSelect,
} from 'react-dat-gui';
import BasicMaterialPropertyDatFolder from '~/components/BasicMaterialPropertyDatFolder';
import { Stats, TrackballControls } from 'drei';

const Ground = (): JSX.Element => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[10000, 10000]} />
      <meshPhongMaterial attach="material" color={0xffffff} />
    </mesh>
  );
};

type SceneProps = {
  readonly width: number;
  readonly height: number;
  readonly widthSegments: number;
  readonly heightSegments: number;
  readonly material: Three.Material;
  readonly castShadow: boolean;
  readonly isGroundPlaneVisible: boolean;
};

const Scene = ({
  width,
  height,
  widthSegments,
  heightSegments,
  material,
  castShadow,
  isGroundPlaneVisible,
}: SceneProps): JSX.Element => {
  const ref = React.useRef<Three.Mesh<Three.Geometry>>();
  const step = React.useRef(0);
  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    if (!ref.current) return;

    step.current = step.current + 0.01;
    ref.current.rotation.x = step.current;
    ref.current.rotation.y = step.current;
    ref.current.rotation.z = step.current;
    /* eslint-enable functional/immutable-data */
  });

  return (
    <>
      <mesh ref={ref} material={material} castShadow={castShadow}>
        <planeBufferGeometry
          args={[width, height, widthSegments, heightSegments]}
          attach="geometry"
        />
      </mesh>

      {isGroundPlaneVisible ? <Ground /> : null}
      <ambientLight color={0x343434} />
      <spotLight
        color={0xffffff}
        position={[-10, 30, 40]}
        castShadow
        decay={2}
        penumbra={0.05}
        shadow-camera-fov={15}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
};

const Page = (): JSX.Element => {
  const [applyMaterial, setApplyMaterial] = React.useState<
    'MeshNormalMaterial' | 'MeshStandardMaterial'
  >('MeshNormalMaterial');

  const material = React.useMemo(() => {
    if (applyMaterial === 'MeshNormalMaterial') {
      const material = new Three.MeshNormalMaterial();
      // eslint-disable-next-line functional/immutable-data
      material.side = Three.DoubleSide;
      return material;
    } else {
      const material = new Three.MeshStandardMaterial({ color: 0xff0000 });
      // eslint-disable-next-line functional/immutable-data
      material.side = Three.DoubleSide;
      return material;
    }
  }, [applyMaterial]);

  const [state, setState] = React.useState({
    id: material.id,
    uuid: material.uuid,
    name: material.name,
    opacity: material.opacity,
    transparent: material.transparent,
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
    width: 20,
    height: 20,
    widthSegments: 4,
    heightSegments: 4,
    wireframe: material.wireframe,
    castShadow: true,
    isGroundPlaneVisible: true,
  });

  React.useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    material.wireframe = state.wireframe;
  }, [material, state.wireframe]);

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{
          fov: 45,
          position: [-30, 40, 30],
        }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000);
        }}>
        <React.Suspense fallback={null}>
          <Scene
            width={state.width}
            height={state.height}
            widthSegments={state.widthSegments}
            heightSegments={state.heightSegments}
            material={material}
            castShadow={state.castShadow}
            isGroundPlaneVisible={state.isGroundPlaneVisible}
          />
        </React.Suspense>
        <Stats />
        <TrackballControls />
      </Canvas>
      <DatGui
        data={{ ...state, applyMaterial }}
        onUpdate={({ applyMaterial, ...rest }) => {
          setState(rest);
          setApplyMaterial(applyMaterial);
        }}>
        <BasicMaterialPropertyDatFolder state={state} material={material} />
        <DatFolder title="Folder" closed={false}>
          <DatSelect
            path="applyMaterial"
            options={['MeshNormalMaterial', 'MeshStandardMaterial']}
          />
          <DatNumber path="width" min={0} max={40} step={1} />
          <DatNumber path="height" min={0} max={40} step={1} />
          <DatNumber path="widthSegments" min={0} max={10} step={1} />
          <DatNumber path="heightSegments" min={0} max={10} step={1} />
          <DatBoolean path="wireframe" />
          <DatBoolean path="castShadow" />
          <DatBoolean path="isGroundPlaneVisible" />
        </DatFolder>
      </DatGui>
    </>
  );
};

export default Page;
