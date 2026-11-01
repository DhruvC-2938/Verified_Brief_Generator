import React, { useEffect, useState } from 'react';
import { Database, FileSpreadsheet, Download, ExternalLink, RefreshCw, X, ShieldCheck } from 'lucide-react';

interface StoredRecord {
  id: string;
  timestamp: string;
  topic: string;
  academicLevel: string;
  briefLength: string;
  title: string;
  totalSources: number;
  totalClaims: number;
  supportedClaims: number;
  verificationRigorScore: number;
  averageCredibilityScore: number;
  automatedExportTriggered: boolean;
  exportedFilePath?: string;
}

interface EvaluationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvaluationsModal: React.FC<EvaluationsModalProps> = ({ isOpen, onClose }) => {
  const [records, setRecords] = useState<StoredRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/evaluations');
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error('Failed to load evaluations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e1726]/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div
        className="bg-[#fffdf9] rounded-2xl border border-[#e5ddcb] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#eee7da] flex items-center justify-between gap-4 bg-[#fffdf9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14233c] text-white flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-[#f4eee2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#14233c]">
                  Saved Research & Evaluations Database
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#f4ece0] text-[#7f1d2a] font-semibold">
                  Live Persistent Store
                </span>
              </div>
              <p className="text-xs text-[#5e6978] font-sans">
                Every research brief, query, and verification rubric is logged directly to disk (JSON & CSV).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecords}
              disabled={isLoading}
              className="p-2 text-[#5e6978] hover:text-[#14233c] hover:bg-[#f3ece0] rounded-lg transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#7c8796] hover:text-[#14233c] hover:bg-[#f3ece0] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar / Stats */}
        <div className="px-6 py-3 bg-[#f8f4ec] border-b border-[#eee7da] flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-[#5e6978]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#1b4e2c]" />
            <span>
              Total Saved Inquiries: <strong className="text-[#14233c]">{records.length}</strong>
            </span>
          </div>
          <div className="text-[11px] text-[#788392]">
            Data saved in: <code className="bg-[#eee7da] px-1.5 py-0.5 rounded font-mono text-[#14233c]">server/data/evaluations.csv</code>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {records.length === 0 ? (
            <div className="text-center py-12 text-sm text-[#7c8796] font-sans">
              No saved evaluations yet. Generate an academic brief to see it logged here automatically.
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((rec) => {
                const formattedDate = new Date(rec.timestamp).toLocaleString();
                return (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl bg-[#fffdf9] border border-[#e5ddcb] hover:border-[#14233c]/30 transition-all space-y-2.5 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f2ede4] text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#7f1d2a] bg-[#fcf2f4] border border-[#f0cdd4] px-2 py-0.5 rounded">
                          {rec.id}
                        </span>
                        <span className="capitalize font-medium text-[#14233c] font-sans">
                          {rec.academicLevel} Level
                        </span>
                        <span aria-hidden="true" className="text-[#d8cfbe]">·</span>
                        <span className="text-[#6b7582] font-sans">{formattedDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-sans text-[#1b4e2c] bg-[#eef6f0] border border-[#c9dfd0] px-2 py-0.5 rounded-full font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          Rigor: {rec.verificationRigorScore}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-serif font-bold text-[#14233c] leading-snug">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-[#5e6978] font-sans mt-0.5">
                        Topic: <strong className="text-[#2b3543]">"{rec.topic}"</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-sans text-[#636f7e]">
                      <div className="flex items-center gap-3">
                        <span>Sources Vetted: <strong className="text-[#14233c]">{rec.totalSources}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Audited Claims: <strong className="text-[#14233c]">{rec.totalClaims}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Supported: <strong className="text-[#1b4e2c]">{rec.supportedClaims}</strong></span>
                      </div>

                      {rec.automatedExportTriggered && (
                        <span className="text-[10px] text-[#7f1d2a] font-medium bg-[#fcf2f4] px-2 py-0.5 rounded border border-[#f0cdd4]">
                          Auto-Exported Markdown Dossier
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

