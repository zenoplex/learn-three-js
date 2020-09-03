import * as React from 'react';
import { Canvas } from 'react-three-fiber';
import * as Three from 'three';
import DatGui, { DatNumber, DatColor } from 'react-dat-gui';
import { TrackballControls, Stats } from 'drei';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

RectAreaLightUniformsLib.init();

type PlaneProps = {
  readonly roughness: number;
  readonly metalness: number;
};

const Plane = ({
  roughness = 0.044676705160855,
  metalness = 0,
}: PlaneProps): JSX.Element => {
  return (
    <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[70, 70, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
};

// eslint-disable-next-line functional/prefer-readonly-type
type PositionTuple = [x: number, y: number, z: number];

type RectProps = {
  readonly color: number;
  readonly position: PositionTuple;
};

const Rect = ({ color, position }: RectProps): JSX.Element => {
  const mesh = React.useMemo(() => {
    const geometry = new Three.BoxBufferGeometry(4, 10, 0);
    const material = new Three.MeshBasicMaterial({ color });
    return new Three.Mesh(geometry, material);
  }, [color]);
  return <primitive object={mesh} position={position} />;
};

type AreaLightProps = {
  readonly color: string;
  readonly intensity: number;
  readonly position: PositionTuple;
};

const AreaLight = ({
  color,
  intensity,
  position,
}: AreaLightProps): JSX.Element => {
  const areaLight = React.useMemo(() => {
    const light = new Three.RectAreaLight(color, intensity, 4, 10);
    return light;
  }, [color, intensity]);

  return (
    <primitive
      object={areaLight}
      position={position}
      onUpdate={(self: typeof areaLight) =>
        self.lookAt(new Three.Vector3(0, 0, 0))
      }
    />
  );
};

const position0: PositionTuple = [-10, 10, -35];
const position1: PositionTuple = [0, 10, -35];
const position2: PositionTuple = [10, 10, -35];

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    color0: '#ff0000',
    color1: '#00ff00',
    color2: '#0000ff',
    intensity0: 500,
    intensity1: 500,
    intensity2: 500,
    roughness: 0.044676705160855,
    metalness: 0,
  });

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        shadowMap
        camera={{
          fov: 45,
          position: [-50, 30, 50],
          near: 0.1,
          far: 1000,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <React.Suspense fallback={null}>
          <Plane roughness={state.roughness} metalness={state.metalness} />
          <spotLight
            color={0xcccccc}
            position={[-40, 60, -10]}
            intensity={0.1}
          />
          <AreaLight
            color={state.color0}
            intensity={state.intensity0}
            position={position0}
          />
          <AreaLight
            color={state.color1}
            intensity={state.intensity1}
            position={position1}
          />
          <AreaLight
            color={state.color2}
            intensity={state.intensity2}
            position={position2}
          />

          <Rect color={0xff0000} position={position0} />
          <Rect color={0x00ff00} position={position1} />
          <Rect color={0x0000ff} position={position2} />

          <TrackballControls />
          <Stats />
        </React.Suspense>
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatColor path="color0" />
        <DatNumber path="intensity0" min={0} max={1000} step={1} />
        <DatColor path="color1" />
        <DatNumber path="intensity1" min={0} max={1000} step={1} />
        <DatColor path="color2" />
        <DatNumber path="intensity2" min={0} max={1000} step={1} />
        <DatNumber path="roughness" min={0} max={1} step={0.01} />
        <DatNumber path="metalness" min={0} max={1} step={0.1} />
      </DatGui>
    </>
  );
};

export default Page;
