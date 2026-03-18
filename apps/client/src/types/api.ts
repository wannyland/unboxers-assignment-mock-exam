// ── GET /api/exams ────────────────────────────────────────────────────────────
export interface ExamData {
  title: string;
  description: string;
  supervisorName: string;
  totalQuestions: number;
  totalScore: number;
}

export interface GetExamResponse {
  message: string;
  data: ExamData;
}

// ── POST /api/exams/submit ────────────────────────────────────────────────────
export type AnswerType = "objective" | "subjective";

export interface SubmitAnswer {
  answerType: AnswerType;
  number: number;
  answer: number | string;
}

export interface SubmitExamRequest {
  name: string;
  school: string;
  grade: number;
  studentNumber: number;
  seatNumber: number;
  answers: SubmitAnswer[];
}

export type AnswerResult = "correct" | "wrong" | "unanswered";

export interface AnswerResultItem {
  answerType: AnswerType;
  number: number;
  result: AnswerResult;
}

export interface SubmitExamData {
  title: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  results: AnswerResultItem[];
}

export interface SubmitExamResponse {
  message: string;
  data: SubmitExamData;
}
