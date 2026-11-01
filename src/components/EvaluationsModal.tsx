import React, { useEffect, useState } from 'react';
import { Database, FileSpreadsheet, Download, ExternalLink, RefreshCw, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

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

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = [
      'ID',
      'Timestamp',
      'Topic',
      'Academic Level',
      'Brief Length',
      'Title',
      'Total Sources',
      'Total Claims',
      'Supported Claims',
      'Verification Rigor (%)',
      'Average Credibility (%)',
      'Automated Export Triggered',
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = records.map((r) => [
      escapeCsv(r.id),
      escapeCsv(new Date(r.timestamp).toISOString()),
      escapeCsv(r.topic),
      escapeCsv(r.academicLevel),
      escapeCsv(r.briefLength),
      escapeCsv(r.title),
      r.totalSources ?? 0,
      r.totalClaims ?? 0,
      r.supportedClaims ?? 0,
      r.verificationRigorScore ?? 0,
      r.averageCredibilityScore ?? 0,
      r.automatedExportTriggered ? 'TRUE' : 'FALSE',
    ]);

    // Prepend UTF-8 BOM so Microsoft Excel, Apple Numbers, and Google Sheets parse cleanly
    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `academic_evaluations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div
        className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#f3f4f6] flex items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#20808d] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-[#111827]">
                  Research Library & Evaluations Store
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#e6f4f5] text-[#20808d] font-semibold border border-[#bce2e6]">
                  Persistent Store
                </span>
              </div>
              <p className="text-xs text-[#6b7280]">
                Every research query, claim audit, and verification rubric is logged directly to disk (JSON & CSV).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecords}
              disabled={isLoading}
              className="p-2 text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-lg transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar / Stats */}
        <div className="px-6 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6b7280]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#047857]" />
            <span>
              Total Saved Research Runs: <strong className="text-[#111827]">{records.length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={handleExportCSV}
              disabled={records.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#f3f4f6] text-[#20808d] border border-[#e5e7eb] rounded-lg font-medium transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV Spreadsheet</span>
            </button>
          </div>
        </div>

        {/* Body Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {records.length === 0 ? (
            <div className="text-center py-16 space-y-2 text-[#6b7280]">
              <Database className="w-8 h-8 text-[#9ca3af] mx-auto" />
              <p className="text-sm font-medium text-[#111827]">No evaluations recorded yet.</p>
              <p className="text-xs">Run a live academic brief inquiry to automatically populate the persistent database.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-white border border-[#e5e7eb] hover:border-[#20808d] transition-all space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#20808d] bg-[#e6f4f5] px-2 py-0.5 rounded border border-[#bce2e6]">
                        {rec.id}
                      </span>
                      <span className="text-[11px] text-[#6b7280]">
                        {new Date(rec.timestamp).toLocaleString()}
                      </span>
                      <span className="capitalize px-1.5 py-0.2 rounded text-[10px] bg-[#f3f4f6] text-[#374151]">
                        {rec.academicLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#047857] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        {rec.verificationRigorScore}% Rigor
                      </span>
                    </div>
                  </div>

                  <div className="font-semibold text-sm text-[#111827]">
                    {rec.title}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#f3f4f6] text-[11px] text-[#6b7280]">
                    <div className="flex items-center gap-3">
                      <span>Sources: <strong className="text-[#111827]">{rec.totalSources}</strong></span>
                      <span>•</span>
                      <span>Claims: <strong className="text-[#111827]">{rec.totalClaims}</strong></span>
                      <span>•</span>
                      <span>Corroborated: <strong className="text-[#047857]">{rec.supportedClaims}</strong></span>
                    </div>

                    {rec.exportedFilePath && (
                      <span className="font-mono text-[10px] text-[#6b7280] truncate max-w-xs">
                        Export: {rec.exportedFilePath.split('/').pop()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
