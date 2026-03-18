import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "blue";
  /**
   * tutorial: 243 × 52  (튜토리얼 공통)
   * exit:     120 × 44  (종료하기)
   * sm/md/lg: 가변 크기 (기타)
   */
  size?: "tutorial" | "exit" | "sm" | "md" | "lg";
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-[18px]",
        "select-none touch-manipulation transition-all duration-150",
        "disabled:pointer-events-none disabled:opacity-40",

        /* ── size ─────────────────────────────── */
        size === "tutorial" && "w-[243px] h-[52px] text-[15px]",
        size === "exit" && "w-[120px] h-[44px] text-[14px]",
        size === "sm" && "h-[44px] px-5 text-[13px]",
        size === "md" && "h-[56px] px-8 text-[15px]",
        size === "lg" && "h-[64px] px-10 text-[16px]",

        /* ── variant ───────────────────────────── */
        variant === "primary" && [
          "bg-gradient-to-b from-[#3d3d3d] to-[#1a1a1a] text-white",
          "shadow-[0_2px_10px_rgba(0,0,0,0.28)]",
          "hover:from-[#4a4a4a] hover:to-[#222]",
          "active:scale-[0.985] active:shadow-none",
        ],
        variant === "secondary" && [
          "bg-white text-gray-900",
          "shadow-[0px_2px_rgba(0,0,0,0.03)]",
          "hover:bg-gray-50 active:bg-gray-100 active:scale-[0.985]",
        ],
        variant === "ghost" && [
          "bg-transparent text-gray-600 border-none shadow-none",
          "hover:bg-gray-100 active:bg-gray-200",
        ],
        variant === "blue" && [
          "bg-[#5784F1] text-white border-none",
          "hover:bg-[#4a72e0] active:bg-[#3d62d0] active:scale-[0.985]",
        ],

        className,
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = "Button";
