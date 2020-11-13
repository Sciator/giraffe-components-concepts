
export type Color = {
  id: string
  type: "min" | "max" | "threshold" | "scale" | "text" | "background" // | "target"
  hex: string
  name: string
  value: number
};
