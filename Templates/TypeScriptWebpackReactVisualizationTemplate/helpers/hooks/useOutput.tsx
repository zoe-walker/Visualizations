import { getVisualizationOutputs } from "@helpers/config";
import { ConfigContext } from "@helpers/context/configContext";
import { useContext, useEffect, useState } from "react";

export const updateOutputEventKey = "mood-update-output";
export type updateOutputEvent = CustomEvent<{
  key: keyof Vis.Outputs;
}>;

/**
 * Because we are creating a new custom event for useOutput we need to update TS's
 *  accepted event types to allow us to execute/listen-to the new event
 */
declare global {
  interface WindowEventMap {
    [updateOutputEventKey]: updateOutputEvent;
  }
}

export function useOutput<TOutput extends keyof Vis.Outputs>(
  output: TOutput
): [
  setOutput: (value: Vis.Outputs[TOutput]) => void,
  value?: Readonly<Vis.Outputs[TOutput]>
] {
  const config = useContext(ConfigContext);
  const [value, setValue] = useState<Vis.Outputs[TOutput]>(
    getVisualizationOutputs()?.[output]
  );

  useEffect(() => {
    const updateSetValue = (event: updateOutputEvent) => {
      if (event.detail.key != output) return;
      setValue(getVisualizationOutputs()?.[event.detail.key] as any);
    };
    document.addEventListener(updateOutputEventKey, updateSetValue);
    return () => {
      document.removeEventListener(updateOutputEventKey, updateSetValue);
    };
  }, [config]);

  return [
    (value: Vis.Outputs[TOutput]) => {
      config.functions.updateOutput(output, value);
    },
    value,
  ];
}
