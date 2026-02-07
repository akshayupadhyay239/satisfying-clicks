import React, { useState, useRef, useEffect, useMemo } from "react";
import { Howl } from "howler";
import popSound1 from "../assets/pop1.mp3";
import popSound2 from "../assets/pop2.mp3";
import popSound3 from "../assets/pop3.mp3";
import popSound4 from "../assets/pop4.mp3";
import popSound5 from "../assets/pop5.mp3";

const GRID_COLS_DESKTOP = 15;
const GRID_COLS_MOBILE = 10;
const GRID_ROWS = 20;

function createInitialGrid(cols: number) {
  return Array(GRID_ROWS)
    .fill(null)
    .map(() => Array(cols).fill(false));
}

const popHowl1 = new Howl({ src: [popSound1], volume: 0.5 });
const popHowl2 = new Howl({ src: [popSound2], volume: 0.5 });
const popHowl3 = new Howl({ src: [popSound3], volume: 0.5 });
const popHowl4 = new Howl({ src: [popSound4], volume: 0.5 });
const popHowl5 = new Howl({ src: [popSound5], volume: 0.5 });

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

interface BubbleWrapProps {
  onBack: () => void;
}

export default function BubbleWrap({ onBack }: BubbleWrapProps) {
  const isMobile = useIsMobile();
  const cols = isMobile ? GRID_COLS_MOBILE : GRID_COLS_DESKTOP;

  const [grid, setGrid] = useState(() => createInitialGrid(cols));
  const [isDragging, setIsDragging] = useState(false);
  const poppedThisDrag = useRef<Set<string>>(new Set());

  const prevCols = useRef(cols);
  useEffect(() => {
    if (prevCols.current !== cols) {
      prevCols.current = cols;
      setGrid(createInitialGrid(cols));
    }
  }, [cols]);

  const total = GRID_ROWS * cols;
  const poppedCount = useMemo(
    () => grid.reduce((sum, row) => sum + row.filter(Boolean).length, 0),
    [grid]
  );
  const allPopped = poppedCount === total;
  const progressPct = Math.round((poppedCount / total) * 100);

  useEffect(() => {
    const stopDrag = () => setIsDragging(false);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  }, []);

  const tryPopBubble = (rowIdx: number, colIdx: number) => {
    if (grid[rowIdx][colIdx]) return;
    const key = `${rowIdx}-${colIdx}`;
    if (poppedThisDrag.current.has(key)) return;
    poppedThisDrag.current.add(key);
    setGrid((prev) =>
      prev.map((row, r) =>
        row.map((popped, c) => (r === rowIdx && c === colIdx ? true : popped))
      )
    );
    const randomPop = Math.floor(Math.random() * 5) + 1;
    if (randomPop === 1) popHowl1.play();
    else if (randomPop === 2) popHowl2.play();
    else if (randomPop === 3) popHowl3.play();
    else if (randomPop === 4) popHowl4.play();
    else if (randomPop === 5) popHowl5.play();
  };

  useEffect(() => {
    if (!isDragging) poppedThisDrag.current.clear();
  }, [isDragging]);

  const handleMouseDown = (rowIdx: number, colIdx: number) => {
    setIsDragging(true);
    tryPopBubble(rowIdx, colIdx);
  };

  const handleMouseEnter = (rowIdx: number, colIdx: number) => {
    if (isDragging) tryPopBubble(rowIdx, colIdx);
  };

  const handleTouchStart = (
    rowIdx: number,
    colIdx: number,
    e: React.TouchEvent
  ) => {
    setIsDragging(true);
    tryPopBubble(rowIdx, colIdx);
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target instanceof HTMLElement && target.dataset.bubble) {
      const [rowIdx, colIdx] = target.dataset.bubble.split("-").map(Number);
      tryPopBubble(rowIdx, colIdx);
    }
  };

  const resetGrid = () => setGrid(createInitialGrid(cols));

  const bubbleSize = isMobile ? 24 : 32;
  const gap = isMobile ? 4 : 6;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 sm:p-4"
      style={{ backgroundColor: "#008080" }}
    >
      <div className="win95-window w-full max-w-2xl flex flex-col" style={{ maxHeight: "95vh" }}>
        {/* Title bar */}
        <div className="win95-titlebar">
          <span>Bubble Wrap Popper</span>
          <div className="flex gap-0.5">
            <button className="win95-titlebar-btn">_</button>
            <button className="win95-titlebar-btn">
              <span style={{ fontSize: "8px" }}>&#9633;</span>
            </button>
            <button className="win95-titlebar-btn" onClick={onBack}>
              X
            </button>
          </div>
        </div>

        {/* Menu bar */}
        <div
          className="px-1 py-0.5 text-xs"
          style={{
            backgroundColor: "#c0c0c0",
            borderBottom: "1px solid #808080",
          }}
        >
          <span className="px-1 hover:bg-[#000080] hover:text-white cursor-default">
            Game
          </span>
          <span
            className="px-1 hover:bg-[#000080] hover:text-white cursor-default"
            onClick={resetGrid}
          >
            New Sheet
          </span>
          <span
            className="px-1 hover:bg-[#000080] hover:text-white cursor-default"
            onClick={onBack}
          >
            Exit
          </span>
        </div>

        {/* Toolbar */}
        <div
          className="px-2 py-1 flex items-center gap-2 flex-wrap"
          style={{
            backgroundColor: "#c0c0c0",
            borderBottom: "1px solid #808080",
          }}
        >
          <button className="win95-button text-xs!" onClick={onBack}>
            &larr; Back
          </button>
          <button className="win95-button text-xs!" onClick={resetGrid}>
            New Sheet
          </button>

          <div className="flex-1" />

          <span className="text-xs" style={{ color: "#000000" }}>
            {allPopped ? (
              <span className="font-bold" style={{ color: "#000080" }}>
                All {total} popped! Great job!
              </span>
            ) : (
              <>
                {poppedCount} / {total} popped
              </>
            )}
          </span>
        </div>

        {/* Progress bar */}
        <div className="px-2 pt-1" style={{ backgroundColor: "#c0c0c0" }}>
          <div className="win95-progress-track">
            <div
              className="win95-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Bubble grid area */}
        <div
          className="flex-1 overflow-auto p-2 sm:p-3 flex justify-center"
          style={{
            backgroundColor: "#c0c0c0",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="win95-inset p-2 sm:p-3 inline-block" style={{ backgroundColor: "#e8ece8" }}>
            <div
              className="select-none"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, ${bubbleSize}px)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, ${bubbleSize}px)`,
                gap: `${gap}px`,
              }}
              onTouchMove={handleTouchMove}
              onMouseLeave={() => setIsDragging(false)}
              onMouseUp={() => setIsDragging(false)}
              onTouchEnd={() => setIsDragging(false)}
            >
              {grid.map((row, rowIdx) =>
                row.map((popped, colIdx) => (
                  <button
                    key={`${rowIdx}-${colIdx}`}
                    data-bubble={`${rowIdx}-${colIdx}`}
                    onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                    onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                    onTouchStart={(e) => handleTouchStart(rowIdx, colIdx, e)}
                    className={popped ? "bubble-popped" : "bubble-unpopped"}
                    style={{
                      width: bubbleSize,
                      height: bubbleSize,
                      padding: 0,
                      touchAction: "none",
                    }}
                    aria-label={popped ? "Popped" : "Pop bubble"}
                    disabled={popped}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="flex gap-1 px-1 pb-1"
          style={{ backgroundColor: "#c0c0c0" }}
        >
          <div
            className="win95-inset flex-1 px-2 py-0.5 text-[11px]"
            style={{ color: "#000000" }}
          >
            {allPopped ? "Complete!" : "Click or drag to pop bubbles"}
          </div>
          <div
            className="win95-inset px-2 py-0.5 text-[11px]"
            style={{ color: "#000000" }}
          >
            {progressPct}%
          </div>
        </div>
      </div>
    </div>
  );
}
