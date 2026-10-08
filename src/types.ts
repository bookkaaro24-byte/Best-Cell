export type PlanType = 'free' | 'creator' | 'business';
export type SubscriptionPlan = PlanType;
export type CurrencyCode = 'PKR' | 'AED' | 'USD' | 'GBP' | 'EUR';
export type TargetMarket = 'Pakistan' | 'UAE' | 'International' | 'Custom';
export type LanguageCode = 'en' | 'ur' | 'roman_ur' | 'ar';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  credits: number;
  createdDate?: string;
  role?: 'user' | 'admin';
  brandName?: string;
  brandColor?: string;
  contactPhone?: string;
  contactEmail?: string;
  instagramHandle?: string;
  defaultCurrency?: CurrencyCode;
  defaultTargetMarket?: TargetMarket;
}

export interface SampleProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  currency?: string;
  keyFeatures?: string;
  targetMarket?: string;
  brandName?: string;
  contactPhone?: string;
  discountPercent?: number;
  imageUrl?: string;
  image?: string;
  targetAudience?: string;
}

export type BusinessType = 'product' | 'service' | 'digital' | 'handmade' | 'rentals' | 'real_estate' | 'industrial';

export interface ProductInput {
  name?: string;
  category?: string;
  businessType?: BusinessType;
  price?: number;
  currency: CurrencyCode;
  keyFeatures?: string;
  targetMarket: TargetMarket;
  preferredLanguages?: LanguageCode[];
  brandName?: string;
  contactPhone?: string;
  discountPercent?: number;
  sellingGoal?: string;
  targetAudience?: string;
  customCategory?: string;
  campaignThemeDuration?: ThemeDuration;
  preferredTheme?: string;
}

export type ProductInputData = ProductInput;

export interface AIProductAnalysis {
  productType: string;
  productCategory: string;
  visibleColors: string[];
  shape: string;
  style: string;
  visibleMaterials: string;
  visibleDesignElements: string[];
  possibleTargetAudience: string;
  potentialSellingPoints: string[];
  suggestedMarketingAngle: string;
  confidenceNotes: string;
}

export type ProductAnalysisResult = AIProductAnalysis;

export interface ProductDescriptionData {
  titleVariations: string[];
  shortDescription: string;
  fullDescription: string;
  keyFeatures: string[];
  benefits: string[];
  callToActionOptions: string[];
  selectedTone?: string;
}

export interface SocialMediaData {
  instagram: {
    captions: string[];
    headline: string;
    cta: string;
    hashtags: string[];
  };
  facebook: {
    shortAd: string;
    longAd: string;
    cta: string;
  };
  tiktok: {
    shortCaption: string;
    hook: string;
    videoConcept: string;
    hashtags: string[];
  };
  whatsapp: {
    promotionalMessage: string;
    toneVariations: {
      professional: string;
      friendly: string;
      premium: string;
      urgent: string;
      casual: string;
    };
  };
}

export interface MultilingualData {
  english: {
    title: string;
    shortDescription: string;
    whatsappMessage: string;
    instagramCaption: string;
  };
  urdu: {
    title: string;
    shortDescription: string;
    whatsappMessage: string;
    instagramCaption: string;
  };
  romanUrdu: {
    title: string;
    shortDescription: string;
    whatsappMessage: string;
    instagramCaption: string;
  };
  arabic: {
    title: string;
    shortDescription: string;
    whatsappMessage: string;
    instagramCaption: string;
  };
}

export interface AdVariation {
  id: string;
  angle: 'Product-focused' | 'Problem/Solution' | 'Lifestyle' | 'Premium' | 'Offer';
  description: string;
  headline: string;
  primaryText: string;
  cta: string;
}

export interface GeneratedImageItem {
  id: string;
  preset: string;
  prompt?: string;
  imageUrl?: string;
  url?: string;
  aspectRatio: string;
  date?: string;
  createdAt?: string;
  thumbnailUrl?: string;
}

export type GeneratedStudioImage = GeneratedImageItem;

export type PosterTemplate = 
  | 'new-arrival'
  | 'special-offer'
  | 'flash-sale'
  | 'new-product'
  | 'limited-time'
  | 'eid-sale'
  | 'ramadan-sale'
  | 'black-friday'
  | 'premium'
  | 'local-business'
  | 'new_arrival'
  | 'special_offer'
  | 'flash_sale'
  | 'new_product'
  | 'limited_time'
  | 'eid_sale'
  | 'ramadan_sale'
  | 'black_friday'
  | 'local_business'
  | 'premium_spotlight';

export type PosterFormat = 
  | 'instagram-post'
  | 'instagram-story'
  | 'facebook-post'
  | 'whatsapp-status'
  | 'square'
  | 'a4';

export interface PosterConfig {
  template: PosterTemplate;
  format: PosterFormat;
  headline: string;
  subheadline: string;
  priceText: string;
  discountBadge: string;
  brandName: string;
  ctaText: string;
  contactText: string;
  brandColor: string;
  accentColor: string;
  logoUrl?: string;
  overlayStyle: 'gradient' | 'minimal' | 'bold' | 'bordered';
}

export interface VideoScene {
  sceneNumber: number;
  durationSeconds: number;
  shotType: string;
  visualPrompt: string;
  voiceover: string;
  onScreenText: string;
}

export type VideoStoryboardScene = VideoScene;

export interface VideoScriptData {
  duration: 5 | 10 | 15 | 30;
  aspectRatio: string;
  videoConcept: string;
  hook: string;
  scenes: VideoScene[];
  cta: string;
  fullVoiceover: string;
  musicMood: string;
}

export interface MarketplaceListingData {
  platform: string;
  marketplaceUrl?: string;
  productTitle?: string;
  title?: string;
  shortDescription: string;
  fullDescriptionHtml?: string;
  fullDescription?: string;
  bulletFeatures: string[];
  specifications: Record<string, string>;
  tags: string[];
  searchKeywords?: string[];
  seoTitle: string;
  seoMetaDescription?: string;
  metaDescription?: string;
  imageAltText?: string;
  category?: string;
}

export interface PricingCalculatorInputs {
  productCost: number;
  sellingPrice: number;
  packagingCost: number;
  shippingCost: number;
  platformFeePercent: number;
  paymentGatewayFeePercent?: number;
  paymentFeePercent?: number;
  advertisingCostPerSale?: number;
  advertisingCost?: number;
  otherCosts?: number;
  discountPercent: number;
}

export type PricingCalculationInput = PricingCalculatorInputs;

export interface PricingScenario {
  name: string;
  sellingPrice: number;
  estimatedProfit?: number;
  netProfit?: number;
  marginPercent: number;
}

export interface PricingCalculatorResults {
  totalCost: number;
  grossProfit: number;
  netProfit: number;
  netEstimatedProfit?: number;
  profitMarginPercent: number;
  markupPercent: number;
  breakEvenPrice: number;
  recommendedPriceRange: {
    budget: number;
    target: number;
    premium: number;
  };
  scenarios: PricingScenario[];
}

export interface CustomerReplyItem {
  id: string;
  question: string;
  reply: string;
  tone: string;
  language: string;
}

export type CustomerRepliesData = Record<string, string>;

export interface CustomerInquiry {
  id: string;
  customerName: string;
  customerPhone?: string;
  productName: string;
  message: string;
  status: 'new' | 'replied' | 'interested' | 'order_confirmed' | 'closed';
  aiSuggestedReply?: string;
  createdAt: string;
}

export type OrderInquiry = CustomerInquiry;

export interface KeywordResearchItem {
  keyword: string;
  searchVolume: number;
  searchVolumeFormatted: string;
  volumeIndex: number;
  trendGrowthPercent: number;
  trendStatus: 'breakout' | 'rising' | 'stable' | 'competitive';
  competition: 'Low' | 'Medium' | 'High';
  cpcEstimate?: string;
  searchIntent: 'Commercial' | 'Transactional' | 'Informational' | 'Navigational';
  source: string;
  recommendedFor: ('SEO' | 'Google Ads' | 'Instagram' | 'TikTok' | 'Marketplace')[];
}

export interface HashtagResearchItem {
  hashtag: string;
  estimatedPosts: number;
  postsFormatted: string;
  velocityScore: number;
  competition: 'Low' | 'Medium' | 'High';
  tier: 'Mega Viral (1M+)' | 'High Reach (100K-1M)' | 'Targeted Niche (10K-100K)' | 'Local / Community';
  source: string;
}

export interface KeywordTrendHistoryPoint {
  period: string;
  interest: number;
}

export interface KeywordResearchData {
  seedQuery: string;
  targetMarket: string;
  category: string;
  analyzedAt: string;
  dataEnginesUsed: string[];
  overallMarketInterestScore: number;
  marketDemandSummary: string;
  highVolumeKeywords: KeywordResearchItem[];
  recommendedHashtags: HashtagResearchItem[];
  trendHistory: KeywordTrendHistoryPoint[];
  risingTopics: string[];
}

export type ThemeDuration = '7_days' | '14_days';

export interface ThemedDayPlan {
  dayNumber: number;
  dayTitle: string;
  funnelStage: 'Awareness' | 'Consideration' | 'Engagement' | 'Conversion' | 'Social Proof' | 'Urgency';
  primaryPlatform: 'Instagram' | 'WhatsApp' | 'Facebook' | 'TikTok' | 'Email/SMS' | 'Omnichannel';
  hook: string;
  contentConcept: string;
  suggestedPostCopy: string;
  visualDirection: string;
  recommendedKeywords: string[];
  recommendedHashtags: string[];
  callToAction: string;
}

export interface ThemedCampaignPlan {
  themeTitle: string;
  themeTagline: string;
  duration: ThemeDuration;
  targetGoal: string;
  keyAudiencePainPoint: string;
  dailyPlans: ThemedDayPlan[];
  calendarNotes: string;
}

export interface CompetitorMarketingAngle {
  angleName: string;
  hook: string;
  targetEmotion: string;
  adCreativeFormat: string;
  keyCopySnippet: string;
  effectivenessRating: 'High' | 'Very High' | 'Moderate';
}

export interface CompetitorOpportunityItem {
  competitorWeakness: string;
  ourAdvantageHook: string;
  suggestedCounterOffer: string;
}

export interface CompetitorAdCreative {
  headline: string;
  primaryText: string;
  cta: string;
  platform: 'Instagram' | 'TikTok' | 'Facebook' | 'Google Search';
}

export interface CompetitorResearchReport {
  id: string;
  competitorName: string;
  websiteUrl?: string;
  analyzedAt: string;
  brandSummary: string;
  marketPositioning: string;
  estimatedPriceRange: {
    min: number;
    max: number;
    currency: string;
    formatted: string;
  };
  pricingStrategy: {
    model: string;
    discountTactics: string[];
    upsellBundleTactics: string[];
    shippingPolicy: string;
    refundGuarantee: string;
  };
  marketingAngles: CompetitorMarketingAngle[];
  customerReviewsAnalysis: {
    topComplaints: string[];
    topPraises: string[];
    unmetCustomerNeeds: string[];
  };
  opportunityMatrix: CompetitorOpportunityItem[];
  sampleAdCreatives: CompetitorAdCreative[];
  scrapedInsights?: {
    metaTitle?: string;
    metaDescription?: string;
    extractedPromos?: string[];
    detectedTechStack?: string[];
  };
  sourcesFound?: {
    title: string;
    url: string;
  }[];
}

export interface SellingPackage {
  id: string;
  userId: string;
  createdAt: string;
  productImage: string;
  productInfo: ProductInput;
  analysis: AIProductAnalysis;
  description: ProductDescriptionData;
  socialMedia: SocialMediaData;
  multilingual: MultilingualData;
  adVariations: AdVariation[];
  studioImages: GeneratedImageItem[];
  posterConfig: PosterConfig;
  videoScript: VideoScriptData;
  marketplaceListings: Record<string, any>;
  pricing: {
    inputs: PricingCalculatorInputs;
    results: any;
  };
  customerReplies: Record<string, string>;
  keywordsResearch?: KeywordResearchData;
  themedPlan?: ThemedCampaignPlan;
  competitorsResearch?: CompetitorResearchReport[];
}

export interface CampaignHistoryItem {
  id: string;
  userId: string;
  productName: string;
  productImage: string;
  category: string;
  date: string;
  assetCount: number;
  data: SellingPackage;
}

export interface AdminSettings {
  freePlanDefaultCredits: number;
  creatorPlanMonthlyCredits?: number;
  businessPlanMonthlyCredits?: number;
  creditsPerCampaign: number;
  creditsPerStudioRender: number;
  creatorPlanPriceUsd: number;
  businessPlanPriceUsd: number;
  freePlanCampaignsLimit?: number;
  creatorPrice?: number;
  businessPrice?: number;
}
