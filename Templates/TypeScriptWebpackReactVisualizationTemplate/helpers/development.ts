/**
 * Ensure that any development undefined variables have default usable values
 * @param config - The config to set up
 * @returns - The config
 */
export const setupDevelopmentConfig = (config: MooDConfig): MooDConfig => {
  if (config.functions != null) return config;

  //This is only useful during web testing, MooD should populate these
  config.functions = config.functions ?? {
    errorOccurred: () => null,
    inputChanged: () => null,
    dataChanged: () => null,
    updateOutput: () => null,
    updateSize: () => null,
    updateState: () => null,
    performAction: () => null,
    hasAction: () => null,
  };

  config.inputs = config.inputs ?? ({} as any);
  config.outputs = config.outputs ?? ({} as any);

  return config;
};
