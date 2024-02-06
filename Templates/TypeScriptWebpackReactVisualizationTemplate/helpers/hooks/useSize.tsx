import { ConfigContext } from "@helpers/context/configContext";
import { useContext, useEffect, useState } from "react";

export const updateSizeEventKey = "mood-update-size";
export type updateSizeEvent = CustomEvent<null>;

/**
 * Because we are creating a new custom event for useSize we need to update TS's
 *  accepted event types to allow us to execute/listen-to the new event
 */
declare global {
  interface WindowEventMap {
    [updateSizeEventKey]: updateSizeEvent;
  }
}

/**
 * Hook that allows getting/updating the size of a Custom Visualization
 * @returns - An object containing the width/height and a method that can update those
 */
export function useSize(): [
  size: { width: number; height: number },
  setSize: (width: number, height: number) => void
] {
  const config = useContext(ConfigContext);
  const [size, setSize] = useState({
    width: parseFloat(config.width),
    height: parseFloat(config.height),
  });

  useEffect(() => {
    const updateSetSize = (event: updateSizeEvent) => {
      setSize({
        width: parseFloat(config.width),
        height: parseFloat(config.height),
      });
    };
    document.addEventListener(updateSizeEventKey, updateSetSize);
    return () => {
      document.removeEventListener(updateSizeEventKey, updateSetSize);
    };
  }, [config]);

  return [
    size,
    (
      width: number = parseFloat(config.width),
      height: number = parseFloat(config.height)
    ) =>
      config.functions.updateSize(
        isNaN(width) ? size.width : width,
        isNaN(height) ? size.height : height
      ),
  ];
}
