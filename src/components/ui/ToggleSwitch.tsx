"use client";

import { useId, useState } from "react";
import HelpIcon from "./HelpIcon";

interface ToggleSwitchProps {
  label: string;
  help?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function ToggleSwitch({
  label,
  help,
  checked,
  onChange,
}: ToggleSwitchProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const controlId = useId();
  const helpId = `${controlId}-help`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <label htmlFor={controlId} className="mr-1 cursor-pointer select-none font-medium text-gray-700">
            {label}
          </label>
          {help && (
            <HelpIcon
              label={label}
              isOpen={isHelpOpen}
              controlsId={helpId}
              onClick={() => setIsHelpOpen((previous) => !previous)}
            />
          )}
        </div>
        <label htmlFor={controlId} className="relative shrink-0 cursor-pointer">
          <input
            id={controlId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      {help && (
        <p
          id={helpId}
          role="tooltip"
          hidden={!isHelpOpen}
          className="rounded-md bg-blue-50 px-3 py-2 text-xs leading-relaxed text-blue-900"
        >
          {help}
        </p>
      )}
    </div>
  );
}