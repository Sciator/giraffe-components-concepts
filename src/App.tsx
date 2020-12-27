// tslint:disable: no-non-null-assertion
import React, { useState, useEffect, FunctionComponent } from "react";

import { InfluxColors } from "@influxdata/clockface";
import { GaugeMini, getColors } from "./GaugeMini";
import { GaugeMiniLayerConfig } from "./types";
import { GAUGE_MINI_THEME_BULLET_DARK, GAUGE_MINI_THEME_PROGRESS_DARK } from "./gaugeMiniStyles";

const width = 300;
const height = 200;

const gaugeTheme: Required<GaugeMiniLayerConfig> = ({
  ...GAUGE_MINI_THEME_BULLET_DARK,
  labelMain: "Processor usage",
  axesFormater: {
    suffix: "%",
  },
  valueFormater: (num: number) => num.toFixed(0) + "%",
});

const gaugeTheme2: Required<GaugeMiniLayerConfig> = {
  ...GAUGE_MINI_THEME_PROGRESS_DARK,
  mode: "progress",
  colors: Array.isArray(gaugeTheme.colors)
    ? [
      { ...gaugeTheme.colors.find(({ type }) => type === "min")!, value: 30 },
      { ...gaugeTheme.colors.find(({ type }) => type === "max")!, value: 130 },
    ]
    : gaugeTheme.colors
    ,
  axesSteps: [60, 85],
  barsDefinitions: {
    groupByColumns: { "_field": true },
    bars: [
      { barDef: { _field: "f1", }, label: "Room 1" },
      { barDef: { _field: "f2", }, label: "Room 2" },
      { barDef: { _field: "f3", }, label: "Room 3" },
      { barDef: { _field: "f4", }, label: "Yard" },
    ],
  },
  labelMain: "Loudness",
  axesFormater: (val: number) => val.toFixed(0) + "dB",
  valueFormater: {
    decimalPlaces: { digits: 1, isEnforced: true },
    prefix: "",
    suffix: " dB",
  },
};

const App: FunctionComponent<any> = () => {
  const { min: { value: min }, max: { value: max } } = getColors(gaugeTheme);

  const [val, setVal] = useState(min - 20);

  useEffect(() => {
    setTimeout(() => {
      let newVal = val + 1;
      if (newVal > max + 100)
        newVal = min - 100;
      setVal(newVal);
    }, 10);
  }, [val, max, min]);

  const asVal = (value: number) => ([{ colsMString: "field0", value }]);

  return (
    <div className="App" style={{
      backgroundColor: InfluxColors.Castle,
      width: "100vw",
      height: "100vh",
      overflow: "auto",
      textAlign: "center",
    }}>
      <GaugeMini values={asVal(val)} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini values={asVal(val)} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini values={asVal(val)} theme={GAUGE_MINI_THEME_BULLET_DARK} {...{ width, height }} />
      <GaugeMini values={asVal(val)} theme={GAUGE_MINI_THEME_PROGRESS_DARK} {...{ width, height }} />
      <GaugeMini values={[
        { colsMString: "f3", value: 12 },
        { colsMString: "f4", value: 98 },
      ]} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini values={[
        { colsMString: "f1", value: 33 },
        { colsMString: "f2", value: 56 },
        { colsMString: "f3", value: 96 },
        { colsMString: "f4", value: 120 },
      ]} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini values={asVal(15)} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini values={asVal(25)} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini values={asVal(85)} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini values={asVal(96)} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini values={asVal(120)} theme={gaugeTheme} {...{ width, height }} />
      <GaugeMini values={asVal(15)} theme={{
        ...gaugeTheme2,
        colors: {
          min: {
            value: 50,
            hex: "#9aa445"
          },
          max: {
            value: 150,
            hex: "#E85B1C",
          },
          thresholds: [],
          secondary: "#202028",
        }
      }} {...{ width, height }} />
      <GaugeMini values={asVal(18)} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini values={asVal(85)} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini values={asVal(96)} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini values={asVal(120)} theme={gaugeTheme2} {...{ width, height }} />
    </div>
  );
};

export default App;
