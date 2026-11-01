import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Search,
  ExternalLink,
  ShieldCheck,
  Quote,
} from 'lucide-react';
import { ClaimVerification, SourceItem, VerificationStatus } from '../types/index.ts';

interface ClaimsTableProps {
  claims: ClaimVerification[];
  sources: SourceItem[];
  onOpenSourceModal?: (source: SourceItem) => void;
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  initialFilter?: string;
}

const normalizeStatus = (status: string | undefined): string => {
  const s = (status || '').toLowerCase().trim().replace(/[\s-]+/g, '_');
  if (s === 'partial' || s === 'partially_supported') return 'partially_supported';
  if (s === 'supported') return 'supported';
  if (s === 'contradicted' || s === 'refuted') return 'contradicted';
  if (s === 'unverified') return 'unverified';
  return s;
};

export const ClaimsTable: React.FC<ClaimsTableProps> = ({
  claims,
  sources,
  onOpenSourceModal,
  selectedFilter,
  onFilterChange,
  initialFilter = 'all',
}) => {
  const [internalFilter, setInternalFilter] = useState<string>(selectedFilter || initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (selectedFilter !== undefined) {
      setInternalFilter(selectedFilter);
    }
  }, [selectedFilter]);

  const activeFilter = selectedFilter !== undefined ? selectedFilter : internalFilter;

  const handleFilterSelect = (newFilter: string) => {
    setInternalFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const filteredClaims = claims.filter((claim) => {
    if (activeFilter !== 'all') {
      const claimStatus = normalizeStatus(claim.status);
      const targetFilter = normalizeStatus(activeFilter);
      if (claimStatus !== targetFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        claim.claimText.toLowerCase().includes(q) ||
        claim.rationale.toLowerCase().includes(q) ||
        claim.evidenceExcerpt.toLowerCase().includes(q) ||
        claim.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSource = (sourceId: string): SourceItem | undefined => {
    return sources.find((s) => s.id === sourceId);
  };

  const supportedCount = claims.filter((c) => normalizeStatus(c.status) === 'supported').length;
  const partialCount = claims.filter((c) => normalizeStatus(c.status) === 'partially_supported').length;
  const contradictedCount = claims.filter((c) => normalizeStatus(c.status) === 'contradicted').length;
  const unverifiedCount = claims.filter((c) => normalizeStatus(c.status) === 'unverified').length;

  const filterTabs = [
    { id: 'all', label: 'All Claims', count: claims.length },
    { id: 'supported', label: 'Supported', count: supportedCount },
    { id: 'partially_supported', label: 'Partial', count: partialCount },
    { id: 'contradicted', label: 'Contradicted', count: contradictedCount },
    { id: 'unverified', label: 'Unverified', count: unverifiedCount },
  ];

  const renderStatusBadge = (status: VerificationStatus, confidenceScore: number) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'supported':
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#047857] bg-[#ecfdf5] border border-[#a7f3d0] rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              Supported
            </span>
            <span className="text-[10px] text-[#6b7280] font-mono pl-1">{confidenceScore}% match</span>
          </div>
        );
      case 'partially_supported':
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#b45309] bg-[#fffbeb] border border-[#fde68a] rounded-md">
              <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
              Partial
            </span>
            <span className="text-[10px] text-[#6b7280] font-mono pl-1">{confidenceScore}% match</span>
          </div>
        );
      case 'contradicted':
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca] rounded-md">
              <XCircle className="w-3.5 h-3.5 text-[#ef4444]" />
              Contradicted
            </span>
            <span className="text-[10px] text-[#6b7280] font-mono pl-1">{confidenceScore}% confidence</span>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#4b5563] bg-[#f3f4f6] border border-[#e5e7eb] rounded-md">
              <HelpCircle className="w-3.5 h-3.5 text-[#6b7280]" />
              Unverified
            </span>
            <span className="text-[10px] text-[#6b7280] font-mono pl-1">{confidenceScore}% match</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Filter and Search Bar (Perplexity Style) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#e5e7eb] shadow-xs">
        {/* Soft Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterSelect(tab.id)}
              className={`px-3 py-1.5 font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                normalizeStatus(activeFilter) === normalizeStatus(tab.id)
                  ? 'bg-[#20808d] text-white font-semibold shadow-xs'
                  : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1 text-[11px] ${normalizeStatus(activeFilter) === normalizeStatus(tab.id) ? 'opacity-90' : 'opacity-60'}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claims or excerpts..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f9fafb] rounded-xl border border-[#e5e7eb] focus:outline-none focus:border-[#20808d] focus:bg-white text-[#111827] placeholder-[#9ca3af]"
          />
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {filteredClaims.map((claim) => (
          <div
            key={claim.id}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e2e8f0] shadow-soft hover:shadow-card hover:border-[#20808d]/60 space-y-3.5 transition-all duration-200"
          >
            {/* Header: ID, Section, Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#20808d] bg-[#e6f4f5] border border-[#bce2e6] px-2.5 py-0.5 rounded-md shadow-2xs">
                  [{claim.id}]
                </span>
                <span className="text-xs text-[#64748b]">
                  Section: <strong className="text-[#0f172a] font-medium">{claim.sectionRef}</strong>
                </span>
              </div>

              <div>{renderStatusBadge(claim.status, claim.confidenceScore)}</div>
            </div>

            {/* Factual Claim Assertion */}
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-[#0f172a] leading-snug">
                "{claim.claimText}"
              </h4>
            </div>

            {/* Verbatim Retrieved Excerpt Pull-Quote */}
            <div className="p-4 rounded-2xl bg-[#f8fafc] border-l-4 border-l-[#20808d] border border-[#e2e8f0] text-xs space-y-1 shadow-2xs">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">
                Retrieved Empirical Excerpt
              </span>
              <p className="text-[#334155] italic leading-relaxed">
                "{claim.evidenceExcerpt}"
              </p>
            </div>

            {/* Verification Rationale & Sources */}
            <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="text-[#64748b] text-xs flex-1">
                <span className="font-semibold text-[#475569]">Audit Rationale: </span>
                <span className="text-[#334155]">{claim.rationale}</span>
              </div>

              {/* Source Link Chips */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] text-[#9ca3af]">Cited Sources:</span>
                {claim.sourceIds.map((sid) => {
                  const src = getSource(sid);
                  return (
                    <button
                      key={sid}
                      onClick={() => src && onOpenSourceModal?.(src)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#e6f4f5] hover:bg-[#cbebee] text-[#20808d] border border-[#bce2e6] text-[11px] font-mono font-semibold transition-colors cursor-pointer"
                      title={src ? `${src.publisher}: ${src.title}` : `Source ${sid}`}
                    >
                      <span>{sid}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {filteredClaims.length === 0 && (
          <div className="text-center py-12 text-xs text-[#6b7280] bg-white rounded-2xl border border-[#e5e7eb] space-y-2">
            <Search className="w-6 h-6 text-[#9ca3af] mx-auto" />
            <p className="font-medium">No factual claims match this filter or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
