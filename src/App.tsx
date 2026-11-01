import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
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
    setStatusMessage('Searching reputable sources and extracting empirical evidence...');
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
        // If already completed, do NOT trigger redundant fallback request
        if (isCompleted) {
          return;
        }

        // Fallback to standard POST endpoint if SSE drops prematurely
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
    <div className="min-h-screen bg-[#f8f4ec] text-[#222f3e] flex flex-col font-sans">
      {/* Warm Editorial Header */}
      <Header
        onReset={handleReset}
        onOpenEvaluations={() => setShowEvaluationsModal(true)}
        currentTopic={brief?.topic || currentTopic}
      />

      {/* Main Container - Full Width Occupancy */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 space-y-6 overflow-x-hidden">
        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-xl bg-[#fdf1f2] border border-[#f5d0d6] text-xs sm:text-sm text-[#7f1d2a] flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#9e1c2d] shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => {
                setError(null);
                setShowQueryForm(true);
              }}
              className="text-xs underline font-medium hover:text-[#531019]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Search Input View */}
        {(showQueryForm || !brief) && !isLoading && (
          <section className="transition-all">
            <ResearchForm
              onSubmit={handleGenerate}
              onSelectSample={handleLoadSample}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* Warm Editorial Loading Screen */}
        {isLoading && (
          <section className="animate-in fade-in duration-200">
            <SynthesisLoader
              statusMessage={statusMessage}
              topic={currentTopic}
            />
          </section>
        )}

        {/* Results View */}
        {brief && !isLoading && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Dossier Title & Edit Bar */}
            {!showQueryForm && (
              <div className="space-y-3">
                {/* Demo Data Banner when reviewing sample briefs */}
                {brief.isDemoSample && (
                  <div className="p-3.5 rounded-xl bg-[#fbf5ea] border border-[#ecdab3] flex items-center justify-between gap-3 text-xs font-sans text-[#7c511b]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase tracking-wider bg-[#7c511b] text-white px-2 py-0.5 rounded text-[10px]">
                        DEMO DATA
                      </span>
                      <span>
                        You are viewing a predefined benchmark example. This is stored demonstration data, not a live web search.
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleReset();
                      }}
                      className="text-xs font-semibold underline hover:text-[#57360c] shrink-0"
                    >
                      Run Live Research
                    </button>
                  </div>
                )}

                {/* Insufficient Evidence Warning Banner */}
                {brief.insufficientEvidence && (
                  <div className="p-4 rounded-xl bg-[#faece9] border border-[#f3cec7] flex items-center gap-3 text-xs sm:text-sm text-[#7f2f27] font-sans">
                    <AlertCircle className="w-5 h-5 text-[#9c3930] shrink-0" />
                    <div>
                      <span className="font-bold block">Insufficient Verifiable Literature Found</span>
                      <span>{brief.insufficientEvidenceMessage || 'Zero usable authoritative sources were returned by search indices.'}</span>
                    </div>
                  </div>
                )}

                <div className="bg-[#fffdf9] p-4 rounded-xl border border-[#e5ddcb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#eef4fa] text-[#182c4a] flex items-center justify-center shrink-0 border border-[#c9d9e8]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-sans text-[#5e6978]">
                          Research Topic
                        </span>
                        {brief.isDemoSample ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#faeed3] text-[#7c511b] font-semibold border border-[#eedcb9]">
                            DEMO SAMPLE
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#eef6f0] text-[#1b4e2c] font-semibold border border-[#c9dfd0]">
                            LIVE RESEARCH
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-serif font-bold text-[#14233c] line-clamp-1">
                        {brief.topic}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowQueryForm(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#182c4a] hover:text-[#0f1d33] bg-[#f4ece0] hover:bg-[#eae0d1] border border-[#d8cfbe] rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-[#5e6c7e]" />
                    <span>Change Topic</span>
                  </button>
                </div>
              </div>
            )}

            {/* Editorial Summary & Verification Checks */}
            <MetricsBar
              metrics={brief.metrics}
              onFilterStatus={(status) => {
                setActiveStatusFilter(status);
                setActiveTab('claims');
              }}
              activeStatusFilter={activeStatusFilter}
            />

            {/* Navigation Tabs */}
            <div className="border-b border-[#e5ddcb] bg-[#fffdf9] rounded-t-xl px-4 sm:px-6 pt-2">
              <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('brief')}
                  className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === 'brief'
                      ? 'border-[#7f1d2a] text-[#14233c] font-bold'
                      : 'border-transparent text-[#5e6978] hover:text-[#14233c]'
                  }`}
                >
                  <BookOpen className={`w-4 h-4 ${activeTab === 'brief' ? 'text-[#7f1d2a]' : 'text-[#7a8698]'}`} />
                  <span>Academic Brief</span>
                </button>

                <button
                  onClick={() => setActiveTab('claims')}
                  className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === 'claims'
                      ? 'border-[#7f1d2a] text-[#14233c] font-bold'
                      : 'border-transparent text-[#5e6978] hover:text-[#14233c]'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${activeTab === 'claims' ? 'text-[#7f1d2a]' : 'text-[#7a8698]'}`} />
                  <span>Claim Verification</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#fcf2f4] text-[#7f1d2a] font-medium border border-[#f0cdd4]">
                    {brief.claims.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('sources')}
                  className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === 'sources'
                      ? 'border-[#7f1d2a] text-[#14233c] font-bold'
                      : 'border-transparent text-[#5e6978] hover:text-[#14233c]'
                  }`}
                >
                  <Globe className={`w-4 h-4 ${activeTab === 'sources' ? 'text-[#7f1d2a]' : 'text-[#7a8698]'}`} />
                  <span>Sources & Citations</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#fcf2f4] text-[#7f1d2a] font-medium border border-[#f0cdd4]">
                    {brief.sources.length}
                  </span>
                </button>
              </nav>
            </div>

            {/* Tab Panels */}
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

      {/* Simple Editorial Footer */}
      <footer className="border-t border-[#e5ddcb] bg-[#f8f4ec] py-6 mt-12 print:hidden text-center text-xs text-[#636f7e]">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <p>Verified Academic Brief Generator — Evidence-based synthesis with traceable citations</p>
        </div>
      </footer>
    </div>
  );
}
