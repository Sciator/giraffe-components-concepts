
export type Color = {
  id: string
  type: "min" | "max" | "threshold" | "scale" | "text" | "background"
  hex: string
  name: string
  value: number
};

export interface DecimalPlaces {
  isEnforced?: boolean;
  digits?: number;
}
