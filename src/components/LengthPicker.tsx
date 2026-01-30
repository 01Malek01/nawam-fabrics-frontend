import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

function clampToQuarter(v: number) {
  // Round to nearest 0.25
  return Math.round(v * 4) / 4;
}

function normalizeArabicNumerals(input: string): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let output = input;
  for (let i = 0; i < arabicNumerals.length; i++) {
    const regex = new RegExp(arabicNumerals[i], "g");
    output = output.replace(regex, i.toString());
  }
  // Replace Arabic decimal separator with a period
  output = output.replace(/٫/g, ".");
  return output;
}

export default function LengthPicker({
  value = 3,
  min = 0.25,
  step = 0.25,
  onChange,
}: {
  value?: number;
  min?: number;
  step?: number;
  onChange?: (v: number) => void;
}) {
  const [internal, setInternal] = useState<number>(clampToQuarter(value));
  const [displayValue, setDisplayValue] = useState(value.toString());

  useEffect(() => {
    const clamped = clampToQuarter(value);
    setInternal(clamped);
    setDisplayValue(clamped.toString());
  }, [value]);

  function update(v: number) {
    const clamped = Math.max(min, clampToQuarter(v));
    setInternal(clamped);
    setDisplayValue(clamped.toString());
    onChange?.(clamped);
  }

  const dec = () => update(clampToQuarter(internal - step));
  const inc = () => update(clampToQuarter(internal + step));

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        type="button"
        onClick={dec}
        className="px-2 py-1 h-9 w-9 flex items-center justify-center text-lg"
      >
        -
      </Button>
      <input
        aria-label="length-meters"
        value={displayValue}
        onChange={(e) => {
          const raw = e.target.value;
          setDisplayValue(raw);
        }}
        onBlur={() => {
          const normalized = normalizeArabicNumerals(displayValue);
          const parsed = parseFloat(normalized as any);
          if (Number.isNaN(parsed)) {
            update(min);
          } else {
            update(parsed);
          }
        }}
        className="text-center w-20 border rounded px-2 py-1"
      />
      <Button
        type="button"
        onClick={inc}
        className="px-2 py-1 h-9 w-9 flex items-center justify-center text-lg "
      >
        +
      </Button>
      <div className="text-xl text-gray-600 pr-2">متر</div>
    </div>
  );
}
