import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import DatGui, {
  DatFolder,
  DatNumber,
  DatBoolean,
  DatSelect,
  DatColor,
} from 'react-dat-gui';
import BasicMaterialPropertyDatFolder from '~/components/BasicMaterialPropertyDatFolder';
import { Stats, TrackballControls } from 'drei';

const Ground = (): JSX.Element => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -30, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[10000, 10000]} />
      <meshPhongMaterial attach="material" color={0xffffff} />
    </mesh>
  );
};

type SceneProps = {
  readonly radius: number;
  readonly height: number;
  readonly radialSegments: number;
  readonly heightSegments: number;
  readonly openEnded: boolean;
  readonly thetaStart: number;
  readonly thetaLength: number;
  readonly material: Three.Material;
  readonly castShadow: boolean;
  readonly isGroundPlaneVisible: boolean;
};

const Scene = ({
  radius,
  height,
  radialSegments,
  heightSegments,
  openEnded,
  thetaStart,
  thetaLength,
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

  const geometry = React.useMemo(() => {
    const geom = new Three.ConeBufferGeometry(
      radius,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength,
    );
    return geom;
  }, [
    height,
    heightSegments,
    openEnded,
    radialSegments,
    radius,
    thetaLength,
    thetaStart,
  ]);

  return (
    <>
      <mesh
        ref={ref}
        material={material}
        geometry={geometry}
        castShadow={castShadow}
      />

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

const defaultColor = '#ff0000';

const Page = (): JSX.Element => {
  const [applyMaterial, setApplyMaterial] = React.useState<
    'MeshNormalMaterial' | 'MeshStandardMaterial'
  >('MeshNormalMaterial');

  const material = React.useMemo(() => {
    if (applyMaterial === 'MeshNormalMaterial') {
      const material = new Three.MeshNormalMaterial();
      // eslint-disable-next-line functional/immutable-data
      material.side = Three.DoubleSide;
      // eslint-disable-next-line functional/immutable-data
      material.shadowSide = Three.DoubleSide;
      return material;
    } else {
      const material = new Three.MeshStandardMaterial({ color: defaultColor });
      // eslint-disable-next-line functional/immutable-data
      material.side = Three.DoubleSide;
      // eslint-disable-next-line functional/immutable-data
      material.shadowSide = Three.DoubleSide;
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
    radius: 20,
    height: 20,
    radialSegments: 8,
    heightSegments: 8,
    openEnded: false,
    thetaStart: 0,
    thetaLength: 2 * Math.PI,
    castShadow: true,
    isGroundPlaneVisible: true,
    //
    color: defaultColor,
    emissive: '#000000',
    metalness: 0.5,
    roughness: 0.5,
    wireframe: material.wireframe,
  });

  React.useEffect(() => {
    /* eslint-disable functional/immutable-data */
    material.wireframe = state.wireframe;
    if (material instanceof Three.MeshStandardMaterial) {
      material.color = new Three.Color(state.color);
      material.emissive = new Three.Color(state.emissive);
      material.metalness = state.metalness;
      material.roughness = state.roughness;
    }
    /* eslint-enable functional/immutable-data */
  }, [
    material,
    state.color,
    state.emissive,
    state.metalness,
    state.roughness,
    state.wireframe,
  ]);

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
            radius={state.radius}
            height={state.height}
            radialSegments={state.radialSegments}
            heightSegments={state.heightSegments}
            openEnded={state.openEnded}
            thetaStart={state.thetaStart}
            thetaLength={state.thetaLength}
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
        <DatFolder title="Folder" closed={false}>
          <DatSelect
            path="applyMaterial"
            options={['MeshNormalMaterial', 'MeshStandardMaterial']}
          />
          <DatNumber path="radius" min={-40} max={40} step={1} />
          <DatNumber path="height" min={0} max={40} step={1} />
          <DatNumber path="radialSegments" min={1} max={20} step={1} />
          <DatNumber path="heightSegments" min={1} max={20} step={1} />
          <DatBoolean path="openEnded" />
          <DatNumber path="thetaStart" min={0} max={Math.PI * 2} step={0.1} />
          <DatNumber path="thetaLength" min={0} max={Math.PI * 2} step={0.1} />
          <DatBoolean path="castShadow" />
          <DatBoolean path="isGroundPlaneVisible" />
        </DatFolder>
        <BasicMaterialPropertyDatFolder
          state={state}
          material={material}
          closed
        />
        {/* Could not use Fragments due to how DatGui has cloneElement setup */}
        {material instanceof Three.MeshStandardMaterial ? (
          <DatFolder title={material.type} closed={false}>
            <DatColor path="color" />
            <DatColor path="emissive" />
            <DatNumber path="metalness" min={0} max={1} step={0.1} />
            <DatNumber path="roughness" min={0} max={1} step={0.1} />
            <DatBoolean path="wireframe" />
          </DatFolder>
        ) : (
          <DatFolder title={material.type} closed={false}>
            <DatBoolean path="wireframe" />
          </DatFolder>
        )}
      </DatGui>
    </>
  );
};

export default Page;
