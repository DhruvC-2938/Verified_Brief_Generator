import React from 'react';
import {
  Search,
  Database,
  FileText,
  BookOpen,
  Plus,
  Compass,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  onNewResearch: () => void;
  onOpenEvaluations: () => void;
  onViewPrompts?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeView: 'research' | 'evaluations';
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNewResearch,
  onOpenEvaluations,
  onViewPrompts,
  isCollapsed,
  onToggleCollapse,
  activeView,
}) => {
  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#f9fafb] border-r border-[#e5e7eb] flex flex-col justify-between transition-all duration-200 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Header & Brand */}
      <div className="p-3.5 space-y-4">
        {/* Brand Logo & Collapse Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNewResearch}
            className={`flex items-center gap-2.5 text-left group overflow-hidden cursor-pointer ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            title="Verified Academic Brief Generator"
          >
            {/* Perplexity Asterisk Mark in Teal */}
            <div className="w-8 h-8 rounded-lg bg-[#20808d] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#186974] transition-colors">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4.5 h-4.5"
              >
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="leading-tight">
                <span className="font-semibold text-sm text-[#111827] tracking-tight block">
                  Verified Academic
                </span>
                <span className="text-[11px] text-[#6b7280] font-sans">
                  Brief Generator
                </span>
              </div>
            )}
          </button>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-1 text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-md transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* New Research Pill Button (Iconic Perplexity Button) */}
        <div>
          <button
            onClick={onNewResearch}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#111827] bg-[#ffffff] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-full shadow-2xs transition-all cursor-pointer ${
              isCollapsed ? 'justify-center p-2' : 'justify-between'
            }`}
            title="Start New Research"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#20808d]" />
              {!isCollapsed && <span>New Research</span>}
            </div>
            {!isCollapsed && (
              <span className="font-mono text-[10px] text-[#9ca3af] bg-[#f9fafb] border border-[#e5e7eb] px-1.5 py-0.5 rounded">
                ⌘N
              </span>
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 font-sans text-xs pt-1">
          <button
            onClick={onNewResearch}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
              activeView === 'research'
                ? 'bg-[#e6f4f5] text-[#20808d] font-semibold'
                : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title="Research Home"
          >
            <Search className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Research</span>}
          </button>

          <button
            onClick={onOpenEvaluations}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
              activeView === 'evaluations'
                ? 'bg-[#e6f4f5] text-[#20808d] font-semibold'
                : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title="Library & Saved Evaluations"
          >
            <Database className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Library</span>}
          </button>

          <a
            href="/Prompt_Engineering_Documentation.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6] transition-all cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Prompt Documentation PDF"
          >
            <FileText className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Documentation PDF</span>}
          </a>
        </nav>
      </div>

      {/* Bottom Status / System Info */}
      <div className="p-3 border-t border-[#e5e7eb] space-y-2">
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="w-full flex justify-center p-1.5 text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-md transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="p-2.5 rounded-xl bg-white border border-[#e5e7eb] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[#111827] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                Live Grounding
              </span>
              <span className="text-[10px] font-mono text-[#6b7280]">v3.0</span>
            </div>
            <p className="text-[10px] text-[#6b7280] leading-snug">
              Gemini 2.5 Flash grounded with live Google Search index. Zero synthetic sources.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
