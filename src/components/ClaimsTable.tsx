import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Search,
  ExternalLink,
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

  // Keep internal filter synchronized when parent (e.g. top MetricsBar) changes filter
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

  const filterTabs = [
    { id: 'all', label: 'All', count: claims.length },
    { id: 'supported', label: 'Supported', count: supportedCount },
    { id: 'partially_supported', label: 'Partial', count: partialCount },
    { id: 'contradicted', label: 'Contradicted', count: contradictedCount },
  ];

  const renderStatusBadge = (status: VerificationStatus, confidenceScore: number) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'supported':
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-medium text-[#1c4e2f] bg-[#edf6f0] border border-[#c9dfd0] rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2b6d43]" />
              Supported
            </span>
            <span className="text-[10px] text-[#6b7582] font-sans pl-1">{confidenceScore}% match</span>
          </div>
        );
      case 'partially_supported':
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-medium text-[#7c511b] bg-[#fdf6ea] border border-[#ebd7b0] rounded-md">
              <AlertTriangle className="w-3.5 h-3.5 text-[#9c6523]" />
              Partially Supported
            </span>
            <span className="text-[10px] text-[#6b7582] font-sans pl-1">{confidenceScore}% match</span>
          </div>
        );
      case 'contradicted':
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-medium text-[#7f1d2a] bg-[#fdf1f2] border border-[#f5d0d6] rounded-md">
              <XCircle className="w-3.5 h-3.5 text-[#9e1c2d]" />
              Contradicted
            </span>
            <span className="text-[10px] text-[#8e2936] font-sans pl-1 font-medium">Refuted by source</span>
          </div>
        );
      case 'unverified':
      default:
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-medium text-[#505c6d] bg-[#f2ecdf] border border-[#ded4c2] rounded-md">
              <HelpCircle className="w-3.5 h-3.5 text-[#737f90]" />
              Unverified
            </span>
            <span className="text-[10px] text-[#6b7582] font-sans pl-1">Inconclusive</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Calm Notice */}
      <div className="p-4 bg-[#f8f3e8] border border-[#e7ddca] rounded-xl text-xs text-[#2b3a4f] leading-relaxed font-sans">
        <strong className="text-[#14233c]">Claim Verification:</strong> Every proposition stated in the brief is audited against source excerpts. Claims are designated <span className="text-[#1c4e2f] font-semibold">Supported</span> when the empirical text directly corroborates the assertion. Where evidence disputes an assertion, it is noted as <span className="text-[#7f1d2a] font-semibold">Contradicted</span>.
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Soft Warm Editorial filter pills */}
        <div className="flex items-center gap-1 p-1 bg-[#f1ebde] rounded-xl overflow-x-auto text-xs">
          {filterTabs.map((tab) => {
            const isSelected =
              tab.id === 'all'
                ? activeFilter === 'all' || !activeFilter
                : normalizeStatus(activeFilter) === normalizeStatus(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleFilterSelect(tab.id)}
                className={`px-3 py-1 font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#14233c] shadow-2xs font-semibold'
                    : 'text-[#5d6778] hover:text-[#14233c]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="ml-1 text-[11px] opacity-75">({tab.count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#7c8796] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified claims..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#fffdf9] rounded-lg border border-[#ded5c2] focus:outline-none focus:border-[#1b355a] font-sans text-[#1a2536]"
          />
        </div>
      </div>

      {/* Claims List - Spacious Grid on Full Width */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredClaims.map((claim) => (
          <div
            key={claim.id}
            className="p-5 rounded-2xl bg-[#fffdf9] border border-[#e5ddcb] shadow-xs flex flex-col justify-between gap-3 overflow-hidden max-w-full break-words hover:border-[#1b355a]/30 transition-colors"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 overflow-hidden max-w-full">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#7f1d2a] bg-[#fcf2f4] border border-[#f0cdd4] px-2 py-0.5 rounded">
                    {claim.id}
                  </span>
                  <span className="text-[11px] text-[#6a7482] font-sans">
                    Section: {claim.sectionRef || 'Findings'}
                  </span>
                </div>
                <p className="text-sm font-serif font-bold text-[#14233c] leading-snug break-words">
                  "{claim.claimText}"
                </p>
              </div>
              <div className="shrink-0">
                {renderStatusBadge(claim.status, claim.confidenceScore)}
              </div>
            </div>

            {/* Evidence excerpt comparison */}
            <div className="p-3 bg-[#f8f3e8] rounded-xl border border-[#e7ddca] text-xs space-y-1.5 font-sans overflow-hidden break-words">
              <div className="flex flex-wrap items-center justify-between gap-1 text-[#5e6978] text-[11px]">
                <span className="font-semibold text-[#14233c]">Source Evidence:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {claim.sourceIds.map((sid) => {
                    const src = getSource(sid);
                    return (
                      <button
                        key={sid}
                        type="button"
                        onClick={() => src && onOpenSourceModal?.(src)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#7f1d2a] hover:underline"
                      >
                        <span>[{sid}] {src?.publisher || 'Source'}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-[#2b3543] italic leading-relaxed break-words [overflow-wrap:anywhere]">
                "{claim.evidenceExcerpt}"
              </p>
            </div>

            {/* Explanation rationale */}
            <div className="text-xs text-[#525e6e] font-sans leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-semibold text-[#14233c]">Rationale: </span>
              {claim.rationale}
            </div>
          </div>
        ))}

        {filteredClaims.length === 0 && (
          <div className="text-center py-8 text-xs text-[#717b88] bg-[#fbf8f0] rounded-xl border border-[#e5ddcb]">
            No claims found matching this filter.
          </div>
        )}
      </div>
    </div>
  );
};
