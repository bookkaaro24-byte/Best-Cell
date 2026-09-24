import { db } from './index.ts';
import { campaigns, users } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getCampaignsByUser(uid: string) {
  try {
    const userRecords = await db.select().from(users).where(eq(users.uid, uid));
    if (!userRecords.length) {
      return [];
    }
    const user = userRecords[0];
    const userCampaigns = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, user.id))
      .orderBy(desc(campaigns.createdAt));

    return userCampaigns.map((c) => ({
      id: String(c.id),
      productName: c.productName,
      category: c.category || '',
      createdAt: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
      ...(typeof c.data === 'object' && c.data ? c.data : {})
    }));
  } catch (error) {
    console.error("Database getCampaignsByUser failed:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function insertCampaign(uid: string, productName: string, category: string, data: any) {
  try {
    const userRecords = await db.select().from(users).where(eq(users.uid, uid));
    if (!userRecords.length) {
      throw new Error("User not found in database.");
    }
    const user = userRecords[0];
    const inserted = await db
      .insert(campaigns)
      .values({
        userId: user.id,
        productName,
        category,
        data,
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error("Database insertCampaign failed:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}
