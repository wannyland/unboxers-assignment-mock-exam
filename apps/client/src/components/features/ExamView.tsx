import type { StudentForm } from "../../pages/ExamOmrPage";
import type { SubmitExamData } from "../../types/api";
import type { StudentData } from "../../types/omr";
import { OmrCard } from "../omr";
import { Button } from "../ui/Button";
import { SubmitButton } from "./SubmitButton";

interface ExamViewProps {
  studentData: StudentData;
  studentForm: StudentForm;
  onStudentFormChange: (f: StudentForm) => void;
  onDigitChange: (
    g: number | null,
    n1: number | null,
    n2: number | null,
  ) => void;
  errorMsg: string;
  onError: (msg: string) => void;
  onSubmitting: () => void;
  onSubmitSuccess: (result: SubmitExamData) => void;
  onExit: () => void;
}

export function ExamView({
  studentData,
  studentForm,
  onStudentFormChange,
  onDigitChange,
  errorMsg,
  onError,
  onSubmitting,
  onSubmitSuccess,
  onExit,
}: ExamViewProps) {
  return (
    <div className="h-full flex flex-col bg-[#F5F5F5] overflow-hidden">
      <div className="shrink-0 flex justify-end px-6 py-3">
        <Button variant="secondary" size="exit" onClick={() => onExit?.()}>
          종료하기 ↗
        </Button>
      </div>

      {/* OMR 카드 + 키패드 */}
      <div className="flex-1 flex items-center justify-center gap-5 overflow-auto px-6 pb-6">
        {/* OMR 카드*/}
        <div
          className="bg-[#FFFDF1] rounded-[2rem] overflow-hidden shrink-0 flex flex-row"
          style={{
            width: 1262,
            height: 659,
            boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
            padding: "16px 24px 4px 24px",
            gap: 0,
          }}
        >
          {/* 학생 정보 패널 */}
          <OmrCard.StudentInfo
            data={studentData}
            academyName="베이스 수학학원"
            academySubtitle={"학생답안 입력용\nOMR 카드"}
            studentForm={studentForm}
            onStudentFormChange={onStudentFormChange}
          />

          <OmrCard.OmrBoard onDigitChange={onDigitChange} />
        </div>

        {/* 주관식 키패드 */}
        <div
          className="flex flex-col items-center justify-center shrink-0"
          style={{ height: 659 }}
        >
          <OmrCard.Keypad showDescription />

          {/* 제출 버튼 */}
          <SubmitButton
            studentForm={studentForm}
            onSubmitting={onSubmitting}
            onSuccess={onSubmitSuccess}
            onError={onError}
          />

          {/* 오류 메시지 */}
          {errorMsg && (
            <p className="text-red-500 text-xs font-medium text-center leading-tight px-1">
              {errorMsg}
            </p>
          )}
        </div>
      </div>

      {/* 하단 상태 바 */}
      <OmrCard.StatusBar countdownSeconds={5} />
    </div>
  );
}
