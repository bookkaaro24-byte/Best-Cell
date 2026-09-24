export interface CategoryDefinition {
  id: string;
  name: string;
  type: 'product' | 'service';
  group: string;
  examples: string[];
  placeholderName: string;
  priceLabel: string;
}

export const PRODUCT_CATEGORIES: CategoryDefinition[] = [
  // Fashion & Apparel
  {
    id: 'fashion_apparel',
    name: 'Fashion & Apparel',
    type: 'product',
    group: 'Clothing & Wearables',
    examples: ['Stitched Suits', 'Kurtis', 'Dresses', 'T-Shirts', 'Denim', 'Hoodies'],
    placeholderName: 'e.g. Luxury Embroidered Lawn 3-Piece Suit',
    priceLabel: 'Selling Price'
  },
  {
    id: 'shoes_footwear',
    name: 'Shoes & Footwear',
    type: 'product',
    group: 'Clothing & Wearables',
    examples: ['Running Sneakers', 'Leather Loafers', 'Heels', 'Traditional Khussa', 'Boots'],
    placeholderName: 'e.g. Ultra-Light Breathable Cushion Sneakers',
    priceLabel: 'Selling Price'
  },
  {
    id: 'bags_luggage',
    name: 'Bags, Wallets & Luggage',
    type: 'product',
    group: 'Accessories',
    examples: ['Leather Handbags', 'Tote Bags', 'Backpacks', 'Bifold Wallets', 'Travel Duffels'],
    placeholderName: 'e.g. Genuine Textured Structured Leather Tote Bag',
    priceLabel: 'Selling Price'
  },
  {
    id: 'jewelry_watches',
    name: 'Jewelry & Luxury Watches',
    type: 'product',
    group: 'Accessories',
    examples: ['Zircon Necklaces', 'Gold-Plated Bangles', 'Men Chronograph Watch', 'Earrings'],
    placeholderName: 'e.g. 18K Gold Plated Emerald Pendant Necklace',
    priceLabel: 'Selling Price'
  },
  {
    id: 'beauty_skincare',
    name: 'Beauty, Skincare & Cosmetics',
    type: 'product',
    group: 'Personal Care',
    examples: ['Vitamin C Serum', 'Hydrating Moisturizer', 'Lipstick Shades', 'Sunscreen SPF 50'],
    placeholderName: 'e.g. Pure Glow Vitamin C & Hyaluronic Acid Serum',
    priceLabel: 'Selling Price'
  },
  {
    id: 'perfumes_fragrances',
    name: 'Perfumes, Ouds & Fragrances',
    type: 'product',
    group: 'Personal Care',
    examples: ['French Perfumes', 'Royal Amber Oud', 'Body Mists', 'Attar Oils'],
    placeholderName: 'e.g. Velvet Noir Eau De Parfum 100ml',
    priceLabel: 'Selling Price'
  },
  {
    id: 'electronics_gadgets',
    name: 'Electronics & Smart Gadgets',
    type: 'product',
    group: 'Electronics & Tech',
    examples: ['Smart Watches', 'TWS Earbuds', 'Bluetooth Speakers', 'Action Cams'],
    placeholderName: 'e.g. Active Noise Canceling Wireless Earbuds Pro',
    priceLabel: 'Selling Price'
  },
  {
    id: 'mobile_accessories',
    name: 'Mobile Phones & Accessories',
    type: 'product',
    group: 'Electronics & Tech',
    examples: ['Silicone Cases', 'Fast Chargers', 'Magnetic Car Mounts', 'Gimbal Stabilizers'],
    placeholderName: 'e.g. 65W GaN Fast Charger with Braided Cable',
    priceLabel: 'Selling Price'
  },
  {
    id: 'computers_gaming',
    name: 'Computers, Laptops & Gaming',
    type: 'product',
    group: 'Electronics & Tech',
    examples: ['Mechanical Keyboards', 'Gaming Mice', 'Laptops', 'USB Docks'],
    placeholderName: 'e.g. RGB Mechanical Wireless Gaming Keyboard',
    priceLabel: 'Selling Price'
  },
  {
    id: 'home_kitchen',
    name: 'Home Decor, Kitchen & Bedding',
    type: 'product',
    group: 'Home & Living',
    examples: ['Air Fryers', 'Egyptian Cotton Sheets', 'Wall Clocks', 'Cookware Sets'],
    placeholderName: 'e.g. Non-Stick Granite Cookware Set (7 Pieces)',
    priceLabel: 'Selling Price'
  },
  {
    id: 'furniture_interior',
    name: 'Furniture & Living Room',
    type: 'product',
    group: 'Home & Living',
    examples: ['Ergonomic Chairs', 'Velvet Sofas', 'Coffee Tables', 'Bookshelves'],
    placeholderName: 'e.g. Scandinavian Minimalist Walnut Coffee Table',
    priceLabel: 'Selling Price'
  },
  {
    id: 'food_gourmet',
    name: 'Food, Gourmet & Confectionery',
    type: 'product',
    group: 'Food & Groceries',
    examples: ['Artisanal Chocolates', 'Organic Honey', 'Premium Dry Fruits', 'Roasted Coffee Beans'],
    placeholderName: 'e.g. Raw Sidr Organic Mountain Honey 500g',
    priceLabel: 'Selling Price'
  },
  {
    id: 'sports_fitness',
    name: 'Sports, Gym & Fitness Gear',
    type: 'product',
    group: 'Fitness & Outdoor',
    examples: ['Resistance Bands', 'Yoga Mats', 'Adjustable Dumbbells', 'Sportswear'],
    placeholderName: 'e.g. Non-Slip High Density Eco Yoga Mat with Strap',
    priceLabel: 'Selling Price'
  },
  {
    id: 'automotive_parts',
    name: 'Automotive Parts & Car Care',
    type: 'product',
    group: 'Vehicles & Auto',
    examples: ['Ceramic Car Wax', 'Dashcams', 'LED Headlights', 'Interior Cleaners'],
    placeholderName: 'e.g. Hydrophobic Ceramic Spray Coating 500ml',
    priceLabel: 'Selling Price'
  },
  {
    id: 'baby_kids',
    name: 'Baby Care & Kids Toys',
    type: 'product',
    group: 'Kids & Family',
    examples: ['Educational Toys', 'Baby Strollers', 'Cotton Rompers', 'Feeding Bottles'],
    placeholderName: 'e.g. Montessori Wooden Learning Activity Box',
    priceLabel: 'Selling Price'
  },
  {
    id: 'books_stationery',
    name: 'Books, Journals & Stationery',
    type: 'product',
    group: 'Lifestyle & Hobbies',
    examples: ['Leather Bound Planners', 'Calligraphy Pens', 'Novels', 'Desk Organizers'],
    placeholderName: 'e.g. Undated Productivity & Goal Planner',
    priceLabel: 'Selling Price'
  },
  {
    id: 'pet_supplies',
    name: 'Pet Supplies & Pet Food',
    type: 'product',
    group: 'Lifestyle & Hobbies',
    examples: ['Grain-Free Dog Food', 'Cat Scratching Posts', 'Leashes', 'Self-Cleaning Brushes'],
    placeholderName: 'e.g. Ergonomic Retractable Dog Leash with Flashlight',
    priceLabel: 'Selling Price'
  },
  {
    id: 'hardware_industrial',
    name: 'Hardware, Tools & Industrial',
    type: 'product',
    group: 'Industrial & Work',
    examples: ['Cordless Power Drills', 'Toolkits', 'Safety Gear', 'Solar Accessories'],
    placeholderName: 'e.g. 21V Cordless Brushless Impact Drill Kit',
    priceLabel: 'Selling Price'
  },
  {
    id: 'eyewear_sunglasses',
    name: 'Eyewear & Sunglasses',
    type: 'product',
    group: 'Accessories',
    examples: ['Polarized Sunglasses', 'Blue Light Blocking Glasses', 'Titanium Frames'],
    placeholderName: 'e.g. Polarized Aviator Sunglasses with UV400 Protection',
    priceLabel: 'Selling Price'
  },
  {
    id: 'artisan_handicrafts',
    name: 'Handcrafted Goods & Art',
    type: 'product',
    group: 'Lifestyle & Hobbies',
    examples: ['Handwoven Rugs', 'Ceramic Pottery', 'Resin Art', 'Embroidered Cushions'],
    placeholderName: 'e.g. Handcrafted Glazed Ceramic Coffee Mug Set',
    priceLabel: 'Selling Price'
  }
];

export const SERVICE_CATEGORIES: CategoryDefinition[] = [
  // Digital & Tech Services
  {
    id: 'digital_marketing',
    name: 'Digital Marketing & Social Media Agency',
    type: 'service',
    group: 'Professional & Business Services',
    examples: ['Meta Ads Management', 'SEO Optimization', 'Content Creation', 'Influencer Campaigns'],
    placeholderName: 'e.g. High-ROAS Meta & TikTok Ads Scaling Package',
    priceLabel: 'Monthly Retainer / Package Fee'
  },
  {
    id: 'software_web_dev',
    name: 'Software, Web & SaaS Development',
    type: 'service',
    group: 'Professional & Business Services',
    examples: ['Custom Shopify Stores', 'Mobile Apps (iOS/Android)', 'Full-Stack Web Apps', 'API Integration'],
    placeholderName: 'e.g. High-Converting Custom Shopify Store Design & Setup',
    priceLabel: 'Project Starting Price'
  },
  {
    id: 'real_estate_property',
    name: 'Real Estate & Property Advisory',
    type: 'service',
    group: 'Real Estate & Living',
    examples: ['Luxury Apartment Sales', 'Commercial Plots', 'Rental Management', 'Off-Plan Investment'],
    placeholderName: 'e.g. Exclusive Off-Plan Luxury Sea-View 2-Bed Apartments',
    priceLabel: 'Starting Price / Down Payment'
  },
  {
    id: 'education_courses',
    name: 'Education, Online Courses & Coaching',
    type: 'service',
    group: 'Education & Training',
    examples: ['Amazon/Shopify Mastery Course', 'IELTS Preparation', 'Coding Bootcamp', 'Language Classes'],
    placeholderName: 'e.g. 6-Week E-Commerce Masterclass & Mentorship Program',
    priceLabel: 'Course Fee / Per Student'
  },
  {
    id: 'healthcare_clinic',
    name: 'Healthcare, Clinic & Dental Services',
    type: 'service',
    group: 'Health & Wellness',
    examples: ['Teeth Whitening', 'Dermatology & Skin Laser', 'Physiotherapy', 'Doctor Consultation'],
    placeholderName: 'e.g. Advanced Laser Skin Rejuvenation & Facial Package',
    priceLabel: 'Consultation / Session Fee'
  },
  {
    id: 'fitness_personal_training',
    name: 'Fitness & Personal Training',
    type: 'service',
    group: 'Health & Wellness',
    examples: ['1-on-1 Personal Training', 'Weight Loss Meal Plans', 'Yoga Classes', 'Crossfit Sessions'],
    placeholderName: 'e.g. 90-Day Body Transformation & Nutrition Coaching',
    priceLabel: 'Monthly Program Fee'
  },
  {
    id: 'legal_corporate_tax',
    name: 'Legal, Corporate & Tax Advisory',
    type: 'service',
    group: 'Professional & Business Services',
    examples: ['Company Registration', 'NTN & FBR Filing', 'Trademark Registration', 'Contract Drafting'],
    placeholderName: 'e.g. Complete Private Limited Company Incorporation & Tax Setup',
    priceLabel: 'Advisory / Filing Fee'
  },
  {
    id: 'accounting_finance',
    name: 'Accounting & Financial Planning',
    type: 'service',
    group: 'Professional & Business Services',
    examples: ['Bookkeeping', 'QuickBooks Setup', 'VAT/GST Compliance', 'Financial Auditing'],
    placeholderName: 'e.g. Monthly Bookkeeping & CFO Advisory for Small Businesses',
    priceLabel: 'Monthly Retainer'
  },
  {
    id: 'home_maintenance_services',
    name: 'Home Services (AC, Plumbing, Electrical, Cleaning)',
    type: 'service',
    group: 'Home & Local Services',
    examples: ['AC Deep Cleaning', 'Solar Panel Installation', 'Plumbing Repairs', 'Deep Sofa Cleaning'],
    placeholderName: 'e.g. Complete Inverter AC Chemical Wash & Gas Top-Up Service',
    priceLabel: 'Service Fee / Visit'
  },
  {
    id: 'salon_spa_grooming',
    name: 'Salon, Spa & Aesthetic Grooming',
    type: 'service',
    group: 'Personal Care & Beauty',
    examples: ['Bridal Makeup', 'Hair Keratin Treatment', 'Swedish Massage', 'Groom Hair & Beard Styling'],
    placeholderName: 'e.g. Signature Organic Keratin & Hair Botox Treatment',
    priceLabel: 'Treatment / Package Price'
  },
  {
    id: 'photography_videography',
    name: 'Photography & Video Production',
    type: 'service',
    group: 'Creative & Media',
    examples: ['E-Commerce Product Shoots', 'Wedding Photography', 'Reels / TikTok Shoots', 'Commercial Ads'],
    placeholderName: 'e.g. Full-Day Commercial E-Commerce Studio Product Photography',
    priceLabel: 'Per Shoot / Day Rate'
  },
  {
    id: 'event_wedding_planning',
    name: 'Event Planning & Wedding Decor',
    type: 'service',
    group: 'Events & Hospitality',
    examples: ['Barat & Walima Decor', 'Corporate Conferences', 'Birthday Setups', 'Catering Packages'],
    placeholderName: 'e.g. Luxury Themed Wedding Reception Floral Stage & Decor',
    priceLabel: 'Package Starting Rate'
  },
  {
    id: 'travel_tourism_visa',
    name: 'Travel, Tourism & Visa Consulting',
    type: 'service',
    group: 'Travel & Mobility',
    examples: ['Dubai Tourist Visas', 'Umrah Packages', 'Northern Areas Tour', 'European Visa Filing'],
    placeholderName: 'e.g. 15-Day Premium 5-Star Umrah Package with Flights & Hotel',
    priceLabel: 'Package Cost / Per Person'
  },
  {
    id: 'car_rental_detailing',
    name: 'Car Rental & Auto Detailing Studio',
    type: 'service',
    group: 'Vehicles & Auto',
    examples: ['Wedding Car Rentals', 'Paint Protection Film (PPF)', 'Interior Detail', 'Chauffeur Service'],
    placeholderName: 'e.g. Ultra-Gloss Ceramic Paint Protection & Interior Steam Clean',
    priceLabel: 'Service / Daily Rate'
  },
  {
    id: 'construction_architecture',
    name: 'Construction, Architecture & Interior Design',
    type: 'service',
    group: 'Real Estate & Living',
    examples: ['3D Architectural Rendering', 'Turnkey House Construction', 'Office Interior Remodeling'],
    placeholderName: 'e.g. Full Turnkey Residential Interior Architecture & Fit-Out',
    priceLabel: 'Per Sq. Ft / Project Quote'
  },
  {
    id: 'business_consulting',
    name: 'Business Consulting & Executive Coaching',
    type: 'service',
    group: 'Professional & Business Services',
    examples: ['Supply Chain Optimization', 'Sales Team Training', 'Franchise Consulting'],
    placeholderName: 'e.g. 1-on-1 Sales Scaling & Executive Leadership Sprint',
    priceLabel: 'Consulting Fee'
  },
  {
    id: 'pet_grooming_vet',
    name: 'Pet Grooming & Veterinary Clinic',
    type: 'service',
    group: 'Lifestyle & Hobbies',
    examples: ['Pet Vaccination', 'Cat Grooming & Haircut', 'Dental Scaling', 'Boarding & Daycare'],
    placeholderName: 'e.g. Complete Spa Bath, Hair Trim & Health Checkup for Dogs/Cats',
    priceLabel: 'Session Fee'
  },
  {
    id: 'printing_packaging',
    name: 'Custom Printing & Brand Packaging',
    type: 'service',
    group: 'B2B & Manufacturing',
    examples: ['Custom Corrugated Mailer Boxes', 'Thank You Cards', 'Embossed Shopping Bags', 'Stickers'],
    placeholderName: 'e.g. Custom Printed Matte Laminated Rigid Magnetic Gift Boxes (500 pcs)',
    priceLabel: 'Minimum Order Quote'
  },
  {
    id: 'restaurant_catering',
    name: 'Restaurant, Cafe & Cloud Kitchen',
    type: 'service',
    group: 'Events & Hospitality',
    examples: ['Party Platters', 'Office Lunch Catering', 'Live BBQ Setup', 'Artisanal Bakery Orders'],
    placeholderName: 'e.g. Gourmet Live BBQ & Wood-Fired Pizza Catering Setup (50 Guests)',
    priceLabel: 'Per Person / Order Total'
  },
  {
    id: 'logistics_freight',
    name: 'Logistics, Courier & Cargo Shipping',
    type: 'service',
    group: 'B2B & Manufacturing',
    examples: ['International DHL/FedEx Cargo', 'COD Doorstep Courier Service', 'Warehousing Fulfillment'],
    placeholderName: 'e.g. Dedicated E-Commerce Doorstep COD Delivery & Warehousing Service',
    priceLabel: 'Per Parcel / Monthly Plan'
  },
  {
    id: 'b2b_wholesale_manufacturing',
    name: 'B2B Wholesale & Contract Manufacturing',
    type: 'service',
    group: 'B2B & Manufacturing',
    examples: ['Private Label Cosmetics', 'Garment Stitching Unit', 'Bulk Sourcing from China/Local'],
    placeholderName: 'e.g. OEM Private Label Skincare & Cosmetic Formulation & Batch Production',
    priceLabel: 'Batch / MOQ Quote'
  }
];

export const ALL_CATEGORIES = [...PRODUCT_CATEGORIES, ...SERVICE_CATEGORIES];

export const CATEGORY_NAMES = [
  ...ALL_CATEGORIES.map((c) => c.name),
  'Other Products & Services (Custom)'
];
