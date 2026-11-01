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
        } print:ml-0`}
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
        <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 space-y-6 print:p-0 print:m-0 print:space-y-4">
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
            <section className="space-y-5 animate-in fade-in duration-300">
              {/* Insufficient Evidence Warning Banner (Only if search failed) */}
              {brief.insufficientEvidence && (
                <div className="p-4 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-center gap-3 text-xs sm:text-sm text-[#b91c1c]">
                  <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0" />
                  <div>
                    <span className="font-bold block">Insufficient Verifiable Literature Found</span>
                    <span>{brief.insufficientEvidenceMessage || 'Zero usable authoritative sources were returned by search indices.'}</span>
                  </div>
                </div>
              )}

              {/* Clean Perplexity Minimal Navigation & Grounding Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0] print:hidden">
                {/* Segmented Pill Tabs */}
                <div className="bg-[#f1f5f9] p-1 rounded-2xl flex items-center gap-1 overflow-x-auto shadow-2xs">
                  <button
                    onClick={() => setActiveTab('brief')}
                    className={`py-1.5 px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 'brief'
                        ? 'bg-white text-[#0f172a] font-semibold shadow-soft'
                        : 'text-[#64748b] hover:text-[#0f172a]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#20808d]" />
                    <span>Academic Brief</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('claims')}
                    className={`py-1.5 px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 'claims'
                        ? 'bg-white text-[#0f172a] font-semibold shadow-soft'
                        : 'text-[#64748b] hover:text-[#0f172a]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#20808d]" />
                    <span>Claim Verification</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                        activeTab === 'claims'
                          ? 'bg-[#e6f4f5] text-[#20808d]'
                          : 'bg-[#e2e8f0] text-[#64748b]'
                      }`}
                    >
                      {brief.claims.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('sources')}
                    className={`py-1.5 px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 'sources'
                        ? 'bg-white text-[#0f172a] font-semibold shadow-soft'
                        : 'text-[#64748b] hover:text-[#0f172a]'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-[#20808d]" />
                    <span>Sources & Citations</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                        activeTab === 'sources'
                          ? 'bg-[#e6f4f5] text-[#20808d]'
                          : 'bg-[#e2e8f0] text-[#64748b]'
                      }`}
                    >
                      {brief.sources.length}
                    </span>
                  </button>
                </div>

                {/* Status Badges & Quick Action */}
                <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
                  {brief.isDemoSample ? (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#fffbeb] text-[#92400e] border border-[#fde68a] font-semibold">
                      DEMO BENCHMARK DATA
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      LIVE GROUNDED
                    </span>
                  )}

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#e6f4f5] text-[#20808d] border border-[#bce2e6] font-semibold">
                    {brief.metrics.verificationRigorScore}% Rigor
                  </span>

                  <button
                    onClick={() => setShowQueryForm(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg transition-colors cursor-pointer ml-1"
                    title="Start a new search"
                  >
                    <Search className="w-3.5 h-3.5 text-[#6b7280]" />
                    <span className="hidden md:inline">New Search</span>
                  </button>
                </div>
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
                  <div className="space-y-4">
                    <MetricsBar
                      metrics={brief.metrics}
                      onFilterStatus={(status) => {
                        setActiveStatusFilter(status);
                      }}
                      activeStatusFilter={activeStatusFilter}
                    />
                    <ClaimsTable
                      claims={brief.claims}
                      sources={brief.sources}
                      onOpenSourceModal={(src) => setSelectedSourceModal(src)}
                      selectedFilter={activeStatusFilter}
                      onFilterChange={(newFilter) => setActiveStatusFilter(newFilter)}
                    />
                  </div>
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
