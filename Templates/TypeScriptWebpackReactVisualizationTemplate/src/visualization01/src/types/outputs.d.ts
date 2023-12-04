export enum OutputsEnum {
  ExampleOutput = "ExampleOutput",
}

type OutputsTypes = {
  [OutputsEnum.ExampleOutput]?: Number
}

declare global {
  namespace Vis {
    type Outputs = {
      [key in OutputsEnum]: OutputsTypes[key];
    }
  }
}