
export interface CandleStyle {
  shadowColor: string;
  shadowStrokeWidth: number;

  bodyColor: string;
  bodyFillOpacity: number;
  bodyStrokeWidth: number;
  bodyRounding: number;
}

export interface CandlestickLayerConfig {
  type: "candlestick";
  /** Defines which columns choose as unique bar indentificator. Also bar labels can be defined here. */
  mode?: "candles" | "fence";

  candlePadding: number;
  candleRaising: CandleStyle;
  candleDecreasing: CandleStyle;

}
