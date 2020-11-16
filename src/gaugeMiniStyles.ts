import { InfluxColors } from "@influxdata/clockface";
import { GaugeMiniLayerConfig } from "./GaugeMini";
import { Color } from "./types";

export const GAUGE_MINI_BULLET_THEME_DARK: Required<GaugeMiniLayerConfig> = {
  type: "gauge mini",
  mode: "bullet",
  valueHeight: 18,
  gaugeHeight: 25,
  valueRounding: 2,
  gaugeRounding: 3,
  gaugePaddingSides: 20,
  colorsAndTargets: [
    {value: 0, type: "min", hex: InfluxColors.Krypton},
    {value: 50, type: "threshold", hex: InfluxColors.Sulfur},
    {value: 75, type: "threshold", hex: InfluxColors.Topaz},
    {value: 100, type: "max", hex: InfluxColors.Topaz},
  ] as Color[],
  colorSecondary: InfluxColors.Kevlar,
  textMode: "follow",

  axesSteps: "thresholds",
  axesStrokeWidth: "2px",
  barPaddings: 5,
  labelMain: "",
  labelBars: [],
  valueFontSize: 12,
  valueFontColorOutside: InfluxColors.Raven,
  valueFontColorInside: InfluxColors.Cloud,
  labelMainFontSize: 13,
  labelMainFontColor: InfluxColors.Ghost,
  labelBarsFontSize: 11,
  labelBarsFontColor: InfluxColors.Forge,
  axesFontSize: 11,
  axesFontColor: InfluxColors.Forge,
  formaters: {
    axes: (num: number) => num.toFixed(0),
    barValue: (num: number) => num.toFixed(0),
  },
};

export const GAUGE_MINI_PROGRESS_THEME_DARK: Required<GaugeMiniLayerConfig> = {
  type: "gauge mini",
  valueHeight: 20,
  gaugeHeight: 20,
  valueRounding: 3,
  gaugeRounding: 3,
  mode: "progress",
  textMode: "follow",
  colorsAndTargets: [
    {value: 0, type: "min", hex: InfluxColors.Krypton},
    {value: 100, type: "max", hex: InfluxColors.Topaz},
  ] as Color[],
  colorSecondary: InfluxColors.Kevlar,
  axesSteps: undefined as any,
  labelMain: "",
  labelBars: [],
  valueFontSize: 18,
  valueFontColorInside: InfluxColors.Raven,
  valueFontColorOutside: InfluxColors.Cloud,
  labelMainFontSize: 13,
  labelMainFontColor: InfluxColors.Ghost,
  labelBarsFontSize: 11,
  labelBarsFontColor: InfluxColors.Forge,
  axesFontSize: 11,
  axesFontColor: InfluxColors.Forge,
  formaters: {
    axes: (val: number) => val.toFixed(0),
    barValue: (val: number) => val.toFixed(0),
  },
  axesStrokeWidth: "2px",
  barPaddings: 5,
  gaugePaddingSides: 20,
};
