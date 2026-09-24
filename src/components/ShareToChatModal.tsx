import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Plus, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { SellingPackage } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  listGoogleChatSpaces, 
  createGoogleChatSpace, 
  sendGoogleChatMessage, 
  GoogleChatSpace 
} from '../lib/googleChat';

interface ShareToChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellingPackage: SellingPackage;
}

export const ShareToChatModal: React.FC<ShareToChatModalProps> = ({
  isOpen,
  onClose,
  sellingPackage,
}) => {
  const { googleAccessToken, signInWithGoogle } = useAuth();
  
  const [spaces, setSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [showNewSpaceInput, setShowNewSpaceInput] = useState(false);
  
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const productName = sellingPackage.productInfo.name || sellingPackage.analysis.productType || 'Product Campaign';

  // Build initial message draft based on campaign contents
  useEffect(() => {
    if (sellingPackage) {
      const priceStr = sellingPackage.productInfo.price 
        ? `${sellingPackage.productInfo.currency} ${sellingPackage.productInfo.price.toLocaleString()}` 
        : 'Price on request';
      const hook = sellingPackage.socialMedia?.instagram?.headline || sellingPackage.socialMedia?.tiktok?.hook || sellingPackage.description?.shortDescription || 'High quality trending product.';
      const bullet1 = sellingPackage.description?.benefits?.[0] || 'Premium grade material and finish';
      const bullet2 = sellingPackage.description?.benefits?.[1] || 'Fast shipping and cash on delivery available';
      const phone = sellingPackage.productInfo.contactPhone || '';
      
      const defaultText = `*📢 NEW PRODUCT CAMPAIGN: ${productName}*\n\n` +
        `*Price:* ${priceStr} | *Target Market:* ${sellingPackage.productInfo.targetMarket}\n` +
        `*Hook:* "${hook}"\n\n` +
        `*Key Highlights:*\n` +
        `• ${bullet1}\n` +
        `• ${bullet2}\n\n` +
        (phone ? `📲 *Order WhatsApp:* ${phone}\n` : '') +
        `Generated via SellBoost AI Campaign Assistant.`;

      setMessageText(defaultText);
    }
  }, [sellingPackage, productName]);

  // Fetch spaces when access token is available
  useEffect(() => {
    if (isOpen && googleAccessToken) {
      fetchSpaces();
    }
  }, [isOpen, googleAccessToken]);

  const fetchSpaces = async () => {
    if (!googleAccessToken) return;
    setIsLoadingSpaces(true);
    setStatusMessage(null);
    try {
      const list = await listGoogleChatSpaces(googleAccessToken);
      setSpaces(list);
      if (list.length > 0 && !selectedSpace) {
        setSelectedSpace(list[0].name);
      }
    } catch (err: any) {
      console.error('Failed to load Google Chat spaces:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Could not load Google Chat spaces. Please ensure permissions are granted.'
      });
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const handleCreateSpace = async () => {
    if (!googleAccessToken || !newSpaceName.trim()) return;
    setIsCreatingSpace(true);
    setStatusMessage(null);
    try {
      const created = await createGoogleChatSpace(googleAccessToken, newSpaceName.trim());
      setSpaces((prev) => [created, ...prev]);
      setSelectedSpace(created.name);
      setNewSpaceName('');
      setShowNewSpaceInput(false);
      setStatusMessage({
        type: 'success',
        text: `Created space "${created.displayName || newSpaceName}" successfully!`
      });
    } catch (err: any) {
      console.error('Failed to create space:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to create Google Chat space.'
      });
    } finally {
      setIsCreatingSpace(false);
    }
  };

  const handleInitiateSend = () => {
    if (!selectedSpace) {
      setStatusMessage({ type: 'error', text: 'Please select a Google Chat space first.' });
      return;
    }
    if (!messageText.trim()) {
      setStatusMessage({ type: 'error', text: 'Message content cannot be empty.' });
      return;
    }
    // Show explicit user confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmedSend = async () => {
    if (!googleAccessToken || !selectedSpace) return;
    setShowConfirmDialog(false);
    setIsSending(true);
    setStatusMessage(null);
    try {
      await sendGoogleChatMessage(googleAccessToken, selectedSpace, messageText.trim());
      setStatusMessage({
        type: 'success',
        text: `Successfully posted campaign announcement to Google Chat!`
      });
    } catch (err: any) {
      console.error('Failed to send Google Chat message:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to send message to Google Chat.'
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const currentSpaceObj = spaces.find((s) => s.name === selectedSpace);
  const spaceDisplayName = currentSpaceObj?.displayName || currentSpaceObj?.name || 'Selected Space';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Share to Google Chat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Post product briefs and launch announcements to team spaces
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* If user needs to connect / sign in to Google */}
          {!googleAccessToken ? (
            <div className="p-6 text-center space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Google Account Required
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  To view your spaces and send campaign announcements, please sign in and allow access to Google Chat.
                </p>
              </div>

              {/* Official Google Sign-In Styled Button */}
              <button
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                  } catch (e: any) {
                    setStatusMessage({ type: 'error', text: e.message || 'Sign in failed' });
                  }
                }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-xs transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>Sign in with Google to Connect Chat</span>
              </button>
            </div>
          ) : (
            <>
              {/* Space Selection Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Google Chat Space
                  </label>
                  <button
                    onClick={() => setShowNewSpaceInput(!showNewSpaceInput)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{showNewSpaceInput ? 'Select Existing Space' : 'Create New Space'}</span>
                  </button>
                </div>

                {showNewSpaceInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Marketing Launch Team"
                      value={newSpaceName}
                      onChange={(e) => setNewSpaceName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                    <button
                      onClick={handleCreateSpace}
                      disabled={isCreatingSpace || !newSpaceName.trim()}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      {isCreatingSpace ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>Create</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isLoadingSpaces ? (
                      <div className="w-full flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                        <span>Loading accessible spaces...</span>
                      </div>
                    ) : spaces.length === 0 ? (
                      <div className="w-full p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                        No spaces found. Click above to create one.
                      </div>
                    ) : (
                      <select
                        value={selectedSpace}
                        onChange={(e) => setSelectedSpace(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      >
                        {spaces.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.displayName || s.name} ({s.spaceType || 'Space'})
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={fetchSpaces}
                      title="Refresh spaces"
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                    >
                      ↻
                    </button>
                  </div>
                )}
              </div>

              {/* Message Composer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Message Preview & Content
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Google Chat Markdown supported (*bold*, _italic_)
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none leading-relaxed"
                />
              </div>
            </>
          )}

          {/* Feedback message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>

          {googleAccessToken && (
            <button
              onClick={handleInitiateSend}
              disabled={isSending || !selectedSpace || !messageText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 active:scale-95 transition-all shadow-sm shadow-indigo-600/20"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Post to Google Chat</span>
            </button>
          )}
        </div>

      </div>

      {/* Mandatory User Confirmation Dialog before mutating external Google Chat data */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Confirm Message Posting
                </h4>
                <p className="text-xs text-slate-500">Google Chat Integration</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to send this campaign message to <strong className="text-slate-900 dark:text-white">"{spaceDisplayName}"</strong> on behalf of your Google account?
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-700 dark:text-slate-300 max-h-24 overflow-y-auto">
              {messageText.slice(0, 180)}...
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedSend}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                Yes, Send Message
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
