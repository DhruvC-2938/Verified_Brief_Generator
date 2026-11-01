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
    <div className="max-w-3xl mx-auto py-12 sm:py-20 px-4">
      {/* Centered Perplexity Hero Title */}
      <div className="text-center mb-8 space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f4f5] text-[#20808d] text-xs font-medium mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Grounded Epistemic Academic Synthesis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#111827] tracking-tight font-sans">
          Where knowledge begins.
        </h1>
        <p className="text-sm sm:text-base text-[#4b5563] max-w-xl mx-auto leading-relaxed">
          Search reputable academic papers, government registries, and verified literature to generate an authoritative brief.
        </p>
      </div>

      {/* Iconic Perplexity Floating Search Box */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm hover:border-[#cbd5e1] focus-within:border-[#20808d] focus-within:ring-2 focus-within:ring-[#20808d]/15 p-4 sm:p-5 transition-all">
          <div className="space-y-2">
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
              placeholder="Ask anything or enter an academic inquiry (e.g. mRNA equity in LMICs, post-quantum NIST standards, AI labor productivity)..."
              className="w-full text-base sm:text-lg text-[#111827] placeholder:text-[#9ca3af] bg-transparent border-0 focus:outline-none focus:ring-0 resize-none font-sans leading-relaxed"
              required
            />

            {/* Optional Specific Question Input */}
            {showQuestionField && (
              <div className="pt-2.5 border-t border-[#f3f4f6]">
                <input
                  type="text"
                  value={researchQuestion}
                  onChange={(e) => setResearchQuestion(e.target.value)}
                  placeholder="Specific hypothesis or focus question (optional)..."
                  className="w-full px-3 py-1.5 text-xs text-[#111827] placeholder:text-[#9ca3af] bg-[#f9fafb] rounded-lg border border-[#e5e7eb] focus:outline-none focus:border-[#20808d] font-sans"
                />
              </div>
            )}
          </div>

          {/* Bottom Controls Bar inside Search Box */}
          <div className="pt-3 mt-2 border-t border-[#f3f4f6] flex flex-wrap items-center justify-between gap-2.5">
            {/* Focus Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {/* Source Focus */}
              <div className="relative">
                <select
                  value={preferredSourceTypes}
                  onChange={(e) => setPreferredSourceTypes(e.target.value as any)}
                  className="appearance-none bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] text-[#374151] text-xs font-medium py-1 pl-2.5 pr-6 rounded-lg focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="all">Focus: All Academic</option>
                  <option value="papers">Focus: Peer-Reviewed Papers</option>
                  <option value="reports">Focus: Official Reports</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#9ca3af] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Academic Level */}
              <div className="relative">
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                  className="appearance-none bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] text-[#374151] text-xs font-medium py-1 pl-2.5 pr-6 rounded-lg focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="beginner">Introductory</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="advanced">Graduate / Advanced</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#9ca3af] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Length */}
              <div className="relative">
                <select
                  value={briefLength}
                  onChange={(e) => setBriefLength(e.target.value as BriefLength)}
                  className="appearance-none bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] text-[#374151] text-xs font-medium py-1 pl-2.5 pr-6 rounded-lg focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="short">Concise</option>
                  <option value="medium">Standard</option>
                  <option value="long">Detailed</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#9ca3af] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={() => setShowQuestionField(!showQuestionField)}
                className="text-xs text-[#20808d] hover:text-[#186974] font-medium px-1.5 py-1 rounded transition-colors"
              >
                {showQuestionField ? 'Hide question' : '+ Add question'}
              </button>
            </div>

            {/* Perplexity Round Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isLoading || !topic.trim()
                  ? 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'
                  : 'bg-[#20808d] hover:bg-[#186974] text-white shadow-xs cursor-pointer active:scale-95'
              }`}
              title="Search and synthesize brief"
            >
              <ArrowUp className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Topic Chips (Perplexity Style) */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-xs text-[#6b7280]">
          <Compass className="w-3.5 h-3.5 text-[#20808d]" />
          <span className="font-medium">Try exploring:</span>
        </div>

        <div className="flex flex-wrap gap-2">
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
              className="text-xs text-[#374151] hover:text-[#111827] bg-white hover:bg-[#f3f4f6] border border-[#e5e7eb] px-3 py-1.5 rounded-full transition-all shadow-2xs text-left cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Benchmarks Section */}
      {onSelectSample && (
        <div className="mt-8 p-4 bg-[#f9fafb] rounded-2xl border border-[#e5e7eb] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#111827] flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                DEMO DATA
              </span>
              <span>Pre-computed Benchmark Examples</span>
            </span>
            <span className="text-[11px] text-[#6b7280]">Zero API quota required</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {DEMO_SAMPLES.map((sample) => (
              <button
                key={sample.key}
                onClick={() => onSelectSample(sample.key)}
                disabled={isLoading}
                className="text-xs text-[#4b5563] hover:text-[#111827] bg-white hover:bg-[#f3f4f6] border border-[#e5e7eb] px-3 py-1 rounded-lg transition-colors cursor-pointer"
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
