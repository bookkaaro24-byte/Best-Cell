import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  UploadCloud, 
  Image as ImageIcon, 
  FileText, 
  Megaphone, 
  MessageSquare, 
  Palette, 
  Video, 
  Store, 
  CheckCircle2, 
  Globe2,
  Zap,
  Play
} from 'lucide-react';
import { SAMPLE_PRODUCTS, SampleProduct } from '../data/samples';

interface HeroLandingProps {
  onStartUpload: () => void;
  onSelectSample: (sample: SampleProduct) => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartUpload,
  onSelectSample
}) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Subtle decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/10 via-sky-500/10 to-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Upload One Product Photo. Get Everything You Need to Sell It Online.</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Turn One Product Photo Into a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500">
              Complete Selling Campaign
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload your product photo and instantly create professional product visuals, descriptions, social media ads, posters, captions, and customer replies.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onStartUpload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all shadow-lg shadow-indigo-600/25 text-base"
            >
              <UploadCloud className="w-5 h-5" />
              <span>Upload Product</span>
            </button>

            <button
              onClick={() => onSelectSample(SAMPLE_PRODUCTS[0])}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 active:scale-98 transition-all text-base shadow-xs"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>See Example</span>
            </button>
          </div>

          {/* Target Audience Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Built for sellers on:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Instagram</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">WhatsApp</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">TikTok</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Facebook Marketplace</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Shopify</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Daraz</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium">Pakistan, UAE & Global</span>
          </div>

        </div>
      </section>

      {/* Visual Workflow Section: ONE PHOTO -> MULTIPLE SELLING ASSETS */}
      <section className="py-12 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span>ONE PHOTO</span>
              <span className="text-indigo-600">→</span>
              <span>MULTIPLE SELLING ASSETS</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Everything Generated in Seconds from One Upload
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Product Visuals</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Studio presets, white background, luxury marble, and lifestyle composition.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Product Description</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                3 high-converting titles, short summary, bullet features, benefits, and CTAs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">5 Ad Variations</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Product-focused, Problem/Solution, Lifestyle, Premium, and Promotional angles.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Social & WhatsApp</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Instagram captions + tags, Facebook ads, TikTok hooks, and ready WhatsApp messages.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Promotional Poster</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                10 templates (Flash Sale, Eid, Ramadan, New Arrival) with custom prices and direct PNG export.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Video Storyboard</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Viral 3-second hook, shot-by-shot visual prompts, voiceover script, and scene playback.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Marketplace Listing</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tailored for Shopify, Daraz, and Facebook Marketplace with SEO tags and specs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Multilingual & Replies</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Native Urdu script, Roman Urdu, Arabic, and auto-replies to customer DMs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Quick Test with Sample Products */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Try It Immediately (Select a Demo Product)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click any product to load its photo and test the AI selling engine in one tap.
            </p>
          </div>
          <button
            onClick={onStartUpload}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            <span>Or upload your own</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_PRODUCTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={sample.imageUrl}
                  alt={sample.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-xs">
                  {sample.category}
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-xs">
                  {sample.currency} {sample.price.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {sample.name}
                </h4>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{sample.targetMarket} Market</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-0.5">
                    Test Now →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
