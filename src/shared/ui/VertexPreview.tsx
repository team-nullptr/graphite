import colors from "tailwindcss/colors";
import { Color } from "~/types/color";

export type VertexPreviewProps = {
  label: string;
  color?: Color;
};

export function VertexPreview({ color, label }: VertexPreviewProps) {
  const backgroundColor = color ? colors[color][200] : colors["slate"][100];
  const borderColor = color ? colors[color][500] : colors["slate"][300];
  const textColor = colors[color ?? "slate"][900];

  return (
    <div
      className={`inline-flex aspect-square h-10 items-center justify-center rounded-full border transition-all`}
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      <span style={{ color: textColor }}></span>
      {label}
    </div>
  );
}
