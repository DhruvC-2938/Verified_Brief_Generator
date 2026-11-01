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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e1726]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-[#ffffff] rounded-2xl border border-[#e5ddcb] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#eee7da] flex items-start justify-between gap-4 sticky top-0 bg-[#ffffff]/95 backdrop-blur-md z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#7f1d2a] bg-[#fcf2f4] border border-[#f0cdd4] px-2.5 py-0.5 rounded-md">
                [{source.id}]
              </span>
              <span className="text-xs font-medium text-[#2d3a4f] bg-[#f5efe3] px-2 py-0.5 rounded-md">
                {source.sourceType}
              </span>
              <span className="text-xs font-mono text-[#152e4d] bg-[#eef4fa] border border-[#c9d9e8] px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#152e4d]" />
                <span>{source.credibilityScore}% Rigor</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#14233c] leading-snug">
              {source.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#7c8796] hover:text-[#14233c] hover:bg-[#f3ece0] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 font-sans text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#faf7f0] rounded-xl border border-[#e8dfcf]">
            <div>
              <span className="text-[10px] uppercase font-sans text-[#707c8d] block font-semibold">Publisher</span>
              <span className="font-semibold text-[#14233c] text-xs mt-0.5 block">{source.publisher}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-sans text-[#707c8d] block font-semibold">Domain</span>
              <span className="font-mono text-[#14233c] text-xs mt-0.5 block">{source.domain}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-sans text-[#707c8d] block font-semibold">Publication Date</span>
              <span className="font-medium text-[#14233c] text-xs mt-0.5 block">
                {source.publishedDate && source.publishedDate !== 'Unknown' ? source.publishedDate : 'Unlisted (n.d.)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-sans text-[#707c8d] block font-semibold">Authority Tier</span>
              <span className="font-medium text-[#182c4a] text-xs mt-0.5 block">{source.credibilityTier}</span>
            </div>
          </div>

          {/* Verbatim Excerpt */}
          {source.excerpt && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5e6978] uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5 text-[#14233c]" />
                <span>Extracted Empirical Excerpt</span>
              </div>
              <div className="p-4 bg-[#faf7f0] rounded-xl border-l-3 border-[#14233c] border border-[#e8dfcf] text-xs sm:text-sm font-serif italic text-[#253245] leading-relaxed">
                "{source.excerpt}"
              </div>
              <p className="text-[11px] text-[#636f7e] italic">
                {source.credibilityNotes}
              </p>
            </div>
          )}

          {/* Scholarly APA Reference */}
          <div className="p-3.5 bg-[#faf7f0] rounded-xl border border-[#e8dfcf] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#5e6978] uppercase tracking-wider">
                APA 7th Reference
              </span>
              <button
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#14233c] bg-white border border-[#ded5c2] rounded-md hover:bg-[#f5efe3] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#1b4e2c]" />
                    <span className="text-[#1b4e2c]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-[#647082]" />
                    <span>Copy Citation</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs font-serif text-[#253245] leading-relaxed">
              {apaCitation}
            </p>
          </div>

          {/* Associated Claims */}
          {associatedClaims.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#eee7da]">
              <h4 className="text-xs font-semibold text-[#14233c] uppercase tracking-wider">
                Corroborated Claims in Dossier ({associatedClaims.length})
              </h4>
              <div className="space-y-2">
                {associatedClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-3 rounded-xl bg-[#faf7f0] border border-[#e8dfcf] text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#7f1d2a] font-bold">[{claim.id}]</span>
                      <span className="capitalize text-[#1b4e2c] font-medium bg-[#eef7f0] border border-[#c9e8d1] px-2 py-0.5 rounded-full text-[10px]">
                        {claim.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[#1e293b] font-serif text-xs leading-relaxed">
                      "{claim.claimText}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Link Button */}
          <div className="pt-3 border-t border-[#eee7da] flex justify-end">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14233c] hover:bg-[#0c1626] text-white text-xs font-semibold transition-colors shadow-xs"
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
