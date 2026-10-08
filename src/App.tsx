import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { 
  UserProfile, 
  AdminSettings, 
  SellingPackage, 
  CustomerInquiry, 
  ProductAnalysisResult, 
  SampleProduct, 
  ProductInput 
} from './types';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { ProductWorkspace } from './components/ProductWorkspace';
import { SellingPackageDashboard } from './components/SellingPackageDashboard';
import { CampaignHistory } from './components/CampaignHistory';
import { InquiryInbox } from './components/InquiryInbox';
import { GenerationProgressModal } from './components/GenerationProgressModal';
import { CreditsAndPlansModal } from './components/CreditsAndPlansModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ProfileModal } from './components/ProfileModal';
import { GoogleChatView } from './components/GoogleChatView';
import { SellingAssistantModal } from './components/SellingAssistantModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { GeminiChatbotModal } from './components/GeminiChatbotModal';
import { DEMO_CAMPAIGN } from './data/demoCampaign';
import { useAuth } from './context/AuthContext.tsx';

export default function App() {
  const { idToken, currentUser } = useAuth();
  // Navigation View State
  const [currentView, setCurrentView] = useState<'landing' | 'workspace' | 'dashboard' | 'history' | 'inbox' | 'chat'>('landing');
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Active Workspace / Campaign State
  const [activePackage, setActivePackage] = useState<SellingPackage | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInput>({
    currency: 'PKR',
    targetMarket: 'Pakistan',
    preferredLanguages: ['en', 'ur', 'roman_ur'],
    brandName: 'Trendique Official',
    contactPhone: '+92 300 1234567'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysisResult | null>(null);
  const [isGeneratingPackage, setIsGeneratingPackage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Database / Persisted Data (Pre-seeded with DEMO_CAMPAIGN so users always have instant proof)
  const [campaigns, setCampaigns] = useState<SellingPackage[]>([DEMO_CAMPAIGN]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'usr_default',
    name: 'Online Seller',
    email: 'seller@example.com',
    plan: 'free',
    credits: 5,
    defaultCurrency: 'PKR',
    defaultTargetMarket: 'Pakistan',
    brandName: 'Trendique Official',
    contactPhone: '+92 300 1234567'
  });
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    freePlanDefaultCredits: 5,
    creditsPerCampaign: 1,
    creditsPerStudioRender: 2,
    creatorPlanPriceUsd: 9,
    businessPlanPriceUsd: 29
  });

  // Modals state
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // 1-Click Instant Demo Campaign Launcher (Instant Proof of Utility)
  const handleOpenDemoCampaign = () => {
    setActivePackage(DEMO_CAMPAIGN);
    setUploadedImage(DEMO_CAMPAIGN.productImage);
    setProductInfo(DEMO_CAMPAIGN.productInfo);
    setAnalysisResult(DEMO_CAMPAIGN.analysis);
    setCurrentView('dashboard');
  };

  const showNotification = (text: string, type: 'error' | 'success' = 'error') => {
    let clean = text;
    if (clean.includes('503') || clean.includes('high demand') || clean.includes('UNAVAILABLE')) {
      clean = 'The AI model is experiencing a momentary spike in traffic. Retrying with backup models.';
    }
    setToastMessage({ text: clean, type });
    setTimeout(() => setToastMessage(null), 6000);
  };

  // Initialize theme and load persisted backend data
  useEffect(() => {
    const savedTheme = localStorage.getItem('sellboost_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Load initial server data
    fetchData();
  }, []);

  // Reload campaigns when authenticated state changes
  useEffect(() => {
    if (idToken) {
      fetch('/api/campaigns', {
        headers: { Authorization: `Bearer ${idToken}` }
      })
        .then((res) => res.json())
        .then((data) => {
          const list = Array.isArray(data) ? data : (data?.campaigns || []);
          if (list.length > 0) {
            setCampaigns(list);
          }
        })
        .catch((err) => console.error('Error fetching authenticated campaigns:', err));
    }
  }, [idToken]);

  const fetchData = async () => {
    try {
      const authHeaders: Record<string, string> = idToken ? { Authorization: `Bearer ${idToken}` } : {};
      const [campRes, inqRes, profRes, adminRes] = await Promise.all([
        fetch('/api/campaigns', { headers: authHeaders }).catch(() => null),
        fetch('/api/inquiries').catch(() => null),
        fetch('/api/user-profile').catch(() => null),
        fetch('/api/admin/settings').catch(() => null),
      ]);

      if (campRes && campRes.ok) {
        const ct = campRes.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          const data = await campRes.json();
          const list = Array.isArray(data) ? data : (data?.campaigns || []);
          setCampaigns(list);
        }
      }
      if (inqRes && inqRes.ok) {
        const ct = inqRes.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          const data = await inqRes.json();
          const list = Array.isArray(data) ? data : (data?.inquiries || []);
          setInquiries(list);
        }
      }
      if (profRes && profRes.ok) {
        const ct = profRes.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          const data = await profRes.json();
          const profile = data?.userProfile || data;
          if (profile && typeof profile === 'object') {
            setUserProfile((prev) => ({ ...prev, ...profile }));
            if (profile.brandName || profile.contactPhone) {
              setProductInfo((prev) => ({
                ...prev,
                brandName: profile.brandName || prev.brandName,
                contactPhone: profile.contactPhone || prev.contactPhone,
                currency: profile.defaultCurrency || prev.currency,
                targetMarket: profile.defaultTargetMarket || prev.targetMarket
              }));
            }
          }
        }
      }
      if (adminRes && adminRes.ok) {
        const ct = adminRes.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          const data = await adminRes.json();
          const settings = data?.settings || data;
          if (settings && typeof settings === 'object') {
            setAdminSettings((prev) => ({ ...prev, ...settings }));
          }
        }
      }
    } catch (e) {
      console.error('Initial data fetch error:', e);
    }
  };

  const handleToggleTheme = (dark: boolean) => {
    const next = dark ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('sellboost_theme', next);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sample Product Selection
  const handleSelectSample = async (sample: SampleProduct) => {
    const img = sample.imageUrl || sample.image || '';
    setUploadedImage(img);
    setProductInfo({
      name: sample.name,
      category: sample.category,
      price: sample.price,
      currency: (sample.currency as any) || 'PKR',
      targetMarket: (sample.targetMarket as any) || 'Pakistan',
      preferredLanguages: ['en', 'ur', 'roman_ur'],
      targetAudience: sample.targetAudience || 'Online buyers seeking premium quality',
      brandName: sample.brandName || userProfile.brandName || 'SellBoost Seller',
      contactPhone: sample.contactPhone || userProfile.contactPhone || '+92 300 1234567'
    });
    setCurrentView('workspace');
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: img,
          additionalInfo: {
            name: sample.name,
            category: sample.category,
            price: sample.price,
            currency: sample.currency || 'PKR',
            targetMarket: sample.targetMarket || 'Pakistan',
            targetAudience: sample.targetAudience || 'Online buyers',
            brandName: sample.brandName || userProfile.brandName || 'SellBoost Seller'
          }
        })
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        showNotification(data.error || 'Could not analyze product');
      }
    } catch (err: any) {
      showNotification('Error analyzing sample product: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analyze uploaded photo
  const handleAnalyzePhoto = async () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: uploadedImage, 
          additionalInfo: productInfo 
        })
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        showNotification(data.error || 'Failed to analyze product image');
      }
    } catch (err: any) {
      showNotification('Error analyzing image: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate full selling package
  const handleCreateSellingPackage = async () => {
    if (!uploadedImage) {
      showNotification('Please upload or select a product photo first.');
      return;
    }

    // Check credits
    const cost = adminSettings.creditsPerCampaign || 1;
    if (userProfile.credits < cost) {
      setIsCreditsModalOpen(true);
      return;
    }

    setIsGeneratingPackage(true);

    try {
      let currentAnalysis = analysisResult;

      // If analysis not done yet, perform analysis automatically first
      if (!currentAnalysis) {
        const analyzeRes = await fetch('/api/analyze-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: uploadedImage,
            additionalInfo: productInfo
          })
        });

        const analyzeData = await analyzeRes.json();
        if (analyzeData.analysis) {
          currentAnalysis = analyzeData.analysis;
          setAnalysisResult(currentAnalysis);
        } else {
          throw new Error(analyzeData.error || 'Failed to analyze product photo');
        }
      }

      const res = await fetch('/api/generate-selling-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          productInfo: productInfo,
          analysis: currentAnalysis
        })
      });

      const data = await res.json();
      const pkgCandidate = data.sellingPackage || data.package;
      if (pkgCandidate) {
        const pkg: SellingPackage = pkgCandidate;
        setActivePackage(pkg);

        // Deduct credit
        const newCredits = Math.max(0, userProfile.credits - cost);
        const updatedProfile = { ...userProfile, credits: newCredits };
        setUserProfile(updatedProfile);
        fetch('/api/user-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProfile)
        }).catch(() => {});

        // Save to campaigns list
        setCampaigns((prev) => [pkg, ...prev.filter((c) => c.id !== pkg.id)]);

        setTimeout(() => {
          setIsGeneratingPackage(false);
          setCurrentView('dashboard');
        }, 600);
      } else {
        setIsGeneratingPackage(false);
        showNotification(data.error || 'Failed to generate complete selling package');
      }
    } catch (err: any) {
      setIsGeneratingPackage(false);
      showNotification('Error generating campaign: ' + err.message);
    }
  };

  // Save campaign updates
  const handleSaveCampaign = async () => {
    if (!activePackage) return;
    setIsSaving(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }
      await fetch('/api/campaigns', {
        method: 'POST',
        headers,
        body: JSON.stringify(activePackage)
      });
      setCampaigns((prev) => [activePackage, ...prev.filter((c) => c.id !== activePackage.id)]);
    } catch (err) {
      console.error('Error saving campaign:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved campaign?')) return;
    try {
      await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      if (activePackage?.id === id) {
        setActivePackage(null);
        setCurrentView('workspace');
      }
    } catch (err) {
      console.error('Delete campaign error:', err);
    }
  };

  // CRM Inquiry handlers
  const handleAddInquiry = async (inq: Omit<CustomerInquiry, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inq)
      });
      const data = await res.json();
      if (data.inquiry) {
        setInquiries((prev) => [data.inquiry, ...prev]);
      }
    } catch (err) {
      console.error('Add inquiry error:', err);
    }
  };

  const handleUpdateInquiry = async (id: string, updates: Partial<CustomerInquiry>) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.inquiry) {
        setInquiries((prev) => prev.map((inq) => (inq.id === id ? data.inquiry : inq)));
      }
    } catch (err) {
      console.error('Update inquiry error:', err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    try {
      await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    } catch (err) {
      console.error('Delete inquiry error:', err);
    }
  };

  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    const next = { ...userProfile, ...updated };
    setUserProfile(next);
    try {
      await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      });
    } catch (err) {
      console.error('Save profile error:', err);
    }
  };

  const handleUpdateAdminSettings = async (nextSettings: AdminSettings) => {
    setAdminSettings(nextSettings);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextSettings)
      });
    } catch (err) {
      console.error('Save admin settings error:', err);
    }
  };

  // Map our view name for Navbar
  const navbarActiveView = currentView === 'inbox' ? 'inquiries' : (currentView === 'dashboard' ? 'workspace' : currentView);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 pb-16 md:pb-0">
      
      {/* Global Navigation */}
      <Navbar
        activeView={navbarActiveView as any}
        setActiveView={(view) => {
          if (view === 'inquiries') setCurrentView('inbox');
          else if (view === 'chat') setCurrentView('chat');
          else if (view === 'calculator') {
            if (activePackage) setCurrentView('dashboard');
            else setCurrentView('workspace');
          } else {
            setCurrentView(view as any);
          }
        }}
        userProfile={userProfile}
        onOpenCreditsModal={() => setIsCreditsModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        darkMode={theme === 'dark'}
        setDarkMode={handleToggleTheme}
        onNewCampaign={() => {
          setUploadedImage(null);
          setAnalysisResult(null);
          setActivePackage(null);
          setCurrentView('workspace');
        }}
        onOpenDemoCampaign={handleOpenDemoCampaign}
        onOpenAssistant={() => setIsAssistantModalOpen(true)}
        onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
        onOpenGeminiChat={() => setIsGeminiChatOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <HeroLanding
            onStartUpload={() => setCurrentView('workspace')}
            onSelectSample={handleSelectSample}
            onOpenDemoCampaign={handleOpenDemoCampaign}
            onOpenAssistant={() => setIsAssistantModalOpen(true)}
            onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
            onOpenGeminiChat={() => setIsGeminiChatOpen(true)}
          />
        )}

        {currentView === 'workspace' && (
          <ProductWorkspace
            image={uploadedImage}
            setImage={(img: string | null) => setUploadedImage(img)}
            productInfo={productInfo}
            setProductInfo={setProductInfo}
            analysis={analysisResult}
            setAnalysis={setAnalysisResult}
            onAnalyze={handleAnalyzePhoto}
            isAnalyzing={isAnalyzing}
            onCreateSellingPackage={handleCreateSellingPackage}
            isGeneratingPackage={isGeneratingPackage}
            userProfile={userProfile}
            onOpenCreditsModal={() => setIsCreditsModalOpen(true)}
            onOpenAssistant={() => setIsAssistantModalOpen(true)}
          />
        )}

        {currentView === 'dashboard' && activePackage && (
          <SellingPackageDashboard
            sellingPackage={activePackage}
            onBackToWorkspace={() => setCurrentView('workspace')}
            onSaveCampaign={handleSaveCampaign}
            isSaving={isSaving}
            onUpdatePackage={(updated) => setActivePackage(updated)}
            onOpenAssistant={() => setIsAssistantModalOpen(true)}
          />
        )}

        {currentView === 'history' && (
          <CampaignHistory
            campaigns={campaigns}
            onOpenCampaign={(pkg) => {
              setActivePackage(pkg);
              setUploadedImage(pkg.productImage);
              setAnalysisResult(pkg.analysis);
              setCurrentView('dashboard');
            }}
            onDeleteCampaign={handleDeleteCampaign}
            onNewCampaign={() => {
              setUploadedImage(null);
              setAnalysisResult(null);
              setActivePackage(null);
              setCurrentView('workspace');
            }}
          />
        )}

        {currentView === 'inbox' && (
          <InquiryInbox
            inquiries={inquiries}
            onAddInquiry={handleAddInquiry}
            onUpdateInquiry={handleUpdateInquiry}
            onDeleteInquiry={handleDeleteInquiry}
            activePackage={activePackage}
          />
        )}

        {currentView === 'chat' && (
          <GoogleChatView
            campaigns={campaigns}
            onOpenCampaign={(pkg) => {
              setActivePackage(pkg);
              setUploadedImage(pkg.productImage);
              setAnalysisResult(pkg.analysis);
              setCurrentView('dashboard');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">
            SellBoost • Upload One Product Photo. Get Everything You Need to Sell It Online.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Instagram • WhatsApp • TikTok • Facebook • Shopify</span>
            <button
              onClick={() => setIsCreditsModalOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              {userProfile.credits} Credits Available
            </button>
          </div>
        </div>
      </footer>

      {/* Progress Animation Modal */}
      <GenerationProgressModal
        isOpen={isGeneratingPackage}
        productName={productInfo.name || analysisResult?.productType}
      />

      {/* Credits & Subscription Modal */}
      <CreditsAndPlansModal
        isOpen={isCreditsModalOpen}
        onClose={() => setIsCreditsModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Admin Governance Modal */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        adminSettings={adminSettings}
        onUpdateAdminSettings={handleUpdateAdminSettings}
        totalCampaignsCount={campaigns.length}
      />

      {/* Profile Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* AI Selling Assistant (CEO & Sales Coach Copilot Modal) */}
      <SellingAssistantModal
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
        activePackage={activePackage}
        productInfo={productInfo}
        uploadedImage={uploadedImage}
        onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
        onOpenGeminiChat={() => setIsGeminiChatOpen(true)}
      />

      {/* Real-Time Live Voice Sales Coach (gemini-3.8-live) */}
      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
        productInfo={productInfo}
        productName={productInfo.name || analysisResult?.productType}
        onOpenChatbot={() => setIsGeminiChatOpen(true)}
      />

      {/* Multi-Turn Gemini Chatbot (Pro / Flash / Flash-Lite with Roles) */}
      <GeminiChatbotModal
        isOpen={isGeminiChatOpen}
        onClose={() => setIsGeminiChatOpen(false)}
        productInfo={productInfo}
        productName={productInfo.name || analysisResult?.productType}
        onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
      />

      {/* Global Floating AI Selling Suite Action Cluster (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setIsAssistantModalOpen(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/30 backdrop-blur-md cursor-pointer group"
          title="Open SellBoost AI Chief Sales Officer & Copilot"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-amber-300 group-hover:rotate-12 transition-transform shadow-inner">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
          </div>
          <span>Sales Copilot</span>
          <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] bg-slate-950/40 text-amber-300 font-black border border-white/20">
            CEO
          </span>
        </button>

        {/* Live Voice floating button */}
        <button
          type="button"
          onClick={() => setIsLiveVoiceOpen(true)}
          className="p-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-white/30 backdrop-blur-md cursor-pointer"
          title="Start Live Voice Call with gemini-3.8-live"
        >
          <span className="relative flex h-3 w-3 mr-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <span className="hidden sm:inline">Live Voice</span>
        </button>

        {/* Gemini Chatbot floating button */}
        <button
          type="button"
          onClick={() => setIsGeminiChatOpen(true)}
          className="px-3.5 py-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-purple-300 hover:text-white font-bold text-xs shadow-xl border border-purple-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
          title="Open Multi-Turn Gemini Chatbot (gemini-3.5-flash / pro / flash-lite)"
        >
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <span>Gemini Chat</span>
        </button>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-fade-in">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 text-xs leading-relaxed ${
              toastMessage.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                : 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            <div className="flex-1 font-medium">{toastMessage.text}</div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
