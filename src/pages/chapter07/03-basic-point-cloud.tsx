import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import { Stats, TrackballControls } from 'drei';
import DatGui, { DatNumber, DatColor, DatBoolean } from 'react-dat-gui';

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
    });
  }, [color, opacity, size, sizeAttenuation, transparent, vertexColors]);

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
    size: 2,
    transparent: true,
    opacity: 1,
    vertexColors: true,
    color: '#ffffff',
    vertexColor: '#00ff00',
    sizeAttenuation: true,
    rotate: true,
  });

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{ fov: 45, position: [0, 0, 150] }}
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
