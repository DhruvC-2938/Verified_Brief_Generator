import React, { useState } from 'react';
import { X, ExternalLink, Calendar, Building, Globe, ShieldCheck, Quote, Copy, Check } from 'lucide-react';
import { SourceItem, ClaimVerification } from '../types/index.ts';

interface SourceDetailModalProps {
  source: SourceItem | null;
  onClose: () => void;
  claims?: ClaimVerification[];
}

export const SourceDetailModal: React.FC<SourceDetailModalProps> = ({
  source,
  onClose,
  claims = [],
}) => {
  const [copied, setCopied] = useState(false);
  if (!source) return null;

  const associatedClaims = claims.filter((c) => c.sourceIds.includes(source.id));
  const cleanUrl = source.url.startsWith('http') ? source.url : `https://${source.domain}`;
  const yearMatch = source.publishedDate.match(/\d{4}/);
  const year = yearMatch ? yearMatch[0] : null;
  const apaCitation = `${source.publisher}. (${year || 'n.d.'}). ${source.title}. Retrieved from ${cleanUrl}`;

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(apaCitation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div
        className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#f3f4f6] flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#20808d] bg-[#e6f4f5] border border-[#bce2e6] px-2.5 py-0.5 rounded-md">
                [{source.id}]
              </span>
              <span className="text-xs font-medium text-[#4b5563] bg-[#f3f4f6] px-2 py-0.5 rounded-md">
                {source.sourceType}
              </span>
              <span className="text-xs font-mono text-[#047857] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#10b981]" />
                <span>{source.credibilityScore}% Rigor</span>
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[#111827] leading-snug">
              {source.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#f9fafb] rounded-xl border border-[#e5e7eb]">
            <div>
              <span className="text-[10px] uppercase text-[#6b7280] block font-semibold">Publisher</span>
              <span className="font-semibold text-[#111827] text-xs mt-0.5 block">{source.publisher}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#6b7280] block font-semibold">Domain</span>
              <span className="font-mono text-[#111827] text-xs mt-0.5 block">{source.domain}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#6b7280] block font-semibold">Publication Date</span>
              <span className="font-medium text-[#111827] text-xs mt-0.5 block">
                {source.publishedDate && source.publishedDate !== 'Unknown' ? source.publishedDate : 'Unlisted (n.d.)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#6b7280] block font-semibold">Authority Tier</span>
              <span className="font-medium text-[#20808d] text-xs mt-0.5 block">{source.credibilityTier}</span>
            </div>
          </div>

          {/* Verbatim Excerpt */}
          {source.excerpt && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5 text-[#20808d]" />
                <span>Extracted Empirical Excerpt</span>
              </div>
              <div className="p-3.5 bg-[#f9fafb] rounded-xl border-l-2 border-[#20808d] border border-[#e5e7eb] text-xs sm:text-sm italic text-[#374151] leading-relaxed">
                "{source.excerpt}"
              </div>
              <p className="text-[11px] text-[#6b7280] italic">
                {source.credibilityNotes}
              </p>
            </div>
          )}

          {/* Scholarly APA Reference */}
          <div className="p-3.5 bg-[#f9fafb] rounded-xl border border-[#e5e7eb] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                APA 7th Reference
              </span>
              <button
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#111827] bg-white border border-[#e5e7eb] rounded-md hover:bg-[#f3f4f6] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#10b981]" />
                    <span className="text-[#10b981]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-[#6b7280]" />
                    <span>Copy Citation</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-[#374151] leading-relaxed">
              {apaCitation}
            </p>
          </div>

          {/* Associated Claims */}
          {associatedClaims.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#f3f4f6]">
              <h4 className="text-xs font-semibold text-[#111827] uppercase tracking-wider">
                Corroborated Claims in Dossier ({associatedClaims.length})
              </h4>
              <div className="space-y-2">
                {associatedClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#20808d] font-bold">[{claim.id}]</span>
                      <span className="capitalize text-[#047857] font-medium bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-full text-[10px]">
                        {claim.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[#111827] text-xs leading-relaxed">
                      "{claim.claimText}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Link Button */}
          <div className="pt-3 border-t border-[#f3f4f6] flex justify-end">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#20808d] hover:bg-[#186974] text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <span>Visit Primary Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
