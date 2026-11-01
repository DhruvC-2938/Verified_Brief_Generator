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

  // Helper to format academic citations in multiple scholarly conventions
  const formatCitation = (src: SourceItem, format: CitationFormat): string => {
    const cleanUrl = src.url.startsWith('http') ? src.url : `https://${src.domain}`;
    const yearMatch = src.publishedDate.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : null;
    const isDateListed = src.publishedDate && src.publishedDate !== 'Unknown';

    switch (format) {
      case 'APA': {
        // APA 7th Edition: Author/Publisher. (Year or n.d.). Title. URL
        const datePart = year ? `(${year})` : '(n.d.)';
        return `${src.publisher}. ${datePart}. ${src.title}. Retrieved from ${cleanUrl}`;
      }
      case 'MLA': {
        // MLA 9th Edition: Publisher. "Title." Domain, Date, URL.
        const datePart = isDateListed ? `${src.publishedDate}, ` : '';
        return `${src.publisher}. "${src.title}." ${src.domain}, ${datePart}${cleanUrl}.`;
      }
      case 'Chicago': {
        // Chicago 17th Edition: Publisher. "Title." Accessed [Date]. URL.
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
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 bg-[#fffdf9] p-3 rounded-2xl border border-[#e5ddcb] shadow-2xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-sans">
          {[
            { id: 'all', label: 'All Sources', count: sources.length },
            { id: 'research_paper', label: 'Academic Papers', count: sources.filter((s) => s.sourceType === 'Research Paper').length },
            { id: 'government', label: 'Government', count: sources.filter((s) => s.sourceType === 'Government').length },
            { id: 'official_report', label: 'Reports', count: sources.filter((s) => s.sourceType === 'Official Report').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-[#14233c] text-white shadow-xs font-semibold'
                  : 'text-[#5d6778] hover:text-[#14233c] hover:bg-[#f3ece0]'
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
          <div className="relative flex-1 md:w-72">
            <Search className="w-3.5 h-3.5 text-[#7c8796] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, domain, publisher..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#fbf8f2] rounded-xl border border-[#ded5c2] focus:outline-none focus:border-[#14233c] focus:bg-white font-sans text-[#1a2536] placeholder-[#8d98a6]"
            />
          </div>

          <button
            onClick={handleCopyAllCitations}
            disabled={filteredSources.length === 0}
            title="Copy all visible references formatted in APA"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#f3ede1] hover:bg-[#eae2d3] text-[#14233c] border border-[#d8cfbe] transition-colors whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
          >
            {copiedBatch ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1b4e2c]" />
                <span className="text-[#1b4e2c] font-semibold">All Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#5e6b7c]" />
                <span>Copy All (APA)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sources Grid - Clean Academic Architecture */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filteredSources.map((source) => {
          const currentFormat = cardFormats[source.id] || 'APA';
          const citationText = formatCitation(source, currentFormat);
          const isDateKnown = source.publishedDate && source.publishedDate !== 'Unknown';

          return (
            <article
              key={source.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#fffdf9] border border-[#e5ddcb] shadow-xs flex flex-col justify-between gap-4.5 hover:border-[#14233c]/35 transition-all group"
            >
              {/* Card Header: Source ID, Domain, Credibility Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#eee7da]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#7f1d2a] bg-[#fcf2f4] border border-[#f0cdd4] px-2.5 py-0.5 rounded-md">
                    [{source.id}]
                  </span>
                  <span className="text-xs font-medium text-[#2d3a4f] bg-[#f5efe3] px-2 py-0.5 rounded-md">
                    {source.sourceType}
                  </span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#5e6978] hover:text-[#14233c] hover:underline font-mono"
                  >
                    <Globe className="w-3 h-3 text-[#7b8798]" />
                    <span>{source.domain}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium font-sans border"
                    style={{
                      backgroundColor: source.credibilityScore >= 80 ? '#eef7f0' : '#f7f4ed',
                      borderColor: source.credibilityScore >= 80 ? '#c9e8d1' : '#e0d8c7',
                      color: source.credibilityScore >= 80 ? '#1b4e2c' : '#495565',
                    }}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>{source.credibilityScore}% Rigor</span>
                  </div>
                </div>
              </div>

              {/* Title & Publisher Line */}
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-serif font-bold text-[#14233c] leading-snug break-words">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#7f1d2a] transition-colors"
                  >
                    {source.title}
                  </a>
                </h4>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5e6978] font-sans">
                  <span className="inline-flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#7b8798]" />
                    <span>Publisher: <strong className="text-[#14233c] font-semibold">{source.publisher}</strong></span>
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#7b8798]" />
                    <span>
                      {isDateKnown ? (
                        <>Published: <strong className="text-[#14233c] font-semibold">{source.publishedDate}</strong></>
                      ) : (
                        <span className="italic text-[#798595]">Date unlisted (n.d.)</span>
                      )}
                    </span>
                  </span>
                </div>
              </div>

              {/* Verbatim Retrieved Excerpt (Authentic Scholarly Pull-Quote) */}
              {source.excerpt && (
                <div className="relative pl-3.5 border-l-2 border-[#14233c]/30 py-0.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-[#5e6978] uppercase tracking-wider">
                    <Quote className="w-3 h-3 text-[#14233c]" />
                    <span>Retrieved Empirical Evidence</span>
                  </div>
                  <p className="text-xs sm:text-sm font-serif italic text-[#253245] leading-relaxed break-words [overflow-wrap:anywhere]">
                    "{source.excerpt}"
                  </p>
                </div>
              )}

              {/* Professional Citation Box (Replaces the clunky APA box) */}
              <div className="p-3.5 rounded-xl bg-[#faf7f0] border border-[#e8dfcf] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {/* Scholarly Format Tabs */}
                  <div className="flex items-center gap-1 bg-[#ede4d3] p-0.5 rounded-lg text-[11px] font-sans font-medium">
                    {(['APA', 'MLA', 'Chicago', 'BibTeX'] as CitationFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setFormatForCard(source.id, fmt)}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                          currentFormat === fmt
                            ? 'bg-[#ffffff] text-[#14233c] font-bold shadow-2xs'
                            : 'text-[#647082] hover:text-[#14233c]'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  {/* Copy Button with Smooth Micro-Interaction */}
                  <button
                    type="button"
                    onClick={() => handleCopy(source.id, citationText)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#14233c] bg-[#ffffff] hover:bg-[#f5efe3] border border-[#d8cfbe] rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedId === source.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#1b4e2c]" />
                        <span className="text-[#1b4e2c] font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#5e6c7d]" />
                        <span>Copy {currentFormat}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Formatted Citation Content */}
                {currentFormat === 'BibTeX' ? (
                  <pre className="p-2.5 rounded-lg bg-[#f3ede1] border border-[#ded5c2] font-mono text-[11px] text-[#14233c] overflow-x-auto leading-relaxed select-all">
                    {citationText}
                  </pre>
                ) : (
                  <p className="text-xs sm:text-sm font-serif text-[#28323f] leading-relaxed break-words [overflow-wrap:anywhere] pl-3 border-l-2 border-[#14233c]/20">
                    <span className="font-semibold text-[#14233c]">{source.publisher}</span>.{' '}
                    <span>{source.publishedDate && source.publishedDate !== 'Unknown' ? `(${source.publishedDate}).` : '(n.d.).'}</span>{' '}
                    <em className="italic">{source.title}</em>.{' '}
                    <span className="text-[#596677] text-xs">Retrieved from </span>
                    <span className="text-[#14233c] text-xs break-all underline-offset-2 hover:underline">
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
                  className="inline-flex items-center gap-1 text-[#7f1d2a] hover:text-[#531019] font-medium underline-offset-4 hover:underline cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Evidence Audit</span>
                </button>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef4fa] hover:bg-[#e0ebf5] text-[#152e4d] font-semibold transition-colors border border-[#c9d9e8]"
                >
                  <span>Open Primary Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </article>
          );
        })}

        {filteredSources.length === 0 && (
          <div className="col-span-full text-center py-12 text-xs text-[#717b88] bg-[#fbf8f0] rounded-2xl border border-[#e5ddcb] space-y-2">
            <Search className="w-6 h-6 text-[#99a5b5] mx-auto" />
            <p className="font-medium">No references match your current search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
