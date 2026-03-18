import type { AnswerResult, SubmitExamData } from "../../types/api";
import { Button } from "../ui/Button";

// ── 결과 화면 ─────────────────────────────────────────────────────────────────
const RESULT_COLOR: Record<AnswerResult, string> = {
  correct: "#5784F1",
  wrong: "#ef4444",
  unanswered: "#d1d5db",
};
const RESULT_LABEL: Record<AnswerResult, string> = {
  correct: "정답",
  wrong: "오답",
  unanswered: "미응답",
};

export function ResultView({
  data,
  onRetry,
}: {
  data: SubmitExamData;
  onRetry: () => void;
}) {
  const { title, score, correctCount, wrongCount, unansweredCount, results } =
    data;
  const total = correctCount + wrongCount + unansweredCount;

  const mcResults = results.filter((r) => r.answerType === "objective");
  const saResults = results.filter((r) => r.answerType === "subjective");

  // 점수 등급 색상
  const scoreColor =
    score >= 90
      ? "#5784F1"
      : score >= 70
        ? "#16a34a"
        : score >= 50
          ? "#ca8a04"
          : "#ef4444";

  return (
    <div className="h-full flex flex-col bg-[#F5F5F5] overflow-hidden">
      {/* 헤더 */}
      <div className="shrink-0 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <span className="font-semibold text-gray-800 text-[15px]">
          채점 결과
        </span>
        <Button variant="secondary" size="sm" onClick={onRetry}>
          다시 풀기
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-8 flex flex-col gap-6">
          {/* ── 점수 카드 ── */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="px-10 py-8 flex items-center gap-10">
              {/* 점수 */}
              <div
                className="flex flex-col items-center shrink-0"
                style={{ minWidth: 140 }}
              >
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">
                  점수
                </span>
                <div className="flex items-end gap-1">
                  <span
                    className="font-black tabular-nums leading-none"
                    style={{ fontSize: 72 }}
                  >
                    {score * 4} // 25문제 100점 만점
                  </span>
                  <span className="text-gray-400 font-semibold text-xl mb-2">
                    점
                  </span>
                </div>
                <span className="text-gray-400 text-sm font-medium mt-1">
                  {title}
                </span>
              </div>

              {/* 구분선 */}
              <div className="w-px self-stretch bg-gray-100" />

              {/* 통계 3칸 */}
              <div className="flex-1 grid grid-cols-3 gap-4">
                {[
                  {
                    label: "정답",
                    count: correctCount,
                    color: "#5784F1",
                    bg: "rgba(87,132,241,0.08)",
                  },
                  {
                    label: "오답",
                    count: wrongCount,
                    color: "#ef4444",
                    bg: "rgba(239,68,68,0.08)",
                  },
                  {
                    label: "미응답",
                    count: unansweredCount,
                    color: "#9ca3af",
                    bg: "#f9fafb",
                  },
                ].map(({ label, count, color, bg }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center rounded-2xl py-5 px-4 gap-2"
                    style={{ background: bg }}
                  >
                    <span className="font-black text-3xl" style={{ color }}>
                      {count}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      {label}
                    </span>
                    <div
                      className="w-full rounded-full bg-white overflow-hidden"
                      style={{ height: 4 }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: total > 0 ? `${(count / total) * 100}%` : "0%",
                          background: color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      {total > 0 ? Math.round((count / total) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 문항별 결과 ── */}
          <div className="grid grid-cols-2 gap-6">
            {/* 객관식 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[rgba(87,132,241,0.12)]">
                  객관식
                </span>
                <span className="text-gray-400 text-sm">
                  {mcResults.length}문항
                </span>
              </div>

              {mcResults.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-300 text-sm font-medium">
                  응답한 객관식 문항이 없습니다
                </div>
              ) : (
                <div className="p-4 grid grid-cols-5 gap-2">
                  {mcResults.map(({ number, result }) => (
                    <div
                      key={number}
                      className="flex flex-col items-center rounded-xl py-2 px-1 gap-1"
                      style={{ background: `${RESULT_COLOR[result]}12` }}
                    >
                      <span className="text-gray-500 text-xs font-semibold">
                        {number}번
                      </span>
                      <span
                        className="text-xs font-black"
                        style={{ color: RESULT_COLOR[result] }}
                      >
                        {RESULT_LABEL[result]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 주관식 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[rgba(87,132,241,0.12)] text-[#5784F1]">
                  주관식
                </span>
                <span className="text-gray-400 text-sm">
                  {saResults.length}문항
                </span>
              </div>

              {saResults.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-300 text-sm font-medium">
                  응답한 주관식 문항이 없습니다
                </div>
              ) : (
                <div className="flex flex-col">
                  {saResults.map(({ number, result }, i) => (
                    <div
                      key={number}
                      className="flex items-center justify-between px-6 py-3"
                      style={{
                        borderBottom:
                          i < saResults.length - 1
                            ? "1px solid #f3f4f6"
                            : "none",
                      }}
                    >
                      <span className="text-gray-600 font-semibold text-sm">
                        {number}번
                      </span>
                      <span
                        className="text-sm font-black px-3 py-1 rounded-full"
                        style={{
                          color: RESULT_COLOR[result],
                          background: `${RESULT_COLOR[result]}12`,
                        }}
                      >
                        {RESULT_LABEL[result]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
