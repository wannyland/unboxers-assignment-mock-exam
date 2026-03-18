import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { getAssetUrl } from "../../lib/assets";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";

// ── Context ───────────────────────────────────────────────────────────────────
export interface TutorialCtxValue {
  step: number;
  totalSteps: number;
  canGoNext: boolean;
  setCanGoNext: (v: boolean) => void;
  goNext: () => void;
  goPrev: () => void;
  skip: () => void;
}

const TCtx = createContext<TutorialCtxValue | null>(null);

export function useTutorial(): TutorialCtxValue {
  const c = useContext(TCtx);
  if (!c) throw new Error("useTutorial must be used inside <Tutorial>");
  return c;
}

// ── Root ──────────────────────────────────────────────────────────────────────
function TutorialRoot({
  children,
  onSkip,
  onComplete,
}: {
  children: ReactNode;
  onSkip?: () => void;
  onComplete?: () => void;
}) {
  const steps = React.Children.toArray(children);
  const [step, setStep] = useState(0);
  const [canGoNext, setCan] = useState(true);

  const value: TutorialCtxValue = {
    step,
    totalSteps: steps.length,
    canGoNext,
    setCanGoNext: setCan,
    goNext() {
      if (!canGoNext) return;
      if (step >= steps.length - 1) onComplete?.();
      else {
        setStep((s) => s + 1);
        setCan(true);
      }
    },
    goPrev() {
      setStep((s) => Math.max(0, s - 1));
      setCan(true);
    },
    skip() {
      onSkip?.();
    },
  };

  return (
    <TCtx.Provider value={value}>
      <div className="h-full flex flex-col bg-[#F5F5F5]">{steps[step]}</div>
    </TCtx.Provider>
  );
}

// ── Step ──────────────────────────────────────────────────────────────────────
function Step({ children }: { children: ReactNode }) {
  return <div className="flex-1 flex flex-col overflow-hidden">{children}</div>;
}

// ── IllustrationArea ──────────────────────────────────────────────────────────
function IllustrationArea({
  children,
  direction = "row",
  className,
}: {
  children?: ReactNode;
  direction?: "row" | "column";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex-1 flex items-center justify-center overflow-hidden",
        direction === "row" ? "flex-row" : "flex-col",
        "gap-[clamp(16px,1.5vw,32px)]",
        "px-[clamp(24px,2.5vw,48px)] py-[clamp(20px,2vh,40px)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── ImageSlot ─────────────────────────────────────────────────────────────────
/**
 * 이미지 슬롯 사용법:
 *   1) src prop에 import된 이미지 URL 전달
 *      import bookImg from '../assets/book-stack.png'
 *      <Tutorial.ImageSlot src={bookImg} ... />
 *
 *   2) fileName prop에 파일명만 전달 (/src/assets/ 폴더 기준)
 *      <Tutorial.ImageSlot fileName="book-stack.png" ... />
 */
function ImageSlot({
  src,
  fileName,
  alt = "",
  width,
  height,
  label,
}: {
  src?: string;
  fileName?: string;
  alt?: string;
  width: string | number;
  height: string | number;
  label?: string;
}) {
  const resolvedSrc = src ?? (fileName ? getAssetUrl(fileName) : undefined);

  if (resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        style={{ width, height, flexShrink: 0, objectFit: "contain" }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100 text-gray-400 text-sm shrink-0"
      style={{ width, height }}
    >
      {fileName ?? label ?? "이미지"}
    </div>
  );
}

// ── TextArea ──────────────────────────────────────────────────────────────────
function TextArea({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-center shrink-0 px-[clamp(20px,2vw,40px)] pb-[clamp(12px,1.2vh,20px)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Heading ───────────────────────────────────────────────────────────────────
function Heading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("font-black leading-snug text-[2rem]", className)}>
      {children}
    </p>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({
  showPrev = true,
  showSkip = true,
  noMarginTop = false,
}: {
  showPrev?: boolean;
  showSkip?: boolean;
  noMarginTop?: boolean;
}) {
  const { step, goNext, goPrev, skip, canGoNext } = useTutorial();
  const isSpread = step > 0;

  if (isSpread) {
    return (
      <footer
        className={cn(
          "w-full shrink-0 grid grid-cols-2 items-center px-8",
          !noMarginTop && "mt-20", // noMarginTop이 false일 때만 mt-20 적용
        )}
      >
        {/* 왼쪽 */}
        <div className="flex">
          {showPrev && (
            <Button variant="secondary" size="tutorial" onClick={goPrev}>
              ‹ 이전으로
            </Button>
          )}
        </div>

        {/* 오른쪽 */}
        <div className="flex gap-4">
          {showSkip && (
            <Button variant="secondary" size="tutorial" onClick={skip}>
              튜토리얼 건너뛰기
            </Button>
          )}
          <Button
            variant="primary"
            size="tutorial"
            onClick={goNext}
            disabled={!canGoNext}
          >
            다음
          </Button>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full shrink-0 flex items-center justify-center gap-4 px-8 pb-12 pt-4">
      {showSkip && (
        <Button variant="secondary" size="tutorial" onClick={skip}>
          튜토리얼 건너뛰기
        </Button>
      )}
      <Button
        variant="primary"
        size="tutorial"
        onClick={goNext}
        disabled={!canGoNext}
      >
        다음
      </Button>
    </footer>
  );
}

// ── Compound export ───────────────────────────────────────────────────────────
export const Tutorial = Object.assign(TutorialRoot, {
  Step,
  IllustrationArea,
  ImageSlot,
  TextArea,
  Heading,
  Footer,
});
