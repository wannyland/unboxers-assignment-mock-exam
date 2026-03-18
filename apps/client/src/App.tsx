import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import ExamOmrPage from "./pages/ExamOmrPage";
import ExamReadyPage from "./pages/ExamReadyPage";
import TutorialPage from "./pages/TutorialPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

type Page = "tutorial" | "ready" | "exam" | "result" | "home";

function AppContent() {
  const [page, setPage] = useState<Page>("tutorial");

  const goHome = () => setPage("home");

  switch (page) {
    case "tutorial":
      return <TutorialPage onNext={() => setPage("ready")} onHome={goHome} />;

    case "ready":
      return (
        <ExamReadyPage
          onStart={() => setPage("exam")}
          onPrev={() => setPage("tutorial")}
          onHome={goHome}
          examDurationMinutes={60}
        />
      );

    case "exam":
      return <ExamOmrPage onExit={() => setPage("result")} />;

    default:
      return (
        <div className="flex h-full items-center justify-center bg-[#F5F5F5]">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 mb-4">홈 화면</p>
            <button
              onClick={() => setPage("tutorial")}
              className="px-8 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              모의고사 시작
            </button>
          </div>
        </div>
      );
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full">
        <AppContent />
      </div>
    </QueryClientProvider>
  );
}
