// tslint:disable: no-non-null-assertion
import React, { useState, useEffect, FunctionComponent } from "react";

import { InfluxColors } from "@influxdata/clockface";
import { GaugeMini } from "./GaugeMini/GaugeMini";
import { GaugeMiniLayerConfig } from "./GaugeMini/types";
import { GAUGE_MINI_THEME_BULLET_DARK, GAUGE_MINI_THEME_PROGRESS_DARK } from "./GaugeMini/gaugeMiniStyles";
import { Candlestick } from "./Candlestick/Candlestick";
import { range } from "d3-array";

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
  gaugeMiniColors: Array.isArray(gaugeTheme.gaugeMiniColors)
    ? [
      { ...gaugeTheme.gaugeMiniColors.find(({ type }) => type === "min")!, value: 30 },
      { ...gaugeTheme.gaugeMiniColors.find(({ type }) => type === "max")!, value: 130 },
    ]
    : gaugeTheme.gaugeMiniColors
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

const randInt = (max: number) => Math.floor(Math.random() * max);

const App: FunctionComponent<any> = () => {
  const min = -20;
  const max = 150;

  const [val, setVal] = useState(min);

  useEffect(() => {
    setTimeout(() => {
      let newVal = val + 1;
      if (newVal > max)
        newVal = min;
      setVal(newVal);
    }, 10);
  }, [val, max, min]);

  const asVal = (value: number) => ([{ colsMString: "field0", value }]);

  const [candlestickValue, setCandlestickValue] = useState(
    // todo: more realistic random (open match close )
    range(10).map(() => ({
      close: randInt(100),
      high: randInt(100),
      low: randInt(100),
      open: randInt(100),
    }))
    // .concat({
    //   close: 1000,
    //   high: randInt(500),
    //   low: randInt(500),
    //   open: randInt(500),
    // })
    // .concat({
    //   close: -1000,
    //   open: -500+randInt(500),
    //   high: -500+randInt(500),
    //   low: -500+randInt(500),
    // })

    // .concat({
    //   close:randInt(500),
    //   high: 1000,
    //   low: randInt(500),
    //   open: randInt(500),
    // })
    // .concat({
    //   open: -500+randInt(500),
    //   close: -500+randInt(500),
    //   high: -500+randInt(500),
    //   low: -1000,
    // })
  );

  return (
    <div className="App" style={{
      backgroundColor: InfluxColors.Castle,
      width: "100vw",
      height: "100vh",
      overflow: "auto",
      textAlign: "center",
    }}>
      <Candlestick values={candlestickValue} theme={{}}  {...{ width, height }} />

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
        gaugeMiniColors: {
          min: {
            value: 50,
            hex: "#9aa445",
          },
          max: {
            value: 150,
            hex: "#E85B1C",
          },
          thresholds: [],
        },
      }} {...{ width, height }} />
      <GaugeMini values={asVal(18)} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini values={asVal(85)} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini values={asVal(96)} theme={gaugeTheme2} {...{ width, height }} />
      <GaugeMini values={asVal(120)} theme={gaugeTheme2} {...{ width, height }} />
    </div>
  );
};

export default App;
