import { setupDevelopmentConfig } from "./development";
import { updateVisualizationStyleEventKey } from "./hooks/useStyle";
import Logger from "./logger";
import { setupProductionConfig } from "./production";

/**
 * Recursively deep freeze an object with circular references
 * @param obj - The object to deep freeze
 */
export const deepFreeze = (obj: any) => {
  Object.freeze(obj);
  Object.values(obj)
    .filter((prop) => !Object.isFrozen(prop))
    .forEach(deepFreeze);
};

/**
 * Store the mutable version of the custom visualization's config
 */
let visualizationConfig: MooDConfig | undefined;

/**
 * Return the MooD config
 */
export const getVisualizationConfig = () => visualizationConfig;

/**
 * Set up the config and stores it to a variable not exposed
 */
export const setVisualizationConfig = (config: MooDConfig) => {
  visualizationConfig = config;
  setupProductionConfig(setupDevelopmentConfig(config));
};

/**
 * Store the immutable version of the custom visualization's data
 */
let frozenVisualizationData: Vis.Data | undefined;

/**
 * Return the MooD config's data variable
 * @param mutable - Determines if the returned style is the original mutable or a frozen copy
 */
export const getVisualizationData = (mutable: boolean = false) => {
  if (!mutable) {
    if (frozenVisualizationData == null) updateFrozenVisualizationData();
    return frozenVisualizationData;
  } else {
    return visualizationConfig.data;
  }
};

/**
 * Update config.data to a new data object and let useData hooks know
 * @param data - The data to set the config.data to
 */
export const setVisualizationData = (data: Vis.Data) => {
  visualizationConfig.data = data;
  updateFrozenVisualizationData();
};

/**
 * Clone and deep freeze the visualization data into frozenVisualizationData
 */
export const updateFrozenVisualizationData = () => {
  const dataClone = structuredClone(visualizationConfig.data);
  deepFreeze(dataClone);
  frozenVisualizationData = dataClone;
};

/**
 * Store the immutable version of the custom visualization's style
 */
let frozenVisualizationStyle: Vis.Style | undefined;

/**
 * Return the MooD config's style variable
 * @param mutable - Determines if the returned style is the original mutable or a frozen copy
 */
export const getVisualizationStyle = (mutable: boolean = false) => {
  if (!mutable) {
    if (frozenVisualizationStyle == null) updateFrozenVisualizationStyle();
    return frozenVisualizationStyle;
  } else {
    return visualizationConfig.style;
  }
};

/**
 * Update config.style to a new style object and let useStyle hooks know
 * @param style - The style to set the config.style to
 */
export const setVisualizationStyle = (style: Vis.Style) => {
  visualizationConfig.style = style;
  updateFrozenVisualizationStyle();

  //Update logger development mode in case it has changed
  Logger.developmentMode =
    typeof (style.DevelopmentMode ?? false) != "boolean"
      ? false
      : style.DevelopmentMode;

  //Send an event to any useStyle hook listeners
  document.dispatchEvent(new CustomEvent(updateVisualizationStyleEventKey));
};

/**
 * Clone and deep freeze the visualization style into frozenVisualizationStyle
 */
export const updateFrozenVisualizationStyle = () => {
  const styleClone = structuredClone(visualizationConfig.style);
  deepFreeze(styleClone);
  frozenVisualizationStyle = styleClone;
};

/**
 * Store the mutable version of the custom visualization's state
 */
let visualizationState: Vis.State | undefined;

/**
 * Store the immutable version of the custom visualization's state
 */
let frozenVisualizationState: Vis.State | undefined;

/**
 * Return the MooD config's state variable
 * @param mutable - Determines if the returned state is the original mutable or a frozen copy
 */
export const getVisualizationState = (mutable: boolean = false) => {
  if (!mutable) {
    if (frozenVisualizationState == null) updateFrozenVisualizationState();

    return frozenVisualizationState;
  } else {
    return visualizationState;
  }
};

/**
 * Update state to a new state object and let useState hooks know
 * @param state - The state to set the custom visualization state to
 */
export const setVisualizationState = (state: Vis.State) => {
  visualizationState = state;
  updateFrozenVisualizationState();
};

/**
 * Clone and deep freeze the visualization state into frozenVisualizationState
 */
export const updateFrozenVisualizationState = () => {
  const stateClone = structuredClone(visualizationState);
  deepFreeze(stateClone);
  frozenVisualizationState = stateClone;
};

/**
 * Store the immutable version of the custom visualization's inputs
 */
let frozenVisualizationInputs: Vis.Inputs | undefined;

/**
 * Return the MooD config's inputs variable
 */
export const getVisualizationInputs = () => {
  if (frozenVisualizationInputs == null) updateFrozenVisualizationData();
  return frozenVisualizationInputs;
};

/**
 * Clone and deep freeze the visualization inputs into frozenVisualizationInputs
 */
export const updateFrozenVisualizationInputs = () => {
  const inputsClone = structuredClone(visualizationConfig.inputs);
  deepFreeze(inputsClone);
  frozenVisualizationInputs = inputsClone;
};

/**
 * Store the immutable version of the custom visualization's outputs
 */
let frozenVisualizationOutputs: Vis.Outputs | undefined;

/**
 * Return the MooD config's outputs variable
 */
export const getVisualizationOutputs = () => {
  if (frozenVisualizationOutputs == null) updateFrozenVisualizationData();
  return frozenVisualizationOutputs;
};

/**
 * Clone and deep freeze the visualization outputs into frozenVisualizationOutputs
 */
export const updateFrozenVisualizationOutputs = () => {
  const outputsClone = structuredClone(visualizationConfig.outputs);
  deepFreeze(outputsClone);
  frozenVisualizationOutputs = outputsClone;
};

/**
 * Store the immutable version of the custom visualization's size
 */
let frozenVisualizationSize: { width: number; height: number } | undefined;

/**
 * Return the MooD config's size variable
 */
export const getVisualizationSize = () => {
  if (frozenVisualizationSize == null) updateFrozenVisualizationSize();
  return frozenVisualizationSize;
};

/**
 * Clone and deep freeze the visualization size into frozenVisualizationSize
 */
export const updateFrozenVisualizationSize = () => {
  frozenVisualizationSize = Object.freeze({
    width: parseFloat(visualizationConfig.width),
    height: parseFloat(visualizationConfig.height),
  });
};
