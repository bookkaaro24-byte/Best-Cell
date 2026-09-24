import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  RefreshCw, 
  Users, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Package,
  Megaphone,
  Share2
} from 'lucide-react';
import { SellingPackage } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  listGoogleChatSpaces, 
  createGoogleChatSpace, 
  listGoogleChatMessages, 
  sendGoogleChatMessage, 
  GoogleChatSpace, 
  GoogleChatMessage 
} from '../lib/googleChat';

interface GoogleChatViewProps {
  campaigns: SellingPackage[];
  onOpenCampaign?: (pkg: SellingPackage) => void;
}

export const GoogleChatView: React.FC<GoogleChatViewProps> = ({
  campaigns,
  onOpenCampaign,
}) => {
  const { googleAccessToken, signInWithGoogle, currentUser } = useAuth();

  // Spaces state
  const [spaces, setSpaces] = useState<GoogleChatSpace[]>([]);
  const [activeSpace, setActiveSpace] = useState<GoogleChatSpace | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<GoogleChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Space creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);

  // Confirmation modal state for message sending
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'send_message' | 'create_space';
    title: string;
    description: string;
    action: () => Promise<void>;
  } | null>(null);

  // Quick campaign template state
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Load spaces when token is present
  useEffect(() => {
    if (googleAccessToken) {
      loadSpaces();
    }
  }, [googleAccessToken]);

  // Load messages when active space changes
  useEffect(() => {
    if (activeSpace && googleAccessToken) {
      loadMessages(activeSpace.name);
    } else {
      setMessages([]);
    }
  }, [activeSpace, googleAccessToken]);

  const loadSpaces = async () => {
    if (!googleAccessToken) return;
    setIsLoadingSpaces(true);
    try {
      const list = await listGoogleChatSpaces(googleAccessToken);
      setSpaces(list);
      if (list.length > 0 && !activeSpace) {
        setActiveSpace(list[0]);
      }
    } catch (err: any) {
      console.error('Error fetching Google Chat spaces:', err);
      showToast(err.message || 'Failed to load Google Chat spaces. Please verify permissions.', 'error');
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const loadMessages = async (spaceName: string) => {
    if (!googleAccessToken) return;
    setIsLoadingMessages(true);
    try {
      const msgs = await listGoogleChatMessages(googleAccessToken, spaceName);
      setMessages(msgs);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      showToast(err.message || 'Failed to load messages for this space.', 'error');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const promptCreateSpace = () => {
    if (!newSpaceName.trim()) return;
    setConfirmDialog({
      isOpen: true,
      type: 'create_space',
      title: 'Create Google Chat Space',
      description: `Create a new named space "${newSpaceName.trim()}" in your Google Chat account?`,
      action: async () => {
        setIsCreatingSpace(true);
        try {
          const created = await createGoogleChatSpace(googleAccessToken!, newSpaceName.trim());
          setSpaces((prev) => [created, ...prev]);
          setActiveSpace(created);
          setNewSpaceName('');
          setShowCreateModal(false);
          showToast(`Space "${created.displayName || newSpaceName}" created successfully!`, 'success');
        } catch (err: any) {
          showToast(err.message || 'Failed to create space', 'error');
        } finally {
          setIsCreatingSpace(false);
        }
      }
    });
  };

  const promptSendMessage = (textToSend: string) => {
    if (!activeSpace || !textToSend.trim()) return;
    setConfirmDialog({
      isOpen: true,
      type: 'send_message',
      title: 'Confirm Message Posting',
      description: `Post this message to "${activeSpace.displayName || activeSpace.name}" on behalf of your Google account?`,
      action: async () => {
        setIsSendingMessage(true);
        try {
          const sent = await sendGoogleChatMessage(googleAccessToken!, activeSpace.name, textToSend.trim());
          setMessages((prev) => [...prev, sent]);
          setNewMessageText('');
          showToast('Message posted to Google Chat!', 'success');
        } catch (err: any) {
          showToast(err.message || 'Failed to send message', 'error');
        } finally {
          setIsSendingMessage(false);
        }
      }
    });
  };

  // Quick insertion of campaign brief into composer
  const handleInsertCampaignBrief = (camp: SellingPackage) => {
    const pName = camp.productInfo.name || camp.analysis.productType || 'Product';
    const price = camp.productInfo.price 
      ? `${camp.productInfo.currency} ${camp.productInfo.price.toLocaleString()}` 
      : 'Contact for price';
    const hook = camp.socialMedia?.instagram?.headline || camp.socialMedia?.tiktok?.hook || camp.description?.shortDescription || 'Fresh product launch ready.';
    const market = camp.productInfo.targetMarket;
    const phone = camp.productInfo.contactPhone;

    const draft = `*🚀 PRODUCT CAMPAIGN BRIEF: ${pName}*\n\n` +
      `*Price:* ${price} | *Target Market:* ${market}\n` +
      `*Main Hook:* "${hook}"\n\n` +
      `*Selling Angles:*\n` +
      (camp.adVariations ? camp.adVariations.slice(0, 3).map((a) => `• *${a.angle}:* ${a.headline}`).join('\n') + '\n\n' : '') +
      (phone ? `📲 *WhatsApp Orders:* ${phone}\n` : '') +
      `_Generated with SellBoost AI Marketing Assistant_`;

    setNewMessageText(draft);
  };

  const filteredSpaces = spaces.filter((s) => 
    (s.displayName || s.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Unauthenticated screen
  if (!googleAccessToken) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
            <MessageSquare className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
              Connect Google Chat
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Seamlessly share marketing campaigns, product launch packages, and WhatsApp customer inquiry alerts directly with your team in Google Chat spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left py-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Launch Announcements</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Post full product copy and hooks directly to marketing spaces.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Team Collaboration</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Create dedicated product spaces and review ad creatives together.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Space Messaging</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Send updates and check space message streams with user permission.
              </p>
            </div>
          </div>

          {/* Official Google Sign-In Styled Button */}
          <button
            onClick={async () => {
              try {
                await signInWithGoogle();
              } catch (err: any) {
                showToast(err.message || 'Sign in failed', 'error');
              }
            }}
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 shadow-md transition-all active:scale-98"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>Sign in with Google to Access Google Chat</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
              Google Chat Spaces
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Connected
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Broadcast marketing packages, coordinate product drops, and interact with your team spaces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Space</span>
          </button>
          <button
            onClick={loadSpaces}
            disabled={isLoadingSpaces}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
            title="Reload Spaces"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingSpaces ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Spaces List & Chat Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Spaces Navigation */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search spaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="max-h-[560px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoadingSpaces && spaces.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span>Fetching your Google Chat spaces...</span>
              </div>
            ) : filteredSpaces.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <p>No spaces found.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Create your first space
                </button>
              </div>
            ) : (
              filteredSpaces.map((space) => {
                const isSelected = activeSpace?.name === space.name;
                const displayName = space.displayName || space.name;
                const members = space.membershipCount?.joinedDirectHumanUserCount;

                return (
                  <button
                    key={space.name}
                    onClick={() => setActiveSpace(space)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                      isSelected 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                          {displayName}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {space.spaceType || 'Space'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {members !== undefined && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {members} members
                          </span>
                        )}
                        <span className="truncate">{space.name.replace('spaces/', '')}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* Right Col: Conversation View and Composer */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[650px] overflow-hidden">
          
          {activeSpace ? (
            <>
              {/* Space Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {activeSpace.displayName || activeSpace.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {activeSpace.spaceType || 'Space'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    ID: {activeSpace.name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadMessages(activeSpace.name)}
                    disabled={isLoadingMessages}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                    title="Refresh space messages"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin text-indigo-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20 dark:bg-slate-900/20">
                {isLoadingMessages && messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Loading space messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        No messages in this space yet
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Post an announcement or marketing package below to start collaborating.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const senderName = msg.sender?.displayName || msg.sender?.name || 'User';
                    const isApp = msg.sender?.type === 'BOT';
                    const timeStr = msg.createTime 
                      ? new Date(msg.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                      : '';

                    return (
                      <div key={msg.name || i} className="flex items-start gap-3 text-xs">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {senderName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 bg-white dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {senderName}
                              {isApp && (
                                <span className="ml-1.5 px-1.5 py-0.2 rounded-sm text-[9px] bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 font-normal">
                                  App
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400">{timeStr}</span>
                          </div>
                          <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {msg.text || '(Formatted Card / Attachment)'}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Campaign Attachment Bar */}
              {campaigns.length > 0 && (
                <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-2 overflow-x-auto text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Quick Campaign:</span>
                  </span>
                  {campaigns.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleInsertCampaignBrief(c)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500 text-[11px] font-medium shrink-0 transition-colors"
                      title="Insert formatted campaign brief into composer"
                    >
                      {c.productInfo.name || c.analysis.productType}
                    </button>
                  ))}
                </div>
              )}

              {/* Message Composer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    promptSendMessage(newMessageText);
                  }}
                  className="flex items-end gap-2"
                >
                  <textarea
                    rows={2}
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder={`Message ${activeSpace.displayName || 'space'}... (Supports *bold*, _italic_)`}
                    className="flex-1 p-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        promptSendMessage(newMessageText);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSendingMessage || !newMessageText.trim()}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                  >
                    {isSendingMessage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Send</span>
                  </button>
                </form>
              </div>

            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Select a space on the left to view messages.
            </div>
          )}

        </div>

      </div>

      {/* Modal to Create New Space */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Create Google Chat Space
                </h4>
                <p className="text-[11px] text-slate-500">
                  New collaboration room for your campaigns and team
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Space Name
              </label>
              <input
                type="text"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder="e.g. Trendique Ramadan Launch"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={promptCreateSpace}
                disabled={!newSpaceName.trim() || isCreatingSpace}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
              >
                {isCreatingSpace ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Space'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog before Workspace API mutations */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {confirmDialog.title}
                </h4>
                <p className="text-xs text-slate-500">Google Chat Permission Confirmation</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {confirmDialog.description}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const act = confirmDialog.action;
                  setConfirmDialog(null);
                  await act();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div
            className={`p-3 rounded-xl shadow-lg border text-xs flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notification.text}</span>
          </div>
        </div>
      )}

    </div>
  );
};
