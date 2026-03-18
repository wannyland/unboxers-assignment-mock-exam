import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import type { SubmitAnswer } from "../../types/api";
import type {
  McAnswers,
  OmrConfig,
  SaAnswers,
  StudentData,
} from "../../types/omr";
import { Tutorial } from "../tutorial";
import { Bubble } from "./OmrBubble";
import { OmrKeypad } from "./OmrKeypad";

interface OmrCardCtx {
  config: OmrConfig;
  mcAnswers: McAnswers;
  saAnswers: SaAnswers;
  selectedSaQ: number | null;
  toggleMc: (q: number, choice: number) => void;
  selectSaQ: (q: number) => void;
  inputChar: (ch: string) => void;
  deleteChar: () => void;
  confirmSa: () => void;
  getSubmitAnswers: () => SubmitAnswer[];
}

const Ctx = createContext<OmrCardCtx | null>(null);
export const useOmrCard = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOmrCard must be inside <OmrCard>");
  return c;
};

const DEFAULT: OmrConfig = {
  totalMcQuestions: 30,
  totalSaQuestions: 12,
  mcChoicesPerQuestion: 5,
  examDurationMinutes: 60,
};

function OmrCardRoot({
  children,
  config: cp,
  initialMcAnswers = {},
  initialSaAnswers = {},
  onMcChange,
  onSaChange,
}: {
  children: ReactNode;
  config?: Partial<OmrConfig>;
  initialMcAnswers?: McAnswers;
  initialSaAnswers?: SaAnswers;
  onMcChange?: (a: McAnswers) => void;
  onSaChange?: (a: SaAnswers) => void;
}) {
  const config = { ...DEFAULT, ...cp };
  const [mc, setMc] = useState<McAnswers>(initialMcAnswers);
  const [sa, setSa] = useState<SaAnswers>(initialSaAnswers);
  const [selSa, setSelSa] = useState<number | null>(null);

  // 1. 객관식 마킹 토글 (Multiple Choice)
  const toggleMc = (questionId: number, choiceId: number) => {
    setMc((prev) => {
      const currentChoices = prev[questionId] ?? [];
      const isAlreadySelected = currentChoices.includes(choiceId);

      // 이미 선택됐으면 제거, 아니면 추가
      const nextChoices = isAlreadySelected
        ? currentChoices.filter((id) => id !== choiceId)
        : [...currentChoices, choiceId];

      const updatedMc = { ...prev, [questionId]: nextChoices };

      // 콜백 실행 및 상태 반환
      onMcChange?.(updatedMc);
      return updatedMc;
    });
  };

  // 2. 주관식 문항 선택 (Short Answer)
  const selectSaQ = (questionId: number) => {
    // 이미 선택된 문항을 다시 누르면 해제(null), 아니면 선택
    setSelSa((prevSelected) =>
      prevSelected === questionId ? null : questionId,
    );
  };

  // 3. 주관식 글자 입력
  const inputChar = (char: string) => {
    if (selSa === null) return; // 선택된 문항이 없으면 중단

    setSa((prevAnswers) => {
      const currentText = prevAnswers[selSa] ?? "";
      const updatedAnswers = { ...prevAnswers, [selSa]: currentText + char };

      onSaChange?.(updatedAnswers);
      return updatedAnswers;
    });
  };

  // 4. 주관식 글자 삭제 (Backspace)
  const deleteChar = () => {
    if (selSa === null) return;

    setSa((prevAnswers) => {
      const currentText = prevAnswers[selSa] ?? "";
      // 마지막 글자 한 개 제거
      const updatedAnswers = {
        ...prevAnswers,
        [selSa]: currentText.slice(0, -1),
      };

      onSaChange?.(updatedAnswers);
      return updatedAnswers;
    });
  };
  const confirmSa = () => setSelSa(null);

  const getSubmitAnswers = (): SubmitAnswer[] => {
    const result: SubmitAnswer[] = [];
    // 객관식: 선택한 보기 중 첫 번째를 제출 (복수 선택 시 첫 번째)
    Object.entries(mc).forEach(([q, choices]) => {
      if (choices.length > 0) {
        result.push({
          answerType: "objective",
          number: Number(q),
          answer: Number(choices[0]),
        });
      }
    });
    // 주관식
    Object.entries(sa).forEach(([q, val]) => {
      if (val.trim()) {
        result.push({
          answerType: "subjective",
          number: Number(q),
          answer: Number(val),
        });
      }
    });
    return result;
  };

  return (
    <Ctx.Provider
      value={{
        config,
        mcAnswers: mc,
        saAnswers: sa,
        selectedSaQ: selSa,
        toggleMc,
        selectSaQ,
        inputChar,
        deleteChar,
        confirmSa,
        getSubmitAnswers,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

interface StudentForm {
  name: string;
  school: string;
  grade: number | null;
  studentNumber: number | null;
  seatNumber: number | null;
}

// ── StudentInfo ───────────────────────────────────────────────────────────────
function StudentInfo({
  data,
  academyName = "학원",
  academySubtitle = "학생답안 입력용\nOMR 카드",
  className,
  studentForm,
  onStudentFormChange,
}: {
  data: StudentData;
  academyName?: string;
  academySubtitle?: string;
  className?: string;
  studentForm?: StudentForm;
  onStudentFormChange?: (f: StudentForm) => void;
}) {
  const sf = studentForm;
  const setSf = onStudentFormChange;

  // 입력 가능한 필드: 성명, 학교, 좌석번호
  const rows: Array<{
    label: string;
    value: string;
    editable?: keyof Pick<StudentForm, "name" | "school" | "seatNumber">;
  }> = [
    { label: "시험", value: data.examName },
    { label: "과목", value: data.subject },
    { label: "성명", value: sf?.name ?? data.name, editable: "name" },
    { label: "학교", value: sf?.school ?? data.school, editable: "school" },
    {
      label: "좌석",
      value: sf?.seatNumber != null ? String(sf.seatNumber) : "",
      editable: "seatNumber",
    },
    { label: "감독", value: data.supervisor },
  ];

  const cellStyle = {
    width: 28,
    height: 40,
    writingMode: "vertical-rl" as const,
    textOrientation: "upright" as const,
    letterSpacing: "2px",
    padding: "2px 0",
  };

  return (
    <div className={cn("flex h-full flex-col shrink-0", className)}>
      {/* 시험~감독 표 (200px × 240px) */}
      <table
        className="border-collapse border-t border-[#5784F1] [&_td]:border-l [&_td]:border-b [&_td]:border-[#5784F1] shrink-0"
        style={{ width: 200, tableLayout: "fixed" }}
      >
        <tbody>
          {rows.map(({ label, value, editable }) => (
            <tr key={label}>
              <td
                className="py-0 text-[11px] font-bold text-[#364F8E] align-middle text-center"
                style={{
                  width: 28,
                  height: 40,
                  writingMode: "vertical-rl",
                  textOrientation: "upright",
                  letterSpacing: "2px",
                  padding: "2px 0",
                }}
              >
                {label}
              </td>
              <td
                className="flex items-center justify-center px-2 py-0 text-xs font-semibold text-[#364F8E] align-middle"
                style={{ height: 40 }}
              >
                {editable && sf && setSf ? (
                  <input
                    type={editable === "seatNumber" ? "number" : "text"}
                    value={
                      editable === "seatNumber"
                        ? (sf.seatNumber ?? "")
                        : (sf[editable as "name" | "school"] ?? "")
                    }
                    onChange={(e) => {
                      if (editable === "seatNumber") {
                        const v =
                          e.target.value === "" ? null : Number(e.target.value);
                        setSf({ ...sf, seatNumber: v });
                      } else {
                        setSf({ ...sf, [editable]: e.target.value });
                      }
                    }}
                    placeholder={label + " 입력"}
                    className="w-full h-full bg-transparent px-2 text-xs font-semibold text-[#364F8E] outline-none placeholder:text-[#B0C0E8] focus:bg-[rgba(87,132,241,0.05)] text-center"
                    style={{ border: "none" }}
                  />
                ) : (
                  <span className="px-2">{value}</span>
                )}
                {/* {value} */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 로고 영역 */}
      <div
        className="flex flex-1 flex-col items-center justify-center pb-4 opacity-85"
        style={{ width: 200 }}
      >
        <Tutorial.ImageSlot
          fileName="omr-logo.png"
          width="132px"
          height="80px"
          label="OMR 로고 이미지"
        />
        <span className="text-[#364F8E] mt-4 text-center text-[1.4rem] leading-[1.1] font-bold whitespace-pre-wrap">
          {academySubtitle}
        </span>
        <span className="text-[#364F8E] mt-3 text-center text-[0.7rem] leading-[1.3] font-semibold whitespace-pre-wrap">{`객관식 답안은 터치해서 칠하고, 주관식\n답안은 터치한 뒤 키패드로 입력해요.`}</span>
        <span className="text-[#364F8E] mt-3 text-center text-[0.7rem] leading-[1.3] font-semibold whitespace-pre-wrap">{`답안을 작성하지 않고 제출하면 별도의\n경고 없이 오답으로 처리되니 주의하세요.`}</span>
      </div>
    </div>
  );
}

// ── OmrBoard ──────────────────────────────────────────────────────────────────
function OmrBoard({
  highlightQuestion,
  highlightChoice,
  onDigitChange,
}: {
  highlightQuestion?: number;
  highlightChoice?: number;
  /** digit(학년/번호) 선택 변경 콜백 */
  onDigitChange?: (
    grade: number | null,
    num1: number | null,
    num2: number | null,
  ) => void;
}) {
  const { config, mcAnswers, saAnswers, selectedSaQ, toggleMc, selectSaQ } =
    useOmrCard();

  const [grade, setGradeState] = useState<number | null>(null);
  const [num1, setNum1State] = useState<number | null>(null);
  const [num2, setNum2State] = useState<number | null>(null);

  const setGrade = (v: number | null) => {
    setGradeState(v);
    onDigitChange?.(v, num1, num2);
  };
  const setNum1 = (v: number | null) => {
    setNum1State(v);
    onDigitChange?.(grade, v, num2);
  };
  const setNum2 = (v: number | null) => {
    setNum2State(v);
    onDigitChange?.(grade, num1, v);
  };

  const totalQ = config.totalMcQuestions; // 30
  const groupSize = 10;
  const numGroups = Math.ceil(totalQ / groupSize);
  const questionCount = 5;
  const BUBBLE_GAP = "0.625rem";
  const NUM_COL_W = 28; // px
  const BUBBLE_W = "1.25rem";

  // 각 MC 그룹 렌더
  const renderMcGroup = (gi: number) => {
    const startQ = gi * groupSize + 1;
    const endQ = Math.min(startQ + groupSize - 1, totalQ);
    const rows = endQ - startQ + 1;
    const isOddGrp = gi % 2 === 0;

    return (
      <div key={gi} className="flex h-full flex-1">
        {/* 번호 컬럼 */}
        <div
          className={cn(
            "flex h-full flex-col items-center justify-center py-1.5",
            "bg-[rgba(87,132,241,0.20)]",
            gi === 0
              ? "border-r border-[#5784F1]"
              : "border-l border-r border-[#5784F1]",
          )}
          style={{ width: NUM_COL_W }}
        >
          {Array.from({ length: rows }, (_, ri) => (
            <div
              key={ri}
              className="flex w-full flex-1 items-center justify-center text-center text-sm font-semibold text-[#364F8E]"
            >
              {startQ + ri}
            </div>
          ))}
        </div>

        {/* 버블 컬럼 */}
        <div className="flex h-full flex-1 flex-col">
          {Array.from({ length: rows }, (_, ri) => {
            const qNum = startQ + ri;
            const selected = mcAnswers[qNum] ?? [];
            const isFirst = ri === 0;
            const isLast = ri === rows - 1;
            const isDash = ri === 4;
            const hasBg = isOddGrp ? ri >= 5 : ri < 5;

            return (
              <div
                key={qNum}
                className={cn(
                  "flex w-full flex-1 items-center justify-center",
                  "py-1.5",
                  isFirst && "pt-3",
                  isLast && "pb-3",
                  isDash && "border-b border-dashed border-[#5784F1]",
                  hasBg && "bg-[rgba(87,132,241,0.10)]",
                )}
                style={{ gap: BUBBLE_GAP }}
              >
                {Array.from(
                  { length: config.mcChoicesPerQuestion },
                  (_, ci) => {
                    const choiceNum = ci + 1;
                    return (
                      <Bubble
                        key={ci}
                        label={choiceNum}
                        selected={selected.includes(choiceNum)}
                        onToggle={() => toggleMc(qNum, choiceNum)}
                        highlighted={
                          qNum === highlightQuestion &&
                          choiceNum === highlightChoice
                        }
                      />
                    );
                  },
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // digit 버블 헬퍼
  const DigitBubble = ({
    label,
    selected,
    onSelect,
    highlighted = false, // 기본값 설정
  }: {
    label: number;
    selected: boolean;
    onSelect: () => void;
    highlighted?: boolean;
  }) => (
    <button
      onClick={onSelect}
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
        height: "2.75rem",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {label}
    </button>
  );

  const BARCODE_MARKS = 3;

  return (
    <div className="flex h-full flex-col flex-1 min-w-0 border border-[#5784F1]">
      {/* ── 헤더 행 ── */}
      <div
        className="flex shrink-0 border-b border-[#5784F1]"
        style={{ height: 40 }}
      >
        <div
          className="flex shrink-0 border-r border-[#5784F1]"
          style={{ width: NUM_COL_W * 3 }}
        >
          {/* 학년 header */}
          <div className="flex flex-col items-center justify-center font-bold text-[#364F8E] text-xs border-r border-[#5784F1] pr-2 pl-2 ">
            <span>학</span>
            <span>년</span>
          </div>
          {/* 번호 header */}
          <div className="flex items-center justify-center font-bold text-[#364F8E] text-xs flex-1">
            번호
          </div>
        </div>

        {/* 객관식 답안 헤더 */}
        <div className="flex flex-1 items-center justify-center font-bold text-[#364F8E] text-[1.0625rem] tracking-[1.0625rem] border-r border-[#5784F1]">
          객관식답안
        </div>

        {/* 주관식 답안 헤더 */}
        <div
          className="flex items-center justify-center font-bold text-[#364F8E] text-[1.0625rem] tracking-[1.0625rem]"
          style={{ width: "22.5rem" }}
        >
          주관식답안
        </div>
      </div>

      {/* ── 콘텐츠 행 ── */}
      <div className="flex flex-1 flex-row min-h-0">
        {/* digit 열 (학년 + 번호1 + 번호2) */}
        <div
          className="flex h-full shrink-0 border-r border-[#5784F1]"
          style={{ width: NUM_COL_W * 3 }}
        >
          {/* 학년: 1, 2, 3 */}
          <div
            className="flex h-full flex-col items-center py-2 border-r border-[#5784F1] pt-3"
            style={{ width: NUM_COL_W, gap: BUBBLE_GAP }}
          >
            {[1, 2, 3].map((d) => (
              <DigitBubble
                key={d}
                label={d}
                selected={grade === d}
                onSelect={() => setGrade(grade === d ? null : d)}
              />
            ))}
          </div>

          {/* 번호 십의자리: 0–9 */}
          <div
            className="flex h-full flex-col items-center justify-around py-2 "
            style={{ width: NUM_COL_W }}
          >
            {Array.from({ length: 10 }, (_, d) => (
              <DigitBubble
                key={d}
                label={d}
                selected={num1 === d}
                onSelect={() => setNum1(num1 === d ? null : d)}
              />
            ))}
          </div>

          {/* 번호 일의자리: 0–9 */}
          <div
            className="flex h-full flex-col items-center justify-around py-2"
            style={{ width: NUM_COL_W }}
          >
            {Array.from({ length: 10 }, (_, d) => (
              <DigitBubble
                key={d}
                label={d}
                selected={num2 === d}
                onSelect={() => setNum2(num2 === d ? null : d)}
              />
            ))}
          </div>
        </div>

        {/* MC 그리드 */}
        <div className="flex h-full flex-row flex-1 border-r border-[#5784F1]">
          {Array.from({ length: numGroups }, (_, gi) => renderMcGroup(gi))}
        </div>

        {/* SA 열 */}
        <div className="flex h-full flex-col" style={{ width: "22.5rem" }}>
          {Array.from({ length: config.totalSaQuestions }, (_, i) => {
            const q = i + 1;
            const val = saAnswers[q] ?? "";
            const active = selectedSaQ === q;
            const isLast = i === config.totalSaQuestions - 1;

            return (
              <div key={q} className="relative flex w-full flex-1">
                <div
                  className={cn(
                    "flex h-full items-center justify-center text-sm font-semibold text-[#364F8E]",
                    "bg-[rgba(87,132,241,0.20)] border-r border-[#5784F1]",
                    !isLast && "border-b border-[#5784F1]",
                  )}
                  style={{ width: NUM_COL_W }}
                >
                  {q}
                </div>
                <button
                  onClick={() => selectSaQ(q)}
                  className={cn(
                    "flex h-full flex-1 items-center justify-center cursor-pointer transition-colors duration-100",
                    !isLast && "border-b border-[#5784F1]",
                    active ? "bg-blue-50" : "hover:bg-gray-50",
                  )}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <span
                    className={cn(
                      "absolute text-sm font-semibold",
                      val ? "text-[#364F8E]" : "text-[#B0C0E8]",
                    )}
                  >
                    {val || "터치해서 주관식 답안 입력"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 바코드 행 ── */}
      <div
        className="flex shrink-0 border-t border-[#5784F1]"
        style={{ height: 24 }}
      >
        {/* digit 열 하단 바코드 */}
        <div
          className="flex items-center justify-around shrink-0 gap-[6px]"
          style={{ width: NUM_COL_W * 3, paddingLeft: 4, paddingRight: 4 }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-5 bg-black" style={{ width: "0.4rem" }} />
          ))}
        </div>

        {/* MC 열 하단 바코드 (3 그룹) */}
        <div className="flex flex-1 items-center">
          {Array.from({ length: numGroups }, (_, gi) => (
            <div
              key={gi}
              className="flex flex-1 items-center justify-center gap-[23px] ml-7"
            >
              {Array.from({ length: questionCount }, (_, i) => (
                <div
                  key={i}
                  className="h-5 bg-black"
                  style={{ width: "0.4rem" }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* SA 하단 */}
        <div
          className="flex items-center justify-center pr-3 text-[#858585] font-semibold"
          style={{ width: "22.5rem", fontSize: 13 }}
        >
          선 아래부분은 절대 칠하지 말 것.
        </div>
      </div>
    </div>
  );
}

// ── Keypad ────────────────────────────────────────────────────────────────────
function Keypad({
  className,
  showDescription = true,
}: {
  className?: string;
  showDescription?: boolean;
}) {
  const { saAnswers, selectedSaQ, inputChar, deleteChar, confirmSa } =
    useOmrCard();
  const val = selectedSaQ !== null ? (saAnswers[selectedSaQ] ?? "") : "";
  return (
    <OmrKeypad
      value={val}
      onInput={inputChar}
      onDelete={deleteChar}
      onComplete={confirmSa}
      disabled={selectedSaQ === null}
      completeActive={selectedSaQ !== null && val.length > 0}
      showDescription={showDescription}
      className={className}
    />
  );
}

// ── StatusBar ─────────────────────────────────────────────────────────────────
function StatusBar({
  countdownSeconds: initialSeconds,
  className,
}: {
  countdownSeconds?: number | null;
  className?: string;
}) {
  const [isCalled, setIsCalled] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    initialSeconds ?? null,
  );
  const [extraCounter, setExtraCounter] = useState(0); // 0초부터 시작해서
  const [isFinished, setIsFinished] = useState(false);

  const MAX_EXTRA = 20; // 최대 20초까지 차오름

  // 초기값 동기화
  useEffect(() => {
    if (initialSeconds != null) setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  // 메인 카운트다운 (시험 시간)
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isFinished) return;
    const mainTimer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(mainTimer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(mainTimer);
  }, [timeLeft, isFinished]);

  // 종료 후 20초 '차오르는' 카운트다운
  useEffect(() => {
    if (!isFinished || extraCounter >= MAX_EXTRA) {
      if (isFinished && extraCounter === MAX_EXTRA)
        console.log("🚀 [완료] 화면 전환");
      return;
    }
    const extraTimer = window.setInterval(() => {
      setExtraCounter((prev) => prev + 1); // 0에서 20으로 증가
    }, 1000);
    return () => window.clearInterval(extraTimer);
  }, [isFinished, extraCounter]);

  const mins = timeLeft != null ? Math.floor(timeLeft / 60) : 0;
  const secs = timeLeft != null ? String(timeLeft % 60).padStart(2, "0") : "00";

  // 너비 계산: 0초일 때 0%, 20초일 때 100% (왼쪽에서 오른쪽으로 차오름)
  const getProgressWidth = () => {
    if (!isFinished) return "0%"; // 시험 중엔 비워두기 (혹은 기획에 따라 변경)
    const width = (extraCounter / MAX_EXTRA) * 100;
    return `${width}%`;
  };

  return (
    <div className={cn("shrink-0 bg-[#fff] px-10 py-7", className)}>
      <div className="flex items-center gap-12">
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-end justify-between mb-2">
            <div className="min-h-[85px] flex flex-col justify-end">
              {isFinished ? (
                <div className="animate-in fade-in duration-500">
                  <p className="text-gray-500 font-bold text-sm mb-1">
                    시험이 곧 종료됩니다
                  </p>
                  <div className="font-black text-[#333333] leading-tight text-[2.5rem] tracking-tight">
                    <p>
                      {MAX_EXTRA - extraCounter}초 뒤에 자동으로 제출됩니다.{" "}
                      <span className="text-[2.5rem] font-black text-[#333333]">
                        답안을 모두 입력해주세요.
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-1">
                    시험이 곧 시작됩니다...
                  </p>
                  <p className="font-black text-[#333333] leading-none text-[2.75rem] tracking-tight">
                    {mins}분 {secs}초 뒤 시작
                  </p>
                </div>
              )}
            </div>
            <span className="text-[14px] text-gray-800 font-bold pb-1 whitespace-nowrap">
              시험 시간 60분
            </span>
          </div>

          {/* 프로그레스 바: 왼쪽 정렬 상태에서 width가 늘어나며 오른쪽으로 차오름 */}
          <div className="h-[7px] w-full bg-[#EEEEEE] rounded-full overflow-hidden flex justify-start">
            <div
              className="h-full bg-[#444444] rounded-full transition-all duration-1000 ease-linear"
              style={{ width: getProgressWidth() }}
            />
          </div>
        </div>

        {/* 호출 버튼 영역 */}
        <div className="shrink-0 flex items-center justify-center pt-6">
          <div className="relative w-48 h-[54px]">
            <button
              onClick={() => setIsCalled(true)}
              className={cn(
                "absolute inset-0 flex items-center justify-center gap-2 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-500",
                isCalled
                  ? "opacity-0 scale-90 pointer-events-none"
                  : "opacity-100 scale-100",
              )}
            >
              <div className="bg-black text-white rounded-md w-5 h-5 flex items-center justify-center text-[10px] font-black">
                !
              </div>
              <span className="font-bold text-gray-900 text-[15px]">
                문제가 생겼나요?
              </span>
            </button>
            <button
              className={cn(
                "absolute inset-0 flex items-center justify-center gap-2 bg-white border-2 border-gray-900 rounded-2xl transition-all duration-500",
                !isCalled
                  ? "opacity-0 scale-90 pointer-events-none"
                  : "opacity-100 scale-100",
              )}
            >
              <span className="text-black font-black text-lg">✓</span>
              <span className="font-bold text-gray-900 text-[15px]">
                선생님 호출 완료!
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Compound export ───────────────────────────────────────────────────────────
export const OmrCard = Object.assign(OmrCardRoot, {
  StudentInfo,
  OmrBoard,
  Keypad,
  StatusBar,
});
