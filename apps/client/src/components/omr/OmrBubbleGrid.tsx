import { cn } from "../../lib/utils";
import type { McAnswers } from "../../types/omr";
import { Bubble, type BubbleSize } from "./OmrBubble";

interface OmrBubbleGridProps {
  totalQuestions?: number;
  questionsPerGroup?: number;
  choices?: number;
  answers: McAnswers;
  onToggle: (question: number, choice: number) => void;
  size?: BubbleSize;
  highlightQuestion?: number;
  highlightChoice?: number;
  className?: string;
}

export function OmrBubbleGrid({
  totalQuestions = 30,
  questionsPerGroup = 10,
  choices = 5,
  answers,
  onToggle,
  size = "card",
  highlightQuestion,
  highlightChoice,
  className,
}: OmrBubbleGridProps) {
  const numGroups = Math.ceil(totalQuestions / questionsPerGroup);
  const DASH_AFTER = Math.floor(questionsPerGroup / 2) - 1;

  /* size별 수치 */
  const numColW = size === "card" ? "w-[1.75rem]" : "w-[2.25rem]";
  const numFontSz = size === "card" ? "text-sm" : "text-base";
  const bubbleGap = size === "card" ? "gap-x-[0.625rem]" : "gap-x-[0.75rem]";
  const rowPadY = size === "card" ? "py-[6px]" : "py-[8px]";
  const rowFirst = size === "card" ? "pt-[12px]" : "pt-[14px]";
  const rowLast = size === "card" ? "pb-[12px]" : "pb-[14px]";

  /* 바코드: 5개 막대, 굵기 교차 */
  const BARS = 5;
  const barH = size === "card" ? 14 : 18;
  const barcodeH = size === "card" ? 24 : 28;

  return (
    <div className={cn("flex h-full flex-col ", className)}>
      {/* ── 버블 그리드 영역 ── */}
      <div className="flex flex-1 flex-row min-h-0">
        {Array.from({ length: numGroups }, (_, gi) => {
          const startQ = gi * questionsPerGroup + 1;
          const endQ = Math.min(startQ + questionsPerGroup - 1, totalQuestions);
          const rows = endQ - startQ + 1;
          const isOddGrp = gi % 2 === 0; // 체커보드: 그룹0, 그룹2
          const isLastGroup = gi === numGroups - 1; // 마지막 요소인지 확인

          return (
            <div key={gi} className={cn("flex h-full flex-1 min-w-0")}>
              {/* 문제 번호 컬럼 */}
              <div
                className={cn(
                  "flex flex-col items-center justify-center py-[6px] shrink-0",
                  "bg-[rgba(87,132,241,0.20)]",
                  numColW,
                  "border-r border-[#5784F1]",
                  "border-l border-r border-[#5784F1]",
                )}
              >
                {Array.from({ length: rows }, (_, ri) => (
                  <div
                    key={ri}
                    className={cn(
                      "flex w-full flex-1 items-center justify-center",
                      "text-center font-semibold text-[#364F8E]",
                      numFontSz,
                    )}
                  >
                    {startQ + ri}
                  </div>
                ))}
              </div>
              {/* 버블 컬럼 */}
              <div
                className={cn(
                  "flex h-full flex-1 flex-col min-w-0 border-[#5784F1]",
                  isLastGroup && "border-r",
                )}
              >
                {Array.from({ length: rows }, (_, ri) => {
                  const qNum = startQ + ri;
                  const selected = answers[qNum] ?? [];

                  /* 배경 교차 로직 */
                  const hasBg = isOddGrp ? ri >= 5 : ri < 5;

                  return (
                    <div
                      key={qNum}
                      className={cn(
                        "flex w-full flex-1 items-center justify-center pl-1.5 pr-1.5",
                        rowPadY,
                        ri === 0 && rowFirst,
                        ri === rows - 1 && rowLast,
                        ri === DASH_AFTER &&
                          "border-b border-dashed border-[#5784F1]",
                        hasBg && "bg-[rgba(87,132,241,0.10)]",
                        bubbleGap,
                      )}
                    >
                      {Array.from({ length: choices }, (_, ci) => {
                        const choiceNum = ci + 1;
                        return (
                          <Bubble
                            key={ci}
                            label={choiceNum}
                            selected={selected.includes(choiceNum)}
                            onToggle={() => onToggle(qNum, choiceNum)}
                            highlighted={
                              qNum === highlightQuestion &&
                              choiceNum === highlightChoice
                            }
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 바코드 행 ── */}
      <div
        className="flex shrink-0 border-t border-[#5784F1] border-r border-r-[#faf9f0]"
        style={{ height: barcodeH }}
      >
        {Array.from({ length: numGroups }, (_, gi) => (
          <div
            key={gi}
            className={cn("flex flex-1 items-center justify-center")}
            style={{ gap: 25, marginLeft: 37 }}
          >
            {Array.from({ length: BARS }, (_, bi) => (
              <div
                key={bi}
                className="bg-black"
                style={{
                  width: 7,
                  height: barH,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
