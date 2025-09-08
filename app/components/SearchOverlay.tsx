import React, { useRef, useEffect } from "react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (overlayRef.current && e.target === overlayRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-md p-6 bg-white/20 backdrop-blur-lg rounded-xl shadow-lg">
        <label className="flex items-center gap-2 w-full bg-white/30 backdrop-blur-md rounded-lg px-4 py-2">
          <svg
            className="h-5 w-5 text-white/70"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>

          <input
            type="search"
            className="flex-grow bg-transparent outline-none text-white placeholder-white/70 text-sm"
            placeholder="Search Stocks..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onClose();
              }
            }}
          />

          <kbd className="kbd kbd-sm bg-white/20 text-white">⌘</kbd>
          <kbd className="kbd kbd-sm bg-white/20 text-white">K</kbd>
        </label>
      </div>
    </div>
  );
};

export default SearchOverlay;
