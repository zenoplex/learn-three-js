import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import DatGui, {
  DatFolder,
  DatNumber,
  DatBoolean,
  DatSelect,
  DatColor,
  DatButton,
} from 'react-dat-gui';
import BasicMaterialPropertyDatFolder from '~/components/BasicMaterialPropertyDatFolder';
import { Stats, TrackballControls } from 'drei';
import { Mesh } from 'three';

const Ground = (): JSX.Element => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -30, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[10000, 10000]} />
      <meshPhongMaterial attach="material" color={0xffffff} />
    </mesh>
  );
};

type SceneProps = {
  readonly rerender: number;
  readonly material: Three.Material;
  readonly castShadow: boolean;
  readonly isGroundPlaneVisible: boolean;
  readonly segments: number;
  readonly phiStart: number;
  readonly phiLength: number;
};

const Scene = ({
  rerender,
  material,
  castShadow,
  isGroundPlaneVisible,
  segments,
  phiStart,
  phiLength,
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

  const height = 5;
  const points = React.useMemo(() => {
    const count = 30;
    return new Array(count).fill(null).map((_, i) => {
      const x = (Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12;
      const y = i - count + count / 2;
      return new Three.Vector2(x, y);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender]);

  const group = React.useMemo(() => {
    const g = new Three.Group();
    const mat = new Three.MeshBasicMaterial({
      color: 0xff0000,
      transparent: false,
    });
    const geom = new Three.SphereBufferGeometry(0.2);
    points.forEach((point) => {
      const mesh = new Mesh(geom, mat);
      mesh.position.set(point.x, point.y, 0);
      g.add(mesh);
    });

    return g;
  }, [points]);

  const latheGeometry = React.useMemo(
    () => new Three.LatheBufferGeometry(points, segments, phiStart, phiLength),
    [phiLength, phiStart, points, segments],
  );

  return (
    <>
      <group ref={ref}>
        <mesh
          material={material}
          geometry={latheGeometry}
          castShadow={castShadow}
        />
        <primitive object={group} />
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
    rerender: Date.now(),
    segments: 12,
    phiStart: 0,
    phiLength: Math.PI * 2,
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
            rerender={state.rerender}
            material={material}
            segments={state.segments}
            phiStart={state.phiStart}
            phiLength={state.phiLength}
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
          <DatButton
            label="redraw"
            onClick={() => {
              setState((s) => ({ ...s, rerender: Date.now() }));
            }}
          />
          <DatNumber path="segments" min={0} max={50} step={1} />
          <DatNumber path="phiStart" min={0} max={Math.PI * 2} step={0.1} />
          <DatNumber path="phiLength" min={0} max={Math.PI * 2} step={0.1} />
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
