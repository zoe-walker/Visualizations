import { ConfigContext } from "@helpers/context/configContext";
import { useContext, useEffect, useState } from "react";

export const updateVisualizationStateEventKey = "mood-update-state";
export type updateVisualizationStateEvent = CustomEvent<null>;

/**
 * Because we are creating a new custom event for useVisualizationState we need to update TS's
 *  accepted event types to allow us to execute/listen-to the new event
 */
declare global {
  interface WindowEventMap {
    [updateVisualizationStateEventKey]: updateVisualizationStateEvent;
  }
}

/**
 * Hook that allows getting/updating the state of a Custom Visualization
 * @returns - The JSON Parsed state and a method that can update the state
 */
export function useVisualizationState(): [
  state: Vis.State | undefined,
  setState: (state: Vis.State) => void,
  rawState: string | undefined
] {
  const config = useContext(ConfigContext);
  const [state, setState] = useState<Vis.State>(
    config?.state?.visualizationParsed
  );

  useEffect(() => {
    const updateSetState = (event: updateVisualizationStateEvent) => {
      setState(config.state.visualizationParsed);
    };
    document.addEventListener(updateVisualizationStateEventKey, updateSetState);
    return () => {
      document.removeEventListener(
        updateVisualizationStateEventKey,
        updateSetState
      );
    };
  }, [config]);

  return [
    state,
    (state: Vis.State) => {
      config.functions.updateState(JSON.stringify(state, null, 2));
    },
    config?.state?.value,
  ];
}
