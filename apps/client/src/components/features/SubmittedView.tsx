import { Button } from "../ui/Button";
import { OmrMiniature } from "./OmrMiniature";

interface SubmittedViewProps {
  omrSnapshot: React.ReactNode;
  onViewResult: () => void;
  onExit: () => void;
}

export function SubmittedView({
  omrSnapshot,
  onViewResult,
  onExit,
}: SubmittedViewProps) {
  return (
    <div className="h-full flex flex-col bg-[#F5F5F5]">
      {/* 상단 종료 버튼 */}
      <div className="shrink-0 flex justify-end px-6 py-3">
        <Button variant="secondary" size="exit" onClick={onExit}>
          종료하기 ↗
        </Button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* OMR 카드 축소 */}
        <OmrMiniature>{omrSnapshot}</OmrMiniature>

        {/* 완료 메시지 */}
        <div className="text-center">
          <p className="text-[22px] font-black text-gray-900">제출 완료!</p>
          <p className="text-[22px] font-black text-gray-900">
            고생 많았어요. 결과를 바로 확인해볼까요?
          </p>
        </div>

        {/* 결과 보기 버튼 */}
        <Button variant="primary" size="tutorial" onClick={onViewResult}>
          결과 보기
        </Button>
      </main>
    </div>
  );
}
