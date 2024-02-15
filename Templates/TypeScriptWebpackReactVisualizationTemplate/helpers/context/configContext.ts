import { Context, createContext } from "react";

/**
 * This context isn't explicilty needed due to getVisualizationConfig
 *  but keeping it is more inline with React and can allow easier changing
 *  to a new system in the future if a different system is used
 */
export const ConfigContext: Context<MooDConfig> = createContext(null)