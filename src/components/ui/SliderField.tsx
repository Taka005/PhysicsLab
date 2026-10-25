"use client";

import { ChangeEvent } from "react";

type SliderFieldProps = {
  label: string;
  value: number;
  min: string;
  max: string;
  step: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: SliderFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-sm text-gray-600 font-mono">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full accent-blue-600 focus:outline-none"
      />
    </div>
  );
}