import * as React from 'react';
import dat from 'dat.gui';

type RotationSpeed = number;

type BouncingSpeed = number;

const useDatGui = (): {
  readonly rotationSpeed: RotationSpeed;
  readonly bouncingSpeed: BouncingSpeed;
} => {
  const gui = React.useMemo(() => new dat.GUI(), []);
  const [rotationSpeed, setRotationSpeed] = React.useState<RotationSpeed>(0.02);
  const [bouncingSpeed, setbouncingSpeed] = React.useState<BouncingSpeed>(0.03);

  React.useEffect(() => {
    gui
      .add({ rotationSpeed }, 'rotationSpeed', 0, 0.5)
      .onChange(setRotationSpeed);
    gui
      .add({ bouncingSpeed }, 'bouncingSpeed', 0, 0.5)
      .onChange(setbouncingSpeed);

    return () => {
      gui.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rotationSpeed, bouncingSpeed };
};

export default useDatGui;
