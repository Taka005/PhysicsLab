"use client";

import { useEffect, useState } from "react";

type SliderFieldProps = {
  label: string;
  value: number;
  min: string;
  max: string;
  step: string;
  onChange: (value: number) => void;
};

export default function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: SliderFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    if (!isEditing) setInputValue(String(value));
  }, [isEditing, value]);

  const commitInputValue = () => {
    const parsedValue = Number(inputValue);

    if (inputValue.trim() === "" || !Number.isFinite(parsedValue)) {
      setInputValue(String(value));
      setIsEditing(false);
      return;
    }

    const lowerBound = Number(min);
    const upperBound = Number(max);
    const stepValue = Number(step);
    const clampedValue = Math.min(Math.max(parsedValue, lowerBound), upperBound);
    const steppedValue = Number.isFinite(stepValue) && stepValue > 0 ? lowerBound + Math.round((clampedValue - lowerBound) / stepValue) * stepValue : clampedValue;
    const precision = step.includes(".") ? step.split(".")[1].length : 0;
    const nextValue = Number(steppedValue.toFixed(Math.min(precision, 10)));

    onChange(nextValue);
    setInputValue(String(nextValue));
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onBlur={commitInputValue}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
              if (event.key === "Escape") {
                setInputValue(String(value));
                setIsEditing(false);
              }
            }}
            autoFocus
            className="box-border h-7 w-24 rounded border border-gray-500 px-2 py-1 text-right text-sm leading-5 text-gray-700 font-mono focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setInputValue(String(value));
              setIsEditing(true);
            }}
            className="box-border flex h-7 w-24 items-center justify-end px-2 py-1 text-right text-sm leading-5 text-gray-600 font-mono focus:outline-none"
          >
            {value}
          </button>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-blue-600 focus:outline-none"
      />
    </div>
  );
}