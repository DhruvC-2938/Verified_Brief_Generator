import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Search,
  BookOpen,
  Quote,
  Building,
  Calendar,
  Globe,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { SourceItem, AcademicReference } from '../types/index.ts';

interface SourcesListProps {
  sources: SourceItem[];
  references?: AcademicReference[];
  onOpenSourceModal?: (source: SourceItem) => void;
}

export type CitationFormat = 'APA' | 'MLA' | 'Chicago' | 'BibTeX';

export const SourcesList: React.FC<SourcesListProps> = ({
  sources,
  references = [],
  onOpenSourceModal,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedBatch, setCopiedBatch] = useState(false);
  const [cardFormats, setCardFormats] = useState<Record<string, CitationFormat>>({});

  const formatCitation = (src: SourceItem, format: CitationFormat): string => {
    const isRedirect = src.url.includes('vertexaisearch.cloud.google.com') || !src.url.startsWith('http');
    const cleanUrl = isRedirect ? `https://${src.domain}` : src.url;
    const yearMatch = src.publishedDate.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : null;
    const isDateListed = src.publishedDate && src.publishedDate !== 'Unknown';

    switch (format) {
      case 'APA': {
        const datePart = year ? `(${year})` : '(n.d.)';
        return `${src.publisher}. ${datePart}. ${src.title}. Retrieved from ${cleanUrl}`;
      }
      case 'MLA': {
        const datePart = isDateListed ? `${src.publishedDate}, ` : '';
        return `${src.publisher}. "${src.title}." ${src.domain}, ${datePart}${cleanUrl}.`;
      }
      case 'Chicago': {
        const datePart = year ? `${year}. ` : '';
        return `${src.publisher}. "${src.title}." ${datePart}${cleanUrl}.`;
      }
      case 'BibTeX': {
        const citeKey = `${src.publisher.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)}_${year || 'nd'}`;
        return `@online{${citeKey},
  author = {${src.publisher}},
  title = {${src.title}},
  year = {${year || 'n.d.'}},
  url = {${cleanUrl}}
}`;
      }
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy citation:', err);
    }
  };

  const handleCopyAllCitations = async () => {
    try {
      const allText = filteredSources
        .map((s, idx) => `[${idx + 1}] ${formatCitation(s, 'APA')}`)
        .join('\n\n');
      await navigator.clipboard.writeText(allText);
      setCopiedBatch(true);
      setTimeout(() => setCopiedBatch(false), 2000);
    } catch (err) {
      console.error('Failed to copy all citations:', err);
    }
  };

  const setFormatForCard = (sourceId: string, format: CitationFormat) => {
    setCardFormats((prev) => ({ ...prev, [sourceId]: format }));
  };

  const filteredSources = sources.filter((src) => {
    if (selectedType !== 'all' && src.sourceType.toLowerCase().replace(/ /g, '_') !== selectedType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        src.title.toLowerCase().includes(q) ||
        src.publisher.toLowerCase().includes(q) ||
        src.domain.toLowerCase().includes(q) ||
        src.excerpt.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Filter and Search Bar (Perplexity Style) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#e5e7eb] shadow-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Sources', count: sources.length },
            { id: 'research_paper', label: 'Academic Papers', count: sources.filter((s) => s.sourceType === 'Research Paper').length },
            { id: 'government', label: 'Government', count: sources.filter((s) => s.sourceType === 'Government').length },
            { id: 'official_report', label: 'Official Reports', count: sources.filter((s) => s.sourceType === 'Official Report').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-[#20808d] text-white font-semibold shadow-xs'
                  : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 text-[11px] ${selectedType === tab.id ? 'opacity-90' : 'opacity-60'}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* Search & Bulk Export */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search references..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f9fafb] rounded-xl border border-[#e5e7eb] focus:outline-none focus:border-[#20808d] focus:bg-white text-[#111827] placeholder-[#9ca3af]"
            />
          </div>

          <button
            onClick={handleCopyAllCitations}
            disabled={filteredSources.length === 0}
            title="Copy all references formatted in APA"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f9fafb] hover:bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb] transition-colors whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
          >
            {copiedBatch ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="text-[#10b981]">All Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#6b7280]" />
                <span>Copy All (APA)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sources Grid in Perplexity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {filteredSources.map((source) => {
          const currentFormat = cardFormats[source.id] || 'APA';
          const citationText = formatCitation(source, currentFormat);
          const isDateKnown = source.publishedDate && source.publishedDate !== 'Unknown';

          return (
            <article
              key={source.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e2e8f0] shadow-soft hover:shadow-card hover:border-[#20808d]/60 flex flex-col justify-between gap-4 transition-all duration-200 group"
            >
              {/* Card Header: Source ID, Domain, Credibility */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#f1f5f9]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#20808d] bg-[#e6f4f5] border border-[#bce2e6] px-2.5 py-0.5 rounded-md shadow-2xs">
                    [{source.id}]
                  </span>
                  <span className="text-xs font-medium text-[#475569] bg-[#f1f5f9] px-2.5 py-0.5 rounded-md">
                    {source.sourceType}
                  </span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#20808d] hover:underline font-mono"
                  >
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=32`}
                      alt=""
                      className="w-3.5 h-3.5 rounded-xs"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span>{source.domain}</span>
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border shadow-2xs"
                    style={{
                      backgroundColor: source.credibilityScore >= 80 ? '#ecfdf5' : '#f8fafc',
                      borderColor: source.credibilityScore >= 80 ? '#a7f3d0' : '#e2e8f0',
                      color: source.credibilityScore >= 80 ? '#047857' : '#475569',
                    }}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{source.credibilityScore}% Rigor</span>
                  </div>
                </div>
              </div>

              {/* Title & Publisher */}
              <div className="space-y-1.5">
                <h4 className="text-base font-semibold text-[#111827] leading-snug break-words">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#20808d] transition-colors"
                  >
                    {source.title}
                  </a>
                </h4>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6b7280]">
                  <span className="inline-flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#9ca3af]" />
                    <span>Publisher: <strong className="text-[#111827] font-medium">{source.publisher}</strong></span>
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#9ca3af]" />
                    <span>
                      {isDateKnown ? (
                        <>Published: <strong className="text-[#111827] font-medium">{source.publishedDate}</strong></>
                      ) : (
                        <span className="italic text-[#9ca3af]">Date unlisted (n.d.)</span>
                      )}
                    </span>
                  </span>
                </div>
              </div>

              {/* Verbatim Retrieved Excerpt (Perplexity Pull-Quote) */}
              {source.excerpt && (
                <div className="relative pl-3.5 border-l-2 border-[#20808d]/30 py-0.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    <Quote className="w-3 h-3 text-[#20808d]" />
                    <span>Retrieved Empirical Evidence</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#374151] italic leading-relaxed break-words [overflow-wrap:anywhere]">
                    "{source.excerpt}"
                  </p>
                </div>
              )}

              {/* Multi-Format Citation Drawer */}
              <div className="p-3.5 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {/* Scholarly Format Tabs */}
                  <div className="flex items-center gap-1 bg-[#f3f4f6] p-0.5 rounded-lg text-[11px] font-medium">
                    {(['APA', 'MLA', 'Chicago', 'BibTeX'] as CitationFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setFormatForCard(source.id, fmt)}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                          currentFormat === fmt
                            ? 'bg-white text-[#111827] font-bold shadow-2xs'
                            : 'text-[#6b7280] hover:text-[#111827]'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(source.id, citationText)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#111827] bg-white hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedId === source.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#10b981]" />
                        <span className="text-[#10b981] font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#6b7280]" />
                        <span>Copy {currentFormat}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Formatted Citation Content */}
                {currentFormat === 'BibTeX' ? (
                  <pre className="p-2.5 rounded-lg bg-white border border-[#e5e7eb] font-mono text-[11px] text-[#111827] overflow-x-auto leading-relaxed select-all">
                    {citationText}
                  </pre>
                ) : (
                  <p className="text-xs text-[#374151] leading-relaxed break-words [overflow-wrap:anywhere] pl-3 border-l-2 border-[#20808d]/20">
                    <span className="font-semibold text-[#111827]">{source.publisher}</span>.{' '}
                    <span>{source.publishedDate && source.publishedDate !== 'Unknown' ? `(${source.publishedDate}).` : '(n.d.).'}</span>{' '}
                    <em className="italic">{source.title}</em>.{' '}
                    <span className="text-[#6b7280] text-xs">Retrieved from </span>
                    <span className="text-[#20808d] text-xs break-all underline-offset-2 hover:underline">
                      {source.domain}
                    </span>
                  </p>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-1 flex items-center justify-between text-xs font-sans">
                <button
                  type="button"
                  onClick={() => onOpenSourceModal?.(source)}
                  className="inline-flex items-center gap-1 text-[#20808d] hover:text-[#186974] font-medium underline-offset-4 hover:underline cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Audit Evidence</span>
                </button>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f9fafb] hover:bg-[#f3f4f6] text-[#111827] font-semibold transition-colors border border-[#e5e7eb]"
                >
                  <span>Open Primary Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </article>
          );
        })}

        {filteredSources.length === 0 && (
          <div className="col-span-full text-center py-12 text-xs text-[#6b7280] bg-white rounded-2xl border border-[#e5e7eb] space-y-2">
            <Search className="w-6 h-6 text-[#9ca3af] mx-auto" />
            <p className="font-medium">No references match your current search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
