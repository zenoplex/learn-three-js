import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame, useResource } from 'react-three-fiber';
import { Stats } from 'drei';
import DatGui, {
  DatNumber,
  DatColor,
  DatBoolean,
  DatSelect,
} from 'react-dat-gui';
import mergeRefs from '~/hooks/mergeRefs';

const Plane = React.forwardRef<Three.Mesh>((_, ref) => {
  return (
    <mesh
      name="plane"
      ref={ref}
      visible
      position={[15, 0, 0]}
      rotation={[-0.5 * Math.PI, 0, 0]}
      receiveShadow>
      <planeGeometry attach="geometry" args={[60, 20, 1, 1]} />
      <meshPhongMaterial attach="material" color={0xffffff} />
    </mesh>
  );
});
// eslint-disable-next-line functional/immutable-data
Plane.displayName = 'Plane';

const Cube = React.forwardRef<Three.Mesh>(
  (_, ref): JSX.Element => {
    const meshRef = React.useRef<Three.Mesh>();

    useFrame(() => {
      if (meshRef.current) {
        /* eslint-disable functional/immutable-data */
        meshRef.current.rotation.x += 0.02;
        meshRef.current.rotation.y += 0.02;
        meshRef.current.rotation.z += 0.02;
        /* eslint-enable functional/immutable-data */
      }
    });

    return (
      <mesh
        ref={mergeRefs([ref, meshRef])}
        visible
        position={[-4, 3, 0]}
        castShadow>
        <boxBufferGeometry attach="geometry" args={[4, 4, 4]} />
        <meshLambertMaterial attach="material" color={0xff0000} />
      </mesh>
    );
  },
);
// eslint-disable-next-line functional/immutable-data
Cube.displayName = 'Cube';

const Sphere = React.forwardRef<Three.Mesh>(
  (_, ref): JSX.Element => {
    const stepRef = React.useRef<number>(0);
    const meshRef = React.useRef<Three.Mesh>();
    useFrame(() => {
      if (meshRef.current) {
        /* eslint-disable functional/immutable-data */
        meshRef.current.position.x = 20 + 10 * Math.cos(stepRef.current);
        meshRef.current.position.y =
          2 + 10 * Math.abs(Math.sin(stepRef.current));
        stepRef.current += 0.04;
        /* eslint-enable functional/immutable-data */
      }
    });

    return (
      <mesh
        ref={mergeRefs([ref, meshRef])}
        visible
        position={[20, 0, 2]}
        castShadow>
        <sphereGeometry attach="geometry" args={[4, 20, 20]} />
        <meshLambertMaterial attach="material" color={0x7777ff} />
      </mesh>
    );
  },
);
// eslint-disable-next-line functional/immutable-data
Sphere.displayName = 'Sphere';

type MovingSpotLightProps = {
  readonly color: number | string;
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly position: [number, number, number];
  readonly castShadow: boolean;
  readonly distance: number;
  readonly angle: number;
  readonly intensity: number;
  readonly target?: Three.Object3D | null;
  readonly isLightMoving: boolean;
  readonly isShadowDebugVisible: boolean;
  readonly rotationSpeed: number;
  readonly penumbra: number;
};

const MovingSpotLight = ({
  color,
  position,
  castShadow,
  distance,
  angle,
  intensity,
  penumbra,
  target,
  isLightMoving,
  isShadowDebugVisible,
  rotationSpeed,
}: MovingSpotLightProps): JSX.Element => {
  const [spotLightRef, spotLight] = useResource<Three.SpotLight>();
  const spotLightHelperRef = React.useRef<Three.SpotLightHelper>();
  const sphereLightRef = React.useRef<Three.Mesh>();
  const phase = React.useRef(0);
  const invert = React.useRef(1);

  /* eslint-disable functional/immutable-data */
  useFrame(() => {
    if (!sphereLightRef.current || !spotLight) return;

    if (isLightMoving) {
      if (phase.current > 2 * Math.PI) {
        invert.current = invert.current * -1;
        phase.current -= 2 * Math.PI;
      } else {
        phase.current += rotationSpeed;
      }
      sphereLightRef.current.position.x = +(14 * Math.cos(phase.current));
      sphereLightRef.current.position.y = 15;
      sphereLightRef.current.position.z = +(7 * Math.sin(phase.current));

      if (invert.current < 0) {
        sphereLightRef.current.position.x =
          invert.current * (sphereLightRef.current?.position.x - 14) + 14;
      }

      if (sphereLightRef.current)
        spotLight.position.copy(sphereLightRef.current.position);
    }

    if (target) spotLight.target = target;
    spotLightHelperRef.current?.update();
  });
  /* eslint-enable functional/immutable-data */

  return (
    <>
      <spotLight
        ref={spotLightRef}
        color={color}
        position={position}
        castShadow={castShadow}
        distance={distance}
        angle={angle}
        intensity={intensity}
        penumbra={penumbra}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-fov={120}
      />

      {spotLight ? (
        <spotLightHelper ref={spotLightHelperRef} args={[spotLight]} />
      ) : null}

      <mesh ref={sphereLightRef} position={[3, 20, 3]}>
        <sphereGeometry args={[0.2]} attach="geometry" />
        <meshBasicMaterial color={0xac6c25} attach="material" />
      </mesh>

      {isShadowDebugVisible && spotLight ? (
        <cameraHelper args={[spotLight.shadow.camera]} />
      ) : null}
    </>
  );
};

const Page = (): JSX.Element => {
  const planeRef = React.useRef<Three.Mesh>(null);
  const sphereRef = React.useRef<Three.Mesh>(null);
  const cubeRef = React.useRef<Three.Mesh>(null);

  const [state, setState] = React.useState({
    ambientColor: '#1c1c1c',
    pointColor: '#ffffff',
    angle: 0.4,
    intensity: 1,
    penumbra: 0,
    distance: 0,
    isShadowDebugVisible: false,
    castShadow: true,
    target: 'Plain',
    isLightMoving: true,
    rotationSpeed: 0.03,
  });

  const [target, setTarget] = React.useState<Three.Mesh | null>(null);

  React.useEffect(() => {
    /* eslint-disable functional/immutable-data */
    switch (state.target) {
      case 'Plane':
        setTarget(planeRef.current);
        break;
      case 'Sphere':
        setTarget(sphereRef.current);
        break;
      case 'Cube':
        setTarget(cubeRef.current);
        break;
      default:
        setTarget(planeRef.current);
    }
    /* eslint-enable functional/immutable-data */
  }, [state.target]);

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [-30, 40, 30],
        }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <Plane ref={planeRef} />
        <Cube ref={cubeRef} />
        <Sphere ref={sphereRef} />

        <MovingSpotLight
          color={state.pointColor}
          position={[-40, 30, -10]}
          distance={state.distance}
          angle={state.angle}
          intensity={state.intensity}
          castShadow={state.castShadow}
          penumbra={state.penumbra}
          target={target}
          isShadowDebugVisible={state.isShadowDebugVisible}
          isLightMoving={state.isLightMoving}
          rotationSpeed={state.rotationSpeed}
        />

        <ambientLight color={state.ambientColor} />
        <spotLight args={[0xcccccc]} position={[-40, 30, -10]} />

        <Stats />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatColor path="ambientColor" />
        <DatColor path="pointColor" />
        <DatNumber path="angle" min={0} max={Math.PI * 2} step={0.1} />
        <DatNumber path="intensity" min={0} max={5} step={0.1} />
        <DatNumber path="penumbra" min={0} max={1} step={0.1} />
        <DatNumber path="distance" min={0} max={200} step={0.1} />
        <DatBoolean path="isShadowDebugVisible" />
        <DatBoolean path="castShadow" />
        <DatSelect path="target" options={['Plane', 'Sphere', 'Cube']} />
        <DatBoolean path="isLightMoving" />
        <DatNumber path="rotationSpeed" min={0} max={0.1} step={0.01} />
      </DatGui>
    </>
  );
};

export default Page;
