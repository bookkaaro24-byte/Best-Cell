import { ProductInput } from '../types';

export interface SampleProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: 'PKR' | 'AED' | 'USD';
  keyFeatures: string;
  targetMarket: 'Pakistan' | 'UAE' | 'International';
  brandName: string;
  contactPhone: string;
  discountPercent: number;
  imageUrl: string;
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 'sample-handbag',
    name: "Riviera Structured Top-Handle Bag",
    category: "Bags",
    price: 18500,
    currency: "PKR",
    keyFeatures: "Structured silhouette, textured pebbled finish, brushed gold-tone hardware, detachable shoulder strap, dual inner compartments",
    targetMarket: "Pakistan",
    brandName: "Aura Leather Studio",
    contactPhone: "+92 300 1234567",
    discountPercent: 15,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'sample-watch',
    name: "Chronos Minimalist Obsidian Watch",
    category: "Jewelry",
    price: 349,
    currency: "AED",
    keyFeatures: "Matte black dial, sapphire crystal glass, 316L stainless steel mesh strap, 5ATM water resistance, Japanese quartz movement",
    targetMarket: "UAE",
    brandName: "Al-Noor Horology",
    contactPhone: "+971 50 9876543",
    discountPercent: 20,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'sample-shoes',
    name: "Urban Velocity Cloud Sneakers",
    category: "Shoes",
    price: 85,
    currency: "USD",
    keyFeatures: "Breathable knit upper, responsive cushioned EVA sole, ergonomic arch support, reflective heel tab, ultra-lightweight 220g",
    targetMarket: "International",
    brandName: "Stride & Co.",
    contactPhone: "+1 415 555 0199",
    discountPercent: 10,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'sample-skincare',
    name: "Pure Glow Rosehip Hydrating Elixir",
    category: "Beauty",
    price: 6500,
    currency: "PKR",
    keyFeatures: "Cold-pressed organic rosehip seed oil, vitamin C infused, non-comedogenic, lightweight fast absorption, cruelty-free",
    targetMarket: "Pakistan",
    brandName: "Botanica Lab",
    contactPhone: "+92 321 7654321",
    discountPercent: 25,
    imageUrl: "https://images.unsplash.com/photo-1608248597359-bb5c68f1ba98?auto=format&fit=crop&w=800&q=80"
  }
];
