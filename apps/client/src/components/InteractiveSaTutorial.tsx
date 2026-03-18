import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { OmrKeypad } from "./omr/OmrKeypad";
import { Tutorial, useTutorial } from "./tutorial/Tutorial";

const TUTORIAL_Q = 4; // 튜토리얼에서 사용할 주관식 문제 번호

type SubStep = 0 | 1 | 2 | 3;

interface SubStepConfig {
  hint: string;
  line1: string;
  line2: ReactNode;
  locked: boolean;
  showCompleteActive: boolean;
}

const STEPS: Record<SubStep, SubStepConfig> = {
  0: {
    hint: "다음으로 넘어가려면 직접 해보세요",
    line1: "주관식 답안을 입력하려면 입력할 곳을 터치해요",
    line2: (
      <>
        <span className="text-[#5784F1] font-black">{TUTORIAL_Q}번 문제의</span>{" "}
        답안을 입력해볼까요?
      </>
    ),
    locked: true,
    showCompleteActive: false,
  },
  1: {
    hint: "다음으로 넘어가려면 직접 해보세요",
    line1: "아무 숫자나 입력하고",
    line2: (
      <>
        <span className="text-[#5784F1] font-black">완료</span> 버튼을 눌러서
        답안을 작성해요
      </>
    ),
    locked: true,
    showCompleteActive: false,
  },
  2: {
    hint: "다음으로 넘어가려면 직접 해보세요",
    line1: "아무 숫자나 입력하고",
    line2: (
      <>
        <span className="text-[#5784F1] font-black">완료</span> 버튼을 눌러서
        답안을 작성해요
      </>
    ),
    locked: true,
    showCompleteActive: true, // 완료 버튼 파란색
  },
  3: {
    hint: "좋아요! 다음으로 넘어가볼까요?",
    line1: "입력한 답안을 수정하려면",
    line2: "해당 문제를 다시 한 번 터치해요",
    locked: false,
    showCompleteActive: false,
  },
};

// ── SA 패널 (12행 주관식 리스트) ─────────────────────────────────────────────
interface SaPanelProps {
  saAnswers: Record<number, string>;
  selectedQ: number | null;
  subStep: SubStep;
  onSelectQ: (q: number) => void;
  totalSa?: number;
}

function SaPanel({
  saAnswers,
  selectedQ,
  subStep,
  onSelectQ,
  totalSa = 12,
}: SaPanelProps) {
  const NUM_W = 28; // 번호 컬럼 너비 px

  return (
    /*
      사진 기준:
      - 크림 배경 #FFFDF1, 파란 border, rounded-2xl
      - 헤더 없음
      - 번호 컬럼: 파란 bg/20, 파란 텍스트
      - 행: flex-1 균등 높이
      - 4번 행: 파란 ring 강조 + "여기를 터치해줘요!" 파란 텍스트
      - 하단: "주관식 입력 부분입니다." 연한 텍스트
    */
    <div className="h-[570px] bg-[#FFFDF1] rounded-b-2xl p-[clamp(12px,1.5vw,24px)] pt-0 shadow-sm">
      <div
        className="flex flex-col border border-[#5784F1] bg-[#FFFDF1]"
        style={{ width: 360 }}
      >
        {/* 12행 */}
        <div className="flex flex-1 flex-col">
          {Array.from({ length: totalSa }, (_, i) => {
            const q = i + 1;
            const val = saAnswers[q] ?? "";
            const active = selectedQ === q;
            const isLast = i === totalSa - 1;
            const isHint = subStep === 0 && q === TUTORIAL_Q;

            return (
              <div
                key={q}
                className="relative flex w-full flex-1"
                style={{ minHeight: 44 }}
              >
                {/* 번호 셀 */}
                <div
                  className={cn(
                    "flex items-center justify-center font-bold text-[#5784F1]",
                    "bg-[rgba(87,132,241,0.15)] border-r border-[#5784F1]",
                    !isLast && "border-b border-[#5784F1]",
                    "shrink-0",
                  )}
                  style={{ width: NUM_W, fontSize: 13 }}
                >
                  {q}
                </div>

                {/* 입력 셀 */}
                <button
                  onClick={() => onSelectQ(q)}
                  className={cn(
                    "flex flex-1 items-center justify-center",
                    "cursor-pointer transition-colors duration-100",
                    !isLast && "border-b border-[#5784F1]",
                    /* 활성: 파란 ring */
                    active &&
                      "ring-2 ring-inset ring-[#5784F1] bg-[rgba(87,132,241,0.04)]",
                    /* 힌트: 파란 ring (활성보다 연함) */
                    isHint &&
                      !active &&
                      "ring-2 ring-inset ring-[#5784F1] bg-[rgba(87,132,241,0.04)]",
                    !active && !isHint && "hover:bg-[rgba(87,132,241,0.04)]",
                  )}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {/* 힌트 텍스트 (subStep 0 + q=4 + 미선택) */}
                  {isHint && !active && !val && (
                    <span className="text-[13px] font-semibold text-[#5784F1]">
                      여기를 터치해줘요!
                    </span>
                  )}
                  {/* 활성 + 값 없음 */}
                  {active && !val && (
                    <span className="text-[13px] font-medium text-[#B0C0E8]">
                      답안을 입력하세요
                    </span>
                  )}
                  {/* 값 있음 */}
                  {val && (
                    <span className="text-[13px] font-semibold text-[#364F8E]">
                      {val}
                    </span>
                  )}
                  {/* 기본 */}
                  {!active && !isHint && !val && (
                    <span className="text-[13px] font-medium text-[#C5D0E8]">
                      터치해서 주관식 답안 입력
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {/* 하단 안내 텍스트 */}
      <div
        className="flex items-center justify-center border-t border-[#5784F1] py-2 text-[#C5D0E8] font-medium"
        style={{ fontSize: 12 }}
      >
        주관식 입력 부분입니다.
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export function InteractiveSaTutorial() {
  const { setCanGoNext } = useTutorial();

  const [subStep, setSubStep] = useState<SubStep>(0);
  const [saAnswers, setSaAnswers] = useState<Record<number, string>>({});
  const [selectedQ, setSelectedQ] = useState<number | null>(null);
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    setCanGoNext(!STEPS[subStep].locked);
  }, [subStep, setCanGoNext]);

  // subStep 1 -> 2: 입력값이 생기면 자동 진행
  useEffect(() => {
    if (subStep === 1 && inputVal.length > 0) {
      setSubStep(2);
    }
  }, [inputVal, subStep]);

  const handleSelectQ = (q: number) => {
    if (subStep === 3) return; // 완료 후 수정 허용 (선택만)
    if (q !== TUTORIAL_Q && subStep < 3) return; // 4번만 허용
    if (subStep === 0) {
      setSelectedQ(q);
      setSubStep(1);
    } else if (subStep === 2) {
      setSelectedQ(q === selectedQ ? null : q);
    }
  };

  const handleInput = (ch: string) => {
    if (selectedQ === null) return;
    setInputVal((prev) => {
      const next = prev + ch;
      setSaAnswers((p) => ({ ...p, [selectedQ]: next }));
      return next;
    });
  };

  const handleDelete = () => {
    if (selectedQ === null) return;
    setInputVal((prev) => {
      const next = prev.slice(0, -1);
      setSaAnswers((p) => ({ ...p, [selectedQ]: next }));
      return next;
    });
  };

  const handleComplete = () => {
    if (subStep !== 2 || inputVal.length === 0) return;
    setSelectedQ(null);
    setSubStep(3);
  };

  const cfg = STEPS[subStep];

  /* 키패드 상태 */
  const keypadDisabled = subStep === 0 || subStep === 3;
  const keypadPlaceholder =
    subStep === 1
      ? `${TUTORIAL_Q}번 답안을 입력하세요`
      : "입력할 곳을 터치하세요";
  const keypadDisplayValue = keypadDisabled ? "" : inputVal;

  return (
    <>
      {/* SA 패널 + 키패드 */}
      <div className="flex items-center justify-center gap-10 ">
        <SaPanel
          saAnswers={saAnswers}
          selectedQ={selectedQ}
          subStep={subStep}
          onSelectQ={handleSelectQ}
        />
        <OmrKeypad
          value={keypadDisplayValue}
          onInput={handleInput}
          onDelete={handleDelete}
          onComplete={handleComplete}
          disabled={keypadDisabled}
          completeActive={subStep === 2 && inputVal.length > 0}
          showDescription={false}
          placeholder={keypadPlaceholder}
        />
      </div>

      {/* ── 안내 텍스트 ── */}
      <div className="shrink-0 text-center px-8 pb-4">
        <div className="flex flex-col items-center gap-0.5 mb-2">
          <span className="text-gray-300 text-xs">∧</span>
          <span className="text-gray-400 text-xs">{cfg.hint}</span>
        </div>
        <p className="font-bold text-gray-900 leading-snug text-[clamp(18px,1.3vw,24px)]">
          {cfg.line1}
        </p>
        <p className="font-bold text-gray-900 leading-snug text-[clamp(18px,1.3vw,24px)]">
          {cfg.line2}
        </p>
      </div>
      <div className="flex items-center justify-center overflow-hidden">
        <div className="flex justify-between gap-4">
          <Tutorial.Footer showPrev showSkip />
        </div>
      </div>
    </>
  );
}
