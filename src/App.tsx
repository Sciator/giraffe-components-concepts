import React, { useState, useEffect, FunctionComponent, useRef } from "react"

import { InfluxColors } from "@influxdata/clockface";
import { GaugeMini, GaugeTheme, getColors, Color } from "./GaugeMini";

const width = 300;
const height = 200;

const gaugeTheme: GaugeTheme = ({
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
  axesSteps: 6,
  axesStrokeWidth: "2px",
  barPaddings: 5,
  labelMain: "Processor usage",
})

const gaugeTheme2: GaugeTheme = {
  ...gaugeTheme,
  valueHeight: 20,
  gaugeHeight: 20,
  mode: "progress",
  colorsAndTargets: [gaugeTheme.colorsAndTargets[0], gaugeTheme.colorsAndTargets[gaugeTheme.colorsAndTargets.length - 1]],
  textColorBarInside: InfluxColors.Raven,
  textColorBarOutside: InfluxColors.Raven,
  colorSecondary: InfluxColors.Chromium
};

const App: FunctionComponent<any> = () => {
  const { min: { value: min }, max: { value: max } } = getColors(gaugeTheme);

  const [val, setVal] = useState(min);

  const loop = () => {
    setTimeout(() => {
      let newVal = val + 1;
      if (newVal > max)
        newVal = min;
      setVal(newVal);
    }, 20);
  }

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
  )
}

export default App
