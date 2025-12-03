import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, RotateCcw, History } from 'lucide-react';
import IdeaInput from '../components/editor/IdeaInput';
import Tabs from '../components/editor/Tabs';
import CodeOutput from '../components/editor/CodeOutput';
import TokenStats from '../components/editor/TokenStats';
import HistoryPanel from '../components/editor/HistoryPanel';
import { LoadingSkeleton, ProgressIndicator } from '../components/ui/loading-skeleton';
import { generateExports } from '../lib/schema/generateExports';
import { formatExpanded } from '../lib/schema/formatExpanded';
import { countTokens, countInputTokens } from '../lib/utils/tokenCounter';
import { trackEvent, AnalyticsEvents } from '../lib/analytics';
import { useAuth } from '../contexts/AuthContext';
import { useToastContext } from '../contexts/ToastContext';
import { useDebouncedLocalStorage, useLocalStorage } from '../hooks/useLocalStorage';
import { supabase } from '../lib/supabase';
import type { AppSchema } from '../lib/utils/schema';
import type { Example } from '../data/examples';
import type { EditorMode, AITool } from '../components/editor/ModeToggle';
import type { PromptHistoryItem } from '../lib/promptHistory';

type TabType = 'json' | 'dsl' | 'expanded' | 'exports' | 'analysis';

export default function EditorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToastContext();
  const [ideaInput, setIdeaInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<number | undefined>(undefined);
  const [mode, setMode] = useState<EditorMode>('app');
  const [aiTool, setAiTool] = useState<AITool>('cursor');
  const [activeTab, setActiveTab] = useState<TabType>('json');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  // Store results separately for each mode
  const [appResults, setAppResults] = useState<{
    json: string;
    dsl: string;
    expanded: string;
    exports: string;
    analysis?: string;
  } | null>(null);
  const [promptResults, setPromptResults] = useState<{
    json: string;
    dsl: string;
    expanded: string;
    exports: string;
    analysis?: string;
  } | null>(null);
  // Current results based on mode
  const results = mode === 'app' ? appResults : promptResults;
  
  const [isShrinking, setIsShrinking] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  // Store original DSL separately for each mode
  const [appOriginalDsl, setAppOriginalDsl] = useState<string | null>(null);
  const [promptOriginalDsl, setPromptOriginalDsl] = useState<string | null>(null);
  const originalDsl = mode === 'app' ? appOriginalDsl : promptOriginalDsl;
  
  // Store token counts separately for each mode
  const [appTokenCounts, setAppTokenCounts] = useState<{
    original: number;
    json: number;
    smpl: number;
    originalExact?: boolean;
    jsonExact?: boolean;
    smplExact?: boolean;
  } | null>(null);
  const [promptTokenCounts, setPromptTokenCounts] = useState<{
    original: number;
    json: number;
    smpl: number;
    originalExact?: boolean;
    jsonExact?: boolean;
    smplExact?: boolean;
  } | null>(null);
  const tokenCounts = mode === 'app' ? appTokenCounts : promptTokenCounts;
  
  // Helper functions to set results based on current mode
  const setResults = (value: typeof appResults | ((prev: typeof appResults) => typeof appResults)) => {
    if (mode === 'app') {
      setAppResults(value as typeof appResults | ((prev: typeof appResults) => typeof appResults));
    } else {
      setPromptResults(value as typeof promptResults | ((prev: typeof promptResults) => typeof promptResults));
    }
  };
  
  const setOriginalDsl = (value: string | null) => {
    if (mode === 'app') {
      setAppOriginalDsl(value);
    } else {
      setPromptOriginalDsl(value);
    }
  };
  
  const setTokenCounts = (value: typeof appTokenCounts) => {
    if (mode === 'app') {
      setAppTokenCounts(value);
    } else {
      setPromptTokenCounts(value);
    }
  };

  // Load persisted data from localStorage on mount
  useEffect(() => {
    const savedAppResults = localStorage.getItem('smpl_app_results');
    const savedPromptResults = localStorage.getItem('smpl_prompt_results');
    const savedAppDsl = localStorage.getItem('smpl_app_original_dsl');
    const savedPromptDsl = localStorage.getItem('smpl_prompt_original_dsl');
    const savedAppTokens = localStorage.getItem('smpl_app_token_counts');
    const savedPromptTokens = localStorage.getItem('smpl_prompt_token_counts');
    const savedInput = localStorage.getItem('smpl_idea_input');
    const savedMode = localStorage.getItem('smpl_mode') as EditorMode | null;
    const savedAITool = localStorage.getItem('smpl_ai_tool') as AITool | null;

    if (savedAppResults) {
      try {
        setAppResults(JSON.parse(savedAppResults));
      } catch (e) {
        console.error('Failed to parse saved app results', e);
      }
    }
    if (savedPromptResults) {
      try {
        setPromptResults(JSON.parse(savedPromptResults));
      } catch (e) {
        console.error('Failed to parse saved prompt results', e);
      }
    }
    if (savedAppDsl) {
      setAppOriginalDsl(savedAppDsl);
    }
    if (savedPromptDsl) {
      setPromptOriginalDsl(savedPromptDsl);
    }
    if (savedAppTokens) {
      try {
        setAppTokenCounts(JSON.parse(savedAppTokens));
      } catch (e) {
        console.error('Failed to parse saved app token counts', e);
      }
    }
    if (savedPromptTokens) {
      try {
        setPromptTokenCounts(JSON.parse(savedPromptTokens));
      } catch (e) {
        console.error('Failed to parse saved prompt token counts', e);
      }
    }
    if (savedInput) {
      setIdeaInput(savedInput);
    }
    if (savedMode && (savedMode === 'app' || savedMode === 'prompt')) {
      setMode(savedMode);
    }
    if (savedAITool) {
      setAiTool(savedAITool);
    }

    // Check for example from navigation state (takes precedence)
    const state = location.state as { example?: Example } | null;
    if (state?.example) {
      setIdeaInput(state.example.natural);
    }
  }, [location]);

  // Debounced localStorage saves for large/complex data
  useDebouncedLocalStorage('smpl_app_results', appResults);
  useDebouncedLocalStorage('smpl_prompt_results', promptResults);
  useDebouncedLocalStorage('smpl_app_original_dsl', appOriginalDsl);
  useDebouncedLocalStorage('smpl_prompt_original_dsl', promptOriginalDsl);
  useDebouncedLocalStorage('smpl_app_token_counts', appTokenCounts);
  useDebouncedLocalStorage('smpl_prompt_token_counts', promptTokenCounts);
  useDebouncedLocalStorage('smpl_idea_input', ideaInput);

  // Immediate localStorage saves for simple values
  useLocalStorage('smpl_mode', mode);
  useLocalStorage('smpl_ai_tool', aiTool);

  const handleGenerate = async () => {
    if (!ideaInput.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(10);
    trackEvent({ name: AnalyticsEvents.EDITOR_OPENED });

    try {
      const apiEndpoint = mode === 'app' ? 'app-gen' : 'prompt-gen';
      const generateUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${apiEndpoint}`;

      // Get auth token for authenticated users
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;

      setGenerationProgress(30);
      
      const response = await fetch(generateUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'apikey': `${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: ideaInput, tool: aiTool }),
      });

      setGenerationProgress(60);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate schema');
      }

      const data = await response.json();

      if (mode === 'prompt') {
        const jsonPrompt = data.jsonPrompt || '';
        const smplCompact = data.smplCompact || '';
        const expandedPrompt = data.expandedPrompt || '';
        const tokenStats = data.tokenStats || {};
        const exportPrompts = data.exportPrompts || {};

      // Only show the export prompt for the selected tool
      const selectedExport = exportPrompts[aiTool] || exportPrompts.cursor || '';
      const toolName = aiTool.toUpperCase().replace(/([A-Z])/g, ' $1').trim();
      const allExports = selectedExport 
        ? `=== ${toolName} EXPORT PROMPT ===\n\n${selectedExport}`
        : 'No export prompt available for the selected tool.';

        // Store original DSL for refresh functionality
        setOriginalDsl(smplCompact);

        // Use tiktoken for accurate token counting (frontend calculation)
        const inputTokenResult = countInputTokens(ideaInput, aiTool);
        const jsonTokenResult = countTokens(jsonPrompt, aiTool);
        const smplTokenResult = countTokens(smplCompact, aiTool);

        // Calculate savings using accurate token counts
        const savings = inputTokenResult.count - smplTokenResult.count;
        const savingsPercent = inputTokenResult.count > 0 
          ? Math.round((savings / inputTokenResult.count) * 100 * 10) / 10 
          : 0;

        // Create analysis using accurate token counts
        const analysis = `Token Analysis\n\nOriginal Prompt: ${inputTokenResult.count} tokens${inputTokenResult.isExact ? ' (exact)' : ' (approximate)'}\nJSON Format: ${jsonTokenResult.count} tokens${jsonTokenResult.isExact ? ' (exact)' : ' (approximate)'}\nSMPL Compact: ${smplTokenResult.count} tokens${smplTokenResult.isExact ? ' (exact)' : ' (approximate)'}\n\nSavings: ${savings} tokens (${savingsPercent}%)`;

        setResults({
          json: jsonPrompt,
          dsl: smplCompact,
          expanded: expandedPrompt,
          exports: allExports,
          analysis,
        });

        setTokenCounts({
          original: inputTokenResult.count,
          json: jsonTokenResult.count,
          smpl: smplTokenResult.count,
          originalExact: inputTokenResult.isExact,
          jsonExact: jsonTokenResult.isExact,
          smplExact: smplTokenResult.isExact,
        });

        setIsGenerating(false);
        trackEvent({ 
          name: AnalyticsEvents.PROMPT_GENERATED,
          props: { tool: aiTool }
        });
        return;
      }

      // app-gen returns all the data we need
      const jsonSchema = data.jsonSchema || '';
      const smpl = data.smplDsl || '';
      const expandedSpec = data.expandedSpec || '';
      const exportPrompts = data.exportPrompts || {};

      // Only show the export prompt for the selected tool
      const selectedExport = exportPrompts[aiTool] || exportPrompts.cursor || '';
      const toolName = aiTool.toUpperCase().replace(/([A-Z])/g, ' $1').trim();
      const allExports = selectedExport 
        ? `=== ${toolName} EXPORT PROMPT ===\n\n${selectedExport}`
        : 'No export prompt available for the selected tool.';

      const analysis = undefined;

      // Store original DSL for refresh functionality
      setOriginalDsl(smpl);

      setResults({
        json: jsonSchema,
        dsl: smpl,
        expanded: expandedSpec,
        exports: allExports,
        analysis,
      });

      // Use tiktoken for accurate token counting
      const inputTokenResult = countInputTokens(ideaInput, aiTool);
      const jsonTokenResult = countTokens(jsonSchema, aiTool);
      const smplTokenResult = countTokens(smpl, aiTool);

      setTokenCounts({
        original: inputTokenResult.count,
        json: jsonTokenResult.count,
        smpl: smplTokenResult.count,
        originalExact: inputTokenResult.isExact,
        jsonExact: jsonTokenResult.isExact,
        smplExact: smplTokenResult.isExact,
      });
      
      trackEvent({ 
        name: AnalyticsEvents.SCHEMA_GENERATED,
        props: { tool: aiTool, mode: mode }
      });
    } catch (error) {
      console.error('Generation failed:', error);
      trackEvent({ 
        name: AnalyticsEvents.ERROR_OCCURRED,
        props: { error: 'generation_failed', mode: mode }
      });
      setResults({
        json: JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to generate' }, null, 2),
        dsl: 'Error generating compact format',
        expanded: 'Error generating expanded format',
        exports: 'Error generating export prompts',
        analysis: 'Error generating analysis',
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(undefined);
    }
  };

  const handleShrink = async () => {
    if (!results?.dsl) return;

    setIsShrinking(true);
    try {
      const shrinkUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shrink-prompt`;

      const response = await fetch(shrinkUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': `${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: results.dsl, tool: aiTool }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to shrink prompt' }));
        throw new Error(errorData.error || errorData.details || 'Failed to shrink prompt');
      }

      const data = await response.json();
      if (data.compactPrompt) {
        setResults((prev) => prev ? { ...prev, dsl: data.compactPrompt } : null);
        setActiveTab('dsl'); // Switch to DSL tab to show the result
        
        // Recalculate SMPL token count with the new compact prompt
        if (tokenCounts) {
          const smplTokenResult = countTokens(data.compactPrompt, aiTool);
          setTokenCounts({
            ...tokenCounts,
            smpl: smplTokenResult.count,
            smplExact: smplTokenResult.isExact,
          });
        }
      } else {
        throw new Error('No compact prompt returned');
      }
    } catch (error) {
      console.error('Shrink failed:', error);
      toast.error(`Shrink failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsShrinking(false);
    }
  };

  const handleExpand = async () => {
    if (!results?.dsl) return;

    setIsExpanding(true);
    try {
      const expandUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/expand-prompt`;

      const response = await fetch(expandUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': `${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: results.dsl, tool: aiTool }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to expand prompt' }));
        throw new Error(errorData.error || errorData.details || 'Failed to expand prompt');
      }

      const data = await response.json();
      if (data.expandedPrompt) {
        setResults((prev) => prev ? { ...prev, expanded: data.expandedPrompt } : null);
        setActiveTab('expanded'); // Switch to Expanded tab to show the result
      } else {
        throw new Error('No expanded prompt returned');
      }
    } catch (error) {
      console.error('Expand failed:', error);
      toast.error(`Expand failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExpanding(false);
    }
  };

  const handleRefreshDsl = () => {
    if (originalDsl && results) {
      setResults((prev) => prev ? { ...prev, dsl: originalDsl } : null);
      setActiveTab('dsl');
      
      // Recalculate SMPL token count with the restored original DSL
      if (tokenCounts) {
        const smplTokenResult = countTokens(originalDsl, aiTool);
        setTokenCounts({
          ...tokenCounts,
          smpl: smplTokenResult.count,
          smplExact: smplTokenResult.isExact,
        });
      }
    }
  };

  const handleLoadFromHistory = (item: PromptHistoryItem) => {
    // Set the input text
    setIdeaInput(item.input_text);
    
    // Set the mode
    if (item.mode === 'app' || item.mode === 'prompt') {
      setMode(item.mode);
    }
    
    // Set the AI tool if available
    if (item.tool && ['cursor', 'bolt', 'v0', 'replit', 'claude'].includes(item.tool)) {
      setAiTool(item.tool as AITool);
    }
    
    // Load the results
    if (item.mode === 'app') {
      // Use the tool from the item if available, otherwise use current aiTool
      const toolToUse = item.tool || aiTool;
      
      // Use stored export prompts from database
      const exportPrompts = item.export_prompts || {};
      const selectedExport = exportPrompts[toolToUse] || exportPrompts.cursor || '';
      
      let allExports: string;
      if (selectedExport) {
        const toolName = toolToUse.toUpperCase().replace(/([A-Z])/g, ' $1').trim();
        allExports = `=== ${toolName} EXPORT PROMPT ===\n\n${selectedExport}`;
      } else {
        // Fallback: generate if not stored (for older records)
        const jsonSchema = typeof item.json_schema === 'string' 
          ? JSON.parse(item.json_schema) 
          : item.json_schema;
        allExports = generateExports(jsonSchema as AppSchema, item.smpl_dsl, toolToUse);
      }
      
      // Use stored expanded spec from database, or generate if not available
      let expanded: string;
      if (item.expanded_spec) {
        expanded = item.expanded_spec;
      } else {
        // Fallback: generate if not stored (for older records)
        const jsonSchema = typeof item.json_schema === 'string' 
          ? JSON.parse(item.json_schema) 
          : item.json_schema;
        expanded = formatExpanded(jsonSchema as AppSchema);
      }
      
      // Calculate token counts
      const inputTokenResult = countInputTokens(item.input_text, toolToUse);
      const jsonTokenResult = countTokens(JSON.stringify(item.json_schema, null, 2), toolToUse);
      const smplTokenResult = countTokens(item.smpl_dsl, toolToUse);
      
      setAppResults({
        json: JSON.stringify(item.json_schema, null, 2),
        dsl: item.smpl_dsl,
        expanded: expanded,
        exports: allExports,
      });
      
      setAppOriginalDsl(item.smpl_dsl);
      setAppTokenCounts({
        original: inputTokenResult.count,
        json: jsonTokenResult.count,
        smpl: smplTokenResult.count,
        originalExact: inputTokenResult.isExact,
        jsonExact: jsonTokenResult.isExact,
        smplExact: smplTokenResult.isExact,
      });
      
      // Switch to JSON tab to show the loaded content
      setActiveTab('json');
    } else {
      // Prompt mode
      const jsonPrompt = typeof item.json_schema === 'string'
        ? item.json_schema
        : JSON.stringify(item.json_schema, null, 2);
      
      const exportPrompts = item.export_prompts || {};
      // Use the tool from the item if available, otherwise use current aiTool
      const toolToUse = item.tool || aiTool;
      // Only show the export prompt for the selected tool
      const selectedExport = exportPrompts[toolToUse] || exportPrompts.cursor || '';
      const toolName = toolToUse.toUpperCase().replace(/([A-Z])/g, ' $1').trim();
      const allExports = selectedExport 
        ? `=== ${toolName} EXPORT PROMPT ===\n\n${selectedExport}`
        : 'No export prompt available for the selected tool.';
      
      const inputTokenResult = countInputTokens(item.input_text, toolToUse);
      const jsonTokenResult = countTokens(jsonPrompt, toolToUse);
      const smplTokenResult = countTokens(item.smpl_dsl, toolToUse);
      
      const savings = inputTokenResult.count - smplTokenResult.count;
      const savingsPercent = inputTokenResult.count > 0 
        ? Math.round((savings / inputTokenResult.count) * 100 * 10) / 10 
        : 0;
      
      const analysis = `Token Analysis\n\nOriginal Prompt: ${inputTokenResult.count} tokens${inputTokenResult.isExact ? ' (exact)' : ' (approximate)'}\nJSON Format: ${jsonTokenResult.count} tokens${jsonTokenResult.isExact ? ' (exact)' : ' (approximate)'}\nSMPL Compact: ${smplTokenResult.count} tokens${smplTokenResult.isExact ? ' (exact)' : ' (approximate)'}\n\nSavings: ${savings} tokens (${savingsPercent}%)`;
      
      setPromptResults({
        json: jsonPrompt,
        dsl: item.smpl_dsl,
        expanded: item.expanded_spec || '',
        exports: allExports,
        analysis: analysis,
      });
      
      setPromptOriginalDsl(item.smpl_dsl);
      setPromptTokenCounts({
        original: inputTokenResult.count,
        json: jsonTokenResult.count,
        smpl: smplTokenResult.count,
        originalExact: inputTokenResult.isExact,
        jsonExact: jsonTokenResult.isExact,
        smplExact: smplTokenResult.isExact,
      });
      
      // Switch to JSON tab to show the loaded content
      setActiveTab('json');
    }
  };

  useEffect(() => {
    // When switching modes, restore the active tab and results for that mode
    // Don't clear results - they're stored separately per mode
    setActiveTab('json');
  }, [mode]);

  return (
    <div className="min-h-screen bg-[#0C0D10] text-[#ECECEC]">
      <div className="flex h-screen">
        <div className="w-[45%] border-r border-[#2F333A] flex flex-col">
          <IdeaInput
            value={ideaInput}
            onChange={setIdeaInput}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            mode={mode}
            onModeChange={setMode}
            aiTool={aiTool}
            onAIToolChange={setAiTool}
          />

          {tokenCounts && (
            <TokenStats
              originalTokens={tokenCounts.original}
              jsonTokens={tokenCounts.json}
              smplTokens={tokenCounts.smpl}
              originalExact={tokenCounts.originalExact}
              jsonExact={tokenCounts.jsonExact}
              smplExact={tokenCounts.smplExact}
            />
          )}
        </div>

        <div className="w-[55%] flex flex-col overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <Tabs activeTab={activeTab} onTabChange={setActiveTab} mode={mode} />
              <div className="flex items-center gap-2">
                {user && (
                  <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-[#111215] border border-[#2F333A] text-[#ECECEC] hover:border-[#6D5AE0] hover:bg-[#6D5AE0]/10 transition-colors duration-200"
                    title="View History"
                  >
                    <History className="w-4 h-4" />
                    <span>History</span>
                  </button>
                )}
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-[#111215] border border-[#2F333A] text-[#ECECEC] hover:border-[#6D5AE0] hover:bg-[#6D5AE0]/10 transition-colors duration-200"
                  title="Back to Homepage"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                {results && (
                  <div className="flex gap-2">
                    {activeTab === 'dsl' && originalDsl && results.dsl !== originalDsl && (
                      <button
                        onClick={handleRefreshDsl}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-[#111215] border border-[#2F333A] text-[#ECECEC] hover:border-[#6D5AE0] transition-colors"
                        title="Restore original DSL"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restore</span>
                      </button>
                    )}
                    <button
                      onClick={handleShrink}
                      disabled={isShrinking || !results.dsl}
                      className="px-4 py-2 text-sm font-medium rounded-md bg-[#111215] border border-[#2F333A] text-[#ECECEC] hover:border-[#6D5AE0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isShrinking ? 'Shrinking...' : 'Shrink'}
                    </button>
                    <button
                      onClick={handleExpand}
                      disabled={isExpanding || !results.dsl}
                      className="px-4 py-2 text-sm font-medium rounded-md bg-[#111215] border border-[#2F333A] text-[#ECECEC] hover:border-[#6D5AE0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExpanding ? 'Expanding...' : 'Expand'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 px-8 pb-8 overflow-hidden flex flex-col">
            {isGenerating && generationProgress !== undefined && (
              <ProgressIndicator 
                progress={generationProgress} 
                message={mode === 'app' ? 'Generating schema...' : 'Generating prompt...'}
              />
            )}
            <div className="flex-1 overflow-hidden">
              {isGenerating ? (
                <LoadingSkeleton 
                  type="code" 
                />
              ) : (
                <CodeOutput
                  content={results ? (results[activeTab] || '') : ''}
                  hasContent={!!results}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* History Panel */}
      {user && (
        <HistoryPanel
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onLoadPrompt={handleLoadFromHistory}
        />
      )}
    </div>
  );
}
