import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import DatGui, {
  DatFolder,
  DatNumber,
  DatBoolean,
  DatSelect,
  DatColor,
  DatString,
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
  readonly material: Three.Material;
  readonly castShadow: boolean;
  readonly isGroundPlaneVisible: boolean;
  readonly str: string;
  readonly font:
    | 'bitstream_vera_sans_mono_roman'
    | 'helvetiker_regular'
    | 'helvetiker_bold';
  readonly size: number;
  readonly height: number;
  readonly curveSegments: number;
  readonly bevelThickness: number;
  readonly bevelSize: number;
  readonly bevelSegments: number;
  readonly bevelEnabled: boolean;
  readonly steps: number;
};

const Scene = ({
  material,
  castShadow,
  isGroundPlaneVisible,
  str,
  font,
  curveSegments,
  size,
  height,
  bevelThickness,
  bevelSize,
  bevelSegments,
  bevelEnabled,
  steps,
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

  const face = useLoader(Three.FontLoader, `/fonts/${font}.typeface.json`);

  const geometry = React.useMemo(() => {
    const geom = new Three.TextBufferGeometry(str, {
      size,
      height,
      font: face,
      bevelThickness,
      bevelSize,
      bevelSegments,
      bevelEnabled,
      curveSegments,
      // @ts-expect-error steps does exist as a option but missing in type def
      steps,
    });
    geom.scale(0.05, 0.05, 0.05);
    geom.center();

    return geom;
  }, [
    bevelEnabled,
    bevelSegments,
    bevelSize,
    bevelThickness,
    curveSegments,
    face,
    height,
    size,
    steps,
    str,
  ]);

  return (
    <>
      <group ref={ref}>
        <mesh material={material} geometry={geometry} castShadow={castShadow} />
      </group>

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
    str: 'Learning Three.js',
    font: 'bitstream_vera_sans_mono_roman' as const,
    size: 90,
    height: 90,
    curveSegments: 12,
    bevelThickness: 2,
    bevelSize: 0.5,
    bevelSegments: 3,
    bevelEnabled: true,
    steps: 1,
    castShadow: true,
    isGroundPlaneVisible: true,
    //
    color: defaultColor,
    emissive: '#000000',
    metalness: 0.5,
    roughness: 0.5,
    wireframe: material.wireframe,
    renderFunction: 'radialWave' as const,
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
            material={material}
            castShadow={state.castShadow}
            isGroundPlaneVisible={state.isGroundPlaneVisible}
            str={state.str}
            font={state.font}
            size={state.size}
            height={state.height}
            curveSegments={state.curveSegments}
            bevelThickness={state.bevelThickness}
            bevelSize={state.bevelSize}
            bevelSegments={state.bevelSegments}
            bevelEnabled={state.bevelEnabled}
            steps={state.steps}
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
          <DatString path="str" />
          <DatSelect
            path="font"
            options={[
              'bitstream_vera_sans_mono_roman',
              'helvetiker_regular',
              'helvetiker_bold',
            ]}
          />
          <DatNumber path="size" min={1} max={200} step={1} />
          <DatNumber path="height" min={0} max={200} step={1} />
          <DatNumber path="curveSegments" min={1} max={50} step={1} />
          <DatNumber path="bevelThickness" min={0} max={50} step={1} />
          <DatNumber path="bevelSize" min={0} max={50} step={1} />
          <DatNumber path="bevelSegments" min={0} max={50} step={1} />
          <DatBoolean path="bevelEnabled" />
          <DatNumber path="steps" min={0} max={50} step={1} />
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
