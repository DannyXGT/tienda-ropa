"use client";

import type { VariantSize } from "@/lib/catalog.types";

export default function SizePicker({
  sizes,
  value,
  onChange,
}: {
  sizes: VariantSize[];
  value: string;
  onChange: (size: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {sizes.map((s) => {
        const active = s.size === value;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.size)}
            className={[
              "rounded-2xl px-4 py-2 text-sm font-semibold ring-1 transition",
              "hover:-translate-y-[1px] active:translate-y-[1px]",
              active
                ? "bg-[#fce7f3] text-[#9d174d] ring-[#f9a8d4]"
                : "bg-white ring-black/10 hover:ring-black/20",
            ].join(" ")}
          >
            {s.size}
          </button>
        );
      })}
    </div>
  );
}
