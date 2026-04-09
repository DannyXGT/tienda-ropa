"use client";

import type { Variant } from "@/lib/catalog.types";

export default function ColorSwatches({
  variants,
  value,
  onChange,
}: {
  variants: Variant[];
  value: string;
  onChange: (colorId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {variants.map((v) => {
        const active = v.colorId === value;
        return (
          <button
            key={v.colorId}
            type="button"
            onClick={() => onChange(v.colorId)}
            className={[
              "h-11 w-11 rounded-full border border-white/80 ring-2 transition shadow-[0_6px_14px_rgba(0,0,0,.10)]",
              "hover:scale-[1.07] active:scale-[.97]",
              active ? "ring-[#ec4899] scale-[1.05]" : "ring-black/12 hover:ring-black/25",
            ].join(" ")}
            title={v.colorName}
            aria-label={v.colorName}
            style={{ backgroundColor: v.hex || "#d1d5db" }}
          />
        );
      })}
    </div>
  );
}
