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
  readonly material: Three.Material;
  readonly castShadow: boolean;
  readonly isGroundPlaneVisible: boolean;
  readonly pointCount: number;
  readonly tubularSegments: number;
  readonly radius: number;
  readonly radiusSegments: number;
  readonly closed: boolean;
};

const Scene = ({
  material,
  castShadow,
  isGroundPlaneVisible,

  pointCount = 5,
  tubularSegments,
  radius,
  radiusSegments,
  closed,
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

  const points = React.useMemo(
    () =>
      new Array(pointCount).fill(null).map(() => {
        const x = -20 + Math.round(Math.random() * 50);
        const y = -15 + Math.round(Math.random() * 40);
        const z = -20 + Math.round(Math.random() * 40);

        return new Three.Vector3(x, y, z);
      }),
    [pointCount],
  );

  const geometry = React.useMemo(() => {
    const curve = new Three.CatmullRomCurve3(points);
    const geom = new Three.TubeBufferGeometry(
      curve,
      tubularSegments,
      radius,
      radiusSegments,
      closed,
    );

    return geom;
  }, [closed, points, radius, radiusSegments, tubularSegments]);

  const pointsGroup = React.useMemo(() => {
    const group = new Three.Group();
    const mat = new Three.MeshBasicMaterial({
      color: 0xff0000,
      transparent: false,
    });
    const geom = new Three.SphereBufferGeometry(0.2);
    points.forEach((point) => {
      const mesh = new Three.Mesh(geom, mat);
      mesh.position.copy(point);
      group.add(mesh);
    });

    return group;
  }, [points]);

  return (
    <>
      <group ref={ref}>
        <mesh material={material} geometry={geometry} castShadow={castShadow} />
        <primitive object={pointsGroup} />
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
    pointCount: 5,
    tubularSegments: 64,
    radius: 1,
    radiusSegments: 8,
    closed: false,
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
            material={material}
            pointCount={state.pointCount}
            tubularSegments={state.tubularSegments}
            radius={state.radius}
            radiusSegments={state.radiusSegments}
            closed={state.closed}
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
          <DatNumber path="pointCount" min={0} max={50} step={1} />
          <DatNumber path="tubularSegments" min={0} max={200} step={1} />
          <DatNumber path="radius" min={0} max={10} step={0.1} />
          <DatNumber path="radiusSegments" min={0} max={100} step={1} />
          <DatBoolean path="closed" />
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
