import * as React from 'react';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import * as Three from 'three';
import {
  Lensflare,
  LensflareElement,
} from 'three/examples/jsm/objects/Lensflare';
import DatGui, { DatNumber, DatColor } from 'react-dat-gui';
import { TrackballControls, Stats } from 'drei';

const Plane = React.forwardRef<Three.Mesh>(
  (_, ref): JSX.Element => {
    const texture = useLoader(Three.TextureLoader, '/grasslight_big.jpg');
    /* eslint-disable functional/immutable-data */
    texture.wrapS = Three.RepeatWrapping;
    texture.wrapT = Three.RepeatWrapping;
    /* eslint-enable functional/immutable-data */
    texture.repeat.set(10, 10);

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
      const geometry = new Three.SphereBufferGeometry(4, 25, 25);
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
  readonly color: string;
  readonly intensity: number;
};

const DirectionalLight = ({
  color,
  intensity,
}: DirectionalLightProps): JSX.Element => {
  const texture0 = useLoader(Three.TextureLoader, '/lensflare_0.png');
  const texture3 = useLoader(Three.TextureLoader, '/lensflare_3.png');

  const lensFlare = React.useMemo(() => {
    const color = new Three.Color(0xffaacc);
    const flare = new Lensflare();
    flare.addElement(new LensflareElement(texture0, 350, 0.0, color));
    flare.addElement(new LensflareElement(texture3, 60, 0.6, color));
    flare.addElement(new LensflareElement(texture3, 70, 0.7, color));
    flare.addElement(new LensflareElement(texture3, 120, 0.9, color));
    flare.addElement(new LensflareElement(texture3, 70, 1.0, color));
    return flare;
  }, [texture0, texture3]);

  const directionalLight = React.useMemo(() => {
    /* eslint-disable functional/immutable-data */
    const light = new Three.DirectionalLight();
    light.castShadow = true;
    light.shadow.camera.near = 2;
    light.shadow.camera.far = 200;
    light.shadow.camera.left = -100;
    light.shadow.camera.right = 100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.add(lensFlare);
    return light;
    /* eslint-enable functional/immutable-data */
  }, [lensFlare]);

  return (
    <primitive
      object={directionalLight}
      color={color}
      intensity={intensity}
      position={[30, 10, -50]}
    />
  );
};

const Page = (): JSX.Element => {
  const planeRef = React.useRef<Three.Mesh>(null);
  const cubeRef = React.useRef<Three.Mesh>(null);
  const sphereRef = React.useRef<Three.Mesh>(null);
  const [state, setState] = React.useState({
    ambientColor: '#1c1c1c',
    color: '#ffffff',
    intensity: 0.1,
    rotationSpeed: 0.03,
    bouncingSpeed: 0.03,
  });

  return (
    <>
      <Canvas
        shadowMap
        camera={{
          fov: 45,
          position: [-20, 10, 45],
        }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(new Three.Color(0x000000));
          camera.lookAt(new Three.Vector3(-10, 0, 0));
        }}>
        <React.Suspense fallback={null}>
          <Plane ref={planeRef} />
          <Cube ref={cubeRef} rotationSpeed={state.rotationSpeed} />
          <Sphere ref={sphereRef} bouncingSpeed={state.bouncingSpeed} />

          <spotLight color={0xcccccc} position={[-40, 60, -10]} />
          <ambientLight color={state.ambientColor} />
          <DirectionalLight color={state.color} intensity={state.intensity} />
          <TrackballControls />
          <Stats />
        </React.Suspense>
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatColor path="ambientColor" />
        <DatColor path="color" />
        <DatNumber path="intensity" min={0} max={3} step={0.1} />
        <DatNumber path="rotationSpeed" min={0.01} max={0.1} step={0.01} />
        <DatNumber path="bouncingSpeed" min={0.01} max={0.1} step={0.01} />
      </DatGui>
    </>
  );
};

export default Page;
