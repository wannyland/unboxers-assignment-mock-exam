import { Button } from "../ui/Button";
import { LaserScanner } from "./LaserScanner";
import { OmrMiniature } from "./OmrMiniature";

interface ScanningViewProps {
  omrSnapshot: React.ReactNode;
}

export function ScanningView({ omrSnapshot }: ScanningViewProps) {
  return (
    <div className="h-full flex flex-col bg-[#F5F5F5]">
      <div className="shrink-0 h-14" /> {/* 상단 여백 */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* OMR 카드 + 레이저 */}
        <div className="relative">
          <OmrMiniature>{omrSnapshot}</OmrMiniature>
          <LaserScanner />
        </div>

        {/* 스캔 메시지 */}
        <div className="text-center">
          <p className="text-[22px] font-black text-gray-900">
            OMR 카드 스캔중...
          </p>
          <p className="text-[22px] font-black text-gray-900">
            곧 결과가 나와요
          </p>
        </div>

        {/* 비활성 버튼 */}
        <Button variant="secondary" size="tutorial" disabled>
          과연 몇 점일까요?
        </Button>
      </main>
    </div>
  );
}
