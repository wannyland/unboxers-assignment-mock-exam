// ── OMR 카드 미니어처 (제출 완료 / 스캔 화면 공통) ─────────────────────────────
export function OmrMiniature({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className="relative bg-[#FFFDF1] rounded-2xl overflow-hidden"
      style={{
        width: 580,
        height: 303,
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        border: "1px solid #e8e4c0",
      }}
    >
      {/* OMR 썸네일 — 실제 카드를 scale로 축소 */}
      <div
        style={{
          transform: "scale(0.46)",
          transformOrigin: "top left",
          width: 1262,
          height: 659,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
