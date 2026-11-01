import React, { useState } from 'react';
import { Search, ChevronDown, ArrowRight } from 'lucide-react';
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

  const DEMO_SAMPLES = [
    { key: 'mrna-vaccine-distribution', label: 'mRNA Vaccine Distribution' },
    { key: 'post-quantum-cryptography', label: 'Post-Quantum Cryptography' },
    { key: 'crispr-cas9-gene-editing', label: 'CRISPR Gene Editing Ethics' },
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
    <div className="max-w-5xl mx-auto py-10 sm:py-14">
      {/* Calm Hero Intro */}
      <div className="text-center mb-9 space-y-3">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#14233c] tracking-tight">
          Research Brief Generator
        </h1>
        <p className="text-sm sm:text-lg text-[#576170] max-w-2xl mx-auto font-sans leading-relaxed">
          Search across credible academic papers, government publications, and institutional reports to generate a verified, citation-backed brief.
        </p>
      </div>

      {/* Main Research Card */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#fffdf9] rounded-2xl border border-[#e5ddcb] shadow-xs p-5 sm:p-7 transition-all focus-within:border-[#1b355a] focus-within:ring-2 focus-within:ring-[#1b355a]/15">
          {/* Inquiry Input */}
          <div className="relative">
            <div className="absolute left-3 top-3.5 text-[#5a677a]">
              <Search className="w-5 h-5 text-[#1b355a]" />
            </div>
            <textarea
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What topic would you like to research? (e.g., Renewable energy adoption in emerging markets, impact of sleep on cognitive memory...)"
              className="w-full pl-11 pr-3 py-2 text-base text-[#1a2536] placeholder:text-[#919aa8] bg-transparent border-0 focus:outline-none focus:ring-0 resize-none font-sans"
              required
            />
          </div>

          {/* Optional specific research question */}
          {showQuestionField && (
            <div className="pt-3 mt-3 border-t border-[#eee7da]">
              <label className="block text-xs font-medium text-[#556172] mb-1">
                Specific Hypothesis or Question (Optional)
              </label>
              <input
                type="text"
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                placeholder="e.g., What empirical data exists on cost reduction and grid reliability?"
                className="w-full px-3.5 py-2 text-xs text-[#1a2536] placeholder:text-[#919aa8] bg-[#f7f2e7] rounded-xl border border-[#ded5c2] focus:outline-none focus:border-[#1b355a] font-sans"
              />
            </div>
          )}

          {/* Options Bar */}
          <div className="pt-4 mt-3 border-t border-[#eee7da] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Academic Level */}
              <div className="relative">
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                  className="appearance-none bg-[#f4eee2] hover:bg-[#eae3d5] border border-[#d8cfbe] text-[#25364f] text-xs font-medium py-1.5 pl-3 pr-7 rounded-lg focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="beginner">Beginner Level</option>
                  <option value="undergraduate">Undergraduate Level</option>
                  <option value="advanced">Graduate / Advanced</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#737f90] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Length */}
              <div className="relative">
                <select
                  value={briefLength}
                  onChange={(e) => setBriefLength(e.target.value as BriefLength)}
                  className="appearance-none bg-[#f4eee2] hover:bg-[#eae3d5] border border-[#d8cfbe] text-[#25364f] text-xs font-medium py-1.5 pl-3 pr-7 rounded-lg focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="short">Concise (~800 words)</option>
                  <option value="medium">Standard (~1,200 words)</option>
                  <option value="long">Detailed (~2,000 words)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#737f90] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Preferred Sources */}
              <div className="relative">
                <select
                  value={preferredSourceTypes}
                  onChange={(e) => setPreferredSourceTypes(e.target.value as any)}
                  className="appearance-none bg-[#f4eee2] hover:bg-[#eae3d5] border border-[#d8cfbe] text-[#25364f] text-xs font-medium py-1.5 pl-3 pr-7 rounded-lg focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="all">All Credible Sources</option>
                  <option value="papers">Peer-Reviewed Journals</option>
                  <option value="reports">Government & Official</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#737f90] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={() => setShowQuestionField(!showQuestionField)}
                className="text-xs text-[#7f1d2a] hover:text-[#58111c] font-medium transition-colors px-1 py-1"
              >
                {showQuestionField ? 'Fewer options' : '+ Add question'}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                isLoading || !topic.trim()
                  ? 'bg-[#e7e1d3] text-[#9a9e99] cursor-not-allowed'
                  : 'bg-[#182c4a] hover:bg-[#112036] text-white shadow-xs active:scale-[0.99]'
              }`}
            >
              <span>{isLoading ? 'Searching Sources...' : 'Generate Academic Brief'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quiet footnote & DEMO Samples Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs font-sans text-[#717b88]">
          <p>
            Default mode: <strong>Live Web Research</strong> with source-grounded verification.
          </p>

          {onSelectSample && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#9aa2ad] font-semibold">
                Explore Demo Data:
              </span>
              <div className="flex items-center gap-1.5">
                {DEMO_SAMPLES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => onSelectSample(s.key)}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#f2ecdf] hover:bg-[#eae1cf] text-[#14233c] hover:text-[#7f1d2a] transition-colors border border-[#ded5c2] cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
