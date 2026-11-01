import React from 'react';
import { Search, Database, Sparkles, BookOpen, ExternalLink, ShieldCheck, PanelLeft } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenEvaluations?: () => void;
  currentTopic?: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenEvaluations,
  currentTopic,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#fbfbfb]/90 backdrop-blur-md border-b border-[#e5e7eb] transition-all">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: Sidebar Toggle + Breadcrumb / Topic title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onToggleSidebar}
              className="p-1.5 text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-lg transition-colors cursor-pointer shrink-0"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeft className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={onReset}
              className="text-xs font-semibold text-[#111827] hover:text-[#20808d] transition-colors truncate hidden sm:inline-block cursor-pointer"
            >
              Verified Academic Brief
            </button>

            {currentTopic && (
              <>
                <span className="text-gray-300 hidden sm:inline">/</span>
                <span className="text-xs font-medium text-[#4b5563] truncate max-w-sm md:max-w-xl lg:max-w-2xl">
                  {currentTopic}
                </span>
              </>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenEvaluations}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#374151] hover:text-[#111827] bg-white hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg transition-all shadow-2xs cursor-pointer"
              title="Saved Evaluations Database & CSV"
            >
              <Database className="w-3.5 h-3.5 text-[#20808d]" />
              <span className="hidden sm:inline">Library</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#20808d] hover:bg-[#186974] rounded-lg transition-all shadow-2xs cursor-pointer"
              title="New Inquiry"
            >
              <Search className="w-3.5 h-3.5" />
              <span>New Search</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
