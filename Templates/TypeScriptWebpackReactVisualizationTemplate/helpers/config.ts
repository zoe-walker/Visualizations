import { setupDevelopmentConfig } from "./development";
import { updateVisualizationStyleEventKey } from "./hooks/useStyle";
import { updateVisualizationStateEventKey } from "./hooks/useVisualizationState";
import Logger from "./logger";
import { setupProductionConfig } from "./production";

/**
 * Store the mutable version of the custom visualization's config
 */
let visualizationConfig: MooDConfig | undefined;

/**
 * Store the immutable version of the custom visualization's config
 */
let frozenVisualizationConfig: MooDConfig | undefined;

/**
 * Return a frozen immutable version of the MooD config
 * @param mutable - Determines if the returned config is the original mutable or a copy
 */
export const getVisualizationConfig = (mutable: boolean = false) => {
  if (!mutable) {
    if (frozenVisualizationConfig == null)
      frozenVisualizationConfig = Object.freeze({ ...visualizationConfig });

    return frozenVisualizationConfig;
  } else {
    return visualizationConfig;
  }
};

/**
 * Set up the config and stores it to a variable not exposed
 */
export const setVisualizationConfig = (config: MooDConfig) => {
  visualizationConfig = setupProductionConfig(setupDevelopmentConfig(config));
  frozenVisualizationConfig = Object.freeze({ ...visualizationConfig });
};

/**
 * Store the immutable version of the custom visualization's style
 */
let frozenVisualizationStyle: Vis.Style | undefined;

/**
 * Return the MooD config's style variable
 * @param mutable - Determines if the returned style is the original mutable or a copy
 */
export const getVisualizationStyle = (mutable: boolean = false) => {
  if (!mutable) {
    if (frozenVisualizationStyle == null)
      frozenVisualizationStyle = Object.freeze({
        ...visualizationConfig.style,
      });

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
  frozenVisualizationStyle = Object.freeze({
    ...visualizationConfig.style,
  });

  //Update logger development mode in case it has changed
  Logger.developmentMode =
    typeof (style.DevelopmentMode ?? false) != "boolean"
      ? false
      : style.DevelopmentMode;

  //Send an event to any useStyle hook listeners
  document.dispatchEvent(new CustomEvent(updateVisualizationStyleEventKey));
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
 * @param mutable - Determines if the returned state is the original mutable or a copy
 */
export const getVisualizationState = (mutable: boolean = false) => {
  if (!mutable) {
    if (frozenVisualizationState == null)
      frozenVisualizationState = Object.freeze({
        ...JSON.parse(visualizationConfig.state.value),
      });

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
  frozenVisualizationState = Object.freeze({
    ...visualizationState,
  });
};
