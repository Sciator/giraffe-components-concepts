import React, { useState, useEffect, FunctionComponent, useRef } from "react"

import "./App.css"

import { color as d3Color } from "d3-color";
import { scaleLinear } from "d3-scale";
import { range } from "d3-array";

import {InfluxColors} from "@influxdata/clockface";

// props
const width = 200;
const height = 100;

type Color = {
  id: string
  type: "min" | "max" | "threshold" | "scale" | "text" | "background" | "target"
  hex: string
  name: string
  value: number
};


const SvgBoxText: FunctionComponent<React.SVGProps<SVGTextElement> & { borderColor: string, borderWidth: number | string }> = (props) => {
  const { borderColor, borderWidth } = props;

  const textRef = useRef<SVGTextElement>(null);

  const [textRect, setTextRect] = useState<SVGRect | null>(null);

  useEffect(() => {
    setTextRect(textRef.current?.getBBox() as SVGRect)
  }, [])

  return <>
    {/* 
    <rect
      style={{ stroke: borderColor, strokeWidth: borderWidth }}
      fill="none"
      width={textRect?.width}
      height={(textRect?.height || 0) - 2}
      x={textRect?.x}
      y={textRect?.y}
    />
     */}
    <text
      {...props}
      fill={InfluxColors.Platinum}
      ref={textRef}
    />
  </>
}

// todo: color type ?
type TColor = string;

interface GaugeTheme {
  valueHeight: number;
  gaugeHeight: number;
  gaugePaddingSides: number;
  colorsAndTargets: Color[];
  colorSecondary: TColor,
  mode: "progress" | "bullet",
  textMode: "follow" | "left",
  textColorOutside: TColor
  textColorInside: TColor
  axesColor: TColor;
  axesStrokeWidth: string | number;
  axesSteps: number;
}

type Colors = {
  min: Color,
  max: Color,
  secondary: TColor,
  thresholds: Color[],
  targets: Color[],
}

const getColors = (theme: GaugeTheme): Colors => {
  const { colorSecondary: secondary, colorsAndTargets } = theme;

  colorsAndTargets.forEach(({ hex, name }) => d3Color(hex) ?? throwReturn(`Object "${hex}" isn"t valid color for name:${name}`))

  const min: Color = colorsAndTargets.find(x => x.type === "min") ?? throwReturn("color of type min must be defined");
  const max: Color = colorsAndTargets.find(x => x.type === "max") ?? throwReturn("color of type max must be defined");

  const thresholds = colorsAndTargets.filter(({ type }) => type === "threshold").sort(({ value: a }, { value: b }) => a - b);
  const targets = colorsAndTargets.filter(({ type }) => type === "target").sort(({ value: a }, { value: b }) => a - b);

  return { max, min, secondary, targets, thresholds }
}

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
  textColorOutside: InfluxColors.Cloud,
  textColorInside: InfluxColors.Cloud,
  axesColor: InfluxColors.Cloud,
  axesSteps: 6,
  axesStrokeWidth: "2px",
})

const gaugeTheme2: GaugeTheme = {
  ...gaugeTheme,
  valueHeight: 20,
  gaugeHeight: 20,
  mode: "progress",
  colorsAndTargets: [gaugeTheme.colorsAndTargets[0], gaugeTheme.colorsAndTargets[gaugeTheme.colorsAndTargets.length - 1]],
  textColorInside: InfluxColors.Raven,
  textColorOutside: InfluxColors.Raven,
  colorSecondary: InfluxColors.Chromium
};

const throwReturn = <T extends unknown>(msg: string): T => {
  throw new Error(msg);
}

const GaugeBarBackground: FunctionComponent<{
  theme: GaugeTheme,
  colors: Colors,
  gaugeBarWidth: number,
  getFrac: (x: number) => number,
}> = ({ theme, colors: { max, min, secondary, thresholds }, gaugeBarWidth, getFrac }) => {
  const { gaugeHeight, mode } = theme;

  const colors: { start: number, end: number, col: string }[] = [];
  if (mode === "progress") {
    colors.push({ start: 0, end: 1, col: secondary })
  } else {
    const all = [min, ...thresholds, max];
    let start = 0;
    for (let i = 0; i + 1 < all.length; i++) {
      const { hex: col } = all[i];
      const { value } = all[i + 1];

      const end = getFrac(value);

      colors.push({ start, end, col });
      start = end;
    }
  }

  return <>
    {colors.map(({ col, end, start }) =>
      <rect height={gaugeHeight} x={gaugeBarWidth * start} width={gaugeBarWidth * (end - start)} fill={col} />
    )}
  </>
}

const GaugeBarValue: FunctionComponent<{
  theme: GaugeTheme,
  gaugeBarValueWidth: number,
  colors: Colors,
  value: number,
}> = ({ colors, gaugeBarValueWidth, value, theme }) => {
  const { valueHeight, gaugeHeight, mode } = theme;
  const colorModeGradient = colors.thresholds.length === 0;

  const colorValue = mode === "bullet"
    ? colors.secondary
    : d3Color(
      (() => {
        if (colorModeGradient) {
          return (
            scaleLinear()
              .range([colors.min.hex, colors.max.hex] as any)
              .domain([colors.min.value, colors.max.value])
              (value) as any
          )
        } else {
          const sortedColors = [colors.min, ...colors.thresholds, colors.max];
          let i = 0;
          while (i < sortedColors.length && value >= sortedColors[i].value) {
            i++;
          }
          return sortedColors[
            Math.max(Math.min(i - 1, sortedColors.length - 1), 0)
          ].hex;
        }
      })()
    )!
      .brighter(1.5)
      .formatHex()
    ;

  return <>
    <rect height={valueHeight} width={gaugeBarValueWidth} y={(gaugeHeight - valueHeight) / 2} fill={colorValue as any} />
  </>;
}

const GaugeText: FunctionComponent<{
  theme: GaugeTheme,
  gaugeBarValueWidth: number,
  colors: Colors,
  value: number,
}> = ({ value, gaugeBarValueWidth, theme }) => {
  const { textColorInside, textColorOutside, textMode } = theme;
  const textValue = ` ${(value).toFixed(0)} `

  const [textBBox, setTextBBox] = useState<SVGRect | null>(null);
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    setTextBBox(textRef.current?.getBBox() as SVGRect)
  }, [])

  const textInside = (textBBox?.width || 0) < gaugeBarValueWidth;

  const textAnchor = (textInside && textMode === "follow")
    ? "end"
    : "start"
    ;

  const textColor = textInside
    ? textColorInside
    : textColorOutside
    ;

  const x = textMode === "follow"
    ? gaugeBarValueWidth
    : 0
    ;

  return <>
    <text ref={textRef} x={x} fill={textColor} textAnchor={textAnchor}
      alignmentBaseline="central"
    >{textValue}</text>
  </>;
}

const GaugeMini: FunctionComponent<{ value: number, theme: GaugeTheme }> = ({ value, theme }) => {
  // data
  // const value = .7;

  const { colorSecondary, colorsAndTargets, gaugeHeight, gaugePaddingSides, mode, textColorInside, textColorOutside, valueHeight } = theme;

  const colors = getColors(theme);

  const colorLen = (colors.max.value - colors.min.value);

  const centerY = height / 2

  const valueFrac = ((value - colors.min.value) / colorLen);

  const gaugeBarY = centerY - (gaugeHeight / 2);
  const gaugeBarWidth = width - gaugePaddingSides * 2;
  const gaugeBarValueWidth = gaugeBarWidth * valueFrac;

  const { axesColor, axesSteps, axesStrokeWidth } = theme;

  const axesLineStyle = { stroke: axesColor, strokeWidth: axesStrokeWidth };

  const t = (x: number, y: number) => ({
    transform: `translate(${x},${y})`
  })

  /** return value as fraction 0->min 1->max */
  const getFrac = (val: number): number =>
    (val - colors.min.value) / colorLen
    ;

  return (
    <svg width={width} height={height}>
      <g {...t(gaugePaddingSides, gaugeBarY)}>
        <GaugeBarBackground {...{ colors, gaugeBarWidth, theme, getFrac }} />
        <GaugeBarValue {...{ colors, gaugeBarValueWidth, theme, value }} />
      </g>
      <g {...t(gaugePaddingSides, centerY)}>
        <GaugeText {...{ centerY, colors, gaugeBarValueWidth, theme, value }} />
      </g>

      <g {...t(0, gaugeBarY + Math.max(gaugeHeight, valueHeight) + 5)}>
        <line x1={gaugePaddingSides} x2={gaugeBarWidth + gaugePaddingSides}
          style={axesLineStyle} />
        {range(axesSteps).map(x => {
          const posX = gaugeBarWidth * x / (axesSteps - 1) + gaugePaddingSides;
          const value = colorLen * x / (axesSteps - 1) + colors.min.value;

          return <>
            <g {...t(posX, 5)} >
              <line
                y1={-5}
                style={axesLineStyle}
              />
              <text
                textAnchor="middle"
                alignmentBaseline="hanging"
                fill={axesColor}
              >
                {value.toFixed(0)}
              </text>
            </g>
          </>
        })}
      </g>
      <g {...t(gaugePaddingSides, 0)}>
        {colors.targets.map(({ value, hex }) => {
          const posX = gaugeBarWidth * ((value - colors.min.value) / colorLen);

          return <>
            <line
              style={{ stroke: hex, strokeWidth: "2px" }}
              y1={gaugeBarY - 8} y2={gaugeBarY + gaugeHeight}
              x1={posX} x2={posX}
            />

            <SvgBoxText
              borderColor={hex}
              borderWidth="2px"

              textAnchor="middle"
              x={posX}
              y={gaugeBarY - 10}
              style={{ borderColor: hex, borderStyle: "solid", borderWidth: "2px" }}
            >
              {value}
            </SvgBoxText>
          </>
        })}
      </g>
    </svg>
  )
}

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
    <div className="App" style={{backgroundColor: InfluxColors.Castle, width:"100vw", height:"100vh", overflow:"auto"}}>
      <GaugeMini value={val} theme={gaugeTheme} />
      <GaugeMini value={val} theme={gaugeTheme2} />
      <GaugeMini value={15} theme={gaugeTheme} />
      <GaugeMini value={25} theme={gaugeTheme} />
      <GaugeMini value={85} theme={gaugeTheme} />
      <GaugeMini value={96} theme={gaugeTheme} />
      <GaugeMini value={120} theme={gaugeTheme} />
      <GaugeMini value={15} theme={gaugeTheme2} />
      <GaugeMini value={18} theme={gaugeTheme2} />
      <GaugeMini value={85} theme={gaugeTheme2} />
      <GaugeMini value={96} theme={gaugeTheme2} />
      <GaugeMini value={120} theme={gaugeTheme2} />
    </div>
  )
}

export default App
