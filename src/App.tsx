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

const GaugeMini: FunctionComponent<{ value: number }> = ({ value }) => {
  // data
  // const value = .7;

  // #region theme

  const gaugeHeight = 20;
  const gaugeHeightPadding = 10;
  const gaugePaddingSides = 20;
  const colorsAndTargets: Color[] = [
    { value: 95, type: "min", hex: "#ff0000", ...({} as any) },
    { value: 240, type: "threshold", hex: "#aaaaff", ...({} as any) },
    { value: 450, type: "threshold", hex: "#7777ff", ...({} as any) },
    { value: 812, type: "max", hex: "#00ff00", ...({} as any) },

    // { value: 725, type: "target", hex: "#ff0000", ...({} as any) },
    // { value: 312, type: "target", hex: "#ffff00", ...({} as any) },
  ];
  const colorSecondary = "black";

  const mode: "progress" | "bullet" = "bullet"

  const textColorOutside = "white";
  const textColorInside = "black";

  // #endregion

  const isBullet = mode === "bullet";
  const colors = colorsAndTargets.filter(x => x.type !== "target");
  const targets = colorsAndTargets.filter(({ type }) => type === "target");

  const colorModeGradient = colors.length === 2;
  const colorMin = colors.find(x => x.type === "min")!;
  const colorMax = colors.find(x => x.type === "max")!;

  const color = isBullet
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

  const gaugeBarHeight = gaugeHeight + gaugeHeightPadding;
  const gaugeBarY = centerY - (gaugeBarHeight / 2);
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
      <rect height={gaugeBarHeight} width={gaugeBarWidth} x={gaugePaddingSides} y={gaugeBarY} />
      <rect height={gaugeHeight} width={gaugeBarValueWidth} x={gaugePaddingSides} y={gaugeBarValueY} fill={color as any} />
      <text ref={textRef} x={gaugePaddingSides + gaugeBarValueWidth} y={centerY} fill={textColor} style={{ filter: "invert(1);" }} textAnchor={textAnchor}
        alignmentBaseline="central"
      >{textValue}</text>
      <line x1={gaugePaddingSides} x2={gaugeBarWidth + gaugePaddingSides}
        y1={gaugeBarY + gaugeBarHeight + 5} y2={gaugeBarY + gaugeBarHeight + 5} style={axesLineStyle} />
      {range(axesSteps).map(x => {
        const posXStart = gaugePaddingSides;
        const posXEnd = gaugeBarWidth + gaugePaddingSides;
        const posXLen = posXEnd - posXStart;
        const posX = posXLen * x / (axesSteps - 1) + posXStart;

        const value = colorLen * x / (axesSteps - 1) + colorMin.value;

        return <>
          <g
            {...t(posX, gaugeBarY + gaugeBarHeight)}
          >
            <line
              y1={5} y2={10}
              style={axesLineStyle}
            />
            <text
              y={10}
              textAnchor="middle"
              alignmentBaseline="hanging"
              fill={axesColor}
            >
              {value.toFixed(0)}
            </text>
          </g>
        </>
      })}
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
