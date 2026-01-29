import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

function clampToQuarter(v: number) {
  // Round to nearest 0.25
  return Math.round(v * 4) / 4;
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

  useEffect(() => {
    setInternal(clampToQuarter(value));
  }, [value]);

  function update(v: number) {
    const clamped = Math.max(min, clampToQuarter(v));
    setInternal(clamped);
    onChange?.(clamped);
  }

  const dec = () => update(clampToQuarter(internal - step));
  const inc = () => update(clampToQuarter(internal + step));

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        type="button"
        onClick={dec}
        className="px-2 py-1 h-9 w-9 flex items-center justify-center"
      >
        -
      </Button>
      <input
        aria-label="length-meters"
        value={internal}
        onChange={(e) => {
          const raw = e.target.value;
          // allow empty while typing
          const parsed = parseFloat(raw as any);
          if (Number.isNaN(parsed)) {
            setInternal(0);
            return;
          }
          // allow typing, but don't call onChange until blur
          setInternal(parsed);
        }}
        onBlur={() => {
          update(internal);
        }}
        className="text-center w-20 border rounded px-2 py-1"
      />
      <Button
        type="button"
        onClick={inc}
        className="px-2 py-1 h-9 w-9 flex items-center justify-center"
      >
        +
      </Button>
      <div className="text-xl text-gray-600 pr-2">متر</div>
    </div>
  );
}
