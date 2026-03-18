import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchExam, submitExam } from "../lib/api";
import type { SubmitExamRequest, SubmitExamResponse } from "../types/api";

export const QUERY_KEYS = {
  exam: ["exam"] as const,
} as const;

// ── GET /api/exams ───────────────────────────────────────────────────────────
/**
 * 시험 정보를 가져옵니다.
 */
export function useExam() {
  return useQuery({
    queryKey: QUERY_KEYS.exam,
    queryFn: fetchExam,
    staleTime: Infinity,
    retry: 2,
  });
}

// ── POST /api/exams/submit ────────────────────────────────────────────────────
/**
 * 답안을 제출합니다.
 */
export function useSubmitExam(options?: {
  onSuccess?: (res: SubmitExamResponse) => void;
  onError?: (err: unknown) => void;
}) {
  return useMutation<SubmitExamResponse, unknown, SubmitExamRequest>({
    mutationFn: submitExam,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
