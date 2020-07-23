import * as React from 'react';
import * as Three from 'three';
import { Canvas, useThree, Camera } from 'react-three-fiber';
import { Stats, TrackballControls } from 'drei';
import DatGui, { DatBoolean } from 'react-dat-gui';

type PlaneProps = {
  readonly width: number;
  readonly height: number;
};

const Plain = ({ width, height }: PlaneProps): JSX.Element => {
  return (
    <mesh
      visible
      position={[0, 0, 0]}
      rotation={[-0.5 * Math.PI, 0, 0]}
      receiveShadow>
      <planeGeometry attach="geometry" args={[width, height, 1, 1]} />
      <meshLambertMaterial attach="material" color={0xffffff} />
    </mesh>
  );
};

const cubeGeometry = new Three.BoxBufferGeometry(4, 4, 4);

type CubeProps = {
  // eslint-disable-next-line functional/prefer-readonly-type
  position?: [number, number, number];
};

const Cube = ({ position }: CubeProps): JSX.Element => {
  return (
    <mesh geometry={cubeGeometry} position={position}>
      <meshLambertMaterial
        attach="material"
        color={new Three.Color(Math.random() * 0.75 + 0.25, 0, 0)}
      />
    </mesh>
  );
};

const planeWidth = 180;
const planeHeight = 180;
const divider = 5;

const PerspectiveCamera = (): JSX.Element => {
  const ref = React.useRef<Camera>();
  const { setDefaultCamera, scene } = useThree();

  React.useEffect(() => {
    if (ref.current) {
      setDefaultCamera(ref.current);
      ref.current.lookAt(scene.position);
    }
  }, [scene.position, setDefaultCamera]);
  return (
    <perspectiveCamera
      ref={ref}
      position={[120, 60, 180]}
      near={0.1}
      far={1000}
    />
  );
};

const OrthographicCamera = (): JSX.Element => {
  const ref = React.useRef<Camera>();
  const { setDefaultCamera, size, scene } = useThree();

  React.useEffect(() => {
    if (ref.current) {
      setDefaultCamera(ref.current);
      ref.current.lookAt(scene.position);
    }
  }, [scene.position, setDefaultCamera]);

  return (
    <orthographicCamera
      ref={ref}
      position={[120, 60, 180]}
      // Not sure but left, right, top, bottom option does not seem to work as intended
      zoom={8}
      args={[
        size.width / -16,
        size.width / 16,
        size.height / 16,
        size.height / -16,
        -200,
        500,
      ]}
    />
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    orthographic: false,
  });

  const rowCount = planeHeight / divider;
  const colCount = planeWidth / divider;

  const cubes: readonly typeof Cube[] = React.useMemo(() => {
    return new Array(rowCount).fill(null).reduce((acc, _, i) => {
      const cols = new Array(colCount).fill(null).map((_, j) => {
        return (
          <Cube
            key={j + rowCount * i}
            position={[
              -(planeWidth / 2) + 2 + i * divider,
              2,
              -(planeHeight / 2) + 2 + j * divider,
            ]}
          />
        );
      });

      return acc.concat(...cols);
    }, []);
  }, [colCount, rowCount]);

  return (
    <>
      <Canvas
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <Plain width={planeWidth} height={planeHeight} />
        <ambientLight color={0x292929} />
        <directionalLight
          color={0xffffff}
          intensity={0.7}
          position={[-20, 40, 60]}
        />
        {cubes.map((Element) => Element)}
        <TrackballControls />
        <Stats />
        {state.orthographic ? <OrthographicCamera /> : <PerspectiveCamera />}
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatBoolean path="orthographic" />
      </DatGui>
    </>
  );
};

export default Page;
