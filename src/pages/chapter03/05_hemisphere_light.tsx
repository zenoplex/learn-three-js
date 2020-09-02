import * as React from 'react';
import { Canvas, useFrame, useResource, useLoader } from 'react-three-fiber';
import * as Three from 'three';
import DatGui, {
  DatNumber,
  DatColor,
  DatSelect,
  DatBoolean,
} from 'react-dat-gui';
import { TrackballControls, Stats } from 'drei';

const Plane = React.forwardRef<Three.Mesh>(
  (_, ref): JSX.Element => {
    const texture = useLoader(Three.TextureLoader, '/grasslight-big.jpg');
    texture.wrapS = Three.RepeatWrapping;
    texture.wrapT = Three.RepeatWrapping;

    return (
      <mesh
        ref={ref}
        receiveShadow
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[15, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[1000, 1000, 20, 20]} />
        <meshLambertMaterial attach="material" map={texture} />
      </mesh>
    );
  },
);
// eslint-disable-next-line functional/immutable-data
Plane.displayName = 'Plane';

type CubeProps = {
  readonly rotationSpeed: number;
};

const Cube = React.forwardRef<Three.Mesh, CubeProps>(
  ({ rotationSpeed }: CubeProps, ref): JSX.Element => {
    const cube = React.useMemo(() => {
      const geometry = new Three.BoxBufferGeometry(4, 4, 4);
      const material = new Three.MeshLambertMaterial({ color: 0xff3333 });
      const mesh = new Three.Mesh(geometry, material);
      // eslint-disable-next-line functional/immutable-data
      mesh.castShadow = true;
      mesh.position.set(-4, 3, 0);
      return mesh;
    }, []);

    useFrame(() => {
      /* eslint-disable functional/immutable-data */
      cube.rotation.x += rotationSpeed;
      cube.rotation.y += rotationSpeed;
      cube.rotation.z += rotationSpeed;
      /* eslint-enable functional/immutable-data */
    });

    return <primitive ref={ref} object={cube} />;
  },
);

type SphereProps = {
  readonly bouncingSpeed: number;
};

const Sphere = React.forwardRef<Three.Mesh, SphereProps>(
  ({ bouncingSpeed }: SphereProps, ref): JSX.Element => {
    const sphere = React.useMemo(() => {
      /* eslint-disable functional/immutable-data */
      const geometry = new Three.SphereBufferGeometry(4, 20, 20);
      const material = new Three.MeshLambertMaterial({ color: 0x777ff });
      const mesh = new Three.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.position.set(20, 0, 2);
      return mesh;
      /* eslint-enable functional/immutable-data */
    }, []);

    const step = React.useRef(0);
    useFrame(() => {
      /* eslint-disable functional/immutable-data */
      step.current += bouncingSpeed;
      sphere.position.x = 20 + 10 * Math.cos(step.current);
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(step.current));
      /* eslint-enable functional/immutable-data */
    });

    return <primitive ref={ref} object={sphere} />;
  },
);
// eslint-disable-next-line functional/immutable-data
Sphere.displayName = 'Sphere';

type DirectionalLightProps = {
  readonly bouncingSpeed: number;
  readonly target: Three.Mesh | null;
  readonly canCastShadow: boolean;
  readonly color: string;
};

const Page = (): JSX.Element => {
  const [planeRef, plane] = useResource<Three.Mesh>();
  const [cubeRef, cube] = useResource<Three.Mesh>();
  const [sphereRef, sphere] = useResource<Three.Mesh>();
  const [state, setState] = React.useState({
    ambientColor: '#0c0c0c',
    directionalColor: '#ff5808',
    distance: 100,
    intensity: 0.5,
    rotationSpeed: 0.03,
    bouncingSpeed: 0.03,
    canCastShadow: true,
    target: 'Plane',
  });
  const [target, setTarget] = React.useState<Three.Mesh | null>(null);

  React.useEffect(() => {
    /* eslint-disable functional/immutable-data */
    switch (state.target) {
      case 'Plane':
        setTarget(plane);
        break;
      case 'Sphere':
        setTarget(sphere);
        break;
      case 'Cube':
        setTarget(cube);
        break;
      default:
        setTarget(plane);
    }
    /* eslint-enable functional/immutable-data */
  }, [cube, plane, sphere, state.target]);

  return (
    <>
      <Canvas
        shadowMap
        camera={{
          fov: 45,
          position: [-80, 80, 80],
          near: 0.1,
          far: 1000,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <React.Suspense fallback={null}>
          <Plane ref={planeRef} />
          <Cube ref={cubeRef} rotationSpeed={state.rotationSpeed} />
          <Sphere ref={sphereRef} bouncingSpeed={state.bouncingSpeed} />

          <spotLight args={[0xcccccc]} position={[-40, 60, -10]} />
          <hemisphereLight
            args={[0x0000ff, 0x00ff00, 0.6]}
            position={[0, 500, 0]}
          />
          <directionalLight
            args={['#ffffff']}
            castShadow
            shadow-camera-near={0.1}
            shadow-camera-far={200}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-button={-50}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
        </React.Suspense>
        <TrackballControls />
        <Stats />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatColor path="ambientColor" />
        <DatColor path="directionalColor" />
        <DatNumber path="intensity" min={0} max={3} step={0.1} />
        <DatNumber path="distance" min={0} max={100} step={1} />
        <DatNumber path="rotationSpeed" min={0.01} max={0.1} step={0.01} />
        <DatNumber path="bouncingSpeed" min={0.01} max={0.1} step={0.01} />
        <DatBoolean path="canCastShadow" />
        <DatSelect path="target" options={['Plane', 'Sphere', 'Cube']} />
      </DatGui>
    </>
  );
};

export default Page;
