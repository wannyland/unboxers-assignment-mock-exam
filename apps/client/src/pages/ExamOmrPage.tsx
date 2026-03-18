import { useState } from "react";
import { ExamView } from "../components/features/ExamView";
import { ResultView } from "../components/features/ResultView";
import { ScanningView } from "../components/features/ScanningView";
import { SubmittedView } from "../components/features/SubmittedView";
import { OmrCard } from "../components/omr";
import { Button } from "../components/ui/Button";
import { useExam } from "../hooks/useExam";
import type { SubmitExamData } from "../types/api";
import type { StudentData } from "../types/omr";

// ── 학생 입력 폼 타입 ──────────────────────────────────────────────────────────
export interface StudentForm {
  name: string;
  school: string;
  grade: number | null;
  studentNumber: number | null;
  seatNumber: number | null; // 직접 입력
}

// 시험 화면, 제출 화면, 스캔 화면
type ExamPhase = "exam" | "submitted" | "scanning" | "result";

interface Props {
  onExit?: (result?: SubmitExamData) => void;
}

export default function ExamOmrPage({ onExit }: Props) {
  const [phase, setPhase] = useState<ExamPhase>("exam");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitResult, setSubmitResult] = useState<
    SubmitExamData | undefined
  >();
  const [studentForm, setStudentForm] = useState<StudentForm>({
    name: "",
    school: "",
    grade: null,
    studentNumber: null,
    seatNumber: null,
  });

  // GET /api/exams ──────────────────────────────────────────────────────────
  const { data: examRes, isLoading, isError } = useExam();
  const exam = examRes?.data;

  // digit selector (학년/번호)가 변경될 때 studentForm 동기화
  const handleDigitChange = (
    grade: number | null,
    num1: number | null,
    num2: number | null,
  ) => {
    const studentNumber =
      num1 !== null && num2 !== null
        ? num1 * 10 + num2
        : num1 !== null
          ? num1
          : num2 !== null
            ? num2
            : null;
    setStudentForm((prev) => ({ ...prev, grade, studentNumber }));
  };

  // API에서 받아온 데이터를 StudentInfo에 전달
  const studentData: StudentData = {
    examName: exam?.title ?? "TEN-UP 모의고사",
    subject: "공통수학2",
    name: studentForm.name || "",
    school: studentForm.school || "",
    seatNumber:
      studentForm.seatNumber != null ? String(studentForm.seatNumber) : "",
    supervisor: exam?.supervisorName ?? "감독",
  };

  const handleSubmitSuccess = (result: SubmitExamData) => {
    setSubmitResult(result);
    setPhase("submitted");
  };

  const handleViewResult = () => {
    if (submitResult) {
      setPhase("scanning");
      // setTimeout(() => onExit?.(submitResult), 5000);
      setTimeout(() => setPhase("result"), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F5F5F5]">
        <p className="text-gray-400 font-semibold text-lg animate-pulse">
          시험 정보를 불러오는 중...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#F5F5F5] gap-4">
        <p className="text-red-500 font-semibold text-lg">
          시험 정보를 불러오지 못했습니다.
        </p>
        <p className="text-gray-400 text-sm">관리자에게 문의해 주세요.</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.location.reload()}
        >
          다시 시도
        </Button>
      </div>
    );
  }

  const omrSnapshot = (
    <OmrCardInner studentData={studentData} onDigitChange={handleDigitChange} />
  );

  return (
    <div className="h-full">
      {phase === "result" && submitResult ? (
        <ResultView
          data={submitResult}
          onRetry={() => {
            setSubmitResult(undefined);
            setStudentForm({
              name: "",
              school: "",
              grade: null,
              studentNumber: null,
              seatNumber: null,
            });
            setPhase("exam");
          }}
        />
      ) : (
        <OmrCard
          config={{
            examDurationMinutes: 60,
            totalMcQuestions: exam?.totalQuestions ?? 30,
          }}
        >
          {phase === "exam" && (
            <ExamView
              studentData={studentData}
              studentForm={studentForm}
              onStudentFormChange={setStudentForm}
              onDigitChange={handleDigitChange}
              errorMsg={errorMsg}
              onError={setErrorMsg}
              onSubmitting={() => setPhase("submitted")}
              onSubmitSuccess={handleSubmitSuccess}
              onExit={() => onExit?.()}
            />
          )}
          {phase === "submitted" && (
            <SubmittedView
              omrSnapshot={omrSnapshot}
              onViewResult={handleViewResult}
              onExit={() => onExit?.()}
            />
          )}
          {phase === "scanning" && <ScanningView omrSnapshot={omrSnapshot} />}
        </OmrCard>
      )}
    </div>
  );
}

function OmrCardInner({
  studentData,
  onDigitChange,
}: {
  studentData: StudentData;
  onDigitChange: (
    g: number | null,
    n1: number | null,
    n2: number | null,
  ) => void;
}) {
  return (
    <div
      className="flex flex-row h-full"
      style={{ padding: "16px 24px 4px 24px" }}
    >
      <OmrCard.StudentInfo
        data={studentData}
        academyName="베이스 수학학원"
        academySubtitle={"학생답안 입력용\nOMR 카드"}
      />
      <OmrCard.OmrBoard onDigitChange={onDigitChange} />
    </div>
  );
}
