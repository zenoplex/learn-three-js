import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import DatGui, { DatNumber } from 'react-dat-gui';
import { Stats, TrackballControls } from 'drei';

// eslint-disable-next-line functional/prefer-readonly-type
type Turtle = [number, number, number];

type Points = readonly {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}[];

const gosperCurve = (order: number, size: number): Points => {
  // Not going to rewrite this function, out of scope
  /* eslint-disable no-param-reassign, functional/immutable-data */
  const turtle: Turtle = [0, 0, 0];
  // eslint-disable-next-line functional/prefer-readonly-type
  const points: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  }[] = [];
  const count = 0;

  const rg = (st: number, ln: number, turtle: Turtle): void => {
    st--;
    ln = ln / 2.6457;
    if (st > 0) {
      //                    ctx.strokeStyle = '#111';
      rg(st, ln, turtle);
      rt(60);
      gl(st, ln, turtle);
      rt(120);
      gl(st, ln, turtle);
      lt(60);
      rg(st, ln, turtle);
      lt(120);
      rg(st, ln, turtle);
      rg(st, ln, turtle);
      lt(60);
      gl(st, ln, turtle);
      rt(60);
    }
    if (st == 0) {
      fd(ln);
      rt(60);
      fd(ln);
      rt(120);
      fd(ln);
      lt(60);
      fd(ln);
      lt(120);
      fd(ln);
      fd(ln);
      lt(60);
      fd(ln);
      rt(60);
    }
  };

  const rt = (x: number): void => {
    turtle[2] += x;
  };

  const lt = (x: number): void => {
    turtle[2] -= x;
  };

  const fd = (dist: number): void => {
    //                ctx.beginPath();
    points.push({
      x: turtle[0],
      y: turtle[1],
      z: Math.sin(count) * 5,
    });
    //                ctx.moveTo(turtle[0], turtle[1]);

    const dir = turtle[2] * (Math.PI / 180);
    turtle[0] += Math.cos(dir) * dist;
    turtle[1] += Math.sin(dir) * dist;

    points.push({
      x: turtle[0],
      y: turtle[1],
      z: Math.sin(count) * 5,
    });
    //                ctx.lineTo(turtle[0], turtle[1]);
    //                ctx.stroke();
  };

  const gl = (st: number, ln: number, turtle: Turtle): void => {
    st--;
    ln = ln / 2.6457;
    if (st > 0) {
      //                    ctx.strokeStyle = '#555';
      lt(60);
      rg(st, ln, turtle);
      rt(60);
      gl(st, ln, turtle);
      gl(st, ln, turtle);
      rt(120);
      gl(st, ln, turtle);
      rt(60);
      rg(st, ln, turtle);
      lt(120);
      rg(st, ln, turtle);
      lt(60);
      gl(st, ln, turtle);
    }
    if (st == 0) {
      lt(60);
      fd(ln);
      rt(60);
      fd(ln);
      fd(ln);
      rt(120);
      fd(ln);
      rt(60);
      fd(ln);
      lt(120);
      fd(ln);
      lt(60);
      fd(ln);
    }
  };

  rg(order, size, turtle);

  return points;
  /* eslint-enable no-param-reassign, functional/immutable-data */
};

type SceneProps = {
  readonly order: number;
  readonly size: number;
};

const Scene = ({ order, size }: SceneProps): JSX.Element => {
  const ref = React.useRef<Three.Mesh>();
  const step = React.useRef(0);

  const lines = React.useMemo(() => {
    // eslint-disable-next-line functional/prefer-readonly-type
    const colors: Three.Color[] = [];
    const points = gosperCurve(order, size);
    const lines = new Three.Geometry();

    points.forEach((point, index) => {
      lines.vertices.push(new Three.Vector3(point.x, point.z, point.y));
      const color = new Three.Color(0xffffff);
      color.setHSL(point.x / 100 + 0.5, (point.y * 20) / 300, 0.8);
      // eslint-disable-next-line functional/immutable-data
      colors[index] = color;
    });

    // eslint-disable-next-line functional/immutable-data
    lines.colors = colors;

    return lines;
  }, [order, size]);

  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    if (!ref.current) return;
    step.current = step.current + 0.01;
    ref.current.rotation.z = step.current;
    /* eslint-enable functional/immutable-data */
  });

  return (
    <>
      <line
        // @ts-expect-error
        ref={ref}
        geometry={lines}
        position={[25, -30, -60]}>
        <lineBasicMaterial
          attach="material"
          opacity={1}
          linewidth={1}
          vertexColors
        />
      </line>

      <ambientLight color={0x0c0c0c} />
      <spotLight color={0xffffff} position={[-40, 60, -10]} castShadow />
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    order: 4,
    size: 60,
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
          <Scene order={state.order} size={state.size} />
        </React.Suspense>
        <Stats />
        <TrackballControls />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatNumber path="order" min={1} max={6} step={1} />
        <DatNumber path="size" min={1} max={100} step={1} />
      </DatGui>
    </>
  );
};

export default Page;
