import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ArrowUp,
  Sparkles,
  BookOpen,
  Globe,
  FileText,
  Building,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { BriefGenerationRequest, AcademicLevel, BriefLength } from '../types/index.ts';

interface ResearchFormProps {
  onSubmit: (params: BriefGenerationRequest) => void;
  onSelectSample?: (sampleKey: string) => void;
  isLoading: boolean;
}

export const ResearchForm: React.FC<ResearchFormProps> = ({ onSubmit, onSelectSample, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [researchQuestion, setResearchQuestion] = useState('');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('undergraduate');
  const [briefLength, setBriefLength] = useState<BriefLength>('medium');
  const [preferredSourceTypes, setPreferredSourceTypes] = useState<'all' | 'papers' | 'reports'>('all');
  const [showQuestionField, setShowQuestionField] = useState(false);

  const SUGGESTED_QUERIES = [
    'mRNA Vaccine Distribution Equity in LMICs',
    'Post-Quantum Cryptography & NIST Standards',
    'Impact of AI on Global Labor Productivity',
    'Direct Air Carbon Capture Efficacy & Energy Trade-offs',
  ];

  const DEMO_SAMPLES = [
    { key: 'mrna-vaccine-distribution', label: 'mRNA Distribution' },
    { key: 'post-quantum-cryptography', label: 'Post-Quantum Crypto' },
    { key: 'crispr-cas9-gene-editing', label: 'CRISPR Gene Editing' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onSubmit({
      topic: topic.trim(),
      researchQuestion: researchQuestion.trim() ? researchQuestion.trim() : undefined,
      academicLevel,
      briefLength,
      preferredSourceTypes,
    });
  };

  return (
    <div className="relative w-full max-w-4xl lg:max-w-5xl mx-auto py-10 sm:py-16 px-4">
      {/* Subtle Ambient Background Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[260px] bg-gradient-to-b from-[#20808d]/10 via-[#20808d]/4 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Centered Perplexity Hero Title */}
      <div className="text-center mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f4f5] text-[#20808d] text-xs font-semibold tracking-wide mb-1 border border-[#bce2e6] shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#20808d]" />
          <span>Real-Time Academic Research Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#111827] tracking-tight font-sans">
          Where knowledge begins.
        </h1>
        <p className="text-sm sm:text-base text-[#4b5563] max-w-xl mx-auto leading-relaxed">
          Synthesize publication-grade academic briefs grounded in verifiable peer-reviewed literature, official reports, and government archives.
        </p>
      </div>

      {/* Iconic Perplexity Floating Search Box */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-card hover:border-[#cbd5e1] focus-within:border-[#20808d] focus-within:ring-2 focus-within:ring-[#20808d]/15 p-5 sm:p-6 transition-all duration-200">
          <div className="space-y-3">
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask anything or enter a research inquiry (e.g. mRNA equity in LMICs, post-quantum NIST standards, AI labor productivity)..."
              className="w-full text-base sm:text-lg text-[#111827] placeholder:text-[#9ca3af] bg-transparent border-0 focus:outline-none focus:ring-0 resize-none font-sans leading-relaxed"
              required
            />

            {/* Optional Specific Question Input */}
            {showQuestionField && (
              <div className="pt-2.5 border-t border-[#f1f5f9]">
                <input
                  type="text"
                  value={researchQuestion}
                  onChange={(e) => setResearchQuestion(e.target.value)}
                  placeholder="Specific hypothesis or framing question (optional)..."
                  className="w-full px-3.5 py-2 text-xs text-[#111827] placeholder:text-[#9ca3af] bg-[#f8fafc] rounded-xl border border-[#e2e8f0] focus:outline-none focus:border-[#20808d] font-sans"
                />
              </div>
            )}
          </div>

          {/* Bottom Controls Bar inside Search Box */}
          <div className="pt-3.5 mt-2 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-3">
            {/* Focus Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Source Focus */}
              <div className="relative">
                <select
                  value={preferredSourceTypes}
                  onChange={(e) => setPreferredSourceTypes(e.target.value as any)}
                  className="appearance-none bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] text-[#374151] text-xs font-medium py-1.5 pl-3 pr-7 rounded-full focus:outline-none cursor-pointer transition-colors shadow-2xs"
                >
                  <option value="all">Focus: All Academic</option>
                  <option value="papers">Focus: Peer-Reviewed Papers</option>
                  <option value="reports">Focus: Official Reports</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Academic Level */}
              <div className="relative">
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                  className="appearance-none bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] text-[#374151] text-xs font-medium py-1.5 pl-3 pr-7 rounded-full focus:outline-none cursor-pointer transition-colors shadow-2xs"
                >
                  <option value="beginner">Introductory</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="advanced">Graduate / Advanced</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Length */}
              <div className="relative">
                <select
                  value={briefLength}
                  onChange={(e) => setBriefLength(e.target.value as BriefLength)}
                  className="appearance-none bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] text-[#374151] text-xs font-medium py-1.5 pl-3 pr-7 rounded-full focus:outline-none cursor-pointer transition-colors shadow-2xs"
                >
                  <option value="short">Concise Brief</option>
                  <option value="medium">Standard Brief</option>
                  <option value="long">Comprehensive Brief</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={() => setShowQuestionField(!showQuestionField)}
                className="text-xs text-[#20808d] hover:text-[#186974] font-medium px-2 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {showQuestionField ? 'Hide question' : '+ Add question'}
              </button>
            </div>

            {/* Perplexity Round Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isLoading || !topic.trim()
                  ? 'bg-[#f1f5f9] text-[#9ca3af] cursor-not-allowed'
                  : 'bg-[#20808d] hover:bg-[#186974] text-white shadow-md hover:shadow-lg cursor-pointer active:scale-95'
              }`}
              title="Search and synthesize brief"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Topic Exploration Cards */}
      <div className="mt-8 space-y-3.5">
        <div className="flex items-center gap-2 text-xs text-[#6b7280]">
          <Compass className="w-3.5 h-3.5 text-[#20808d]" />
          <span className="font-semibold text-[#374151]">Suggested Research Topics:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SUGGESTED_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => {
                setTopic(q);
                onSubmit({
                  topic: q,
                  academicLevel,
                  briefLength,
                  preferredSourceTypes,
                });
              }}
              disabled={isLoading}
              className="text-xs text-[#374151] hover:text-[#0f172a] bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#20808d]/50 p-3 rounded-2xl transition-all shadow-soft hover:shadow-md text-left cursor-pointer disabled:opacity-50 flex items-center justify-between group"
            >
              <span className="font-medium truncate pr-2">{q}</span>
              <ArrowUp className="w-3.5 h-3.5 rotate-45 text-[#9ca3af] group-hover:text-[#20808d] transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Demo Benchmarks Section */}
      {onSelectSample && (
        <div className="mt-8 p-4.5 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#e2e8f0] shadow-soft space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#111827] flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#fffbeb] text-[#92400e] border border-[#fde68a]">
                BENCHMARK DATA
              </span>
              <span>Pre-computed Demonstration Samples</span>
            </span>
            <span className="text-[11px] text-[#6b7280]">Instant verification preview</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {DEMO_SAMPLES.map((sample) => (
              <button
                key={sample.key}
                onClick={() => onSelectSample(sample.key)}
                disabled={isLoading}
                className="text-xs text-[#4b5563] hover:text-[#111827] bg-[#f8fafc] hover:bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
