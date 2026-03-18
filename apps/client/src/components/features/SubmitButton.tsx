import { useSubmitExam } from "../../hooks/useExam";
import type { StudentForm } from "../../pages/ExamOmrPage";
import type { SubmitExamData } from "../../types/api";
import { useOmrCard } from "../omr/OmrCard";

interface SubmitButtonProps {
  studentForm: StudentForm;
  onSubmitting: () => void;
  onSuccess: (result: SubmitExamData) => void;
  onError: (msg: string) => void;
}

export function SubmitButton({
  studentForm,
  onSubmitting,
  onSuccess,
  onError,
}: SubmitButtonProps) {
  const { getSubmitAnswers } = useOmrCard();

  const { mutate, isPending } = useSubmitExam({
    onSuccess: (res) => onSuccess(res.data),
    onError: (err) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "제출 중 오류가 발생했습니다.";
      onError(msg);
    },
  });

  const handleSubmit = () => {
    const { name, school, grade, studentNumber, seatNumber } = studentForm;

    console.log(
      JSON.stringify(
        {
          name: name.trim(),
          school: school.trim(),
          grade,
          studentNumber,
          seatNumber,
          answers: getSubmitAnswers(),
        },
        null,
        2,
      ),
    );

    if (!name.trim()) {
      onError("성명을 입력해주세요.");
      return;
    }
    if (!school.trim()) {
      onError("학교를 입력해주세요.");
      return;
    }
    if (grade === null) {
      onError("학년을 선택해주세요.");
      return;
    }
    if (studentNumber === null) {
      onError("번호를 선택해주세요.");
      return;
    }
    if (seatNumber === null) {
      onError("좌석번호를 입력해주세요.");
      return;
    }

    onError("");
    onSubmitting(); // phase -> submitted
    mutate({
      name: name.trim(),
      school: school.trim(),
      grade,
      studentNumber,
      seatNumber,
      answers: getSubmitAnswers(),
    });
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={isPending}
      className="w-full px-5 py-3 rounded-xl bg-[#5784F1] text-white font-bold text-sm mt-4
                 hover:bg-[#4a72e0] active:bg-[#3d62d0] transition-colors
                 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {isPending ? "제출 중..." : "답안 제출하기"}
    </button>
  );
}
