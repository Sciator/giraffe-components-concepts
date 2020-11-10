import React, { useState, useEffect, FunctionComponent, useRef } from "react";

import { InfluxColors } from "@influxdata/clockface";
import { GaugeMini, IGaugeTheme, getColors, Color } from "./GaugeMini";

const width = 300;
const height = 200;

const gaugeTheme: IGaugeTheme = ({
  mode: "bullet",
  valueHeight: 18,
  gaugeHeight: 25,
  gaugePaddingSides: 20,
  colorsAndTargets: [
    { value: 0, type: "min", hex: InfluxColors.Krypton, ...({} as any) },

    { value: 50, type: "threshold", hex: InfluxColors.Sulfur, ...({} as any) },
    { value: 80, type: "threshold", hex: InfluxColors.Topaz, ...({} as any) },

    // { value: 55, type: "target", hex: InfluxColors.Sulfur, ...({} as any) },
    // { value: 82, type: "target", hex: InfluxColors.Krypton, ...({} as any) },

    { value: 100, type: "max", hex: InfluxColors.Topaz, ...({} as any) },
  ] as Color[],
  colorSecondary: InfluxColors.Raven,
  textMode: "left",
  textColorBarOutside: InfluxColors.Cloud,
  textColorBarInside: InfluxColors.Cloud,
  textColor: InfluxColors.Cloud,
  axesSteps: "thresholds",
  axesStrokeWidth: "2px",
  barPaddings: 5,
  labelMain: "Processor usage",
  formaters: {
    axes: (num: number) => num.toFixed(0) + "%",
    barValue: (num: number) => num.toFixed(0) + "%",
  }
});

const gaugeTheme2: IGaugeTheme = {
  ...gaugeTheme,
  valueHeight: 20,
  gaugeHeight: 20,
  mode: "progress",
  textMode: "follow",
  colorsAndTargets: [
    { ...gaugeTheme.colorsAndTargets[0], value: 30 },
    { ...gaugeTheme.colorsAndTargets[gaugeTheme.colorsAndTargets.length - 1], value: 130 },
  ],
  textColorBarInside: InfluxColors.Raven,
  textColorBarOutside: InfluxColors.Raven,
  colorSecondary: InfluxColors.Chromium,
  axesSteps: [60, 85],
  labelBars: [
    { _field: "f1", label: "Room 1" },
    { _field: "f2", label: "Room 2" },
    { _field: "f3", label: "Room 3" },
    { _field: "f4", label: "Yard" },
    { _field: "_default", label: "CPU 1" },
  ],
  labelMain: "Loudness",
  formaters: {
    ...gaugeTheme.formaters,
    axes: (val: number) => val.toFixed(0) + "dB",
    barValue: (val: number) => val.toFixed(0) + "dB",
  },
};

const App: FunctionComponent<any> = () => {
  const { min: { value: min }, max: { value: max } } = getColors(gaugeTheme);

  const [val, setVal] = useState(min - 20);

  const loop = () => {
    setTimeout(() => {
      let newVal = val + 1;
      if (newVal > max + 100)
        newVal = min - 100;
      setVal(newVal);
    }, 10);
  };

  useEffect(() => loop(), [val]);

  return (
    <div className="App" style={{
      backgroundColor: InfluxColors.Castle,
      width: "100vw",
      height: "100vh",
      overflow: "auto",
      textAlign: "center",
    }}>
      <GaugeMini value={val} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini value={val} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini value={[
        { _field: "f3", value: 34 },
        { _field: "f4", value: 98 },
      ]} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini value={[
        { _field: "f1", value: 33 },
        { _field: "f2", value: 56 },
        { _field: "f3", value: 96 },
        { _field: "f4", value: 120 },
      ]} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini value={15} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini value={25} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini value={85} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini value={96} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini value={120} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini value={15} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini value={18} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini value={85} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini value={96} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini value={120} theme={gaugeTheme2} {...{ width, height }} />
    </div>
  );
};

export default App;
