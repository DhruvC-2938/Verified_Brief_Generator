import React from 'react';
import { Search, Database } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenEvaluations?: () => void;
  currentTopic?: string;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenEvaluations }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#f8f4ec]/95 backdrop-blur-md border-b border-[#e5ddcb] transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Main Website Name - Prominent Warm Scholarly */}
          <button
            onClick={onReset}
            className="text-left group focus:outline-none"
          >
            <span className="font-serif font-bold text-2xl sm:text-3xl text-[#14233c] tracking-tight block group-hover:text-[#7f1d2a] transition-colors">
              Verified Academic Brief Generator
            </span>
            <span className="text-xs text-[#5e6674] font-sans tracking-wide block mt-0.5">
              Evidence-based scholarly research and verified literature sources
            </span>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenEvaluations}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#14233c] hover:text-[#7f1d2a] bg-[#fffdf9] hover:bg-[#fbf7f0] border border-[#dcd3bf] rounded-lg transition-colors shadow-2xs cursor-pointer"
              title="View all saved research inputs, outputs, and evaluation metrics"
            >
              <Database className="w-3.5 h-3.5 text-[#7f1d2a]" />
              <span>Saved Evaluations</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#182a47] hover:text-[#0f1d33] bg-[#f1ebde] hover:bg-[#eae2d3] border border-[#d6ccb8] rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#4e5c70]" />
              <span>New Research</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
