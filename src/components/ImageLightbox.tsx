"use client";

import { useState, useEffect, useCallback } from "react";

export default function ImageLightbox() {
  const [src, setSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const close = useCallback(() => {
    setSrc(null);
    setScale(1);
  }, []);

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.25, 4)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.25, 0.25)), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const img = (e.target as HTMLElement).closest(".wiki-content img") as HTMLImageElement | null;
      if (img) {
        e.preventDefault();
        setSrc(img.src);
        setScale(1);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!src) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
    }
    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [src, close, zoomIn, zoomOut]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={zoomOut}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg font-bold flex items-center justify-center transition-colors"
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="text-white/70 text-sm min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={zoomIn}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg font-bold flex items-center justify-center transition-colors"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={close}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg font-bold flex items-center justify-center transition-colors ml-2"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Image */}
      <div className="overflow-auto max-h-[90vh] max-w-[95vw]">
        <img
          src={src}
          alt=""
          className="block transition-transform duration-200"
          style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
          draggable={false}
        />
      </div>
    </div>
  );
}
