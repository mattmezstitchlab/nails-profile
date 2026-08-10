"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Génère une fenêtre de pages à afficher (max 7 liens)
  const window = 3;
  const start = Math.max(1, currentPage - window);
  const end = Math.min(totalPages, currentPage + window);
  const pages: (number | "...")[] = [];
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 my-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-soft-gray/80 text-ink-light/60 hover:border-ink/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-2 text-ink-light/30">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-9 h-9 px-3 rounded-full text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-rose text-white shadow-sm"
                : "bg-white border border-soft-gray/80 text-ink-light/60 hover:border-ink/15"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-soft-gray/80 text-ink-light/60 hover:border-ink/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
