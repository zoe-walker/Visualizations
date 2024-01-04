export enum OutputsEnum {
  ExampleOutput = "ExampleOutput",
}

export interface OutputsTypes {
  [OutputsEnum.ExampleOutput]?: Number
}

declare global {
  namespace Vis {
    type Outputs = {
      [key in OutputsEnum]: OutputsTypes[key];
    }
  }
}