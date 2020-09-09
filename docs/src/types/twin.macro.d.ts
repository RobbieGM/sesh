declare module "twin.macro" {
  import { InterpolationWithTheme } from "@emotion/core";

  export function css(
    css: TemplateStringsArray,
    ...interpolatedValues: InterpolationWithTheme<any>[]
  ): InterpolationWithTheme<any>;
  export default function tw(
    classes: TemplateStringsArray
  ): InterpolationWithTheme<any>;
}
