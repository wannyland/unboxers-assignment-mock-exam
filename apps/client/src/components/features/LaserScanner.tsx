// ── 레이저 스캔 애니메이션 ────────────────────────────────────────────────────
export function LaserScanner() {
  return (
    <>
      <style>{`
        @keyframes laserSweep {
          0%   { left: 60px;  }
          50%  { left: 542px; }
          100% { left: 60px;  }
        }
        .laser-line {
          animation: laserSweep 5s cubic-bezier(0.45,0,0.55,1) forwards;
        }
      `}</style>

      {/* 레이저 라인 */}
      <div
        className="laser-line absolute top-0 bottom-0 pointer-events-none"
        style={{ width: 3, zIndex: 10 }}
      >
        {/* 메인 빔 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #ef4444 20%, #ef4444 80%, transparent 100%)",
            boxShadow: "0 0 8px 3px rgba(239,68,68,0.6)",
          }}
        />
        {/* 상단 핀 */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-900" />
        {/* 하단 핀 */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-900" />
      </div>
    </>
  );
}
