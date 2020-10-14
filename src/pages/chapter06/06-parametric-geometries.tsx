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

const klein = (u: number, v: number, target: Three.Vector3): void => {
  const u2 = u * Math.PI * 2;
  const v2 = v * Math.PI * 2;

  const y = -2 * (1 - Math.cos(u2) / 2) * Math.sin(v2);

  if (u2 < Math.PI) {
    const x =
      3 * Math.cos(u2) * (1 + Math.sin(u2)) +
      2 * (1 - Math.cos(u2) / 2) * Math.cos(u2) * Math.cos(v2);
    const z =
      -8 * Math.sin(u2) -
      2 * (1 - Math.cos(u2) / 2) * Math.sin(u2) * Math.cos(v2);
    target.set(x, y, z);
  } else {
    const x =
      3 * Math.cos(u2) * (1 + Math.sin(u2)) +
      2 * (1 - Math.cos(u2) / 2) * Math.cos(v2 + Math.PI);
    const z = -8 * Math.sin(u2);
    target.set(x, y, z);
  }
};

const radialWave = (u: number, v: number, target: Three.Vector3): void => {
  const r = 50;
  const x = Math.sin(u) * r;
  const z = Math.sin(v / 2) * 2 * r;
  const y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8;

  target.set(x, y, z);
};

type SceneProps = {
  readonly material: Three.Material;
  readonly castShadow: boolean;
  readonly isGroundPlaneVisible: boolean;
  readonly slices: number;
  readonly stacks: number;
  readonly renderFunction: 'radialWave' | 'klein';
};

const Scene = ({
  material,
  slices,
  stacks,
  renderFunction,
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
    switch (renderFunction) {
      case 'klein': {
        const geom = new Three.ParametricBufferGeometry(klein, slices, stacks);
        geom.center();
        return geom;
      }
      default: {
        const geom = new Three.ParametricBufferGeometry(
          radialWave,
          slices,
          stacks,
        );
        geom.center();
        return geom;
      }
    }
  }, [renderFunction, slices, stacks]);

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
    slices: 50,
    stacks: 50,
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
            slices={state.slices}
            stacks={state.stacks}
            renderFunction={state.renderFunction}
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
          <DatNumber path="slices" min={1} max={150} step={1} />
          <DatNumber path="stacks" min={1} max={150} step={1} />
          <DatSelect path="renderFunction" options={['radialWave', 'klein']} />
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
