import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Trash2, Clock, FileText, Loader2, Star, StarOff, Trash } from 'lucide-react';
import { 
  getPromptHistory, 
  getSavedPrompts,
  deletePrompt, 
  savePrompt,
  unsavePrompt,
  clearAllHistory,
  type PromptHistoryItem 
} from '../../lib/promptHistory';
import { useAuth } from '../../contexts/AuthContext';

interface HistoryPanelProps {
  onLoadPrompt: (item: PromptHistoryItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'history' | 'saved';

export default function HistoryPanel({ onLoadPrompt, isOpen, onClose }: HistoryPanelProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [saved, setSaved] = useState<PromptHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadData();
    }
  }, [isOpen, user, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'history') {
        const data = await getPromptHistory(50);
        setHistory(data);
      } else {
        const data = await getSavedPrompts();
        setSaved(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    
    setDeletingId(id);
    const success = await deletePrompt(id);
    if (success) {
      setHistory(prev => prev.filter(item => item.id !== id));
      setSaved(prev => prev.filter(item => item.id !== id));
    }
    setDeletingId(null);
  }, []);

  const handleSave = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavingId(id);
    setError(null);
    try {
      await savePrompt(id);
      // Move from history to saved
      setHistory(prev => {
        const item = prev.find(h => h.id === id);
        if (item) {
          setSaved(prevSaved => [...prevSaved, { ...item, is_saved: true }]);
          return prev.filter(h => h.id !== id);
        }
        return prev;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prompt');
    } finally {
      setSavingId(null);
    }
  }, []);

  const handleUnsave = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavingId(id);
    setError(null);
    try {
      await unsavePrompt(id);
      setSaved(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsave prompt');
    } finally {
      setSavingId(null);
    }
  }, []);

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all history? This cannot be undone. Saved prompts will not be deleted.')) {
      return;
    }
    
    setClearing(true);
    setError(null);
    try {
      const success = await clearAllHistory();
      if (success) {
        setHistory([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear history');
    } finally {
      setClearing(false);
    }
  };

  const handleLoad = (item: PromptHistoryItem) => {
    onLoadPrompt(item);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const currentItems = useMemo(() => {
    return activeTab === 'history' ? history : saved;
  }, [activeTab, history, saved]);
  
  const isEmpty = currentItems.length === 0;

  if (!user) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-[#1a1a1a] border-l border-[#2F333A] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2F333A]">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#C7B8FF]" />
                <h2 className="text-lg font-semibold text-white">History</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-[#2F333A] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-graphite-gray" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#2F333A]">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'history'
                    ? 'text-[#C7B8FF]'
                    : 'text-graphite-gray hover:text-white'
                }`}
              >
                History
                {activeTab === 'history' && history.length > 0 && (
                  <span className="ml-2 text-xs">({history.length})</span>
                )}
                {activeTab === 'history' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C7B8FF]"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'saved'
                    ? 'text-[#C7B8FF]'
                    : 'text-graphite-gray hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Star className="w-4 h-4" />
                  Saved
                  {activeTab === 'saved' && saved.length > 0 && (
                    <span className="text-xs">({saved.length}/10)</span>
                  )}
                </div>
                {activeTab === 'saved' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C7B8FF]"
                  />
                )}
              </button>
            </div>

            {/* Clear All Button (only for history tab) */}
            {activeTab === 'history' && history.length > 0 && (
              <div className="p-3 border-b border-[#2F333A]">
                <button
                  onClick={handleClearAll}
                  disabled={clearing}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  {clearing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash className="w-4 h-4" />
                      Clear All History
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mx-4 mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 text-[#C7B8FF] animate-spin" />
                </div>
              ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  {activeTab === 'history' ? (
                    <>
                      <History className="w-12 h-12 text-graphite-gray mb-4 opacity-50" />
                      <p className="text-graphite-gray mb-2">No history yet</p>
                      <p className="text-sm text-graphite-gray/70">
                        Your generated prompts will appear here
                      </p>
                    </>
                  ) : (
                    <>
                      <Star className="w-12 h-12 text-graphite-gray mb-4 opacity-50" />
                      <p className="text-graphite-gray mb-2">No saved prompts</p>
                      <p className="text-sm text-graphite-gray/70">
                        Save prompts from history to keep them permanently
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {currentItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleLoad(item)}
                      className="group relative p-3 bg-[#0f0f0f] border border-[#2F333A] rounded-lg hover:border-[#6D5AE0] transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <FileText className="w-4 h-4 text-[#C7B8FF] flex-shrink-0" />
                            <span className="text-xs font-medium text-[#C7B8FF] uppercase">
                              {item.mode}
                            </span>
                            {item.tool && (
                              <span className="text-xs text-graphite-gray">
                                • {item.tool}
                              </span>
                            )}
                            {item.is_saved && (
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            )}
                          </div>
                          <p className="text-sm text-white mb-2 line-clamp-2">
                            {truncateText(item.input_text)}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-graphite-gray">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(item.created_at)}
                            </div>
                            {item.token_count && (
                              <span>{item.token_count} tokens</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {activeTab === 'history' ? (
                            <button
                              onClick={(e) => handleSave(item.id, e)}
                              disabled={savingId === item.id || saved.length >= 10}
                              className="p-1.5 hover:bg-yellow-500/10 rounded transition-all flex-shrink-0 disabled:opacity-50"
                              title={saved.length >= 10 ? 'Maximum 10 saved prompts' : 'Save prompt'}
                            >
                              {savingId === item.id ? (
                                <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                              ) : (
                                <Star className="w-4 h-4 text-yellow-400" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleUnsave(item.id, e)}
                              disabled={savingId === item.id}
                              className="p-1.5 hover:bg-yellow-500/10 rounded transition-all flex-shrink-0"
                              title="Unsave prompt"
                            >
                              {savingId === item.id ? (
                                <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                              ) : (
                                <StarOff className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            disabled={deletingId === item.id}
                            className="p-1.5 hover:bg-red-500/10 rounded transition-all flex-shrink-0"
                            title="Delete prompt"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 text-red-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
