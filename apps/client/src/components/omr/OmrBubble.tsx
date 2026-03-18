import { cn } from "../../lib/utils";

export type BubbleSize = "card" | "tutorial";

export function Bubble({
  label,
  selected,
  onToggle,
  highlighted,
}: {
  label: number;
  selected: boolean;
  onToggle: () => void;
  highlighted?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "flex items-center justify-center rounded-full font-bold shrink-0 cursor-pointer transition-colors duration-150 touch-manipulation",
        "text-[0.75rem]",
        selected
          ? "bg-gray-900 text-white"
          : highlighted
            ? "bg-[#bfdbfe] text-[#364F8E] ring-1 ring-[#5784F1]"
            : "bg-[#AAAAAA] text-white",
      )}
      style={{
        width: "1.25rem",
        height: "100%",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {label}
    </button>
  );
}
