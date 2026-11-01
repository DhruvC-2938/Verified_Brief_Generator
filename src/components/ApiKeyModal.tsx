import React, { useState, useEffect } from 'react';
import { X, Key, Check, AlertCircle, ExternalLink, RefreshCw, Trash2, Shield } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyChange?: (hasCustomKey: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyChange,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('custom_gemini_api_key') || '';
      setApiKey(savedKey);
      setIsSaved(Boolean(savedKey));
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem('custom_gemini_api_key', trimmed);
      setIsSaved(true);
      onKeyChange?.(true);
    } else {
      localStorage.removeItem('custom_gemini_api_key');
      setIsSaved(false);
      onKeyChange?.(false);
    }
    setTestResult({ success: true, message: 'Custom API key saved for this browser!' });
  };

  const handleClear = () => {
    localStorage.removeItem('custom_gemini_api_key');
    setApiKey('');
    setIsSaved(false);
    setTestResult(null);
    onKeyChange?.(false);
  };

  const handleTestKey = async () => {
    const keyToTest = apiKey.trim() || localStorage.getItem('custom_gemini_api_key');
    if (!keyToTest) {
      setTestResult({ success: false, message: 'Please enter a Gemini API key to test.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyToTest }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setTestResult({ success: true, message: data.message || 'Key is active and ready!' });
      } else {
        setTestResult({ success: false, message: data.message || 'Key validation failed.' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: 'Network error verifying key.' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div
        className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#f3f4f6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e6f4f5] border border-[#bce2e6] flex items-center justify-center">
              <Key className="w-4 h-4 text-[#20808d]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#111827]">Gemini API Key Settings</h3>
              <p className="text-[11px] text-[#6b7280]">Manage Google Gemini credentials & quota</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Status Alert */}
          <div className="p-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#111827] flex items-center gap-1.5 text-xs">
                <Shield className="w-3.5 h-3.5 text-[#20808d]" />
                Current Key Status:
              </span>
              {isSaved ? (
                <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] font-semibold text-[10px]">
                  Custom Key Active
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] font-medium text-[10px]">
                  Server Default Key
                </span>
              )}
            </div>
            <p className="text-[#6b7280] text-[11px] leading-relaxed">
              Google AI Studio free-tier projects have a limit of 20 requests per day. When your daily quota is reached, you can paste a fresh free key here to continue immediately without server redeployment.
            </p>
          </div>

          {/* Key Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#374151] uppercase tracking-wider">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-xs text-[#111827] font-mono focus:outline-none focus:border-[#20808d] focus:bg-white transition-colors"
            />
          </div>

          {/* Verification feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#047857]'
                  : 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 shrink-0 text-[#10b981] mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-[#ef4444] mt-0.5" />
              )}
              <span className="leading-snug break-words">{testResult.message}</span>
            </div>
          )}

          {/* Helpful Links */}
          <div className="pt-2 flex items-center justify-between text-[11px]">
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#20808d] hover:underline font-medium"
            >
              <span>Get Free Key (Google AI Studio)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {isSaved && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-[#ef4444] hover:underline cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove Custom Key</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f9fafb] border-t border-[#f3f4f6] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={isTesting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e5e7eb] bg-white text-xs font-medium text-[#374151] hover:bg-[#f3f4f6] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#6b7280] ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Validating...' : 'Test Key'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#6b7280] hover:text-[#111827] cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-[#20808d] hover:bg-[#186974] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Key</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
