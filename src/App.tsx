import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { ResearchForm } from './components/ResearchForm.tsx';
import { SynthesisLoader } from './components/SynthesisLoader.tsx';
import { MetricsBar } from './components/MetricsBar.tsx';
import { BriefViewer } from './components/BriefViewer.tsx';
import { ClaimsTable } from './components/ClaimsTable.tsx';
import { SourcesList } from './components/SourcesList.tsx';
import { SourceDetailModal } from './components/SourceDetailModal.tsx';
import { EvaluationsModal } from './components/EvaluationsModal.tsx';
import {
  AcademicBriefData,
  BriefGenerationRequest,
  SourceItem,
} from './types/index.ts';
import {
  BookOpen,
  CheckCircle2,
  Globe,
  FileText,
  AlertCircle,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [brief, setBrief] = useState<AcademicBriefData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'brief' | 'claims' | 'sources'>('brief');
  const [selectedSourceModal, setSelectedSourceModal] = useState<SourceItem | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [showQueryForm, setShowQueryForm] = useState(true);
  const [showEvaluationsModal, setShowEvaluationsModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Restore active brief from session storage across accidental refreshes or HMR
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('current_academic_brief');
      if (saved) {
        const parsed: AcademicBriefData = JSON.parse(saved);
        if (parsed && parsed.topic && parsed.executiveSummary) {
          setBrief(parsed);
          setCurrentTopic(parsed.topic);
          setShowQueryForm(false);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleReset = () => {
    setBrief(null);
    setShowQueryForm(true);
    setError(null);
    setCurrentTopic('');
    try {
      sessionStorage.removeItem('current_academic_brief');
    } catch {
      // ignore
    }
  };

  const handleLoadSample = async (sampleKey: string) => {
    setIsLoading(true);
    setError(null);
    setShowQueryForm(false);
    try {
      const res = await fetch(`/api/samples/${sampleKey}`);
      if (!res.ok) throw new Error('Failed to load sample brief.');
      const data: AcademicBriefData = await res.json();
      const demoBrief = { ...data, isDemoSample: true };
      setBrief(demoBrief);
      setCurrentTopic(data.topic);
      setActiveTab('brief');
      try {
        sessionStorage.setItem('current_academic_brief', JSON.stringify(demoBrief));
      } catch {
        // ignore
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load demo sample.');
      setShowQueryForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (params: BriefGenerationRequest) => {
    setIsLoading(true);
    setError(null);
    setCurrentTopic(params.topic);
    setStatusMessage('Querying reputable academic repositories & government databases...');
    setShowQueryForm(false);

    let isCompleted = false;

    try {
      const queryParams = new URLSearchParams({
        topic: params.topic,
        academicLevel: params.academicLevel,
        briefLength: params.briefLength,
        preferredSourceTypes: params.preferredSourceTypes,
      });
      if (params.researchQuestion) {
        queryParams.set('researchQuestion', params.researchQuestion);
      }

      const eventSource = new EventSource(`/api/stream?${queryParams.toString()}`);

      eventSource.addEventListener('status', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.message) setStatusMessage(data.message);
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener('stage_progress', (e) => {
        try {
          const update = JSON.parse(e.data);
          if (update.message) setStatusMessage(update.message);
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener('complete', (e) => {
        isCompleted = true;
        try {
          const completedBrief: AcademicBriefData = JSON.parse(e.data);
          setBrief(completedBrief);
          setActiveTab('brief');
          setIsLoading(false);
          try {
            sessionStorage.setItem('current_academic_brief', JSON.stringify(completedBrief));
          } catch {
            // ignore
          }
          eventSource.close();
        } catch {
          setError('Failed to parse completed brief.');
          setIsLoading(false);
          eventSource.close();
        }
      });

      eventSource.addEventListener('error', () => {
        eventSource.close();
        if (isCompleted) {
          return;
        }

        fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        })
          .then((res) => {
            if (!res.ok) throw new Error('Research brief generation failed');
            return res.json();
          })
          .then((data) => {
            isCompleted = true;
            setBrief(data);
            setActiveTab('brief');
            setIsLoading(false);
            try {
              sessionStorage.setItem('current_academic_brief', JSON.stringify(data));
            } catch {
              // ignore
            }
          })
          .catch((err) => {
            setError(err.message || 'Unable to complete research brief.');
            setIsLoading(false);
          });
      });
    } catch (err: any) {
      setError(err.message || 'Failed to initiate research generation.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#111827] flex font-sans antialiased selection:bg-[#e6f4f5] selection:text-[#20808d]">
      {/* Perplexity Sidebar */}
      <Sidebar
        onNewResearch={handleReset}
        onOpenEvaluations={() => setShowEvaluationsModal(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeView={showEvaluationsModal ? 'evaluations' : 'research'}
      />

      {/* Main Body Layout Shifted by Sidebar */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {/* Top Perplexity Minimal Header */}
        <Header
          onReset={handleReset}
          onOpenEvaluations={() => setShowEvaluationsModal(true)}
          currentTopic={brief?.topic || currentTopic}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Content Container - Full screen layout occupying entire available width */}
        <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 space-y-6">
          {/* Error Notice */}
          {error && (
            <div className="p-4 rounded-2xl bg-[#fef2f2] border border-[#fecaca] text-xs sm:text-sm text-[#b91c1c] flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => {
                  setError(null);
                  setShowQueryForm(true);
                }}
                className="text-xs font-semibold underline hover:text-[#991b1b] cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Search Input View (Perplexity Centered Hero) */}
          {(showQueryForm || !brief) && !isLoading && (
            <section className="transition-all animate-in fade-in duration-200">
              <ResearchForm
                onSubmit={handleGenerate}
                onSelectSample={handleLoadSample}
                isLoading={isLoading}
              />
            </section>
          )}

          {/* Perplexity Synthesis Loading State */}
          {isLoading && (
            <section className="animate-in fade-in duration-200">
              <SynthesisLoader
                statusMessage={statusMessage}
                topic={currentTopic}
              />
            </section>
          )}

          {/* Results View (Perplexity Light Layout) */}
          {brief && !isLoading && (
            <section className="space-y-6 animate-in fade-in duration-300">
              {/* Dossier Topic Bar */}
              {!showQueryForm && (
                <div className="space-y-3">
                  {/* Demo Data Banner when reviewing sample briefs */}
                  {brief.isDemoSample && (
                    <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fef3c7] flex items-center justify-between gap-3 text-xs text-[#92400e]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase tracking-wider bg-[#f59e0b] text-white px-2 py-0.5 rounded text-[10px]">
                          DEMO DATA
                        </span>
                        <span>
                          Viewing pre-computed benchmark data. This is stored demonstration data, not a live web search.
                        </span>
                      </div>
                      <button
                        onClick={handleReset}
                        className="text-xs font-semibold underline hover:text-[#78350f] shrink-0 cursor-pointer"
                      >
                        Run Live Research
                      </button>
                    </div>
                  )}

                  {/* Insufficient Evidence Warning Banner */}
                  {brief.insufficientEvidence && (
                    <div className="p-4 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-center gap-3 text-xs sm:text-sm text-[#b91c1c]">
                      <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0" />
                      <div>
                        <span className="font-bold block">Insufficient Verifiable Literature Found</span>
                        <span>{brief.insufficientEvidenceMessage || 'Zero usable authoritative sources were returned by search indices.'}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="bg-white p-4 rounded-2xl border border-[#e5e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#e6f4f5] text-[#20808d] flex items-center justify-center shrink-0 border border-[#bce2e6]">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#6b7280]">
                            Active Research Topic
                          </span>
                          {brief.isDemoSample ? (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#fef3c7] text-[#92400e] font-semibold border border-[#fde68a]">
                              DEMO SAMPLE
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#ecfdf5] text-[#047857] font-semibold border border-[#a7f3d0]">
                              LIVE GROUNDED
                            </span>
                          )}
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-[#111827] line-clamp-1">
                          {brief.topic}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowQueryForm(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#374151] hover:text-[#111827] bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-[#6b7280]" />
                      <span>New Inquiry</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Verification Rigor & Status Chips Bar */}
              <MetricsBar
                metrics={brief.metrics}
                onFilterStatus={(status) => {
                  setActiveStatusFilter(status);
                  setActiveTab('claims');
                }}
                activeStatusFilter={activeStatusFilter}
              />

              {/* Perplexity Styled Tabs Bar */}
              <div className="border-b border-[#e5e7eb] bg-white rounded-2xl p-1.5 shadow-2xs">
                <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto text-xs">
                  <button
                    onClick={() => setActiveTab('brief')}
                    className={`py-2 px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'brief'
                        ? 'bg-[#20808d] text-white font-semibold shadow-xs'
                        : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Academic Brief</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('claims')}
                    className={`py-2 px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'claims'
                        ? 'bg-[#20808d] text-white font-semibold shadow-xs'
                        : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Claim Verification</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        activeTab === 'claims'
                          ? 'bg-white/20 text-white'
                          : 'bg-[#f3f4f6] text-[#6b7280]'
                      }`}
                    >
                      {brief.claims.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('sources')}
                    className={`py-2 px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'sources'
                        ? 'bg-[#20808d] text-white font-semibold shadow-xs'
                        : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Sources & Citations</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        activeTab === 'sources'
                          ? 'bg-white/20 text-white'
                          : 'bg-[#f3f4f6] text-[#6b7280]'
                      }`}
                    >
                      {brief.sources.length}
                    </span>
                  </button>
                </nav>
              </div>

              {/* Active Tab Panel */}
              <div className="transition-all">
                {activeTab === 'brief' && (
                  <BriefViewer
                    brief={brief}
                    onOpenSourceModal={(src) => setSelectedSourceModal(src)}
                    onSelectTab={(tab) => setActiveTab(tab as any)}
                  />
                )}

                {activeTab === 'claims' && (
                  <ClaimsTable
                    claims={brief.claims}
                    sources={brief.sources}
                    onOpenSourceModal={(src) => setSelectedSourceModal(src)}
                    selectedFilter={activeStatusFilter}
                    onFilterChange={(newFilter) => setActiveStatusFilter(newFilter)}
                  />
                )}

                {activeTab === 'sources' && (
                  <SourcesList
                    sources={brief.sources}
                    references={brief.references}
                    onOpenSourceModal={(src) => setSelectedSourceModal(src)}
                  />
                )}
              </div>
            </section>
          )}
        </main>

        {/* Clean Perplexity Footer */}
        <footer className="border-t border-[#e5e7eb] bg-[#fbfbfb] py-6 mt-12 print:hidden text-center text-xs text-[#9ca3af]">
          <div className="w-full px-4">
            <p>Verified Academic Brief Generator • Powered by Gemini 2.5 Grounded Search • Zero-Fabrication Guarantee</p>
          </div>
        </footer>
      </div>

      {/* Source Detail Modal */}
      <SourceDetailModal
        source={selectedSourceModal}
        onClose={() => setSelectedSourceModal(null)}
        claims={brief?.claims}
      />

      {/* Saved Database Evaluations Modal */}
      <EvaluationsModal
        isOpen={showEvaluationsModal}
        onClose={() => setShowEvaluationsModal(false)}
      />
    </div>
  );
}
