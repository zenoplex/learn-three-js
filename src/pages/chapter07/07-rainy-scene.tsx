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
  }
>;

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
  const ref = React.useRef<Three.Points<Three.Geometry>>();

  const texture = useLoader(Three.TextureLoader, '/raindrop-3.png');

  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    if (!ref.current) return;

    const mesh = ref.current;

    const wm = mesh.userData?.velocities as Velocities;

    mesh.geometry.vertices.forEach((v) => {
      const velocity = wm.get(v) ?? { x: 1, y: 1 };

      v.y = v.y - velocity.y;
      v.x = v.x - velocity.x;

      if (v.y <= 0) v.y = 60;
      if (v.x <= -20 || v.x >= 20) {
        wm.set(v, {
          ...velocity,
          x: velocity.x * -1,
        });
      }
    });

    mesh.geometry.verticesNeedUpdate = true;
    /* eslint-enale functional/immutable-data */
  });

  const material = React.useMemo(() => {
    return new Three.PointsMaterial({
      size,
      transparent,
      opacity,
      map: texture,
      blending: Three.AdditiveBlending,
      sizeAttenuation,
      color,
    });
  }, [color, opacity, size, sizeAttenuation, texture, transparent]);

  const points = React.useMemo(() => {
    const range = 40;
    const geom = new Three.Geometry();
    const velocities = new WeakMap() as Velocities;

    new Array(count).fill(null).forEach((_, i) => {
      const vec = new Three.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range * 1.5,
        1 + i / 100,
      );
      geom.vertices.push(vec);

      // Original sample adds velocity property to the vector instance but since we have typescript and I didn't want to extend Three.Vector3, I've used WeakMap instead
      velocities.set(vec, {
        x: (Math.random() - 0.5) / 3,
        y: 0.1 + Math.random() / 5,
      });
    });

    const p = new Three.Points(geom, material);
    // eslint-disable-next-line functional/immutable-data
    p.userData.velocities = velocities;
    return p;
  }, [count, material]);

  return (
    <>
      <primitive ref={ref} object={points} />
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    count: 1500,
    size: 3,
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
        <DatBoolean path="rotate" />
      </DatGui>
    </>
  );
};

export default Page;
