import Header from "../components/Header";
import { InteractiveOmrTutorial } from "../components/InteractiveOmrTutorial";
import { InteractiveSaTutorial } from "../components/InteractiveSaTutorial";
import { Tutorial } from "../components/tutorial";

interface TutorialPageProps {
  onNext?: () => void;
  onHome?: () => void;
}

/**
 * 튜토리얼 4단계
 * Step 0: 시험 소개 (시험지 이미지 + 텍스트)
 * Step 1: OMR 설명 (시험지 + OMR 이미지)
 * Step 2: 인터랙티브 MC 마킹 연습
 * Step 3: 인터랙티브 SA 입력 연습 → 완료 후 ExamReadyPage
 *
 * 이미지 교체: /src/assets/ 폴더에 파일을 넣고 fileName prop 사용
 *   <Tutorial.ImageSlot fileName="book-stack.png" ... />
 */
export default function TutorialPage({ onNext, onHome }: TutorialPageProps) {
  return (
    <div className="flex flex-col h-full">
      <Header onHome={onHome} />

      <Tutorial onSkip={onNext} onComplete={onNext}>
        {/* ── Step 0: 시험 소개 ─────────────────────── */}
        <Tutorial.Step>
          <Tutorial.IllustrationArea direction="column">
            <Tutorial.ImageSlot
              fileName="common-math.png"
              width="315px"
              height="433px"
              label="시험지 스택 이미지"
            />

            <Tutorial.TextArea>
              <Tutorial.Heading>
                모의고사 모드는 처음이시죠?{" "}
                <span className="whitespace-nowrap">실전 모의고사는</span>
              </Tutorial.Heading>
              <Tutorial.Heading>
                실전과 최대한 비슷한 환경으로 진행돼요
              </Tutorial.Heading>
            </Tutorial.TextArea>
            <Tutorial.Footer showPrev={false} showSkip />
          </Tutorial.IllustrationArea>
        </Tutorial.Step>

        {/* ── Step 1: OMR 설명 ──────────────────────── */}
        <Tutorial.Step>
          <Tutorial.IllustrationArea direction="column">
            <div className="flex gap-4 items-center justify-center">
              <Tutorial.ImageSlot
                fileName="common-math.png"
                width="315px"
                height="433px"
                label="시험지 이미지"
              />
              <Tutorial.ImageSlot
                fileName="omr-card.png"
                width="593px"
                height="316px"
                label="OMR 카드 이미지"
              />
            </div>
            <Tutorial.TextArea>
              <Tutorial.Heading>
                실제 시험지 크기에 인쇄된 시험지에 문제를 풀고
              </Tutorial.Heading>
              <Tutorial.Heading>
                화면에 표시된 OMR카드에 답을 마킹해요
              </Tutorial.Heading>
            </Tutorial.TextArea>
            <div className="flex justify-between gap-4">
              <Tutorial.Footer showPrev showSkip />
            </div>
          </Tutorial.IllustrationArea>
        </Tutorial.Step>

        {/* ── Step 2: 인터랙티브 MC ─────────────────── */}
        <Tutorial.Step>
          <InteractiveOmrTutorial />
        </Tutorial.Step>

        {/* ── Step 3: 인터랙티브 SA ─────────────────── */}
        <Tutorial.Step>
          <InteractiveSaTutorial />
        </Tutorial.Step>
      </Tutorial>
    </div>
  );
}
