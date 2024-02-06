import { getVisualizationStyle, setVisualizationStyle } from "@helpers/config";
import { ConfigContext } from "@helpers/context/configContext";
import Logger from "@helpers/logger";
import { useContext, useEffect, useState } from "react";

export const updateVisualizationStyleEventKey = "mood-update-style";
export type updateVisualizationStyleEvent = CustomEvent<null>;

/**
 * Because we are creating a new custom event for useStyle we need to update TS's
 *  accepted event types to allow us to execute/listen-to the new event
 */
declare global {
  interface WindowEventMap {
    [updateVisualizationStyleEventKey]: updateVisualizationStyleEvent;
  }
}

/**
 * Hook that allows getting/updating the Custom Visualization style
 * @returns - An object containing the style and a method that can update it
 */
export function useStyle<TStyleOverride extends Vis.Style = Vis.Style>(): [
  readonlyStyle: TStyleOverride,
  updateStyle: (updateStyleCallback: (style: TStyleOverride) => void) => void
] {
  const config = useContext(ConfigContext);
  const [style, setStyle] = useState(getVisualizationStyle());

  useEffect(() => {
    const updateSetStyle = (event: updateVisualizationStyleEvent) => {
      setStyle(getVisualizationStyle());
    };
    document.addEventListener(updateVisualizationStyleEventKey, updateSetStyle);
    return () => {
      document.removeEventListener(
        updateVisualizationStyleEventKey,
        updateSetStyle
      );
    };
  }, [config]);

  return [
    style as TStyleOverride,
    (updateStyleCallback: (style: TStyleOverride) => void) => {
      // Get a mutable version of the style and invoke the callback with that
      const newStyle: TStyleOverride = getVisualizationStyle(
        true
      ) as TStyleOverride;

      updateStyleCallback(newStyle);

      //Update the config style to be the changed style
      setVisualizationStyle(newStyle);
      Logger.Log(`Updated Custom Visualization Style`);

      //Send an event to any useStyle hook listeners
      document.dispatchEvent(new CustomEvent(updateVisualizationStyleEventKey));
    },
  ];
}
