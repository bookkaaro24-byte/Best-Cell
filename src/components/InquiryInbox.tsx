import React, { useState } from 'react';
import { 
  MessageSquareText, 
  Plus, 
  Trash2, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { CustomerInquiry, SellingPackage } from '../types';

interface InquiryInboxProps {
  inquiries: CustomerInquiry[];
  onAddInquiry: (inq: Omit<CustomerInquiry, 'id' | 'createdAt'>) => void;
  onUpdateInquiry: (id: string, updates: Partial<CustomerInquiry>) => void;
  onDeleteInquiry: (id: string) => void;
  activePackage?: SellingPackage | null;
}

export const InquiryInbox: React.FC<InquiryInboxProps> = ({
  inquiries,
  onAddInquiry,
  onUpdateInquiry,
  onDeleteInquiry,
  activePackage
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [productTitle, setProductTitle] = useState(activePackage?.productInfo.name || '');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<CustomerInquiry['status']>('new');
  const [isDraftingId, setIsDraftingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onAddInquiry({
      customerName: name.trim() || 'Anonymous Buyer',
      customerPhone: phone.trim() || undefined,
      productName: productTitle.trim() || 'Product',
      message: message.trim(),
      status: status
    });
    setName('');
    setPhone('');
    setMessage('');
    setIsAddOpen(false);
  };

  const handleDraftReply = async (inq: CustomerInquiry) => {
    setIsDraftingId(inq.id);
    try {
      const res = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerMessage: inq.message,
          productPackage: activePackage || undefined,
          tone: 'sales_closing',
          language: 'roman_urdu'
        })
      });
      const data = await res.json();
      if (data.reply) {
        onUpdateInquiry(inq.id, {
          aiSuggestedReply: data.reply,
          status: 'replied'
        });
      }
    } catch (err: any) {
      alert('Error generating reply: ' + err.message);
    } finally {
      setIsDraftingId(null);
    }
  };

  const shareToWhatsApp = (phone?: string, text?: string) => {
    if (!text) return;
    const cleanPhone = phone?.replace(/[^0-9]/g, '') || '';
    const encoded = encodeURIComponent(text);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const getStatusBadge = (st: CustomerInquiry['status']) => {
    switch (st) {
      case 'new':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">New Inquiry</span>;
      case 'replied':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">Replied</span>;
      case 'interested':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">Interested</span>;
      case 'order_confirmed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Order Confirmed!</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">Closed</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquareText className="w-6 h-6 text-indigo-600" />
            <span>Buyer Inquiries & WhatsApp CRM</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Log incoming messages from Instagram DMs, WhatsApp, and Facebook Marketplace with 1-click AI replies.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Buyer Message</span>
        </button>
      </div>

      {/* Inquiries List */}
      {inquiries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <MessageSquareText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base">
            No Buyer Inquiries Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Log incoming customer questions here to generate polite, sales-closing responses in Roman Urdu or English.
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-100"
          >
            + Add First Customer Inquiry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {(inq.customerName || "Customer").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {inq.customerName || "Customer"}
                    </span>
                    {inq.customerPhone && (
                      <span className="text-xs text-slate-400 ml-2 font-mono">
                        {inq.customerPhone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(inq.status)}

                  <select
                    value={inq.status}
                    onChange={(e) => onUpdateInquiry(inq.id, { status: e.target.value as any })}
                    className="text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1 px-2 text-slate-700 dark:text-slate-300"
                  >
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="interested">Interested</option>
                    <option value="order_confirmed">Order Confirmed</option>
                    <option value="closed">Closed</option>
                  </select>

                  <button
                    onClick={() => onDeleteInquiry(inq.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                  Regarding: {inq.productName}
                </span>
                "{inq.message}"
              </div>

              {/* AI Drafted Reply */}
              {inq.aiSuggestedReply ? (
                <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>AI Suggested Sales Response:</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => shareToWhatsApp(inq.customerPhone, inq.aiSuggestedReply)}
                        className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send to Customer</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {inq.aiSuggestedReply}
                  </p>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDraftReply(inq)}
                    disabled={isDraftingId === inq.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isDraftingId === inq.id ? "Drafting Reply..." : "Generate AI Reply"}</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Created {new Date(inq.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Inquiry */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Log Customer Inquiry
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fatima Ali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Customer Phone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="e.g. +92 300 9876543"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Product Inquired About</label>
                <input
                  type="text"
                  placeholder="e.g. Leather Handbag"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Customer Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Bhai what is the final price with delivery to Islamabad?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-xs"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
