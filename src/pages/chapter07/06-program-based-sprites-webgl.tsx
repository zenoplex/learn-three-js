// SpriteCanvasMaterial has been removed since canvas was removed from three.js
// Instead I used external texture
import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import { Stats, TrackballControls } from 'drei';
import DatGui, { DatNumber, DatColor, DatBoolean } from 'react-dat-gui';

const createGhostTexture = (): Three.Texture | undefined => {
  const canvas = document.createElement('canvas');
  // eslint-disable-next-line functional/immutable-data
  canvas.width = 32;
  // eslint-disable-next-line functional/immutable-data
  canvas.height = 32;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(-81, -84, canvas.width, canvas.height);
  // the body
  ctx.translate(-81, -84);

  // eslint-disable-next-line functional/immutable-data
  ctx.fillStyle = 'orange';
  ctx.beginPath();
  ctx.moveTo(83, 116);
  ctx.lineTo(83, 102);
  ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
  ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
  ctx.lineTo(111, 116);
  ctx.lineTo(106.333, 111.333);
  ctx.lineTo(101.666, 116);
  ctx.lineTo(97, 111.333);
  ctx.lineTo(92.333, 116);
  ctx.lineTo(87.666, 111.333);
  ctx.lineTo(83, 116);
  ctx.fill();

  // the eyes
  // eslint-disable-next-line functional/immutable-data
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(91, 96);
  ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
  ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
  ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
  ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
  ctx.moveTo(103, 96);
  ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
  ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
  ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
  ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
  ctx.fill();

  // the pupils
  // eslint-disable-next-line functional/immutable-data
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
  ctx.fill();

  const texture = new Three.Texture(canvas);
  // eslint-disable-next-line functional/immutable-data
  texture.needsUpdate = true;
  return texture;
};

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
      map: createGhostTexture(),
      sizeAttenuation,
      transparent,
      color,
      opacity,
    });
  }, [color, opacity, sizeAttenuation, transparent]);

  // eslint-disable-next-line functional/immutable-data -- Required to make background transparent
  spriteMaterial.alphaTest = 0.5;

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
        <DatNumber path="count" min={100} max={3000} step={100} />
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
