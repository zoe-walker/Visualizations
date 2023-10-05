import { OutputType } from './output-type';

declare global {
  namespace Vis.Outputs {
    interface Root {
      [key: string]: any,
      [OutputType.ExampleOutput]?: Number
    }
  }
}