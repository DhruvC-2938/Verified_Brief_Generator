import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
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
  const isUnverifiedActive = normalizeStatus(activeStatusFilter) === 'unverified';

  return (
    <div className="bg-white rounded-3xl border border-[#e2e8f0] p-5 sm:p-6 shadow-card space-y-4 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f1f5f9]">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[#0f172a] flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-[#20808d]" />
            <span>Verification Rigor & Claim Ledger</span>
          </h3>
          <p className="text-xs text-[#64748b]">
            Empirical evidence breakdown across audited claims and primary literature
          </p>
        </div>

        {/* Rigor Score Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f4f5] border border-[#bce2e6] text-xs text-[#20808d] font-semibold self-start sm:self-auto shadow-2xs">
          <span>Verification Rigor:</span>
          <span className="font-mono text-sm font-bold">{metrics.verificationRigorScore}%</span>
        </div>
      </div>

      {/* 4 Perplexity Clean Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Supported */}
        <button
          type="button"
          onClick={() => onFilterStatus?.(isSupportedActive ? 'all' : 'supported')}
          className={`text-left p-4 rounded-2xl border transition-all cursor-pointer shadow-soft ${
            isSupportedActive
              ? 'bg-[#ecfdf5] border-[#10b981] ring-2 ring-[#10b981]/20'
              : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#ecfdf5]/50 hover:border-[#a7f3d0]'
          }`}
        >
          <div className="flex items-center justify-between text-[#047857] mb-1">
            <span className="text-xs font-semibold">Supported</span>
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a]">
            {metrics.supportedCount}
          </div>
          <div className="text-[11px] text-[#059669] mt-0.5">
            Directly corroborated
          </div>
        </button>

        {/* Partially Supported */}
        <button
          type="button"
          onClick={() => onFilterStatus?.(isPartialActive ? 'all' : 'partially_supported')}
          className={`text-left p-4 rounded-2xl border transition-all cursor-pointer shadow-soft ${
            isPartialActive
              ? 'bg-[#fffbeb] border-[#f59e0b] ring-2 ring-[#f59e0b]/20'
              : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#fffbeb]/50 hover:border-[#fde68a]'
          }`}
        >
          <div className="flex items-center justify-between text-[#b45309] mb-1">
            <span className="text-xs font-semibold">Partial</span>
            <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a]">
            {metrics.partiallySupportedCount}
          </div>
          <div className="text-[11px] text-[#b45309] mt-0.5">
            Limited scope / caveats
          </div>
        </button>

        {/* Contradicted */}
        <button
          type="button"
          onClick={() => onFilterStatus?.(isContradictedActive ? 'all' : 'contradicted')}
          className={`text-left p-4 rounded-2xl border transition-all cursor-pointer shadow-soft ${
            isContradictedActive
              ? 'bg-[#fef2f2] border-[#ef4444] ring-2 ring-[#ef4444]/20'
              : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#fef2f2]/50 hover:border-[#fecaca]'
          }`}
        >
          <div className="flex items-center justify-between text-[#b91c1c] mb-1">
            <span className="text-xs font-semibold">Contradicted</span>
            <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a]">
            {metrics.contradictedCount}
          </div>
          <div className="text-[11px] text-[#b91c1c] mt-0.5">
            Disputed by literature
          </div>
        </button>

        {/* Unverified */}
        <button
          type="button"
          onClick={() => onFilterStatus?.(isUnverifiedActive ? 'all' : 'unverified')}
          className={`text-left p-4 rounded-2xl border transition-all cursor-pointer shadow-soft ${
            isUnverifiedActive
              ? 'bg-[#f1f5f9] border-[#64748b] ring-2 ring-[#64748b]/20'
              : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
          }`}
        >
          <div className="flex items-center justify-between text-[#475569] mb-1">
            <span className="text-xs font-semibold">Unverified</span>
            <HelpCircle className="w-4 h-4 text-[#64748b]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a]">
            {metrics.unverifiedCount}
          </div>
          <div className="text-[11px] text-[#64748b] mt-0.5">
            Insufficient evidence
          </div>
        </button>
      </div>
    </div>
  );
};
