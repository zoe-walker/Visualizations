import { setupDevelopmentConfig } from "./development";
import { setupProductionConfig } from "./production";

let visualizationConfig: MooDConfig | undefined;

/**
 * Return a frozen immutable version of the MooD config
 * @param mutable - Determines if the returned config is the original mutable or a copy
 */
export const getVisualizationConfig = (mutable: boolean = false) =>
  mutable ? visualizationConfig : Object.freeze({ ...visualizationConfig });

/**
 * Set up the config and stores it to a variable not exposed
 */
export const setVisualizationConfig = (config: MooDConfig) => {
  visualizationConfig = setupProductionConfig(setupDevelopmentConfig(config));
};