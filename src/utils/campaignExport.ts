import jsPDF from 'jspdf';
import { SellingPackage, MarketplaceListingData } from '../types';

/**
 * Generates a clean, comprehensive plain text representation of the entire campaign.
 * Preserves full UTF-8 formatting (Urdu, Arabic, Roman Urdu, hashtags, emojis).
 */
export function generateCampaignPlainText(pkg: SellingPackage): string {
  const pInfo = pkg.productInfo;
  const productName = pInfo.name || pkg.analysis.productType || 'Product';
  const priceDisplay = pInfo.price ? `${pInfo.currency} ${pInfo.price.toLocaleString()}` : 'Price on Inquiry';
  const divider = '======================================================================';
  const subDivider = '----------------------------------------------------------------------';

  const sections: string[] = [];

  // 1. Header & Overview
  sections.push(`${divider}
SELLBOOST AI - COMPLETE MARKETING & SELLING CAMPAIGN BRIEF
${divider}
Product Name:    ${productName}
Brand Name:      ${pInfo.brandName || 'N/A'}
Category:        ${pInfo.category || pkg.analysis.productCategory}
Selling Price:   ${priceDisplay}${pInfo.discountPercent ? ` (${pInfo.discountPercent}% OFF)` : ''}
Target Market:   ${pInfo.targetMarket}
Contact / Order: ${pInfo.contactPhone || 'Via DM / WhatsApp'}
Generated Date:  ${new Date(pkg.createdAt).toLocaleDateString()} ${new Date(pkg.createdAt).toLocaleTimeString()}
Campaign ID:     ${pkg.id}

AI Strategic Analysis:
- Product Type:     ${pkg.analysis.productType}
- Target Audience:  ${pkg.analysis.possibleTargetAudience || 'General Consumers'}
- Visual Style:     ${pkg.analysis.style || 'Modern Commercial'}
- Key Strengths:    ${pkg.analysis.potentialSellingPoints?.join(', ') || 'High appeal, premium positioning'}
- Recommended Angle: ${pkg.analysis.suggestedMarketingAngle || 'Value proposition'}`);

  // 2. Product Titles
  if (pkg.description?.titleVariations && pkg.description.titleVariations.length > 0) {
    sections.push(`${subDivider}
1. HIGH-CONVERTING PRODUCT TITLES
${subDivider}
${pkg.description.titleVariations.map((t, idx) => `[Option ${idx + 1}] ${t}`).join('\n')}`);
  }

  // 3. Descriptions & Features
  if (pkg.description) {
    const desc = pkg.description;
    const descText = `${subDivider}
2. PRODUCT DESCRIPTIONS & KEY VALUE PROPOSITIONS
${subDivider}
SHORT HOOK / ELEVATOR PITCH:
${desc.shortDescription}

FULL E-COMMERCE / SOCIAL DESCRIPTION:
${desc.fullDescription}

KEY FEATURES:
${(desc.keyFeatures || []).map((f) => `• ${f}`).join('\n')}

BENEFITS FOR THE BUYER:
${(desc.benefits || []).map((b) => `✓ ${b}`).join('\n')}

CALL TO ACTION (CTA) OPTIONS:
${(desc.callToActionOptions || []).map((cta) => `👉 ${cta}`).join('\n')}`;

    sections.push(descText);
  }

  // 4. Social Media Campaign
  if (pkg.socialMedia) {
    const sm = pkg.socialMedia;
    const socialLines: string[] = [
      `${subDivider}`,
      `3. MULTI-CHANNEL SOCIAL MEDIA COPY`,
      `${subDivider}`,
      `[INSTAGRAM CAPTIONS & HASHTAGS]`,
      `Headline: ${sm.instagram?.headline || productName}`,
      `CTA: ${sm.instagram?.cta || 'Link in bio'}`,
      ``
    ];

    if (sm.instagram?.captions) {
      sm.instagram.captions.forEach((cap, i) => {
        socialLines.push(`--- Instagram Variation ${i + 1} ---`);
        socialLines.push(cap);
        socialLines.push('');
      });
    }

    if (sm.instagram?.hashtags?.length) {
      socialLines.push(`Instagram Hashtags:\n${sm.instagram.hashtags.join(' ')}\n`);
    }

    if (sm.facebook) {
      socialLines.push(`[FACEBOOK ADS COPY]`);
      socialLines.push(`Short Ad:\n${sm.facebook.shortAd}\n`);
      socialLines.push(`Long Story Ad:\n${sm.facebook.longAd}\n`);
      socialLines.push(`Facebook CTA: ${sm.facebook.cta}\n`);
    }

    if (sm.tiktok) {
      socialLines.push(`[TIKTOK & REELS CONCEPT]`);
      socialLines.push(`Hook: ${sm.tiktok.hook}`);
      socialLines.push(`Short Caption: ${sm.tiktok.shortCaption}`);
      socialLines.push(`Video Concept: ${sm.tiktok.videoConcept}`);
      if (sm.tiktok.hashtags?.length) {
        socialLines.push(`Hashtags: ${sm.tiktok.hashtags.join(' ')}`);
      }
      socialLines.push('');
    }

    if (sm.whatsapp) {
      socialLines.push(`[WHATSAPP PROMOTIONAL BROADCAST]`);
      socialLines.push(sm.whatsapp.promotionalMessage);
      socialLines.push('');

      if (sm.whatsapp.toneVariations) {
        socialLines.push(`--- WhatsApp Tone Variations ---`);
        Object.entries(sm.whatsapp.toneVariations).forEach(([tone, msg]) => {
          socialLines.push(`[${tone.toUpperCase()}]`);
          socialLines.push(msg);
          socialLines.push('');
        });
      }
    }

    sections.push(socialLines.join('\n'));
  }

  // 5. 5 Ad Angles
  if (pkg.adVariations && pkg.adVariations.length > 0) {
    const adLines = [
      `${subDivider}`,
      `4. 5 HIGH-PERFORMING AD ANGLES (META & TIKTOK ADS)`,
      `${subDivider}`
    ];

    pkg.adVariations.forEach((ad, i) => {
      adLines.push(`[ANGLE ${i + 1}: ${ad.angle.toUpperCase()}]`);
      if (ad.description) adLines.push(`Strategy: ${ad.description}`);
      adLines.push(`Headline: ${ad.headline}`);
      adLines.push(`Primary Copy:\n${ad.primaryText}`);
      adLines.push(`CTA: ${ad.cta}`);
      adLines.push('');
    });

    sections.push(adLines.join('\n'));
  }

  // 6. Multilingual Content
  if (pkg.multilingual) {
    const ml = pkg.multilingual;
    const mlLines = [
      `${subDivider}`,
      `5. MULTILINGUAL MARKETING COPY`,
      `${subDivider}`
    ];

    if (ml.urdu) {
      mlLines.push(`[URDU - اردو]`);
      mlLines.push(`Title: ${ml.urdu.title}`);
      mlLines.push(`Description: ${ml.urdu.shortDescription}`);
      mlLines.push(`WhatsApp Broadcast:\n${ml.urdu.whatsappMessage}`);
      mlLines.push(`Instagram:\n${ml.urdu.instagramCaption}`);
      mlLines.push('');
    }

    if (ml.romanUrdu) {
      mlLines.push(`[ROMAN URDU]`);
      mlLines.push(`Title: ${ml.romanUrdu.title}`);
      mlLines.push(`Description: ${ml.romanUrdu.shortDescription}`);
      mlLines.push(`WhatsApp:\n${ml.romanUrdu.whatsappMessage}`);
      mlLines.push(`Instagram:\n${ml.romanUrdu.instagramCaption}`);
      mlLines.push('');
    }

    if (ml.arabic) {
      mlLines.push(`[ARABIC - العربية]`);
      mlLines.push(`Title: ${ml.arabic.title}`);
      mlLines.push(`Description: ${ml.arabic.shortDescription}`);
      mlLines.push(`WhatsApp:\n${ml.arabic.whatsappMessage}`);
      mlLines.push(`Instagram:\n${ml.arabic.instagramCaption}`);
      mlLines.push('');
    }

    sections.push(mlLines.join('\n'));
  }

  // 7. Video Script & Storyboard
  if (pkg.videoScript) {
    const vs = pkg.videoScript;
    const vidLines = [
      `${subDivider}`,
      `6. VIDEO AD SCRIPT & STORYBOARD (${vs.duration}s - ${vs.aspectRatio || '9:16'})`,
      `${subDivider}`,
      `Concept: ${vs.videoConcept}`,
      `Opening Hook: ${vs.hook}`,
      `Call To Action: ${vs.cta}`,
      `Music Mood: ${vs.musicMood || 'High-energy upbeat commercial beat'}`,
      `Full Voiceover Track:\n${vs.fullVoiceover || 'See scenes below'}\n`,
      `SCENE-BY-SCENE STORYBOARD:`
    ];

    (vs.scenes || []).forEach((scene) => {
      vidLines.push(`[Scene ${scene.sceneNumber} (${scene.durationSeconds}s) - ${scene.shotType}]`);
      vidLines.push(`Visual: ${scene.visualPrompt}`);
      vidLines.push(`Voiceover: "${scene.voiceover}"`);
      vidLines.push(`On-Screen Text: "${scene.onScreenText}"`);
      vidLines.push('');
    });

    sections.push(vidLines.join('\n'));
  }

  // 8. Marketplace Listings
  const marketplaceArray: MarketplaceListingData[] = Array.isArray(pkg.marketplaceListings)
    ? pkg.marketplaceListings
    : (pkg.marketplaceListings && typeof pkg.marketplaceListings === 'object')
    ? Object.values(pkg.marketplaceListings)
    : [];

  if (marketplaceArray.length > 0) {
    const mLines = [
      `${subDivider}`,
      `7. E-COMMERCE & DIGITAL MARKETPLACE LISTINGS (BOOK KAARO, SHOPIFY, DARAZ)`,
      `${subDivider}`
    ];

    marketplaceArray.forEach((m: MarketplaceListingData) => {
      mLines.push(`[PLATFORM: ${m.platform.toUpperCase()}]`);
      if (m.marketplaceUrl) mLines.push(`Marketplace URL: ${m.marketplaceUrl}`);
      mLines.push(`Title: ${m.title || m.productTitle || productName}`);
      mLines.push(`Short Description: ${m.shortDescription}`);
      if (m.fullDescription) {
        mLines.push(`Full Description:\n${m.fullDescription}`);
      }
      if (m.bulletFeatures?.length) {
        mLines.push(`Bullet Points:\n${m.bulletFeatures.map((b: string) => `• ${b}`).join('\n')}`);
      }
      if (m.specifications && Object.keys(m.specifications).length > 0) {
        mLines.push(`Specifications:\n${Object.entries(m.specifications).map(([k, v]) => `  ${k}: ${v}`).join('\n')}`);
      }
      if (m.tags?.length) {
        mLines.push(`Search Tags: ${m.tags.join(', ')}`);
      }
      if (m.seoTitle) {
        mLines.push(`SEO Title: ${m.seoTitle}`);
      }
      if (m.seoMetaDescription || m.metaDescription) {
        mLines.push(`SEO Meta Description: ${m.seoMetaDescription || m.metaDescription}`);
      }
      mLines.push('');
    });

    sections.push(mLines.join('\n'));
  }

  // 9. Customer Replies Cheat Sheet
  if (pkg.customerReplies && Object.keys(pkg.customerReplies).length > 0) {
    const replyLines = [
      `${subDivider}`,
      `8. CUSTOMER OBJECTION HANDLING & DM REPLIES (CHEAT SHEET)`,
      `${subDivider}`
    ];

    Object.entries(pkg.customerReplies).forEach(([q, a], idx) => {
      replyLines.push(`Q${idx + 1}: ${q}`);
      replyLines.push(`A: ${a}`);
      replyLines.push('');
    });

    sections.push(replyLines.join('\n'));
  }

  // 10. Search Volume & Keyword Intelligence (Google Trends Grounded)
  if (pkg.keywordsResearch) {
    const kr = pkg.keywordsResearch;
    const kwLines = [
      `${subDivider}`,
      `9. SEARCH VOLUME & KEYWORD INTELLIGENCE (GOOGLE TRENDS & ENGINES)`,
      `${subDivider}`,
      `Market Search Demand Index: ${kr.overallMarketInterestScore}/100`,
      `Engines & Data Sources: ${(kr.dataEnginesUsed || []).join(', ')}`,
      `Executive Market Summary: ${kr.marketDemandSummary}`,
      ``,
      `[HIGH SEARCH VOLUME KEYWORDS]`
    ];

    (kr.highVolumeKeywords || []).forEach((kw, i) => {
      kwLines.push(`${i + 1}. "${kw.keyword}"`);
      kwLines.push(`   - Search Volume: ${kw.searchVolumeFormatted || `${kw.searchVolume}/mo`}`);
      kwLines.push(`   - Google Trends Index: ${kw.volumeIndex}/100 (+${kw.trendGrowthPercent}% ${kw.trendStatus})`);
      kwLines.push(`   - Competition: ${kw.competition} | Intent: ${kw.searchIntent} | Est. CPC: ${kw.cpcEstimate || 'N/A'}`);
      kwLines.push(`   - Sourced From: ${kw.source}`);
      kwLines.push(`   - Recommended For: ${(kw.recommendedFor || []).join(', ')}`);
      kwLines.push('');
    });

    if (kr.recommendedHashtags && kr.recommendedHashtags.length > 0) {
      kwLines.push(`[HIGH-PERFORMING HASHTAGS]`);
      kr.recommendedHashtags.forEach((tag, i) => {
        kwLines.push(`${i + 1}. ${tag.hashtag} - Reach: ${tag.postsFormatted || `${tag.estimatedPosts} posts`} (Velocity: ${tag.velocityScore}/100) [Source: ${tag.source}]`);
      });
      kwLines.push('');
    }

    sections.push(kwLines.join('\n'));
  }

  // 11. Themed 1-Week / 2-Weeks Marketing Plan (Single Unifying Theme)
  if (pkg.themedPlan && pkg.themedPlan.dailyPlans && pkg.themedPlan.dailyPlans.length > 0) {
    const tp = pkg.themedPlan;
    const planLines = [
      `${subDivider}`,
      `10. THEMED MARKETING & PROMOTION PLAN (${tp.duration === '14_days' ? '2 WEEKS / 14 DAYS' : '1 WEEK / 7 DAYS'})`,
      `${subDivider}`,
      `Campaign Theme: "${tp.themeTitle}"`,
      `Campaign Tagline: "${tp.themeTagline}"`,
      `Target Goal: ${tp.targetGoal}`,
      `Core Objection Handled: ${tp.keyAudiencePainPoint}`,
      `Execution Notes: ${tp.calendarNotes || 'Maintain daily posting cadence'}`,
      ``,
      `DAY-BY-DAY CAMPAIGN ROADMAP:`
    ];

    tp.dailyPlans.forEach((day) => {
      planLines.push(`--- Day ${day.dayNumber}: ${day.dayTitle} ---`);
      planLines.push(`Funnel Stage: ${day.funnelStage} | Primary Channel: ${day.primaryPlatform}`);
      planLines.push(`Opening Hook: "${day.hook}"`);
      planLines.push(`Post Copy:\n${day.suggestedPostCopy}`);
      planLines.push(`Visual Asset Direction: ${day.visualDirection}`);
      planLines.push(`Call to Action: ${day.callToAction}`);
      planLines.push(`Target Keywords: ${day.recommendedKeywords.join(', ')}`);
      planLines.push(`Hashtags: ${day.recommendedHashtags.join(' ')}`);
      planLines.push('');
    });

    sections.push(planLines.join('\n'));
  }

  sections.push(`${divider}
Generated by SellBoost AI - Instant Multi-Channel Selling Packages
${divider}`);

  return sections.join('\n\n');
}

/**
 * Triggers instant browser download of the campaign content as a .txt file.
 */
export function downloadCampaignAsText(pkg: SellingPackage): void {
  const text = generateCampaignPlainText(pkg);
  const rawName = pkg.productInfo.name || pkg.analysis.productType || 'Campaign';
  const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_Campaign_Content.txt`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Helper to strip non-Latin characters from strings for standard jsPDF fonts,
 * preserving Roman Urdu, English, numbers, and common punctuation.
 */
function sanitizeForPdf(str: string): string {
  if (!str) return '';
  // Replace smart quotes and special dashes with standard ASCII equivalents
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2026]/g, '...')
    .replace(/[^\x00-\x7F]/g, ' '); // Replace non-ascii with space to prevent encoding corruption in standard PDF fonts
}

/**
 * Generates and downloads a multi-page, formatted PDF Marketing Brief using jsPDF.
 */
export async function downloadCampaignAsPdf(
  pkg: SellingPackage,
  posterCanvas?: HTMLCanvasElement | null
): Promise<void> {
  const pInfo = pkg.productInfo;
  const rawName = pInfo.name || pkg.analysis.productType || 'Product';
  const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_Campaign_Brief.pdf`;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const bottomThreshold = pageHeight - 20;

  let currentY = 16;
  let pageCount = 1;

  // Header & Footer helper for subsequent pages
  const drawPageDecoration = (pageNum: number) => {
    // Top running header line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`SellBoost AI | ${sanitizeForPdf(rawName)} - Campaign Brief`, margin, 9);

    // Bottom running footer
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 7);
    doc.text(`Page ${pageNum}`, pageWidth - margin - 14, pageHeight - 7);
  };

  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > bottomThreshold) {
      doc.addPage();
      pageCount++;
      drawPageDecoration(pageCount);
      currentY = 20;
    }
  };

  const addWrappedText = (
    text: string,
    maxWidth: number,
    fontSize: number = 9,
    lineHeight: number = 4.5,
    fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
    color: [number, number, number] = [51, 65, 85]
  ) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const sanitized = sanitizeForPdf(text);
    const lines = doc.splitTextToSize(sanitized, maxWidth);
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, margin, currentY);
      currentY += lineHeight;
    }
  };

  const addSectionHeader = (title: string, iconNumber?: string) => {
    ensureSpace(14);
    currentY += 4;

    // Background pill/bar
    doc.setFillColor(241, 245, 249); // slate-100
    doc.roundedRect(margin, currentY - 4, contentWidth, 8, 1.5, 1.5, 'F');

    // Accent line on left
    doc.setFillColor(79, 70, 229); // indigo-600
    doc.roundedRect(margin, currentY - 4, 3, 8, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59); // slate-800
    const label = iconNumber ? `${iconNumber}. ${title.toUpperCase()}` : title.toUpperCase();
    doc.text(label, margin + 6, currentY + 1.5);

    currentY += 8;
  };

  // ==========================================
  // PAGE 1: COVER HEADER & SUMMARY BANNER
  // ==========================================
  // Hero Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, currentY, contentWidth, 38, 3, 3, 'F');

  // Brand subhead
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(129, 140, 248); // indigo-400
  doc.text('SELLBOOST AI  |  MULTI-CHANNEL SELLING CAMPAIGN BRIEF', margin + 7, currentY + 9);

  // Main product title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  const headerTitleLines = doc.splitTextToSize(sanitizeForPdf(rawName), contentWidth - 14);
  doc.text(headerTitleLines[0] || 'Product Campaign', margin + 7, currentY + 18);

  // Subtitle / category
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  const categoryMarket = `Category: ${pInfo.category || pkg.analysis.productCategory}  •  Target Market: ${pInfo.targetMarket}`;
  doc.text(sanitizeForPdf(categoryMarket), margin + 7, currentY + 26);

  // Date and badge
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  const dateStr = `Exported: ${new Date().toLocaleDateString()}  •  ID: ${pkg.id.substring(0, 8)}`;
  doc.text(dateStr, margin + 7, currentY + 33);

  currentY += 44;

  // Key Metrics Card Row
  const priceDisplay = pInfo.price ? `${pInfo.currency} ${pInfo.price.toLocaleString()}` : 'Inquire via DM';
  const colWidth = (contentWidth - 6) / 3;
  const metricCards = [
    { title: 'SELLING PRICE', val: priceDisplay, note: pInfo.discountPercent ? `${pInfo.discountPercent}% OFF Campaign` : 'Standard MSRP' },
    { title: 'BRAND & STORE', val: pInfo.brandName || 'Direct / DTC', note: pInfo.contactPhone ? `WA: ${pInfo.contactPhone}` : 'Social Commerce' },
    { title: 'MARKET AUDIENCE', val: pInfo.targetMarket || 'Global', note: pkg.analysis.possibleTargetAudience?.substring(0, 28) || 'Broad Demographic' }
  ];

  metricCards.forEach((c, idx) => {
    const cardX = margin + idx * (colWidth + 3);
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, currentY, colWidth, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(c.title, cardX + 3.5, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(sanitizeForPdf(c.val), cardX + 3.5, currentY + 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(sanitizeForPdf(c.note), cardX + 3.5, currentY + 15);
  });

  currentY += 23;

  // 1. Titles & Elevator Pitch
  addSectionHeader('Title Variations & Elevator Pitch', '1');

  if (pkg.description?.titleVariations) {
    pkg.description.titleVariations.forEach((t, i) => {
      ensureSpace(7);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(79, 70, 229);
      doc.text(`Variation ${i + 1}:`, margin, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const titleLines = doc.splitTextToSize(sanitizeForPdf(t), contentWidth - 25);
      doc.text(titleLines, margin + 22, currentY);
      currentY += titleLines.length * 4.2 + 2;
    });
  }

  if (pkg.description?.shortDescription) {
    ensureSpace(12);
    currentY += 2;
    doc.setFillColor(238, 242, 255); // indigo-50
    doc.setDrawColor(199, 210, 254); // indigo-200
    doc.roundedRect(margin, currentY - 2, contentWidth, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(67, 56, 202); // indigo-700
    doc.text('ELEVATOR PITCH / HOOK:', margin + 4, currentY + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const shortDescLines = doc.splitTextToSize(sanitizeForPdf(pkg.description.shortDescription), contentWidth - 8);
    doc.text(shortDescLines, margin + 4, currentY + 7.5);

    currentY += 16;
  }

  // 2. Full Description, Features & Benefits
  addSectionHeader('Product Features & Benefits', '2');

  if (pkg.description?.keyFeatures) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('Key Features:', margin, currentY);
    currentY += 5;

    pkg.description.keyFeatures.forEach((feat) => {
      ensureSpace(5);
      doc.setFillColor(79, 70, 229);
      doc.circle(margin + 2, currentY - 1, 0.8, 'F');
      addWrappedText(`   ${feat}`, contentWidth - 6, 8.5, 4.2);
    });
    currentY += 2;
  }

  if (pkg.description?.benefits) {
    ensureSpace(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('Customer Benefits:', margin, currentY);
    currentY += 5;

    pkg.description.benefits.forEach((ben) => {
      ensureSpace(5);
      doc.setFillColor(16, 185, 129); // emerald-500
      doc.circle(margin + 2, currentY - 1, 0.8, 'F');
      addWrappedText(`   ${ben}`, contentWidth - 6, 8.5, 4.2);
    });
    currentY += 2;
  }

  // 3. 5 Ad Angles
  if (pkg.adVariations && pkg.adVariations.length > 0) {
    addSectionHeader('5 High-Converting Ad Angles', '3');

    pkg.adVariations.forEach((ad, i) => {
      ensureSpace(24);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, currentY - 2, contentWidth, 22, 1.5, 1.5, 'FD');

      // Tag
      doc.setFillColor(224, 231, 255); // indigo-100
      doc.roundedRect(margin + 3, currentY, 34, 4.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(67, 56, 202);
      doc.text(`ANGLE ${i + 1}: ${ad.angle.toUpperCase()}`, margin + 5, currentY + 3.2);

      // Headline
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(sanitizeForPdf(ad.headline), margin + 40, currentY + 3.2);

      // Body copy
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const copyLines = doc.splitTextToSize(sanitizeForPdf(ad.primaryText), contentWidth - 10);
      doc.text(copyLines.slice(0, 2), margin + 3, currentY + 8);

      // CTA
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(79, 70, 229);
      doc.text(`CTA: ${sanitizeForPdf(ad.cta)}`, margin + 3, currentY + 17);

      currentY += 24;
    });
  }

  // 4. Social Media Package
  if (pkg.socialMedia) {
    addSectionHeader('Social Media Copy & WhatsApp Campaign', '4');

    const sm = pkg.socialMedia;

    if (sm.instagram) {
      ensureSpace(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(192, 38, 211); // fuchsia-600
      doc.text('Instagram Campaign:', margin, currentY);
      currentY += 4.5;

      if (sm.instagram.captions && sm.instagram.captions[0]) {
        addWrappedText(`Caption: ${sm.instagram.captions[0]}`, contentWidth, 8, 4.2, 'normal', [51, 65, 85]);
      }
      if (sm.instagram.hashtags?.length) {
        addWrappedText(`Hashtags: ${sm.instagram.hashtags.join(' ')}`, contentWidth, 7.5, 3.8, 'italic', [100, 116, 139]);
      }
      currentY += 2;
    }

    if (sm.whatsapp?.promotionalMessage) {
      ensureSpace(20);
      doc.setFillColor(240, 253, 244); // emerald-50
      doc.setDrawColor(187, 247, 208); // emerald-200
      doc.roundedRect(margin, currentY - 2, contentWidth, 18, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(22, 101, 52); // emerald-800
      doc.text('WHATSAPP READY-TO-SEND PROMO MESSAGE:', margin + 4, currentY + 2.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      const waLines = doc.splitTextToSize(sanitizeForPdf(sm.whatsapp.promotionalMessage), contentWidth - 8);
      doc.text(waLines.slice(0, 3), margin + 4, currentY + 7.5);

      currentY += 20;
    }

    if (sm.tiktok?.hook) {
      ensureSpace(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('TikTok & Reels Hook:', margin, currentY);
      currentY += 4;
      addWrappedText(`"${sm.tiktok.hook}" - Concept: ${sm.tiktok.videoConcept}`, contentWidth, 8, 4.2);
      currentY += 2;
    }
  }

  // 5. Video Script & Storyboard
  if (pkg.videoScript?.scenes && pkg.videoScript.scenes.length > 0) {
    addSectionHeader('Video Ad Storyboard Script', '5');

    const vs = pkg.videoScript;
    ensureSpace(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Duration: ${vs.duration}s  •  Format: ${vs.aspectRatio || '9:16'}  •  Concept: ${sanitizeForPdf(vs.videoConcept)}`, margin, currentY);
    currentY += 6;

    vs.scenes.forEach((scene) => {
      ensureSpace(14);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, currentY - 2, contentWidth, 12, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(79, 70, 229);
      doc.text(`Scene ${scene.sceneNumber} (${scene.durationSeconds}s) - ${scene.shotType}`, margin + 3, currentY + 2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const voLine = `VO: "${sanitizeForPdf(scene.voiceover)}"  |  Text: "${sanitizeForPdf(scene.onScreenText)}"`;
      const voSplit = doc.splitTextToSize(voLine, contentWidth - 6);
      doc.text(voSplit[0] || '', margin + 3, currentY + 6.5);

      currentY += 14;
    });
  }

  // 6. Customer Objection Handling
  if (pkg.customerReplies && Object.keys(pkg.customerReplies).length > 0) {
    addSectionHeader('Customer FAQ & Objection Handling', '6');

    Object.entries(pkg.customerReplies).slice(0, 5).forEach(([q, a]) => {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(`Q: ${sanitizeForPdf(q)}`, margin, currentY);
      currentY += 4;

      addWrappedText(`A: ${a}`, contentWidth, 7.5, 3.8, 'normal', [71, 85, 105]);
      currentY += 2;
    });
  }

  // 7. Search Volume & Keyword Intelligence
  if (pkg.keywordsResearch && pkg.keywordsResearch.highVolumeKeywords?.length > 0) {
    addSectionHeader('High-Volume Keywords & Search Intelligence (Google Trends Grounded)', '7');
    const kr = pkg.keywordsResearch;

    ensureSpace(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(79, 70, 229);
    doc.text(`Market Demand Score: ${kr.overallMarketInterestScore}/100  •  Target Market: ${kr.targetMarket}`, margin, currentY);
    currentY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Sources: ${(kr.dataEnginesUsed || []).join(' | ')}`, margin, currentY);
    currentY += 5;

    kr.highVolumeKeywords.slice(0, 6).forEach((kw) => {
      ensureSpace(12);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, currentY - 2, contentWidth, 10.5, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(sanitizeForPdf(kw.keyword), margin + 3, currentY + 2.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(79, 70, 229);
      doc.text(`${kw.searchVolumeFormatted || `${kw.searchVolume}/mo`}`, margin + contentWidth - 45, currentY + 2.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Index: ${kw.volumeIndex}/100 (+${kw.trendGrowthPercent}%) • ${kw.competition} Comp • Intent: ${kw.searchIntent} • Source: ${sanitizeForPdf(kw.source)}`, margin + 3, currentY + 6.8);

      currentY += 12;
    });
  }

  // 8. Themed Marketing Calendar Plan
  if (pkg.themedPlan && pkg.themedPlan.dailyPlans?.length > 0) {
    const tp = pkg.themedPlan;
    addSectionHeader(`Themed Campaign Roadmap (${tp.duration === '14_days' ? '2 Weeks / 14 Days' : '1 Week / 7 Days'})`, '8');

    ensureSpace(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Theme: "${sanitizeForPdf(tp.themeTitle)}"`, margin, currentY);
    currentY += 4.5;

    tp.dailyPlans.slice(0, 7).forEach((day) => {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(79, 70, 229);
      doc.text(`Day ${day.dayNumber} [${day.funnelStage} Funnel • ${day.primaryPlatform}]: ${sanitizeForPdf(day.hook)}`, margin, currentY);
      currentY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const scriptPreview = doc.splitTextToSize(`Post: ${sanitizeForPdf(day.suggestedPostCopy)}`, contentWidth);
      doc.text(scriptPreview.slice(0, 2), margin, currentY);
      currentY += 7;
    });
  }

  // Add running headers & footers to page 1 as well
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    if (p > 1) {
      drawPageDecoration(p);
    } else {
      // Bottom footer for page 1
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`SellBoost AI Campaign Brief  •  Page 1 of ${totalPages}`, margin, pageHeight - 7);
      doc.text('Confidential - For Internal and Marketing Use', pageWidth - margin - 58, pageHeight - 7);
    }
  }

  doc.save(filename);
}

/**
 * Native web share or fallback helper.
 */
export async function shareCampaignContent(pkg: SellingPackage): Promise<{ success: boolean; method: string }> {
  const pInfo = pkg.productInfo;
  const productName = pInfo.name || pkg.analysis.productType || 'Product';
  const shareText = `🚀 ${productName} - Marketing Package Ready!\n\n${pkg.description?.shortDescription || ''}\n\nPrice: ${pInfo.currency} ${pInfo.price || ''}\n\nOrder / Inquire: ${pInfo.contactPhone || 'Via DM'}`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `${productName} - SellBoost Campaign`,
        text: shareText
      });
      return { success: true, method: 'native_share' };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, method: 'cancelled' };
      }
    }
  }

  // Fallback: Copy to clipboard
  const plainText = generateCampaignPlainText(pkg);
  const copied = await copyCampaignToClipboard(plainText);
  return { success: copied, method: 'clipboard' };
}

/**
 * Robust copy helper.
 */
export async function copyCampaignToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to textarea
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch {
    return false;
  }
}
