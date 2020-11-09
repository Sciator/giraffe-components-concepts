import React, { FunctionComponent, useEffect, useRef, useState } from "react";

import { color as d3Color } from "d3-color";
import { scaleLinear } from "d3-scale";
import { range } from "d3-array";
import { t } from "./shorthands";
import { SvgTextRect } from "./utilsSvg";

export type Color = {
  id: string
  type: "min" | "max" | "threshold" | "scale" | "text" | "background" | "target"
  hex: string
  name: string
  value: number
};

interface IProps {
  width: number;
  height: number;
  value: number | { _field: string, value: number }[];
  theme: IGaugeTheme;
}

// todo: color type ?
type TColor = string;

export interface IGaugeTheme {
  valueHeight: number;
  gaugeHeight: number;
  gaugePaddingSides: number;
  colorsAndTargets: Color[];
  colorSecondary: TColor;
  mode: "progress" | "bullet";
  textMode: "follow" | "left";
  textColor: TColor;
  textColorBarOutside: TColor;
  textColorBarInside: TColor;
  axesStrokeWidth: string | number;
  labelMain?: string;
  labelBars?: { _field: string, label: string }[];
  axesSteps: number | "thresholds";
  barPaddings: number;
}

export type Colors = {
  min: Color,
  max: Color,
  secondary: TColor,
  thresholds: Color[],
  targets: Color[],
};

const nbsp = " ";

export const getColors = (theme: IGaugeTheme): Colors => {
  const { colorSecondary: secondary, colorsAndTargets } = theme;

  colorsAndTargets.forEach(({ hex, name }) => d3Color(hex) ?? throwReturn(`Object "${hex}" isn"t valid color for name:${name}`));

  const min: Color = colorsAndTargets.find(x => x.type === "min") ?? throwReturn("color of type min must be defined");
  const max: Color = colorsAndTargets.find(x => x.type === "max") ?? throwReturn("color of type max must be defined");

  const thresholds = colorsAndTargets.filter(({ type }) => type === "threshold").sort(({ value: a }, { value: b }) => a - b);
  const targets = colorsAndTargets.filter(({ type }) => type === "target").sort(({ value: a }, { value: b }) => a - b);

  return { max, min, secondary, targets, thresholds };
};


const throwReturn = <T extends unknown>(msg: string): T => {
  throw new Error(msg);
};

const BarBackground: FunctionComponent<{
  theme: IGaugeTheme,
  colors: Colors,
  barWidth: number,
  getFrac: (x: number) => number,
}> = ({ theme, colors: { max, min, secondary, thresholds }, barWidth, getFrac }) => {
  const { gaugeHeight, mode } = theme;

  const colors: { start: number, end: number, col: string }[] = [];
  if (mode === "progress") {
    colors.push({ start: 0, end: 1, col: secondary });
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
      <rect height={gaugeHeight} x={barWidth * start} width={barWidth * (end - start)} fill={col} />
    )}
  </>;
};

const BarValue: FunctionComponent<{
  theme: IGaugeTheme,
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
          );
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
    )
      ?.brighter(1)
      .formatHex()
    ;

  return <>
    <rect height={valueHeight} width={gaugeBarValueWidth} y={(gaugeHeight - valueHeight) / 2} fill={colorValue as any} />
  </>;
};

const Bar: FunctionComponent<{
  value: number, theme: IGaugeTheme, barWidth: number, y: number, getFrac: (x: number) => number,
}> = ({ value, theme, y, barWidth, getFrac, }) => {
  const { gaugeHeight, valueHeight } = theme;

  const colors = getColors(theme);

  const colorLen = (colors.max.value - colors.min.value);

  const valueFrac = ((value - colors.min.value) / colorLen);

  const gaugeBarY = y;
  const gaugeBarValueWidth = barWidth * valueFrac;
  const maxBarHeight = Math.max(gaugeHeight, valueHeight);
  const textCenter = y + maxBarHeight / 2;

  return <>
    <g {...t(0, gaugeBarY)}>
      <BarBackground {...{ colors, barWidth, theme, getFrac }} />
      <BarValue {...{ colors, gaugeBarValueWidth, theme, value }} />
    </g>
    <g {...t(0, textCenter)}>
      <Text {...{ centerY: y, colors, gaugeBarValueWidth, theme, value }} />
    </g>
  </>;
};

const Text: FunctionComponent<{
  theme: IGaugeTheme,
  gaugeBarValueWidth: number,
  colors: Colors,
  value: number,
}> = ({ value, gaugeBarValueWidth, theme }) => {
  const { textColorBarInside, textColorBarOutside, textMode } = theme;
  // todo: better padding style
  const textValue = nbsp + (value).toFixed(0) + nbsp;

  const [textBBox, setTextBBox] = useState<SVGRect | null>(null);

  const textInside = (textBBox?.width || 0) < gaugeBarValueWidth;

  const textAnchor = (textInside && textMode === "follow")
    ? "end"
    : "start"
    ;

  const textColor = textInside
    ? textColorBarInside
    : textColorBarOutside
    ;

  const x = textMode === "follow"
    ? gaugeBarValueWidth
    : 0
    ;

  return <>
    <SvgTextRect
      onRectChanged={setTextBBox}
      x={x} fill={textColor} textAnchor={textAnchor}
      alignmentBaseline="central"
    >{textValue}</SvgTextRect>
  </>;
};

const getIndexPos = (arrLen: number, i: number) => {
  return {
    isLast: i === arrLen - 1,
    isFirst: i === 0,
  };
};

const Axes: FunctionComponent<{
  theme: IGaugeTheme, barWidth: number, y: number, getFrac: (x: number) => number,
}> = ({ theme, barWidth, y, getFrac, }) => {
  const { textColor: axesColor, axesSteps, axesStrokeWidth } = theme;

  const colors = getColors(theme);

  const colorLen = (colors.max.value - colors.min.value);

  const axesLineStyle = { stroke: axesColor, strokeWidth: axesStrokeWidth };

  const points: {
    anchor: string,
    value: number,
    lineLength: number,
  }[] = (
    axesSteps === "thresholds"
      ? colors.thresholds.map(x => x.value)
      : range(axesSteps).map(x => (x + 1) * colorLen / (axesSteps + 1) + colors.min.value)
  ).map(value => ({
    anchor: "middle",
    value,
    lineLength: 5,
  }))
    .concat([{
      anchor: "start",
      lineLength: 3,
      value: colors.min.value,
    }, {
      anchor: "end",
      lineLength: 3,
      value: colors.max.value,
    }])
    ;

  return <>
    <g {...t(0, y)}>
      <line x2={barWidth}
        style={axesLineStyle} />
      {points.map(({ anchor, lineLength, value }, i) => {
        const posX = getFrac(value) * barWidth;
        return <>
          <g {...t(posX, 0)} >
            <line
              y2={lineLength}
              style={axesLineStyle}
            />
            <text
              y={8}
              textAnchor={anchor}
              alignmentBaseline="hanging"
              fill={axesColor}
            >
              {value.toFixed(0)}
            </text>
          </g>
        </>;
      })}
    </g>
  </>;
};

const AutoCenterGroup: FunctionComponent<{ enabled?: boolean, refreshToken?: number | string }> = ({ children, enabled = true, refreshToken = 0 }) => {
  const ref = useRef<SVGGElement>(null);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setX(0);
      setY(0);
      return;
    }

    const g = ref.current;
    // we use this function because we want to know how much we are in negative direction
    const box = g?.getBBox();
    // we use this function because we want to have fixed parent width/height
    const boxParent = (g?.parentElement as SVGGraphicsElement | undefined)?.getBoundingClientRect();

    if (!box || !boxParent)
      return;

    setX((boxParent.width - box.width) / 2 - box.x);
    setY((boxParent.height - box.height) / 2 - box.y);
  }, [refreshToken]);

  return <g ref={ref} {...t(x, y)}>
    {children}
  </g>;
};

export const GaugeMini: FunctionComponent<IProps> = ({ value, theme, width, height }) => {
  const { gaugeHeight, gaugePaddingSides, valueHeight, barPaddings, labelMain, labelBars, textColor } = theme;
  const [barLabelsWidth] = useState<number[]>([]);

  const valueArray = Array.isArray(value) ? value : [{ _field: "_default", value }];

  const colors = getColors(theme);
  const colorLen = (colors.max.value - colors.min.value);
  const centerY = height / 2;

  const gaugeBarY = centerY - (gaugeHeight / 2);
  const barWidth = width - gaugePaddingSides * 2 - (Math.max(...barLabelsWidth) || 0);

  const maxBarHeight = Math.max(gaugeHeight, valueHeight);

  const allBarsHeight = valueArray.length * (maxBarHeight + barPaddings);

  const [autocenterToken, setAutocenterToken] = useState(0);
  useEffect(() => {
    setAutocenterToken(autocenterToken + 1);
  }, [barLabelsWidth, gaugePaddingSides, valueHeight]);

  /** return value as fraction 0->min 1->max */
  const getFrac = (val: number): number =>
    (val - colors.min.value) / colorLen
    ;

  return (
    <svg width={width} height={height} style={{ fontFamily: "Rubik, monospace" }} >
      <AutoCenterGroup enabled={true} refreshToken={autocenterToken}>
        {labelMain &&
          <text fill={textColor} y={-barPaddings * 2}>
            {labelMain}
          </text>
        }
        {valueArray.map(({ _field, value }, i) => {
          const y = 0 + i * (maxBarHeight + barPaddings);
          const label = labelBars?.find(({ _field: f }) => f === _field)?.label;

          const textCenter = y + maxBarHeight / 2;

          // todo: no rerender ?
          const onRectChanged = (r: DOMRect) => { barLabelsWidth[i] = r.width; };

          return <>
            <Bar {...{ barWidth, y, theme, value, getFrac }} />
            <SvgTextRect onRectChanged={onRectChanged} fill={textColor} y={textCenter} alignmentBaseline="central" textAnchor="end">{label && (label + nbsp)}</SvgTextRect>
          </>;
        })}
        <Axes {...{ barWidth, theme, value, y: allBarsHeight + barPaddings, getFrac }} />
        <g {...t(gaugePaddingSides, 0)}>
          {colors.targets.map(({ value, hex }) => {
            const posX = barWidth * ((value - colors.min.value) / colorLen);

            return <>
              <line
                style={{ stroke: hex, strokeWidth: "2px" }}
                y1={gaugeBarY - 8} y2={gaugeBarY + gaugeHeight}
                x1={posX} x2={posX}
              />

              <text
                textAnchor="middle"
                x={posX}
                y={gaugeBarY - 10}
                style={{ borderColor: hex, borderStyle: "solid", borderWidth: "2px" }}
              >
                {value}
              </text>
            </>;
          })}
        </g>
      </AutoCenterGroup>
    </svg>
  );
};
