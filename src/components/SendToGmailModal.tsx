import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  FileText, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  X,
  UserCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SellingPackage } from '../types';
import { sendEmailViaGmail, createGmailDraft, getGmailProfile } from '../lib/gmail';

interface SendToGmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellingPackage: SellingPackage;
}

type EmailTemplateType = 'launch' | 'discount' | 'b2b' | 'custom';

export const SendToGmailModal: React.FC<SendToGmailModalProps> = ({
  isOpen,
  onClose,
  sellingPackage
}) => {
  const { currentUser, googleAccessToken, getGoogleAccessToken, signInWithGoogle } = useAuth();
  
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [templateType, setTemplateType] = useState<EmailTemplateType>('launch');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('preview');

  // Loading & confirmation states
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string; link?: string } | null>(null);

  const productName = sellingPackage.productInfo.name || 'Featured Product';
  const price = sellingPackage.productInfo.price 
    ? `${sellingPackage.productInfo.currency} ${sellingPackage.productInfo.price.toLocaleString()}` 
    : 'Price on Inquiry';
  const brandName = sellingPackage.productInfo.brandName || 'Official Store';
  const whatsapp = sellingPackage.productInfo.contactPhone || '';

  // Initialize templates based on product info
  useEffect(() => {
    applyTemplate(templateType);
  }, [templateType, sellingPackage]);

  const applyTemplate = (type: EmailTemplateType) => {
    setTemplateType(type);
    const bullets = (sellingPackage.description?.keyFeatures || [
      'Premium grade craftsmanship and build',
      'Doorstep nationwide courier delivery',
      'Cash on Delivery (COD) available'
    ]).slice(0, 3);

    const bookKaaroUrl = 'https://bookkaaro.com';

    if (type === 'launch') {
      setSubject(`[New Drop] Introducing ${productName} - Now Available on Book Kaaro!`);
      setEmailBody(`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
  <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 20px;">
    <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #4f46e5; letter-spacing: 1px;">Official Launch Announcement</span>
    <h1 style="font-size: 22px; font-weight: bold; color: #0f172a; margin: 6px 0 0 0;">${productName}</h1>
    <p style="font-size: 13px; color: #64748b; margin: 4px 0 0 0;">By ${brandName} • Listed on Book Kaaro Digital Marketplace</p>
  </div>

  <p style="font-size: 14px; line-height: 1.6; color: #334155;">
    Hello,<br/><br/>
    We are excited to officially unveil our newest addition: <strong>${productName}</strong>. 
    Designed with exceptional quality and built for long-lasting performance.
  </p>

  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <div style="font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase;">Launch Price</div>
    <div style="font-size: 24px; font-weight: 800; color: #4f46e5; margin-top: 4px;">${price}</div>
    <ul style="margin: 12px 0 0 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #334155;">
      ${bullets.map(b => `<li>${b}</li>`).join('')}
    </ul>
  </div>

  <div style="text-align: center; margin: 28px 0;">
    <a href="${bookKaaroUrl}" style="background-color: #4f46e5; color: #ffffff; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">
      View Listing on Book Kaaro (bookkaaro.com)
    </a>
  </div>

  <p style="font-size: 13px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 16px;">
    ${whatsapp ? `Need quick assistance? WhatsApp our orders desk: <strong>${whatsapp}</strong><br/>` : ''}
    Thank you for choosing ${brandName}.
  </p>
</div>
      `.trim());
    } else if (type === 'discount') {
      const discount = sellingPackage.productInfo.discountPercent || 25;
      setSubject(`[Exclusive ${discount}% OFF] VIP Special Deal for ${productName}`);
      setEmailBody(`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
  <div style="background-color: #dc2626; color: #ffffff; padding: 8px 16px; border-radius: 6px; display: inline-block; font-size: 12px; font-weight: bold; text-transform: uppercase;">
    Limited Time VIP Offer • Save ${discount}%
  </div>
  
  <h1 style="font-size: 22px; font-weight: bold; color: #0f172a; margin: 16px 0 8px 0;">Exclusive Savings on ${productName}</h1>
  
  <p style="font-size: 14px; line-height: 1.6; color: #334155;">
    As a valued client, you're receiving exclusive early-access pricing for <strong>${productName}</strong>. 
    Stock for this promotional batch is strictly limited.
  </p>

  <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <div style="font-size: 12px; font-weight: bold; color: #991b1b; text-transform: uppercase;">Special VIP Price</div>
    <div style="font-size: 26px; font-weight: 800; color: #dc2626; margin-top: 4px;">${price}</div>
    <p style="font-size: 12px; color: #7f1d1d; margin: 4px 0 0 0;">Includes Cash on Delivery & Doorstep Dispatch</p>
  </div>

  <div style="text-align: center; margin: 28px 0;">
    <a href="${bookKaaroUrl}" style="background-color: #dc2626; color: #ffffff; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">
      Claim VIP Deal on Book Kaaro
    </a>
  </div>

  <p style="font-size: 13px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 16px;">
    ${whatsapp ? `Direct Order on WhatsApp: <strong>${whatsapp}</strong><br/>` : ''}
    Offer active while stock lasts.
  </p>
</div>
      `.trim());
    } else if (type === 'b2b') {
      setSubject(`Wholesale / Catalog Inquiry: ${productName} - ${brandName}`);
      setEmailBody(`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
  <h2 style="font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 0;">Product Specification & Wholesale Sheet</h2>
  <p style="font-size: 14px; line-height: 1.6; color: #334155;">
    Dear Partner,<br/><br/>
    Please find the commercial overview for <strong>${productName}</strong>. 
    We support custom volume supply, verified merchant escrows, and nationwide logistics.
  </p>

  <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Product:</td>
      <td style="padding: 8px 0; color: #0f172a; text-align: right;">${productName}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Unit Retail Price:</td>
      <td style="padding: 8px 0; color: #0f172a; text-align: right; font-weight: bold;">${price}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Verified Marketplace:</td>
      <td style="padding: 8px 0; color: #4f46e5; text-align: right;">Book Kaaro Digital Marketplace</td>
    </tr>
  </table>

  <p style="font-size: 13px; color: #334155; line-height: 1.6;">
    For bulk purchase inquiries, trade discounts, or sample requests, please reply directly to this email or contact us via WhatsApp: <strong>${whatsapp || '+92 300 1234567'}</strong>.
  </p>
</div>
      `.trim());
    } else {
      setSubject(`Regarding ${productName}`);
      setEmailBody(`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
  <p>Hello,</p>
  <p>Thank you for your interest in <strong>${productName}</strong> (${price}).</p>
  <p>You can view the full listing and verify vendor details on Book Kaaro Digital Marketplace: <a href="https://bookkaaro.com">https://bookkaaro.com</a></p>
  <p>Best regards,<br/>${brandName}</p>
</div>
      `.trim());
    }
  };

  const handleAuthenticate = async () => {
    setIsLoadingAuth(true);
    setStatusMessage(null);
    try {
      await signInWithGoogle();
      setStatusMessage({ type: 'success', text: 'Connected to Gmail successfully!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to authenticate with Google' });
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Step 1: Pre-send validation -> opens explicit confirmation modal
  const handleInitiateSend = () => {
    if (!recipient.trim() || !recipient.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid recipient email address.' });
      return;
    }
    if (!subject.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter an email subject line.' });
      return;
    }
    setShowConfirmDialog(true);
  };

  // Step 2: Explicit User Confirmation (MANDATORY per Workspace Skill)
  const handleConfirmAndSend = async () => {
    setShowConfirmDialog(false);
    setIsSending(true);
    setStatusMessage(null);

    try {
      const token = await getGoogleAccessToken();
      if (!token) {
        throw new Error('Google access token is not available. Please sign in with Google first.');
      }

      const result = await sendEmailViaGmail(token, {
        to: recipient.trim(),
        subject: subject.trim(),
        body: emailBody,
        isHtml: true,
        from: currentUser?.email || undefined
      });

      setStatusMessage({
        type: 'success',
        text: `Email sent successfully to ${recipient}! (Message ID: ${result.id.slice(0, 12)}...)`,
        link: 'https://mail.google.com'
      });
    } catch (err: any) {
      console.error('Failed to send email via Gmail:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to send email via Gmail. Check your permissions.'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!subject.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter an email subject line before saving draft.' });
      return;
    }

    setIsDrafting(true);
    setStatusMessage(null);

    try {
      const token = await getGoogleAccessToken();
      if (!token) {
        throw new Error('Google access token is not available. Please sign in with Google first.');
      }

      await createGmailDraft(token, {
        to: recipient.trim() || (currentUser?.email || ''),
        subject: subject.trim(),
        body: emailBody,
        isHtml: true,
        from: currentUser?.email || undefined
      });

      setStatusMessage({
        type: 'success',
        text: 'Draft saved in your Gmail account! You can review or send it from mail.google.com.',
        link: 'https://mail.google.com/mail/u/0/#drafts'
      });
    } catch (err: any) {
      console.error('Failed to create draft in Gmail:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to create draft in Gmail.'
      });
    } finally {
      setIsDrafting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center border border-red-500/20">
              <Mail className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Send Campaign via Gmail
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300">
                  Gmail API
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send professional launch emails or save formatted drafts in your Gmail mailbox.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Status Message */}
          {statusMessage && (
            <div className={`p-4 rounded-2xl flex items-start justify-between gap-3 text-xs ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
            }`}>
              <div className="flex items-start gap-2.5">
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium leading-relaxed">{statusMessage.text}</p>
                  {statusMessage.link && (
                    <a
                      href={statusMessage.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold underline mt-1 text-emerald-700 dark:text-emerald-300"
                    >
                      <span>Open Gmail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
              <button onClick={() => setStatusMessage(null)} className="font-bold text-slate-400 hover:text-slate-600">✕</button>
            </div>
          )}

          {/* Connected Gmail Account Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center font-bold text-xs">
                {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'G'}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {currentUser?.email ? (
                    <span>Connected: <strong>{currentUser.email}</strong></span>
                  ) : (
                    <span>Not Connected to Google Account</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500">
                  Emails will be sent with permission from your authenticated Gmail address.
                </div>
              </div>
            </div>

            {!currentUser ? (
              <button
                onClick={handleAuthenticate}
                disabled={isLoadingAuth}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {isLoadingAuth ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Connect Gmail</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Template Archetype Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Email Template:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'launch', label: 'Launch Drop', sub: 'Book Kaaro Link' },
                { id: 'discount', label: 'VIP Discount', sub: 'Urgent Promo' },
                { id: 'b2b', label: 'B2B Wholesale', sub: 'Specs & Catalog' },
                { id: 'custom', label: 'Custom Note', sub: 'Personalized' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t.id as EmailTemplateType)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    templateType === t.id
                      ? 'border-red-600 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-red-200 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="truncate">{t.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal truncate">{t.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Email Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Recipient Email (To):
              </label>
              <input
                type="email"
                placeholder="customer@example.com, client@domain.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject Line:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Message Body:
                </label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewMode('preview')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      previewMode === 'preview' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    HTML Preview
                  </button>
                  <button
                    onClick={() => setPreviewMode('edit')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      previewMode === 'edit' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Edit Code
                  </button>
                </div>
              </div>

              {previewMode === 'preview' ? (
                <div 
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white max-h-56 overflow-y-auto text-xs shadow-inner"
                  dangerouslySetInnerHTML={{ __html: emailBody }}
                />
              ) : (
                <textarea
                  rows={8}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 font-mono text-[11px] text-slate-200"
                />
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="text-[11px] text-slate-400">
            Powered by Gmail API & Google Workspace
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={isDrafting || isSending}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDrafting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
              <span>Save as Gmail Draft</span>
            </button>

            <button
              onClick={handleInitiateSend}
              disabled={isSending || isDrafting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 flex items-center gap-1.5 transition-all shadow-md shadow-red-600/20 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending via Gmail...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email Now</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* MANDATORY Explicit Confirmation Dialog (per Workspace Integration Security Rules) */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Confirm Sending Email
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                You are about to send an email via your connected Gmail account (<strong>{currentUser?.email || 'authenticated user'}</strong>).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1 border border-slate-200 dark:border-slate-700">
              <div><span className="text-slate-400">Recipient:</span> <strong className="text-slate-800 dark:text-slate-200">{recipient}</strong></div>
              <div><span className="text-slate-400">Subject:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">{subject}</span></div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmAndSend}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 active:scale-95 transition-all cursor-pointer"
              >
                Yes, Send Email
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
