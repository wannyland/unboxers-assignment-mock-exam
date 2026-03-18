// ── 학생 정보 ───────────────────────────────────────
export interface StudentData {
  examName: string; // 시험
  subject: string; // 과목
  name: string; // 성명
  school: string; // 학교
  seatNumber: string; // 좌석번호
  supervisor: string; // 감독
}

// ── 답안 ────────────────────────────────────────────
/** 객관식 */
export type McAnswers = Record<number, number[]>;

/** 주관식 */
export type SaAnswers = Record<number, string>;

// ── 시험 설정 ────────────────────────────────────────
export interface OmrConfig {
  totalMcQuestions: number; // 객관식 문항 수 (기본 30)
  totalSaQuestions: number; // 주관식 문항 수 (기본 12)
  mcChoicesPerQuestion: number; // 보기 수 (기본 5)
  examDurationMinutes: number; // 시험 시간
}
