"use client";

import { useEffect, useRef, useState } from "react";

type Option = {
  label: string;
  value: string | number;
};

type SelectFieldProps = {
  label: string;
  value: string | number;
  options: Option[];
  onChange: (value: string) => void;
};

export default function SelectField({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => String(option.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    onChange(String(option.value));
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2" ref={popoverRef}>
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{selectedOption?.label ?? String(value)}</span>
          <span className="text-xs text-gray-400">▼</span>
        </button>
        {isOpen && (
          <div
            role="listbox"
            className="absolute left-0 right-0 mt-2 py-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto"
          >
            {options.map((option) => {
              const isSelected = String(option.value) === String(value);

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none ${
                    isSelected
                      ? "bg-gray-200 font-semibold text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}