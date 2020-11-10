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
    { value: 8, type: "min", hex: InfluxColors.Topaz, ...({} as any) },

    { value: 55, type: "threshold", hex: InfluxColors.Sulfur, ...({} as any) },
    { value: 82, type: "threshold", hex: InfluxColors.Krypton, ...({} as any) },

    // { value: 55, type: "target", hex: InfluxColors.Sulfur, ...({} as any) },
    // { value: 82, type: "target", hex: InfluxColors.Krypton, ...({} as any) },

    { value: 120, type: "max", hex: InfluxColors.Krypton, ...({} as any) },
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
});

const gaugeTheme2: IGaugeTheme = {
  ...gaugeTheme,
  valueHeight: 20,
  gaugeHeight: 20,
  mode: "progress",
  textMode: "follow",
  colorsAndTargets: [
    gaugeTheme.colorsAndTargets[0],
    gaugeTheme.colorsAndTargets[gaugeTheme.colorsAndTargets.length - 1],
  ],
  textColorBarInside: InfluxColors.Raven,
  textColorBarOutside: InfluxColors.Raven,
  colorSecondary: InfluxColors.Chromium,
  axesSteps: 3,
  labelBars: [
    { _field: "f1", label: "CPU 1" },
    { _field: "f2", label: "CPU 2" },
    { _field: "f3", label: "CPU 3" },
    { _field: "f4", label: "CPU rest" },
    { _field: "_default", label: "CPU 1" },
  ],
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
        { _field: "f3", value: 96 },
        { _field: "f4", value: 120 },
      ]} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini value={[
        { _field: "f1", value: 15 },
        { _field: "f2", value: 25 },
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
