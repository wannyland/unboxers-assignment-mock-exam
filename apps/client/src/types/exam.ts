// ─── 도메인 타입 ────────────────────────────────────────────────

export interface ExamMeta {
  subject: string;
  label: string;
  timeMinutes: number;
  totalQuestions: number;
  totalScore: number;
}

export interface Question {
  id: number;
  number: number;
  text: string;
  choices: string[];
  type: "multiple" | "short";
}

/** 객관식 답안: { [questionId]: 선택지 인덱스 } */
export type Answers = Record<number, number>;

/** 단답형 답안: { [questionId]: 입력 문자열 } */
export type ShortInputs = Record<number, string>;

export type Grade = 1 | 2 | 3 | 4 | 5;

export interface ExamResult {
  score: number;
  grade: Grade;
  answeredCount: number;
  unansweredCount: number;
}

// ─── 페이지 라우팅 ────────────────────────────────────────────────

export const PAGES = {
  INTRO: "intro",
  TUTORIAL: "tutorial",
  READY: "ready",
  EXAM: "exam",
  HOME: "home",
} as const;

export type Page = (typeof PAGES)[keyof typeof PAGES];
