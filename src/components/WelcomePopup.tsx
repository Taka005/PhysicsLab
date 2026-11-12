"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const WELCOME_STORAGE_KEY = "welcome-seen";

export default function WelcomePopup() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSmallScreenWarning, setShowSmallScreenWarning] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const hasDismissedWarning = useRef(false);

  useEffect(() => {
    try {
      const isFirstVisit = window.localStorage.getItem(WELCOME_STORAGE_KEY) !== "true";

      if (isFirstVisit) {
        window.localStorage.setItem(WELCOME_STORAGE_KEY, "true");
      }

      setShowWelcome(isFirstVisit);
    } catch (error) {
      setShowWelcome(true);
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateScreenSize = () => {
      setIsSmallScreen(mediaQuery.matches);
      setShowSmallScreenWarning(mediaQuery.matches && !hasDismissedWarning.current);
    };

    updateScreenSize();
    mediaQuery.addEventListener("change", updateScreenSize);

    return () => {
      mediaQuery.removeEventListener("change", updateScreenSize);
    };
  }, []);

  const isOpen = showWelcome || showSmallScreenWarning;

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSmallScreen) {
      hasDismissedWarning.current = true;
    }

    setShowWelcome(false);
    setShowSmallScreenWarning(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-dialog-title"
        aria-describedby="welcome-dialog-description"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        <div className="border-b border-gray-100 px-6 pb-4 pt-6">
          <h2 id="welcome-dialog-title" className="text-xl font-semibold text-gray-900 text-center">
            {isSmallScreen ? "画面サイズについて" : "PhysicsLabへようこそ"}
          </h2>
          <p id="welcome-dialog-description" className="mt-2 text-sm leading-6 text-gray-600">
            {isSmallScreen
              ? "PhysicsLabは大きな画面での操作を想定しています。スマートフォンなどの小さな画面では、コントロールパネルや編集ウィンドウが使いづらい場合があります"
              : "物理シミュレーションの基本操作や各機能を、ドキュメントで確認できます"}
          </p>
        </div>
        <div className="flex flex-col gap-3 p-6">
          {isSmallScreen && (
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-900">
              <span
                aria-hidden="true"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700"
              >
                !
              </span>
              <p>可能であれば、PCやタブレットなど大きな画面でのご利用をおすすめします</p>
            </div>
          )}
          {showWelcome && (
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              ドキュメントを見る
              <span aria-hidden="true">→</span>
            </Link>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSmallScreen ? "了解して続ける" : "シミュレーターを始める"}
          </button>
        </div>
      </section>
    </div>
  );
}