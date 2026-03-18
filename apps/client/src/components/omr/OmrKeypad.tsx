import { cn } from "../../lib/utils";

interface OmrKeypadProps {
  value: string;
  onInput: (char: string) => void;
  onDelete: () => void;
  onComplete: () => void;
  disabled?: boolean;
  completeActive?: boolean;
  showDescription?: boolean;
  placeholder?: string;
  className?: string;
}

export function OmrKeypad({
  value,
  onInput,
  onDelete,
  onComplete,
  disabled,
  completeActive,
  showDescription = true,
  placeholder = "입력할 곳을 터치하세요",
  className,
}: OmrKeypadProps) {
  /* 사진 기준 키 스타일 */
  const key = cn(
    "flex items-center justify-center rounded-xl bg-white",
    "text-[22px] font-semibold text-gray-800",
    "h-[52px]",
    "active:scale-[0.96] active:bg-gray-50 transition-all duration-100",
    "touch-manipulation cursor-pointer",
    disabled && "opacity-40 cursor-not-allowed",
  );

  return (
    <div className={cn("flex flex-col gap-2", "w-[243px]", className)}>
      {/* ── 안내 텍스트 (ExamOmrPage에서만 사용) ── */}
      {showDescription && (
        <div className="text-gray-500 text-[12px] font-medium whitespace-pre-wrap leading-normal mb-1">
          {`모든 주관식 답은 숫자와 소숫점, 슬래시(/), 마이너스(-) 기호로 이루어져 있습니다.\n\n마이너스 2분의 3을 입력할 때는 "-3/2"라고 입력하면 돼요. 소숫점은 유효숫자 개수를 맞춰서 입력합니다.\n\n단위가 포함된 주관식 답안은 숫자만 입력합니다.\n\n예시)\n제3사분면 → 3\n3,700만원 → 37000000\n95% → 95`}
        </div>
      )}

      {/* ── 입력 표시창 ── */}
      <div
        className={cn(
          "w-full h-[52px] rounded-xl bg-white",
          "flex items-center justify-center px-4",
          "shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        )}
      >
        {value ? (
          <span className="text-[18px] font-semibold text-gray-900 w-full text-center">
            {value}
          </span>
        ) : (
          <span className="text-[15px] font-medium text-gray-300 w-full text-center">
            {placeholder}
          </span>
        )}
      </div>

      {/* ── 키 그리드 ── */}
      <div className="grid grid-cols-3 gap-[10px]">
        {/* . / - */}
        {[".", "/", "-"].map((k) => (
          <button
            key={k}
            onClick={() => !disabled && onInput(k)}
            className={key}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {k}
          </button>
        ))}
        {/* 1 2 3 */}
        {["1", "2", "3"].map((k) => (
          <button
            key={k}
            onClick={() => !disabled && onInput(k)}
            className={key}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {k}
          </button>
        ))}
        {/* 4 5 6 */}
        {["4", "5", "6"].map((k) => (
          <button
            key={k}
            onClick={() => !disabled && onInput(k)}
            className={key}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {k}
          </button>
        ))}
        {/* 7 8 9 */}
        {["7", "8", "9"].map((k) => (
          <button
            key={k}
            onClick={() => !disabled && onInput(k)}
            className={key}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {k}
          </button>
        ))}
        {/* 0: col-span-2 */}
        <button
          onClick={() => !disabled && onInput("0")}
          className={cn(key, "col-span-2")}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          0
        </button>
        {/* ⌫ delete */}
        <button
          onClick={() => !disabled && onDelete()}
          className={cn(key, "col-span-1")}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.303 4.875h8.822A1.875 1.875 0 0118 6.75v7.5a1.875 1.875 0 01-1.875 1.875H7.303a1.874 1.874 0 01-1.464-.704l-3.094-3.866a1.688 1.688 0 010-2.11l3.094-3.866A1.875 1.875 0 017.3 4.875m-2.929-.468A3.75 3.75 0 017.303 3h8.822a3.75 3.75 0 013.75 3.75v7.5a3.75 3.75 0 01-3.75 3.75H7.303a3.749 3.749 0 01-2.93-1.407l-3.092-3.867a3.563 3.563 0 010-4.452l3.09-3.866zM9.6 7.338a.938.938 0 00-1.325 1.325l1.838 1.838-1.838 1.838A.937.937 0 109.6 13.662l1.838-1.838 1.837 1.838a.938.938 0 101.325-1.325L12.762 10.5 14.6 8.662a.937.937 0 00-1.325-1.325l-1.838 1.838L9.6 7.337z"
                fill="#444"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <path
                  fill="#fff"
                  transform="translate(.5 .5)"
                  d="M0 0H20V20H0z"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      {/* ── 완료 버튼 ── */}
      <button
        onClick={onComplete}
        className={cn(
          "w-full h-[52px] rounded-xl",
          "text-[18px] font-semibold transition-colors duration-150 touch-manipulation",
          completeActive
            ? "bg-[#5784F1] text-white shadow-md"
            : "bg-white text-gray-400 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        )}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        완료
      </button>
    </div>
  );
}
