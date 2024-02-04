import { ConfigContext } from "@helpers/context/configContext";
import Logger from "@helpers/logger";
import { useContext, useEffect, useState } from "react";

/**
 * Hook that allows a custom visualization to perform a MooD action from anywhere
 * @param action - The action to that will be fired
 * @returns - A method that will fire the action requested
 */
export function useAction<TAction extends keyof Vis.Actions>(
  action: TAction
): [(id: string, event: { pageX: number; pageY: number }) => void] {
  const config = useContext(ConfigContext);
  const [actionFunction, setActionFunction] =
    useState<(id: string, event: { pageX: number; pageY: number }) => void>(
      null
    );

  useEffect(() => {
    setActionFunction(
      () => (elementId: string, event: { pageX: number; pageY: number }) => {
        Logger.Log(
          `Perform Action: ${action} with ID: ${elementId}, event: x: ${event.pageX}, y: ${event.pageY}`
        );

        config.functions.performAction(action, elementId, event);
      }
    );
  }, [config]);

  return [actionFunction];
}
