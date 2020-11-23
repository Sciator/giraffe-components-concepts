
export type Color = {
  id: string
  type: "min" | "max" | "threshold" | "scale" | "text" | "background" // | "target"
  hex: string
  name: string
  value: number
};


export interface GaugeMiniLayerConfig {
  type: "gauge mini";
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

  labelBars?: { _field: string, label: string }[];
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
