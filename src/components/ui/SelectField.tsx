"use client";

import { ChangeEvent } from "react";

type Option = {
  label: string;
  value: string | number;
};

type SelectFieldProps = {
  label: string;
  value: string | number;
  options: Option[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectField({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}