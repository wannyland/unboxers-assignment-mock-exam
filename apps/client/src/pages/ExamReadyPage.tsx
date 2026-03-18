import Header from "../components/Header";
import { Button } from "../components/ui/Button";

interface ExamReadyPageProps {
  onStart?: () => void;
  onPrev?: () => void;
  onHome?: () => void;
  examDurationMinutes?: number;
}

export default function ExamReadyPage({
  onStart,
  onPrev,
  onHome,
  examDurationMinutes = 60,
}: ExamReadyPageProps) {
  return (
    <div className="flex flex-col h-screen bg-[#F5F5F5] font-sans select-none">
      <Header onHome={onHome} />

      {/* 메인 영역: 전체 화면의 중앙에 배치 */}
      <main className="flex-1 flex flex-col items-center justify-center px-8">
        <div className=" w-[1200px]">
          {/* 중앙 흰색 카드 (사진의 가로 너비와 라운딩 재현) */}
          <div className="w-full bg-white rounded-[32px] p-12 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-white relative mb-16">
            <div className="flex items-start justify-between">
              {/* 왼쪽: 타이머 섹션 */}
              <div className="flex flex-col">
                <p className="text-[#666666] font-bold text-[18px] mb-3">
                  시험 종료까지 남은 시간
                </p>
                <div className="flex flex-col items-start">
                  <span className="text-[72px] font-black text-[#FF6262] leading-none tracking-tighter">
                    5초
                  </span>
                  <div className="h-[7px] w-14 bg-[#FF6262] rounded-full mt-4" />
                </div>
              </div>

              {/* 오른쪽: 버튼 및 정보 섹션 */}
              <div className="flex flex-col items-end pt-2">
                <div className="flex items-center gap-4 mb-10">
                  {/* 문제 신고 버튼 */}
                  <button className="flex items-center gap-2 px-6 py-4 rounded-[18px] border border-gray-100 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:bg-gray-50 transition-all">
                    <span className="text-xl">!</span>
                    <span className="font-bold text-[#333333] text-[17px]">
                      문제가 생겼나요?
                    </span>
                  </button>

                  {/* 제출 버튼 */}
                  <button className="px-10 py-4 rounded-[18px] bg-[#5C79D1] text-white font-bold text-[18px] shadow-[0_6px_20px_rgba(92,121,209,0.3)] hover:bg-[#4E67B8] transition-all">
                    답안 제출하기
                  </button>
                </div>

                {/* 시험 시간 텍스트 (우측 하단 정렬) */}
                <span className="text-[#666666] font-bold text-[17px] pr-2">
                  시험 시간 {examDurationMinutes}분
                </span>
              </div>
            </div>

            {/* 카드 내부 하단 회색 라인 (사진의 디테일) */}
            <div className="absolute bottom-12 left-12 right-12 h-[1.5px] bg-[#EEEEEE] rounded-full" />
          </div>

          {/* 안내 문구 (사진의 폰트 크기 및 색상 대비) */}
          <div className="text-center space-y-4">
            <h2 className="text-[40px] font-black text-[#222222] tracking-tight leading-tight">
              시간이 모두 지나면 시험은 종료되고 OMR카드는 자동으로 제출돼요
            </h2>
            <p className="text-[32px] font-bold text-[#FF6262] tracking-tight">
              마킹하지 못한 답안은 모두 오답 처리되니 미리 마킹하세요
            </p>
          </div>
          {/* 하단 푸터 버튼 (사진의 하단 배치 방식) */}
          <footer className="w-full shrink-0 flex items-center justify-between mt-20">
            <Button variant="secondary" size="tutorial" onClick={onPrev}>
              ‹ 이전으로
            </Button>

            <Button variant="primary" size="tutorial" onClick={onStart}>
              시험 화면으로 이동
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}
