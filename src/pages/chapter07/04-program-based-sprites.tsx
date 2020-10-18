// SpriteCanvasMaterial has been removed since canvas was removed from three.js
// Instead I used external texture
import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import { Stats, TrackballControls } from 'drei';
import DatGui, { DatNumber, DatColor, DatBoolean } from 'react-dat-gui';

type SceneProps = {
  readonly scale: number;
  readonly transparent: boolean;
  readonly opacity: number;
  readonly color: string;
  readonly sizeAttenuation: boolean;
  readonly count: number;
  readonly rotate: boolean;
};

const Scene = ({
  count,
  scale,
  transparent,
  opacity,
  color,
  sizeAttenuation,
  rotate,
}: SceneProps): JSX.Element => {
  const ref = React.useRef<Three.Points | null>(null);
  const step = React.useRef(0);
  const texture = useLoader(Three.TextureLoader, '/packman.png');

  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    if (!ref.current || !rotate) return;

    step.current = step.current + 0.01;
    ref.current.rotation.x = step.current;
    ref.current.rotation.y = step.current;
    /* eslint-enable functional/immutable-data */
  });

  const spriteMaterial = React.useMemo(() => {
    // Not using Points, but using SpriteMaterial because example uses Sprite.
    return new Three.SpriteMaterial({
      map: texture,
      sizeAttenuation,
      transparent,
      color,
      opacity,
    });
  }, [color, opacity, sizeAttenuation, texture, transparent]);

  const sprites = React.useMemo(() => {
    const range = 500;
    return new Array(count).fill(null).map(() => {
      const sprite = new Three.Sprite(spriteMaterial);

      sprite.position.set(
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
      );
      return sprite;
    });
  }, [count, spriteMaterial]);

  return (
    <>
      <group ref={ref}>
        {sprites.map((sprite, i) => (
          <primitive key={i} object={sprite} scale={[scale, scale, scale]} />
        ))}
      </group>
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    count: 1500,
    scale: 2,
    transparent: true,
    opacity: 1,
    color: '#ffffff',
    sizeAttenuation: true,
    rotate: true,
  });

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{ fov: 45, position: [20, 0, 150] }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000);
        }}>
        <React.Suspense fallback={null}>
          <Scene
            count={state.count}
            scale={state.scale}
            transparent={state.transparent}
            opacity={state.opacity}
            color={state.color}
            sizeAttenuation={state.sizeAttenuation}
            rotate={state.rotate}
          />
        </React.Suspense>
        <Stats />
        <TrackballControls />
      </Canvas>

      <DatGui data={state} onUpdate={setState}>
        <DatNumber path="count" min={1000} max={3000} step={100} />
        <DatNumber path="scale" min={0} max={30} step={1} />
        <DatBoolean path="transparent" />
        <DatNumber path="opacity" min={0} max={1} step={0.1} />
        <DatColor path="color" />
        <DatBoolean path="sizeAttenuation" />
        <DatBoolean path="rotate" />
      </DatGui>

      <canvas id="test" />
    </>
  );
};

export default Page;
