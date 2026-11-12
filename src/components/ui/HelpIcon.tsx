"use client";

type HelpIconProps = {
  label: string;
  isOpen: boolean;
  controlsId: string;
  onClick: () => void;
};

export default function HelpIcon({
  label,
  isOpen,
  controlsId,
  onClick,
}: HelpIconProps) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={controlsId}
      onClick={onClick}
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-[11px] font-semibold text-gray-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    >
      ?
    </button>
  );
}
