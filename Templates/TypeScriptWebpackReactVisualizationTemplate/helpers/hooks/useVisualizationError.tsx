import { getVisualizationConfig } from "@helpers/config";
import { ConfigContext } from "@helpers/context/configContext";
import { useContext, useEffect, useState } from "react";

/**
 * Hook that sends an error message to the Custom Visualization
 *  and let's MooD handle how it is displayed
 * @returns - A method that will send an error to the Custom Visualization
 */
export function useVisualizationError(): (message: string) => void;

/**
 * Hook that sends an error message to the Custom Visualization
 *  and let's MooD handle how it is displayed
 * @param message - The message to provide to the custom visualization
 */
export function useVisualizationError(message: string): void;

/**
 * Hook that sends an error message to the Custom Visualization
 *  and let's MooD handle how it is displayed
 * @returns - A method that will send an error to the Custom Visualization
 */
export function useVisualizationError<TMessage extends string | never>(
  message?: TMessage
): TMessage extends never ? (message: string) => void : void {
  if (message != null) {
    getVisualizationConfig().functions.errorOccurred(message);
    return;
  }

  const config = useContext(ConfigContext);
  const [errorFunction, setErrorFunction] = useState(
    () => (message: string) => config.functions.errorOccurred(message)
  );

  useEffect(() => {
    setErrorFunction(
      () => (message: string) => config.functions.errorOccurred(message)
    );
  }, [config]);

  return errorFunction as TMessage extends never
    ? (message: string) => void
    : void;
}
