// tslint:disable: no-non-null-assertion
import React, { useState, useEffect, FunctionComponent, useRef } from "react";

import { InfluxColors } from "@influxdata/clockface";
import { GaugeMini, GaugeMiniLayerConfig, getColors } from "./GaugeMini";
import { Color } from "./types";
import { GAUGE_MINI_THEME_BULLET_DARK, GAUGE_MINI_THEME_PROGRESS_DARK } from "./gaugeMiniStyles";

const width = 300;
const height = 200;

const gaugeTheme: Required<GaugeMiniLayerConfig> = ({
  ...GAUGE_MINI_THEME_BULLET_DARK,
  labelMain: "Processor usage",
  axesFormater: (num: number) => num.toFixed(0) + "%",
  valueFormater: (num: number) => num.toFixed(0) + "%",
});

const gaugeTheme2: Required<GaugeMiniLayerConfig> = {
  ...GAUGE_MINI_THEME_PROGRESS_DARK,
  mode: "progress",
  colorsAndTargets: [
    { ...gaugeTheme.colorsAndTargets.find(({ type }) => type === "min")!, value: 30 },
    { ...gaugeTheme.colorsAndTargets.find(({ type }) => type === "max")!, value: 130 },
  ],
  axesSteps: [60, 85],
  labelBars: [
    { _field: "f1", label: "Room 1" },
    { _field: "f2", label: "Room 2" },
    { _field: "f3", label: "Room 3" },
    { _field: "f4", label: "Yard" },
    { _field: "_default", label: "CPU 1" },
  ],
  labelMain: "Loudness",
  axesFormater: (val: number) => val.toFixed(0) + "dB",
  valueFormater: (val: number) => val.toFixed(0) + "dB",
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
      <GaugeMini value={val} theme={GAUGE_MINI_THEME_BULLET_DARK} {...{ width, height }} />
      <GaugeMini value={val} theme={GAUGE_MINI_THEME_PROGRESS_DARK} {...{ width, height }} />
      <GaugeMini value={[
        { _field: "f3", value: 12 },
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
