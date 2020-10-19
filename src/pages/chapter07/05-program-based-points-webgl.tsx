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
  readonly size: number;
  readonly transparent: boolean;
  readonly opacity: number;
  readonly vertexColors: boolean;
  readonly color: string;
  readonly vertexColor: string;
  readonly sizeAttenuation: boolean;
  readonly count: number;
  readonly rotate: boolean;
};

const Scene = ({
  count = 15000,
  size,
  transparent,
  opacity,
  vertexColors,
  color,
  vertexColor,
  sizeAttenuation,
  rotate,
}: SceneProps): JSX.Element => {
  const ref = React.useRef<Three.Points | null>(null);
  const step = React.useRef(0);

  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    if (!ref.current || !rotate) return;
    ref.current.rotation.x = step.current;
    ref.current.rotation.y = step.current;

    step.current = step.current + 0.01;
    /* eslint-enable functional/immutable-data */
  });

  const pointMaterial = React.useMemo(() => {
    return new Three.PointsMaterial({
      size,
      transparent,
      opacity,
      vertexColors,
      color,
      sizeAttenuation,
      map: createGhostTexture(),
    });
  }, [color, opacity, size, sizeAttenuation, transparent, vertexColors]);

  // eslint-disable-next-line functional/immutable-data -- Required to make background transparent
  pointMaterial.alphaTest = 0.5;

  const geometry = React.useMemo(() => {
    const geom = new Three.Geometry();
    const range = 500;
    new Array(count).fill(null).forEach(() => {
      const vertex = new Three.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
      );
      const color = new Three.Color(vertexColor);
      const hsl = color.getHSL({ h: 0, s: 0, l: 0 });
      color.setHSL(hsl.h, hsl.s, hsl.l * Math.random());
      geom.vertices.push(vertex);
      geom.colors.push(color);
    });

    return geom;
  }, [count, vertexColor]);

  return (
    <>
      <points ref={ref} args={[geometry, pointMaterial]} />
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    count: 15000,
    size: 15,
    transparent: true,
    opacity: 0.6,
    vertexColors: false,
    color: '#ffffff',
    vertexColor: '#00ff00',
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
        <Scene
          count={state.count}
          size={state.size}
          transparent={state.transparent}
          opacity={state.opacity}
          vertexColors={state.vertexColors}
          color={state.color}
          vertexColor={state.vertexColor}
          sizeAttenuation={state.sizeAttenuation}
          rotate={state.rotate}
        />
        <Stats />
        <TrackballControls />
      </Canvas>

      <DatGui data={state} onUpdate={setState}>
        <DatNumber path="count" min={1000} max={30000} step={1000} />
        <DatNumber path="size" min={0} max={30} step={1} />
        <DatBoolean path="transparent" />
        <DatNumber path="opacity" min={0} max={1} step={0.1} />
        <DatBoolean path="vertexColors" />
        <DatColor path="color" />
        <DatColor path="vertexColor" />
        <DatBoolean path="sizeAttenuation" />
        <DatBoolean path="rotate" />
      </DatGui>
    </>
  );
};

export default Page;
