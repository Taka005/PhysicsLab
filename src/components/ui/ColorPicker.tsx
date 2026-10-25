"use client";

import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

type ColorPickerProps = {
  label: string;
  value?: string;
  onChange?: (color: string) => void;
};

export default function ColorPicker({
  label,
  value: externalValue,
  onChange,
}: ColorPickerProps) {
  const [internalColor, setInternalColor] = useState("#ff0000");
  const color = externalValue !== undefined ? externalValue : internalColor;

  const [inputValue, setInputValue] = useState(color);
  const [isOpen, setIsOpen] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);

  const updateColor = (newColor: string) => {
    setInternalColor(newColor);
    setInputValue(newColor);
    onChange?.(newColor);
  };

  const handleColorChange = (newColor: string) => {
    updateColor(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(inputValue);
    if (isValidHex) {
      updateColor(inputValue);
    } else {
      setInputValue(color);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    setInputValue(color);
  }, [color]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-2" ref={popoverRef}>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-md shadow-inner border border-gray-200"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono">{color}</span>
          </div>
          <span className="text-xs text-gray-400">▼</span>
        </button>
        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 p-4 bg-white rounded-xl shadow-xl border border-gray-200 z-50 flex flex-col items-center">
            <HexColorPicker color={color} onChange={handleColorChange} />
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              placeholder="#000000"
              className="w-full mt-4 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-center text-gray-700 focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}