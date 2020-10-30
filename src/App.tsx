import React, { useState, useEffect, FunctionComponent, useRef } from 'react'

import './App.css'

import { color as d3Color } from 'd3-color';
import { scaleLinear } from 'd3-scale';
import { range } from "d3-array";


type Color = {
  id: string
  type: 'min' | 'max' | 'threshold' | 'scale' | 'text' | 'background' | 'target'
  hex: string
  name: string
  value: number
};

// props
const width = 200;
const height = 100;

const SvgBoxText: FunctionComponent<React.SVGProps<SVGTextElement> & { borderColor: string, borderWidth: number | string }> = (props) => {
  const { borderColor, borderWidth } = props;

  const textRef = useRef<SVGTextElement>(null);

  const [textRect, setTextRect] = useState<SVGRect | null>(null);

  useEffect(() => {
    setTextRect(textRef.current?.getBBox() as SVGRect)
  }, [])

  return <>
    <rect
      style={{ stroke: borderColor, strokeWidth: borderWidth }}
      fill="none"
      width={textRect?.width}
      height={(textRect?.height || 0) - 2}
      x={textRect?.x}
      y={textRect?.y}
    />
    <text
      {...props}
      ref={textRef}
    />
  </>
}

const gaugeTheme = ({
  valueHeight: 20,
  gaugeHeight: 30,
  gaugePaddingSides: 20,
  colorsAndTargets: [
    { value: 95, type: "min", hex: "#ff0000", ...({} as any) },
    { value: 240, type: "threshold", hex: "#aaaaff", ...({} as any) },
    { value: 450, type: "threshold", hex: "#7777ff", ...({} as any) },
    { value: 812, type: "max", hex: "#00ff00", ...({} as any) },

    // { value: 725, type: "target", hex: "#ff0000", ...({} as any) },
    // { value: 312, type: "target", hex: "#ffff00", ...({} as any) },
  ] as Color[],
  colorSecondary: "black",
  mode: "progress" as "progress" | "bullet",
  textColorOutside: "white",
  textColorInside: "black",
})

const throwReturn = <T extends unknown>(msg: string): T => {
  throw new Error(msg);
}

const Gauge = () => {

}


const GaugeMini: FunctionComponent<{ value: number }> = ({ value }) => {
  // data
  // const value = .7;

  const { colorSecondary, colorsAndTargets, gaugeHeight, gaugePaddingSides, mode, textColorInside, textColorOutside, valueHeight } = gaugeTheme;

  const colors = colorsAndTargets.filter(x => x.type !== "target");
  const targets = colorsAndTargets.filter(({ type }) => type === "target");

  const colorModeGradient = colors.length === 2;
  const colorMin: Color = colors.find(x => x.type === "min") ?? throwReturn("color of type min must be defined");
  const colorMax: Color = colors.find(x => x.type === "max") ?? throwReturn("color of type max must be defined");

  const color = mode === "bullet"
    ? colorSecondary
    : d3Color(
      (() => {
        if (colorModeGradient) {
          return (
            scaleLinear()
              .range([colorMin.hex, colorMax.hex] as any)
              .domain([colorMin.value, colorMax.value])
              (value) as any
          )
        } else {
          const sortedColors = [...colors].sort((a, b) => a.value - b.value);
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
      .brighter(1)
      .formatHex()
    ;

  const centerY = height / 2

  const colorLen = (colorMax.value - colorMin.value);
  const valueFrac = ((value - colorMin.value) / colorLen);

  const gaugeBarY = centerY - (gaugeHeight / 2);
  const gaugeBarValueY = centerY - (gaugeHeight / 2);
  const gaugeBarWidth = width - gaugePaddingSides * 2;
  const gaugeBarValueWidth = gaugeBarWidth * valueFrac;

  const textValue = ` ${(value).toFixed(0)} `

  const textRef = useRef<SVGTextElement>(null);

  const [textRect, setTextRect] = useState<SVGRect | null>(null);


  useEffect(() => {
    setTextRect(textRef.current?.getBBox() as SVGRect)
  }, [])

  const textInside = (textRect?.width || 0) < gaugeBarValueWidth;

  const textAnchor = textInside
    ? "end"
    : "start"
    ;

  const textColor = textInside
    ? textColorInside
    : textColorOutside
    ;

  const axesColor = "darkgray";
  const axesLineStyle = { stroke: axesColor, strokeWidth: "2px" };
  const axesSteps = 5;

  const t = (x: number, y: number) => ({
    transform: `translate(${x},${y})`
  })

  return (
    <svg width={width} height={height}>
      <g {...t(gaugePaddingSides, gaugeBarY)}>
        <rect height={gaugeHeight} width={gaugeBarWidth} />
        <rect height={valueHeight} width={gaugeBarValueWidth} y={(gaugeHeight - valueHeight) / 2} fill={color as any} />
      </g>
      <g>
        <text ref={textRef} x={gaugePaddingSides + gaugeBarValueWidth} y={centerY} fill={textColor} textAnchor={textAnchor}
          alignmentBaseline="central"
        >{textValue}</text>
      </g>

      <g {...t(0, gaugeBarY + gaugeHeight + 5)}>
        <line x1={gaugePaddingSides} x2={gaugeBarWidth + gaugePaddingSides}
          style={axesLineStyle} />
        {range(axesSteps).map(x => {
          const posX = gaugeBarWidth * x / (axesSteps - 1) + gaugePaddingSides;
          const value = colorLen * x / (axesSteps - 1) + colorMin.value;

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
      {targets.map(({ value, hex }) => {
        const posX = gaugeBarWidth * ((value - colorMin.value) / colorLen);

        return <>
          <line
            style={{ stroke: hex, strokeWidth: "2px" }}
            y1={gaugeBarY} y2={gaugeBarY + gaugeHeight}
            x1={posX} x2={posX}
          />

          <SvgBoxText
            borderColor={hex}
            borderWidth="2px"

            textAnchor="middle"
            x={posX}
            y={gaugeBarY}
            style={{ borderColor: hex, borderStyle: "solid", borderWidth: "2px" }}
          >
            {value}
          </SvgBoxText>
        </>
      })}
    </svg>
  )
}

const App: FunctionComponent<any> = () => {

  return (
    <div className="App" style={{}}>
      <div style={{ minWidth: `${width}`, minHeight: `${height}`, borderColor: "black", borderWidth: "1px", borderStyle: "solid", display: "inline-block" }}>
        {GaugeMini({ value: 100 })}
      </div>
      <div style={{ minWidth: `${width}`, minHeight: `${height}`, borderColor: "black", borderWidth: "1px", borderStyle: "solid", display: "inline-block" }}>
        {GaugeMini({ value: 125 })}
      </div>
      <div style={{ minWidth: `${width}`, minHeight: `${height}`, borderColor: "black", borderWidth: "1px", borderStyle: "solid", display: "inline-block" }}>
        {GaugeMini({ value: 231 })}
      </div>
      <div style={{ minWidth: `${width}`, minHeight: `${height}`, borderColor: "black", borderWidth: "1px", borderStyle: "solid", display: "inline-block" }}>
        {GaugeMini({ value: 350 })}
      </div>
      <div style={{ minWidth: `${width}`, minHeight: `${height}`, borderColor: "black", borderWidth: "1px", borderStyle: "solid", display: "inline-block" }}>
        {GaugeMini({ value: 483 })}
      </div>
      <div style={{ minWidth: `${width}`, minHeight: `${height}`, borderColor: "black", borderWidth: "1px", borderStyle: "solid", display: "inline-block" }}>
        {GaugeMini({ value: 653 })}
      </div>
      <div style={{ minWidth: `${width}`, minHeight: `${height}`, borderColor: "black", borderWidth: "1px", borderStyle: "solid", display: "inline-block" }}>
        {GaugeMini({ value: 812 })}
      </div>
    </div>
  )
}

export default App
