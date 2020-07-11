import * as React from 'react';
import dat from 'dat.gui';

type StateObject = { readonly [key: string]: string | number | boolean };

// Dirty implementation to use dat.gui with react
// This needs to be loaded via ssr disabled to avoid window error
const useDatGui = <T extends StateObject>(
  data: T,
  onChange: (data: T) => void,
  options?: {
    readonly [key in keyof T]: {
      readonly min?: number;
      readonly max?: number;
      readonly step?: number;
    };
  },
): void => {
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    const gui = new dat.GUI();
    Object.keys(data).map((key) => {
      gui
        .add(
          { [key]: data[key] },
          key,
          options?.[key].min,
          options?.[key].max,
          options?.[key].step,
        )
        .onChange((v) => {
          onChangeRef.current({ ...data, [key]: v });
        });
    });

    return () => {
      gui.destroy();
    };
  }, [data, options]);
};

type Props<T extends StateObject> = {
  readonly data: T;
  readonly onChange: (_: T) => void;
  readonly options?: {
    readonly [key in keyof T]: {
      readonly min?: number;
      readonly max?: number;
      readonly step?: number;
    };
  };
};

const DatGui = <T extends StateObject>({
  data,
  onChange,
  options,
}: Props<T>): null => {
  useDatGui(data, onChange, options);
  return null;
};

export default DatGui;
