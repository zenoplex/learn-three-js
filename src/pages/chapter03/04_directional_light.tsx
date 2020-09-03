import * as React from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
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
    return (
      <mesh
        ref={ref}
        receiveShadow
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[15, -5, 0]}>
        <planeBufferGeometry attach="geometry" args={[600, 200, 20, 20]} />
        <meshLambertMaterial attach="material" color={0xffffff} />
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

const DirectionalLight = ({
  bouncingSpeed,
  target,
  canCastShadow,
  color,
}: DirectionalLightProps): JSX.Element => {
  const directionalLight = React.useMemo(() => {
    /* eslint-disable functional/immutable-data */
    const light = new Three.DirectionalLight('#ff5808');
    light.position.set(-40, 60, -10);
    light.castShadow = true;
    light.shadow.camera.near = 2;
    light.shadow.camera.far = 80;
    light.shadow.camera.left = -30;
    light.shadow.camera.right = 30;
    light.shadow.camera.top = 30;
    light.shadow.camera.bottom = -30;
    light.intensity = 0.5;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    return light;
    /* eslint-enable functional/immutable-data */
  }, []);

  const shadowCamera = React.useMemo(() => {
    return new Three.CameraHelper(directionalLight.shadow.camera);
  }, [directionalLight.shadow.camera]);

  const sphereLightMesh = React.useMemo(() => {
    const geom = new Three.SphereBufferGeometry(0.2);
    const material = new Three.MeshBasicMaterial({ color: 0xac6c25 });
    return new Three.Mesh(geom, material);
  }, []);

  const step = React.useRef(0);

  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    step.current += bouncingSpeed;
    sphereLightMesh.position.x = 10 + 26 * Math.cos(step.current / 3);
    sphereLightMesh.position.y = +(27 * Math.sin(step.current / 3));
    sphereLightMesh.position.z = -8;

    directionalLight.position.copy(sphereLightMesh.position);
    if (target) directionalLight.target = target;
    /* eslint-enable functional/immutable-data */
  });

  return (
    <>
      <primitive
        object={directionalLight}
        castShadow={canCastShadow}
        color={color}
      />
      <primitive object={shadowCamera} />
      <primitive object={sphereLightMesh} />
    </>
  );
};

const Page = (): JSX.Element => {
  const planeRef = React.useRef<Three.Mesh>(null);
  const cubeRef = React.useRef<Three.Mesh>(null);
  const sphereRef = React.useRef<Three.Mesh>(null);
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
        <Plane ref={planeRef} />
        <Cube ref={cubeRef} rotationSpeed={state.rotationSpeed} />
        <Sphere ref={sphereRef} bouncingSpeed={state.bouncingSpeed} />
        <DirectionalLight
          bouncingSpeed={state.bouncingSpeed}
          canCastShadow={state.canCastShadow}
          color={state.directionalColor}
          target={target}
        />
        <ambientLight color={state.ambientColor} intensity={state.intensity} />
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
