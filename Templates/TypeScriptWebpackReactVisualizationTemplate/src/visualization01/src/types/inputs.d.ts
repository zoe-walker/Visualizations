import { InputType } from './input-type';

declare global {
  namespace Vis.Inputs {
    interface Root {
      [key: string]: any,
      [InputType.ExampleInput]?: Number
    }
  }
}