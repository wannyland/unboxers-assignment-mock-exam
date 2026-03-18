import { useState } from "react";
import { ChevronDown } from "./icons";
import { Tutorial } from "./tutorial";

interface HeaderProps {
  title?: string;
  studentName?: string;
  onHome?: () => void;
}

export default function Header({
  title = "모의고사 모드",
  studentName = "신희철 학생",
  onHome,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="w-full shrink-0 flex items-center justify-between bg-white border-b border-gray-100"
      style={{
        padding: "clamp(10px,1vh,18px) clamp(20px,2vw,44px)",
        minHeight: "clamp(50px,4.5vh,76px)",
      }}
    >
      {/* Logo */}
      <Tutorial.ImageSlot
        fileName="header-logo.png"
        width="40px"
        height="40px"
        label="헤더 로고"
      />

      {/* Title */}
      <span className="font-bold" style={{ fontSize: 20 }}>
        {title}
      </span>

      {/* Right */}
      <div
        className="flex items-center"
        style={{ gap: "clamp(10px,1.2vw,24px)" }}
      >
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 text-gray-700 font-medium hover:text-gray-900 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
            style={{
              fontSize: "var(--text-sm)",
              padding: "clamp(4px,0.4vh,7px) clamp(6px,0.5vw,10px)",
              minHeight: "clamp(36px,3.2vh,52px)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {studentName}
            <ChevronDown size={13} />
          </button>
          {open && (
            <div
              className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50"
              style={{ width: "clamp(110px,8.5vw,160px)" }}
            >
              <button
                className="w-full text-left text-gray-700 hover:bg-gray-50 px-4 py-2"
                style={{ fontSize: "var(--text-sm)" }}
              >
                프로필 보기
              </button>
              <button
                className="w-full text-left text-red-500 hover:bg-gray-50 px-4 py-2"
                style={{ fontSize: "var(--text-sm)" }}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
        <button
          onClick={onHome}
          className="text-gray-700 font-medium hover:text-gray-900 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
          style={{
            fontSize: "var(--text-sm)",
            padding: "clamp(4px,0.4vh,7px) clamp(6px,0.5vw,10px)",
            minHeight: "clamp(36px,3.2vh,52px)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          홈으로
        </button>
      </div>
    </header>
  );
}
