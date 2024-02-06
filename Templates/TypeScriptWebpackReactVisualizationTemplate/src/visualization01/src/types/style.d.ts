declare namespace Vis {
  interface Style {
    [key: string | number | symbol]: any | undefined;
    DevelopmentMode: boolean;
  }
}