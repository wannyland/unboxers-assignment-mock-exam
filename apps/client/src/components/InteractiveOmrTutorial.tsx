import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";
import type { McAnswers } from "../types/omr";
import { OmrBubbleGrid } from "./omr/OmrBubbleGrid";
import { Tutorial, useTutorial } from "./tutorial/Tutorial";

type SubStep = 0 | 1 | 2;

interface Config {
  hint: string;
  text: string;
  emphasis: ReactNode;
  locked: boolean;
}

const mkEmphasis = (q: number, c: number, suffix: string): ReactNode => (
  <>
    <span className="text-blue-600 font-black">{q}번 문제에</span>{" "}
    <span className="text-blue-600 font-black">{c}번</span>
    {suffix}
  </>
);

const STEPS: Record<SubStep, Config> = {
  0: {
    hint: "다음으로 넘어가려면 직접 해보세요",
    text: "객관식 답안은 화면을 터치해서 마킹해요",
    emphasis: mkEmphasis(15, 3, "으로 답안을 마킹해보세요"),
    locked: true,
  },
  1: {
    hint: "다음으로 넘어가려면 직접 해보세요",
    text: "마킹한 곳을 한 번 더 터치하면 지울 수 있어요",
    emphasis: mkEmphasis(15, 3, " 답안을 지워보세요"),
    locked: true,
  },
  2: {
    hint: "좋아요! 다음으로 넘어가볼까요?",
    text: "2개 이상의 답안을 골라야 하는 문제에서는",
    emphasis: <span className="font-black">두 답안 모두 마킹하면 돼요</span>,
    locked: false,
  },
};

export function InteractiveOmrTutorial() {
  const { setCanGoNext } = useTutorial();
  const [subStep, setSubStep] = useState<SubStep>(0);
  const [answers, setAnswers] = useState<McAnswers>({});

  useEffect(() => {
    setCanGoNext(!STEPS[subStep].locked);
  }, [subStep, setCanGoNext]);

  const handleToggle = (q: number, choice: number) => {
    setAnswers((prev) => {
      const cur = prev[q] ?? [];
      const selected = cur.includes(choice);
      const next = selected
        ? cur.filter((c) => c !== choice)
        : [...cur, choice];

      if (subStep === 0 && q === 15 && choice === 3 && !selected)
        setTimeout(() => setSubStep(1), 250);
      else if (subStep === 1 && q === 15 && choice === 3 && selected)
        setTimeout(() => setSubStep(2), 250);

      return { ...prev, [q]: next };
    });
  };

  const cfg = STEPS[subStep];

  return (
    <>
      {/* OMR 그리드 */}
      <div className="overflow-y-auto flex items-start justify-center mt-0">
        <div className="h-[600px] bg-[#faf9f0] rounded-2xl p-[clamp(12px,1.5vw,24px)] pt-0 pb-0 shadow-sm">
          <OmrBubbleGrid
            totalQuestions={30}
            answers={answers}
            onToggle={handleToggle}
            size="tutorial"
            highlightQuestion={subStep < 2 ? 15 : undefined}
            highlightChoice={subStep < 2 ? 3 : undefined}
          />
        </div>
      </div>
      {/* 안내 텍스트 */}
      <div
        className={cn(
          "shrink-0 text-center",
          "mt-5",
          "px-[clamp(20px,2vw,40px)] pb-[clamp(8px,0.8vh,14px)]",
        )}
      >
        <div className="flex flex-col items-center gap-0.5 mb-2">
          <span
            className="text-gray-300"
            style={{ fontSize: "var(--text-xs)" }}
          >
            ∧
          </span>
          <span
            className="text-black-900"
            style={{ fontSize: "var(--text-xl)" }}
          >
            {cfg.hint}
          </span>
        </div>
        <p
          className="font-bold text-gray-900 leading-snug mt-10"
          style={{ fontSize: 37 }}
        >
          {cfg.text}
        </p>
        <p
          className="font-bold text-gray-900 leading-snug mb-10"
          style={{ fontSize: 37 }}
        >
          {cfg.emphasis}
        </p>
      </div>
      <div className="flex items-center justify-center overflow-hidden">
        <div className="flex justify-between gap-4">
          <Tutorial.Footer showPrev showSkip noMarginTop />
        </div>
      </div>
    </>
  );
}
