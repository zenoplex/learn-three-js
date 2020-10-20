import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import { Stats, TrackballControls } from 'drei';
import DatGui, { DatNumber, DatColor, DatBoolean } from 'react-dat-gui';

type Velocities = WeakMap<
  Three.Vector3,
  {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  }
>;

type CreatePointsOptions = {
  readonly size: number;
  readonly transparent: boolean;
  readonly opacity: number;
  readonly color: Three.Color;
  readonly sizeAttenuation: boolean;
};

const createPoints = (
  texture: Three.Texture,
  count: number,
  { size, transparent, opacity, color, sizeAttenuation }: CreatePointsOptions,
): Three.Points => {
  const material = new Three.PointsMaterial({
    size: size,
    transparent: transparent,
    opacity: opacity,
    map: texture,
    blending: Three.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: sizeAttenuation,
    color: color,
  });

  const range = 40;
  const geom = new Three.Geometry();
  const velocities = new WeakMap() as Velocities;

  new Array(count).fill(null).forEach(() => {
    const vec = new Three.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range * 1.5,
      Math.random() * range - range / 2,
    );
    geom.vertices.push(vec);

    // Original sample adds velocity property to the vector instance but since we have typescript and I didn't want to extend Three.Vector3, I've used WeakMap instead
    velocities.set(vec, {
      x: (Math.random() - 0.5) / 3,
      y: 0.1 + Math.random() / 5,
      z: (Math.random() - 0.5) / 3,
    });
  });

  const p = new Three.Points(geom, material);
  // eslint-disable-next-line functional/immutable-data
  p.userData.velocities = velocities;
  return p;
};

type SceneProps = {
  readonly size: number;
  readonly transparent: boolean;
  readonly opacity: number;
  readonly color: string;
  readonly sizeAttenuation: boolean;
  readonly count: number;
};

const Scene = ({
  count,
  size,
  transparent,
  opacity,
  color,
  sizeAttenuation,
}: SceneProps): JSX.Element => {
  const ref = React.useRef<Three.Group | null>(null);

  const texture0 = useLoader(Three.TextureLoader, '/snowflake1_t.png');
  const texture1 = useLoader(Three.TextureLoader, '/snowflake2_t.png');
  const texture2 = useLoader(Three.TextureLoader, '/snowflake3_t.png');
  const texture3 = useLoader(Three.TextureLoader, '/snowflake5_t.png');

  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    if (!ref.current) return;

    const group = ref.current;

    group.children.forEach((mesh) => {
      const wm = mesh.userData?.velocities as Velocities;

      if (mesh instanceof Three.Points) {
        const m = mesh as Three.Points<Three.Geometry>;
        m.geometry.vertices.forEach((v) => {
          const velocity = wm.get(v) ?? { x: 1, y: 1, z: 1 };

          v.x = v.x - velocity.x;
          v.y = v.y - velocity.y;
          v.z = v.z - velocity.z;

          if (v.y <= 0) v.y = 60;
          if (v.x <= -20 || v.x >= 20) {
            wm.set(v, {
              ...velocity,
              x: velocity.x * -1,
            });
          }
          if (v.z <= -20 || v.z >= 20) {
            wm.set(v, {
              ...velocity,
              z: velocity.z * -1,
            });
          }
        });
        m.geometry.verticesNeedUpdate = true;
      }
    });
    /* eslint-enale functional/immutable-data */
  });

  const options = React.useMemo(() => {
    const c = new Three.Color(color);
    const hsl = c.getHSL({ h: 0, s: 0, l: 0 });
    c.setHSL(hsl.h, hsl.s, Math.random() * hsl.l);

    return {
      size,
      transparent,
      opacity,
      color: c,
      sizeAttenuation,
    };
  }, [color, opacity, size, sizeAttenuation, transparent]);

  const points0 = React.useMemo(
    () => createPoints(texture0, Math.floor(count / 4), options),
    [count, options, texture0],
  );
  const points1 = React.useMemo(
    () => createPoints(texture1, Math.floor(count / 4), options),
    [count, options, texture1],
  );
  const points2 = React.useMemo(
    () => createPoints(texture2, Math.floor(count / 4), options),
    [count, options, texture2],
  );
  const points3 = React.useMemo(
    () => createPoints(texture3, Math.floor(count / 4), options),
    [count, options, texture3],
  );

  return (
    <>
      <group ref={ref}>
        <primitive object={points0} />
        <primitive object={points1} />
        <primitive object={points2} />
        <primitive object={points3} />
      </group>
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    count: 600,
    size: 10,
    transparent: true,
    opacity: 0.6,
    color: '#ffffff',
    sizeAttenuation: true,
  });

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{ fov: 45, position: [20, 40, 110] }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000);
        }}>
        <React.Suspense fallback={null}>
          <Scene
            count={state.count}
            size={state.size}
            transparent={state.transparent}
            opacity={state.opacity}
            color={state.color}
            sizeAttenuation={state.sizeAttenuation}
          />
        </React.Suspense>
        <Stats />
        <TrackballControls target={[20, 30, 0]} />
      </Canvas>

      <DatGui data={state} onUpdate={setState}>
        <DatNumber path="count" min={100} max={3000} step={100} />
        <DatNumber path="size" min={0} max={30} step={1} />
        <DatBoolean path="transparent" />
        <DatNumber path="opacity" min={0} max={1} step={0.1} />
        <DatColor path="color" />
        <DatBoolean path="sizeAttenuation" />
      </DatGui>
    </>
  );
};

export default Page;
