import { isNumber, isString } from "util";
import { DecimalPlaces } from "./types";


const preventNegativeZero = (
  value: number | string
): number | string => {
  // eslint-disable-next-line no-compare-neg-zero
  if (Number(value) === -0) {
    return typeof value === "number" ? 0 : value.replace(/-/g, "");
  }
  return value;
};

export const MAX_DECIMAL_PLACES = 10;

export interface FormatStatValueOptions {
  decimalPlaces?: DecimalPlaces;
  prefix?: string;
  suffix?: string;
}

const getAutoDigits = (value: number | string): number => {
  const decimalIndex = value.toString().indexOf(".");

  return decimalIndex === -1 ? 0 : 2;
};

export const formatStatValue = (
  value: number | string,
  { decimalPlaces, prefix, suffix }: FormatStatValueOptions = {}
): string => {
  let localeFormattedValue: undefined | string | number;

  let digits: number = (decimalPlaces && decimalPlaces.isEnforced && decimalPlaces.digits !== undefined)
    ? decimalPlaces.digits
    : getAutoDigits(value)
    ;

  digits = Math.min(digits, MAX_DECIMAL_PLACES);

  if (isNumber(value)) {
    const [wholeNumber, fractionalNumber] = Number(value)
      .toFixed(digits)
      .split(".");

    localeFormattedValue = Number(wholeNumber).toLocaleString(undefined, {
      maximumFractionDigits: MAX_DECIMAL_PLACES,
    });

    if (fractionalNumber) {
      localeFormattedValue += `.${fractionalNumber}`;
    }
  } else if (isString(value)) {
    localeFormattedValue = value;
  } else {
    return "Data cannot be displayed";
  }

  localeFormattedValue = preventNegativeZero(localeFormattedValue);
  const formattedValue = `${prefix || ""}${localeFormattedValue}${suffix || ""}`;

  return formattedValue;
};
