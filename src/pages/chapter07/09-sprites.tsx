import * as React from 'react';
import * as Three from 'three';
import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
  createPortal,
} from 'react-three-fiber';
import { TrackballControls, Stats } from 'drei';
import DatGui, { DatNumber, DatColor, DatBoolean } from 'react-dat-gui';

type HudProps = {
  readonly sprite: number;
  readonly opacity: number;
  readonly color: string;
  readonly transparent: boolean;
  readonly size: number;
};

const Hud = ({
  sprite,
  size: scale,
  opacity,
  color,
  transparent,
}: HudProps): JSX.Element => {
  const { gl, scene, camera, size } = useThree();
  const HudScene = React.useMemo(() => new Three.Scene(), []);
  const hudCameraRef = React.useRef<Three.OrthographicCamera | null>(null);
  const texture = useLoader(Three.TextureLoader, '/sprite-sheet.png');
  const material = React.useMemo(() => {
    return new Three.SpriteMaterial({
      opacity,
      color,
      transparent,
      map: texture,
    });
  }, [color, opacity, texture, transparent]);

  React.useEffect(() => {
    /* eslint-disable functional/immutable-data */
    if (material.map) {
      material.map.offset = new Three.Vector2(0.2 * sprite, 0);
      material.map.repeat = new Three.Vector2(1 / 5, 1);
    }
    material.blending = Three.AdditiveBlending;
    // make sure the object is always rendered at the front
    material.depthTest = false;
    /* eslint-enable functional/immutable-data */
  }, [material, sprite]);

  useFrame(() => {
    // matrix.getInverse(camera.matrix);
    // ref.current.quaternion.setFromRotationMatrix(matrix);
    hudCameraRef.current?.updateProjectionMatrix();
    gl.autoClear = true;
    gl.render(scene, camera);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(HudScene, hudCameraRef.current);
  });

  return createPortal(
    <>
      <orthographicCamera
        ref={hudCameraRef}
        left={0}
        right={size.width}
        top={size.height}
        bottom={0}
        near={-10}
        far={10}
      />
      <sprite
        args={[material]}
        scale={[scale, scale, scale]}
        position={[100, 50, -10]}
      />
    </>,
    HudScene,
  );
};

const Scene = (): JSX.Element => {
  const ref = React.useRef<Three.Group | null>(null);
  const step = React.useRef(0);

  return (
    <group ref={ref}>
      <mesh>
        <sphereBufferGeometry attach="geometry" args={[15, 20, 20]} />
        <meshNormalMaterial attach="material" wireframe />
      </mesh>
    </group>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    sprite: 0,
    size: 10,
    transparent: true,
    opacity: 0.6,
    color: '#ffffff',
  });

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{ fov: 45, position: [0, 0, 50] }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <React.Suspense fallback={null}>
          <Scene />
          <Hud
            sprite={state.sprite}
            transparent={state.transparent}
            opacity={state.opacity}
            color={state.color}
            size={state.size}
          />
          <TrackballControls />
        </React.Suspense>
        <Stats />
      </Canvas>

      <DatGui data={state} onUpdate={setState}>
        <DatNumber path="sprite" min={0} max={4} step={1} />
        <DatNumber path="size" min={0} max={150} step={1} />
        <DatBoolean path="transparent" />
        <DatNumber path="opacity" min={0} max={1} step={0.1} />
        <DatColor path="color" />
      </DatGui>
    </>
  );
};

export default Page;
