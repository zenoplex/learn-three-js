import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import DatGui, { DatBoolean } from 'react-dat-gui';
import { Stats, TrackballControls } from 'drei';
import vert from '~/shaders/ch04_11_0.vert';
import frag0 from '~/shaders/ch04_11_0.frag';
import frag1 from '~/shaders/ch04_11_1.frag';
import frag2 from '~/shaders/ch04_11_2.frag';
import frag3 from '~/shaders/ch04_11_3.frag';
import frag4 from '~/shaders/ch04_11_4.frag';
import frag5 from '~/shaders/ch04_11_5.frag';

const uniforms = {
  time: {
    value: 0.2,
  },
  scale: {
    value: 0.2,
  },
  alpha: {
    value: 0.6,
  },
  resolution: {
    value: new Three.Vector2(),
  },
};

const createMaterial = (
  vertexShader: string,
  fragmentShader: string,
): Three.ShaderMaterial => {
  return new Three.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
  });
};

const fragments = [frag0, frag1, frag2, frag3, frag4, frag5];

type SceneProps = {
  readonly wireframe: boolean;
};

const Scene = ({ wireframe }: SceneProps): JSX.Element => {
  const materials = React.useMemo(() => {
    return fragments.map((fragment) => createMaterial(vert, fragment));
  }, []);

  const ref = React.useRef<Three.Mesh<Three.Geometry>>();
  const step = React.useRef(0);

  React.useEffect(() => {
    /* eslint-disable functional/immutable-data */
    materials.forEach((material) => {
      material.wireframe = wireframe;
    });
    /* eslint-enable functional/immutable-data */
  }, [materials, wireframe]);

  useFrame(({ size }) => {
    /* eslint-disable functional/immutable-data */
    if (!ref.current) return;

    step.current = step.current + 0.01;
    ref.current.rotation.x = step.current;
    ref.current.rotation.y = step.current;
    ref.current.rotation.z = step.current;

    materials.map((material) => {
      material.uniforms.resolution.value.x = size.width;
      material.uniforms.resolution.value.y = size.height;
      material.uniforms.time.value += 0.002;
    });
    /* eslint-enable functional/immutable-data */
  });

  return (
    <>
      <mesh ref={ref} material={materials} position={[0, 3, 2]}>
        <boxGeometry attach="geometry" args={[15, 15, 15]} />
      </mesh>

      <ambientLight color={0x0c0c0c} />
      <spotLight color={0xffffff} position={[-40, 60, -19]} castShadow />
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    wireframe: false,
  });

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{
          fov: 45,
          position: [-30, 40, 30],
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000);
        }}>
        <React.Suspense fallback={null}>
          <Scene wireframe={state.wireframe} />
        </React.Suspense>
        <Stats />
        <TrackballControls />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatBoolean path="wireframe" />
      </DatGui>
    </>
  );
};

export default Page;
