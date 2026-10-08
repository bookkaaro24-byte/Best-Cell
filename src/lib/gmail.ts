// Gmail API Service for SellBoost

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
  from?: string;
  cc?: string;
  bcc?: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  sender?: string;
  subject?: string;
  date?: string;
}

/**
 * Builds an RFC 2822 formatted email and encodes it to base64url for the Gmail API.
 */
export function buildRawEmail(params: SendEmailParams): string {
  const { to, subject, body, isHtml = true, from, cc, bcc } = params;

  // Encode subject in UTF-8 base64
  const encodedSubject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;

  const headers: string[] = [];
  if (from) headers.push(`From: ${from}`);
  headers.push(`To: ${to}`);
  if (cc) headers.push(`Cc: ${cc}`);
  if (bcc) headers.push(`Bcc: ${bcc}`);
  headers.push(`Subject: ${encodedSubject}`);
  headers.push('MIME-Version: 1.0');
  headers.push(isHtml ? 'Content-Type: text/html; charset=UTF-8' : 'Content-Type: text/plain; charset=UTF-8');
  headers.push('Content-Transfer-Encoding: 7bit');
  headers.push('');
  headers.push(body);

  const fullEmailText = headers.join('\r\n');

  // Convert to URL-safe base64 string
  const base64 = btoa(unescape(encodeURIComponent(fullEmailText)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64;
}

/**
 * Fetch the authenticated user's Gmail profile
 */
export async function getGmailProfile(accessToken: string): Promise<GmailProfile> {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch Gmail profile (${res.status})`);
  }

  return res.json();
}

/**
 * Send an email directly via the Gmail API
 */
export async function sendEmailViaGmail(
  accessToken: string,
  params: SendEmailParams
): Promise<{ id: string; threadId: string }> {
  const raw = buildRawEmail(params);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to send email via Gmail (${res.status})`);
  }

  return res.json();
}

/**
 * Create a draft email in the user's Gmail mailbox
 */
export async function createGmailDraft(
  accessToken: string,
  params: SendEmailParams
): Promise<{ id: string; message: { id: string; threadId: string } }> {
  const raw = buildRawEmail(params);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: { raw }
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create draft in Gmail (${res.status})`);
  }

  return res.json();
}

/**
 * List recent messages or search messages (e.g. for customer inquiries)
 */
export async function listRecentGmailMessages(
  accessToken: string,
  maxResults = 10,
  query = ''
): Promise<GmailMessageSummary[]> {
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', String(maxResults));
  if (query) {
    url.searchParams.set('q', query);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to list Gmail messages (${res.status})`);
  }

  const data = await res.json();
  if (!data.messages || !Array.isArray(data.messages)) {
    return [];
  }

  // Fetch snippets and headers for the first batch
  const summaries: GmailMessageSummary[] = [];
  for (const m of data.messages.slice(0, 10)) {
    try {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
          }
        }
      );
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        const headers = msgData.payload?.headers || [];
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const sender = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';
        summaries.push({
          id: m.id,
          threadId: m.threadId,
          snippet: msgData.snippet,
          subject,
          sender,
          date
        });
      }
    } catch {
      summaries.push({ id: m.id, threadId: m.threadId });
    }
  }

  return summaries;
}
