import React, { useState, useEffect, FunctionComponent, useRef } from 'react'

import './App.css'

import { color as d3Color } from 'd3-color';
import { scaleLinear } from 'd3-scale';
import { range } from "d3-array";

export const VIRTUAL_DEVICE = 'virtual_device'


type Color = {
  id: string
  type: 'min' | 'max' | 'threshold' | 'scale' | 'text' | 'background'
  hex: string
  name: string
  value: number
};

// props
const width = 200;
const height = 100;

const GaugeMini: FunctionComponent<{ value: number }> = ({ value }) => {
  // data
  // const value = .7;

  // theme
  const gaugeHeight = 20;
  const gaugePaddingSides = 20;
  const colors: Color[] = [
    { value: 95, type: "min", hex: "#ff0000", ...({} as any) },
    { value: 240, type: "threshold", hex: "#aaaaff", ...({} as any) },
    { value: 450, type: "threshold", hex: "#7777ff", ...({} as any) },
    { value: 812, type: "max", hex: "#00ff00", ...({} as any) },
  ];
  const axes = {
    n: 5,
    color: "darkgray",
  };

  const colorModeGradient = colors.length === 2;
  const textColorOutside = "white";
  const textColorInside = "black";

  const colorMin = colors.find(x => x.type === "min")!;
  const colorMax = colors.find(x => x.type === "max")!;

  const color = d3Color(
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
        i--;
        i = Math.min(i, sortedColors.length - 1);
        i = Math.max(i, 0);
        return sortedColors[i].hex;
      }
    })()
  )!
    .brighter(1)
    .formatHex()

  //calculated
  const centerY = height / 2

  const colorLen = (colorMax.value - colorMin.value);
  const valueFrac = ((value - colorMin.value) / colorLen);

  const gaugeBarY = centerY - (gaugeHeight / 2);
  const gaugeBarWidth = width - gaugePaddingSides * 2;
  const gaugeBarValueWidth = gaugeBarWidth * valueFrac;

  const textValue = ` ${(value).toFixed(0)} `

  const textRef = useRef<SVGTextElement>(null);

  const [textRect, setTextRect] = useState<SVGRect | null>(null);

  useEffect(() => {
    setTextRect(textRef.current?.getBBox() as SVGRect)
  })

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

  return (
    <svg width={width} height={height}>
      <rect height={gaugeHeight} width={gaugeBarWidth} x={gaugePaddingSides} y={gaugeBarY} />
      <rect height={gaugeHeight} width={gaugeBarValueWidth} x={gaugePaddingSides} y={gaugeBarY} fill={color as any} />
      <text ref={textRef} x={gaugePaddingSides + gaugeBarValueWidth} y={centerY} fill={textColor} style={{ filter: "invert(1);" }} textAnchor={textAnchor}
        alignmentBaseline="central"
      >{textValue}</text>
      <line x1={gaugePaddingSides} x2={gaugeBarWidth + gaugePaddingSides}
        y1={gaugeBarY + gaugeHeight + 5} y2={gaugeBarY + gaugeHeight + 5} style={axesLineStyle} />
      {range(axesSteps).map(x => {
        const posXStart = gaugePaddingSides;
        const posXEnd = gaugeBarWidth + gaugePaddingSides;
        const posXLen = posXEnd - posXStart;
        const posX = posXLen * x / (axesSteps - 1) + posXStart;

        const value = colorLen * x / (axesSteps - 1) + colorMin.value;

        return <>
          <line
            x1={posX} x2={posX}
            y1={gaugeBarY + gaugeHeight + 5} y2={gaugeBarY + gaugeHeight + 10}
            style={axesLineStyle}
          />
          <text
            x={posX} y= {gaugeBarY + gaugeHeight + 10}
        textAnchor="middle"
        alignmentBaseline="hanging"
        fill={axesColor}
>
{value.toFixed(0)}
          </text>
        </>
      }
      )}
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
