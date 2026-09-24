import JSZip from 'jszip';
import { SellingPackage } from '../types';

export async function downloadCampaignZip(pkg: SellingPackage, posterCanvas?: HTMLCanvasElement | null) {
  const zip = new JSZip();
  const folderName = (pkg.productInfo.name || pkg.analysis.productType || 'SellBoost_Campaign')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const root = zip.folder(folderName) || zip;

  // 1. Text summary file
  let fullText = `=====================================================
SELLBOOST COMPLETE SELLING CAMPAIGN PACKAGE
=====================================================
Product: ${pkg.productInfo.name || pkg.analysis.productType}
Category: ${pkg.productInfo.category || pkg.analysis.productCategory}
Price: ${pkg.productInfo.price ? `${pkg.productInfo.currency} ${pkg.productInfo.price}` : 'Inquire via DM'}
Target Market: ${pkg.productInfo.targetMarket}
Brand: ${pkg.productInfo.brandName || 'N/A'}
Contact: ${pkg.productInfo.contactPhone || 'N/A'}
Created: ${new Date(pkg.createdAt).toLocaleString()}

-----------------------------------------------------
1. PRODUCT TITLES
-----------------------------------------------------
${pkg.description.titleVariations.map((t, i) => `${i + 1}. ${t}`).join('\n')}

-----------------------------------------------------
2. SHORT DESCRIPTION
-----------------------------------------------------
${pkg.description.shortDescription}

-----------------------------------------------------
3. FULL PRODUCT DESCRIPTION
-----------------------------------------------------
${pkg.description.fullDescription}

-----------------------------------------------------
4. KEY FEATURES & BENEFITS
-----------------------------------------------------
Features:
${pkg.description.keyFeatures.map((f) => `- ${f}`).join('\n')}

Benefits:
${pkg.description.benefits.map((b) => `- ${b}`).join('\n')}

Call to Action:
${pkg.description.callToActionOptions.join(' | ')}

-----------------------------------------------------
5. SOCIAL MEDIA COPY
-----------------------------------------------------
[INSTAGRAM CAPTIONS]
${pkg.socialMedia.instagram.captions.map((c, i) => `--- Variation ${i + 1} ---\n${c}`).join('\n\n')}

Hashtags:
${pkg.socialMedia.instagram.hashtags.join(' ')}

[FACEBOOK ADS]
Short Ad:
${pkg.socialMedia.facebook.shortAd}

Long Ad:
${pkg.socialMedia.facebook.longAd}

[TIKTOK]
Hook: ${pkg.socialMedia.tiktok.hook}
Caption: ${pkg.socialMedia.tiktok.shortCaption}
Concept: ${pkg.socialMedia.tiktok.videoConcept}
Hashtags: ${pkg.socialMedia.tiktok.hashtags.join(' ')}

[WHATSAPP MESSAGE (READY TO SEND)]
${pkg.socialMedia.whatsapp.promotionalMessage}

-----------------------------------------------------
6. AD VARIATIONS (5 ANGLES)
-----------------------------------------------------
${pkg.adVariations.map((ad) => `[${ad.angle}]
Headline: ${ad.headline}
Copy: ${ad.primaryText}
CTA: ${ad.cta}
`).join('\n')}

-----------------------------------------------------
7. MULTILINGUAL CONTENT
-----------------------------------------------------
[URDU (اردو)]
Title: ${pkg.multilingual.urdu.title}
Description: ${pkg.multilingual.urdu.shortDescription}
WhatsApp: ${pkg.multilingual.urdu.whatsappMessage}
Instagram: ${pkg.multilingual.urdu.instagramCaption}

[ROMAN URDU]
Title: ${pkg.multilingual.romanUrdu.title}
Description: ${pkg.multilingual.romanUrdu.shortDescription}
WhatsApp: ${pkg.multilingual.romanUrdu.whatsappMessage}
Instagram: ${pkg.multilingual.romanUrdu.instagramCaption}

[ARABIC (العربية)]
Title: ${pkg.multilingual.arabic.title}
Description: ${pkg.multilingual.arabic.shortDescription}
WhatsApp: ${pkg.multilingual.arabic.whatsappMessage}
Instagram: ${pkg.multilingual.arabic.instagramCaption}

-----------------------------------------------------
8. VIDEO SCRIPT & STORYBOARD
-----------------------------------------------------
Concept: ${pkg.videoScript.videoConcept}
Hook: ${pkg.videoScript.hook}
Duration: ${pkg.videoScript.duration}s (${pkg.videoScript.aspectRatio})
CTA: ${pkg.videoScript.cta}

Scenes:
${pkg.videoScript.scenes.map((s) => `Scene ${s.sceneNumber} (${s.durationSeconds}s) [${s.shotType}]:
Visual: ${s.visualPrompt}
Voiceover: ${s.voiceover}
On-Screen Text: ${s.onScreenText}
`).join('\n')}

-----------------------------------------------------
9. CUSTOMER REPLIES CHEAT SHEET
-----------------------------------------------------
${Object.entries(pkg.customerReplies).map(([k, v]) => `Q: ${k}\nA: ${v}\n`).join('\n')}
`;

  root.file('campaign_copy_and_ads.txt', fullText);
  root.file('campaign_data.json', JSON.stringify(pkg, null, 2));

  // 2. Add poster image if available
  if (posterCanvas) {
    try {
      const dataUrl = posterCanvas.toDataURL('image/png');
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      root.file('promotional_poster.png', base64Data, { base64: true });
    } catch (e) {
      console.warn('Could not add poster canvas to zip:', e);
    }
  }

  // 3. Add original product image
  if (pkg.productImage && pkg.productImage.startsWith('data:image/')) {
    const matches = pkg.productImage.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (matches) {
      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      root.file(`original_product_photo.${ext}`, matches[2], { base64: true });
    }
  }

  // 4. Generate and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${folderName}_SellBoost_Package.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  // Fallback
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return Promise.resolve(successful);
  } catch (err) {
    return Promise.resolve(false);
  }
}
