import { InfluxColors } from "@influxdata/clockface";
import { GaugeMiniLayerConfig } from "./GaugeMini";
import { Color } from "./types";

export const GAUGE_MINI_BULLET_THEME_DARK: Required<GaugeMiniLayerConfig> = {
  type: 'gauge mini',
  mode: 'bullet',
  valueHeight: 18,
  gaugeHeight: 25,
  gaugePaddingSides: 20,
  colorsAndTargets: [
    {value: 0, type: 'min', hex: InfluxColors.Krypton},
    {value: 50, type: 'threshold', hex: InfluxColors.Sulfur},
    {value: 75, type: 'threshold', hex: InfluxColors.Topaz},
    {value: 100, type: 'max', hex: InfluxColors.Topaz},
  ] as Color[],
  colorSecondary: InfluxColors.Raven,
  textMode: 'follow',
  textColorBarOutside: InfluxColors.Raven,
  textColorBarInside: InfluxColors.Cloud,
  textColor: InfluxColors.Cloud,
  axesSteps: 'thresholds',
  axesStrokeWidth: '2px',
  barPaddings: 5,
  labelMain: '',
  labelBars: [],
  formaters: {
    axes: (num: number) => num.toFixed(0),
    barValue: (num: number) => num.toFixed(0),
  },
}


export const GAUGE_MINI_PROGRESS_THEME_DARK: Required<GaugeMiniLayerConfig> = {
  type: 'gauge mini',
  valueHeight: 20,
  gaugeHeight: 20,
  mode: "progress",
  textMode: "follow",
  colorsAndTargets: [
    {value: 0, type: 'min', hex: InfluxColors.Krypton},
    {value: 100, type: 'max', hex: InfluxColors.Topaz},
  ] as Color[],
  textColor: InfluxColors.Cloud,
  textColorBarInside: InfluxColors.Raven,
  textColorBarOutside: InfluxColors.Raven,
  colorSecondary: InfluxColors.Chromium,
  axesSteps: undefined as any,
  labelBars: [],
  labelMain: "",
  formaters: {
    axes: (val: number) => val.toFixed(0),
    barValue: (val: number) => val.toFixed(0),
  },
  axesStrokeWidth: '2px',
  barPaddings: 5,
  gaugePaddingSides: 20,
}

