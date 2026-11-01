import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, BookOpen } from 'lucide-react';
import { AcademicBriefData } from '../types/index.ts';

interface MetricsBarProps {
  metrics: AcademicBriefData['metrics'];
  onFilterStatus?: (status: string) => void;
  activeStatusFilter?: string;
}

const normalizeStatus = (status: string | undefined): string => {
  const s = (status || '').toLowerCase().trim().replace(/[\s-]+/g, '_');
  if (s === 'partial' || s === 'partially_supported') return 'partially_supported';
  if (s === 'supported') return 'supported';
  if (s === 'contradicted' || s === 'refuted') return 'contradicted';
  return s;
};

export const MetricsBar: React.FC<MetricsBarProps> = ({
  metrics,
  onFilterStatus,
  activeStatusFilter = 'all',
}) => {
  const isSupportedActive = normalizeStatus(activeStatusFilter) === 'supported';
  const isPartialActive = normalizeStatus(activeStatusFilter) === 'partially_supported';
  const isContradictedActive = normalizeStatus(activeStatusFilter) === 'contradicted';

  return (
    <div className="bg-[#fffdf9] rounded-2xl border border-[#e5ddcb] p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eee7da]">
        <div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#14233c]">
            Research Summary & Evidence Check
          </h3>
          <p className="text-xs text-[#5e6978] font-sans">
            Overview of examined claims and verified references
          </p>
        </div>

        {/* Verification Rigor Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#eef4fa] border border-[#c9d9e8] text-xs font-sans text-[#163252] self-start sm:self-auto">
          <span className="font-semibold">Verification Rigor:</span>
          <span className="font-mono font-bold text-[#142d4a]">{metrics.verificationRigorScore}%</span>
        </div>
      </div>

      {/* 4 Soft Editorial Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {/* Supported */}
        <button
          type="button"
          onClick={() => onFilterStatus?.(isSupportedActive ? 'all' : 'supported')}
          className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
            isSupportedActive
              ? 'bg-[#e4efe7] border-[#86bc95] ring-2 ring-[#86bc95]'
              : 'bg-[#eff6f1] border-[#cfe1d4] hover:bg-[#e4efe7]'
          }`}
        >
          <div className="flex items-center justify-between text-[#1c4e2f] mb-1">
            <span className="text-xs font-medium font-sans">Supported</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2b6d43]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#133c23]">
            {metrics.supportedCount}
          </div>
          <div className="text-[11px] text-[#3e6f4f] mt-0.5">
            Verified by literature
          </div>
        </button>

        {/* Partially Supported */}
        <button
          type="button"
          onClick={() => onFilterStatus?.(isPartialActive ? 'all' : 'partially_supported')}
          className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
            isPartialActive
              ? 'bg-[#faeed3] border-[#deb974] ring-2 ring-[#deb974]'
              : 'bg-[#fdf8eb] border-[#eddcb9] hover:bg-[#fbf1db]'
          }`}
        >
          <div className="flex items-center justify-between text-[#7c511b] mb-1">
            <span className="text-xs font-medium font-sans">Partial</span>
            <AlertCircle className="w-3.5 h-3.5 text-[#9c6523]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#57360c]">
            {metrics.partiallySupportedCount}
          </div>
          <div className="text-[11px] text-[#845b25] mt-0.5">
            Directional evidence
          </div>
        </button>

        {/* Contradicted */}
        <button
          type="button"
          onClick={() => onFilterStatus?.(isContradictedActive ? 'all' : 'contradicted')}
          className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
            isContradictedActive
              ? 'bg-[#fae2e5] border-[#d88c97] ring-2 ring-[#d88c97]'
              : 'bg-[#fdf1f2] border-[#f5d0d6] hover:bg-[#fce5e8]'
          }`}
        >
          <div className="flex items-center justify-between text-[#7f1d2a] mb-1">
            <span className="text-xs font-medium font-sans">Contradicted</span>
            <HelpCircle className="w-3.5 h-3.5 text-[#9e1c2d]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#5c101c]">
            {metrics.contradictedCount}
          </div>
          <div className="text-[11px] text-[#8e2936] mt-0.5">
            {metrics.contradictedCount > 0 ? 'Refuted by source data' : '0 false assertions'}
          </div>
        </button>

        {/* Discovered Sources */}
        <div className="p-3.5 rounded-xl bg-[#f0f5fa] border border-[#d1e0ee]">
          <div className="flex items-center justify-between text-[#152e4d] mb-1">
            <span className="text-xs font-medium font-sans">Sources Vetted</span>
            <BookOpen className="w-3.5 h-3.5 text-[#1b3a5e]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#0f2138]">
            {metrics.sourcesRetained}
          </div>
          <div className="text-[11px] text-[#3e5b7c] mt-0.5">
            Average credibility: {metrics.averageSourceCredibility}%
          </div>
        </div>
      </div>
    </div>
  );
};
