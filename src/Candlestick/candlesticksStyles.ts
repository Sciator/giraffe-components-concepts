import { InfluxColors } from "@influxdata/clockface";
import { CandlestickLayerConfig } from "./types";

export const CANDLESTICK_THEME_DARK: CandlestickLayerConfig = {
  type: "candlestick",
  mode: "candles",
  candlePadding: 5,
  candleRaising: {
    bodyColor: InfluxColors.Krypton,
    bodyFillOpacity: 1,
    bodyRounding: 4,
    bodyStrokeWidth: 2,
    shadowColor: InfluxColors.Krypton,
    shadowStrokeWidth: 2,
  },
  candleDecreasing: {
    bodyColor: InfluxColors.Curacao,
    bodyFillOpacity: 0,
    bodyRounding: 0,
    bodyStrokeWidth: 2,
    shadowColor: InfluxColors.Curacao,
    shadowStrokeWidth: 2,
  },
};


