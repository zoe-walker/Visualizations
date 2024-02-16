import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "@helpers/context/configContext";
import { getVisualizationInputs } from "@helpers/config";

export const updateInputEventKey = "mood-update-input";
export type updateInputEvent = CustomEvent<{
  key: keyof Vis.Inputs;
}>;

/**
 * Because we are creating a new custom event for useInput we need to update TS's
 *  accepted event types to allow us to execute/listen-to the new event
 */
declare global {
  interface WindowEventMap {
    [updateInputEventKey]: updateInputEvent;
  }
}

/**
 * Hooks into the custom visualization inputs and listens to updates
 * @param input - The key for the input requested
 * @returns - The input hook
 */
export function useInput<TInput extends keyof Vis.Inputs>(
  input: TInput
): Readonly<Vis.Inputs[TInput]> | undefined {
  const config = useContext(ConfigContext);
  const [value, setValue] = useState<Vis.Inputs[TInput]>(
    getVisualizationInputs()?.[input] as Vis.Inputs[TInput] | undefined
  );

  useEffect(() => {
    const updateSetValue = (event: updateInputEvent) => {
      if (event.detail.key != input) return;
      setValue(getVisualizationInputs()?.[event.detail.key] as any);
    };
    document.addEventListener(updateInputEventKey, updateSetValue);
    return () => {
      document.removeEventListener(updateInputEventKey, updateSetValue);
    };
  }, [config]);

  return value as Readonly<Vis.Inputs[TInput]> | undefined;
}
