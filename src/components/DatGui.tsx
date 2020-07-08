import * as React from 'react';
import dat from 'dat.gui';

type StateObject = Record<string, string | number | boolean>;

// Dirty implementation to use dat.gui with react
// This needs to be loaded via ssr disabled to avoid window error
const useDatGui = <T extends StateObject>(
  data: T,
  onChange: (data: T) => void,
): void => {
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    const gui = new dat.GUI();
    Object.keys(data).map((key) => {
      gui.add({ [key]: data[key] }, key).onChange((v) => {
        onChangeRef.current({ ...data, [key]: v });
      });
    });

    return () => {
      gui.destroy();
    };
  }, [data]);
};

type Props<T extends StateObject> = {
  readonly data: T;
  readonly onChange: (data: T) => void;
};

function DatGui<T extends StateObject>({ data, onChange }: Props<T>): null {
  useDatGui(data, onChange);
  return null;
}

export default DatGui;
