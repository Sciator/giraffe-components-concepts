
export type Color = {
  id: string
  type: "min" | "max" | "threshold" | "scale" | "text" | "background" // | "target"
  hex: string
  name: string
  value: number
};

export interface GaugeMiniBarsDefinitions<T extends { [key: string]: true }> {
  /** Defines which columns choose as unique bar indentificator.  */
  groupByColumns: T;
  // todo: allow regex ?
  /** Give label for given unique column values */
  bars?: { barDef: { [key in keyof T]: string }, label?: string }[];
}

export interface GaugeMiniLayerConfig {
  type: "gauge mini";
  /** Defines which columns choose as unique bar indentificator. Also bar labels can be defined here. */
  barsDefinitions: GaugeMiniBarsDefinitions<any>;
  mode?: "progress" | "bullet";
  textMode?: "follow" | "left";

  valueHeight?: number;
  gaugeHeight?: number;
  valueRounding?: number;
  gaugeRounding?: number;
  barPaddings?: number;
  sidePaddings?: number;
  oveflowFraction?: number;

  gaugeColors?: Color[];
  colorSecondary?: string;

  labelMain?: string;
  labelMainFontSize?: number;
  labelMainFontColor?: string;

  labelBarsFontSize?: number;
  labelBarsFontColor?: string;

  valuePadding?: number;
  valueFontSize?: number;
  valueFontColorInside?: string;
  valueFontColorOutside?: string;
  valueFormater?: (value: number) => string;

  axesSteps?: number | "thresholds" | undefined | number[];
  axesFontSize?: number;
  axesFontColor?: string;
  axesFormater?: (value: number) => string;
}
