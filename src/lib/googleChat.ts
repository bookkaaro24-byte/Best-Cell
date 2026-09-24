export interface GoogleChatSpace {
  name: string; // e.g. "spaces/AAAAAAAAAAA"
  displayName?: string;
  type?: string;
  spaceType?: 'SPACE' | 'GROUP_CHAT' | 'DIRECT_MESSAGE';
  spaceThreadingState?: string;
  externalUserAllowed?: boolean;
  membershipCount?: {
    joinedDirectHumanUserCount?: number;
  };
}

export interface GoogleChatMessageSender {
  name?: string;
  displayName?: string;
  avatarUrl?: string;
  type?: string;
}

export interface GoogleChatMessage {
  name: string; // e.g. "spaces/AAA/messages/BBB"
  text?: string;
  createTime?: string;
  sender?: GoogleChatMessageSender;
  cardsV2?: any[];
}

export class GoogleChatError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'GoogleChatError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Lists all Google Chat spaces accessible by the user.
 */
export async function listGoogleChatSpaces(accessToken: string): Promise<GoogleChatSpace[]> {
  const response = await fetch('https://chat.googleapis.com/v1/spaces', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error?.message || `Failed to list spaces (HTTP ${response.status})`;
    throw new GoogleChatError(message, response.status, errorBody);
  }

  const data = await response.json();
  return data.spaces || [];
}

/**
 * Creates a new Google Chat named space for product collaboration.
 */
export async function createGoogleChatSpace(
  accessToken: string,
  displayName: string
): Promise<GoogleChatSpace> {
  const response = await fetch('https://chat.googleapis.com/v1/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      displayName: displayName.trim(),
      spaceType: 'SPACE',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error?.message || `Failed to create space (HTTP ${response.status})`;
    throw new GoogleChatError(message, response.status, errorBody);
  }

  return await response.json();
}

/**
 * Lists recent messages inside a Google Chat space.
 */
export async function listGoogleChatMessages(
  accessToken: string,
  spaceName: string
): Promise<GoogleChatMessage[]> {
  const cleanSpace = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
  const response = await fetch(
    `https://chat.googleapis.com/v1/${cleanSpace}/messages?pageSize=30`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error?.message || `Failed to list messages (HTTP ${response.status})`;
    throw new GoogleChatError(message, response.status, errorBody);
  }

  const data = await response.json();
  return (data.messages || []).reverse(); // oldest to newest for chat view
}

/**
 * Sends a message (text and/or rich card) into a Google Chat space.
 */
export async function sendGoogleChatMessage(
  accessToken: string,
  spaceName: string,
  text: string,
  cardsV2?: any[]
): Promise<GoogleChatMessage> {
  const cleanSpace = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
  const body: Record<string, any> = {
    text,
  };

  if (cardsV2 && cardsV2.length > 0) {
    body.cardsV2 = cardsV2;
  }

  const response = await fetch(`https://chat.googleapis.com/v1/${cleanSpace}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error?.message || `Failed to send message (HTTP ${response.status})`;
    throw new GoogleChatError(message, response.status, errorBody);
  }

  return await response.json();
}
