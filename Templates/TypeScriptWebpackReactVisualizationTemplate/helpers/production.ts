import { updateDataEventKey } from "./hooks/useData";
import { updateInputEventKey } from "./hooks/useInput";
import { updateOutputEventKey } from "./hooks/useOutput";
import Logger from "./logger";

/**
 * Ensure that any config production hooks are set up
 * @param config - The config to set up
 * @returns - The config
 */
export const setupProductionConfig = (config: MooDConfig): MooDConfig => {
  //This allows us to listen to any errors that MooD tells us about
  const errorOccurredSuper = config.functions.errorOccurred;
  config.functions.errorOccurred = (error: Error) => {
    errorOccurredSuper?.(error);
    if (Logger.developmentMode) {
      Logger.Error(error);
    } else {
      console.error(error);
    }
  };

  //This allows us to update what is inside the inputs whenever they change
  const inputChangedSuper = config.functions.inputChanged;
  config.functions.inputChanged = <TInputKey extends keyof Vis.Inputs>(
    name: TInputKey,
    value: Vis.Inputs[TInputKey]
  ) => {
    Logger.Log(`Updating input: ${name} with value: `, JSON.stringify(value));

    inputChangedSuper?.(name, value);

    config.inputs[name] = value;
    //Send an event to any useInput hook listeners
    document.dispatchEvent(
      new CustomEvent(updateInputEventKey, { detail: { key: name } })
    );
  };

  //This allows us to update what is inside the outputs whenever they change
  const updateOutputSuper = config.functions.updateOutput;
  config.functions.updateOutput = <TOutputKey extends keyof Vis.Outputs>(
    name: TOutputKey,
    value: Vis.Outputs[TOutputKey]
  ) => {
    Logger.Log(`Updating output: ${name} with value: `, JSON.stringify(value));

    updateOutputSuper?.(name, value);

    config.outputs[name] = value;
    //Send an event to any useOutput hook listeners
    document.dispatchEvent(
      new CustomEvent(updateOutputEventKey, { detail: { key: name } })
    );
  };

  const dataChangedSuper = config.functions.dataChanged;
  config.functions.dataChanged = (data) => {
    Logger.Log("Data has been changed, updateing custom visualization");

    dataChangedSuper?.(data);

    config.data = data;
    //Send an event to any useData hook listeners
    document.dispatchEvent(new CustomEvent(updateDataEventKey));
  };

  return config;
};
