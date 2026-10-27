"use client";

import { ChangeEvent } from "react";

type InputFieldProps = {
  label: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password";
  required?: boolean;
};

export default function InputField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-inner text-sm text-gray-700 placeholder-gray-500 focus:outline-none transition-colors"
      />
    </div>
  );
}