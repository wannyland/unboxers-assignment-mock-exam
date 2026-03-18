import axios from "axios";
import type {
  GetExamResponse,
  SubmitExamRequest,
  SubmitExamResponse,
} from "../types/api";

export const apiClient = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message ?? err.message;
    console.error("[API Error]", err.response?.status, msg);
    return Promise.reject(err);
  },
);

/** GET /api/exams — 시험 정보 조회 */
export async function fetchExam(): Promise<GetExamResponse> {
  const { data } = await apiClient.get<GetExamResponse>("/api/exams");
  return data;
}

/** POST /api/exams/submit — 답안 제출 */
export async function submitExam(
  body: SubmitExamRequest,
): Promise<SubmitExamResponse> {
  const { data } = await apiClient.post<SubmitExamResponse>(
    "/api/exams/submit",
    body,
  );
  return data;
}
