export interface CategoryDefinition {
  id: string;
  name: string;
  type: 'product' | 'service' | 'digital' | 'handmade' | 'rentals' | 'real_estate' | 'industrial';
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
    id: 'furniture_decor',
    name: 'Furniture & Interior Furnishings',
    type: 'product',
    group: 'Home & Living',
    examples: ['Velvet Accent Chairs', 'Coffee Tables', 'Bookshelves', 'Orthopedic Mattresses'],
    placeholderName: 'e.g. Mid-Century Modern Solid Oak Wood Armchair',
    priceLabel: 'Selling Price'
  },
  {
    id: 'food_grocery',
    name: 'Food, Gourmet & Organic Groceries',
    type: 'product',
    group: 'Food & Nutrition',
    examples: ['Sidr Honey', 'Dry Fruits', 'Organic Spices', 'Olive Oil', 'Gourmet Chocolates'],
    placeholderName: 'e.g. Pure Himalayan Mountain Sidr Raw Honey 1kg',
    priceLabel: 'Selling Price'
  },
  {
    id: 'sports_fitness',
    name: 'Sports, Fitness & Gym Gear',
    type: 'product',
    group: 'Sports & Outdoors',
    examples: ['Yoga Mats', 'Adjustable Dumbbells', 'Resistance Bands', 'Cricket Bats', 'Protein Shakers'],
    placeholderName: 'e.g. Non-Slip Eco Rubber Exercise Yoga Mat with Strap',
    priceLabel: 'Selling Price'
  },
  {
    id: 'baby_kids',
    name: 'Baby, Kids & Toys',
    type: 'product',
    group: 'Kids & Family',
    examples: ['Baby Strollers', 'Wooden Educational Toys', 'Kids Clothing', 'Diaper Bags'],
    placeholderName: 'e.g. Ultra-Compact Lightweight Folding Baby Stroller',
    priceLabel: 'Selling Price'
  },
  {
    id: 'automotive_parts',
    name: 'Automotive Accessories & Bike Gear',
    type: 'product',
    group: 'Automotive',
    examples: ['Dash Cameras', 'LED Headlights', 'Bike Helmets', 'Car Vacuum Cleaners'],
    placeholderName: 'e.g. 4K Ultra HD Dual Dash Camera with Night Vision',
    priceLabel: 'Selling Price'
  }
];

// Expanded Industry 1: Digital Products & Software
export const DIGITAL_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'digital_saas',
    name: 'SaaS, Software & Web Applications',
    type: 'digital',
    group: 'Digital Products & Software',
    examples: ['Cloud CRM Software', 'Inventory Management App', 'Billing & POS Tool', 'AI Automation Bot'],
    placeholderName: 'e.g. All-In-One Cloud Retail POS & Inventory Billing Software',
    priceLabel: 'Subscription / License Fee'
  },
  {
    id: 'digital_courses',
    name: 'Online Courses, Masterclasses & Bootcamps',
    type: 'digital',
    group: 'Digital Products & Software',
    examples: ['Digital Marketing Masterclass', 'Python Coding Bootcamp', 'E-Commerce Scaling Course'],
    placeholderName: 'e.g. Complete 0-to-100 Daraz & Shopify E-Commerce Mastery Course',
    priceLabel: 'Enrollment Fee'
  },
  {
    id: 'digital_templates',
    name: 'Design Templates, UI Kits & Graphic Assets',
    type: 'digital',
    group: 'Digital Products & Software',
    examples: ['Figma Mobile UI Kit', 'Canva Social Media Bundle', 'Photoshop Mockups', 'Icon Sets'],
    placeholderName: 'e.g. 500+ Luxury Viral Social Media Canva Editable Templates',
    priceLabel: 'Download Price'
  },
  {
    id: 'digital_ebooks',
    name: 'E-Books, Guides & Educational Bundles',
    type: 'digital',
    group: 'Digital Products & Software',
    examples: ['Tax Filing Guide', 'Fitness Nutrition E-Book', 'Stock Market Strategy PDF'],
    placeholderName: 'e.g. The Complete Guide to Freelancing & Overseas Remittances',
    priceLabel: 'Digital Copy Price'
  },
  {
    id: 'digital_notion_sheets',
    name: 'Notion Dashboards & Financial Spreadsheets',
    type: 'digital',
    group: 'Digital Products & Software',
    examples: ['Personal Finance Tracker', 'Freelance Project Notion OS', 'E-Commerce P&L Sheet'],
    placeholderName: 'e.g. Automated E-Commerce Profit & Loss Financial Tracker Spreadsheet',
    priceLabel: 'Lifetime Access Price'
  }
];

// Expanded Industry 2: Handmade, Artisanal & Crafts
export const HANDMADE_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'handmade_resin_art',
    name: 'Handmade Resin Art, Trays & Coasters',
    type: 'handmade',
    group: 'Handmade, Crafts & Artisanal',
    examples: ['Ocean Wave Resin Clock', 'Gold Leaf Coasters', 'Preserved Floral Resin Tray'],
    placeholderName: 'e.g. Handcrafted Ocean Wave Resin Wall Clock with Real Shells',
    priceLabel: 'Artisan Price'
  },
  {
    id: 'handmade_pottery',
    name: 'Artisan Pottery, Ceramics & Planters',
    type: 'handmade',
    group: 'Handmade, Crafts & Artisanal',
    examples: ['Hand-Thrown Ceramic Mugs', 'Glazed Terracotta Planters', 'Ceramic Bowls'],
    placeholderName: 'e.g. Hand-Thrown Speckled Stoneware Coffee Mug with Ergonomic Handle',
    priceLabel: 'Handmade Piece Price'
  },
  {
    id: 'handmade_leather',
    name: 'Custom Handstitched Leather Goods',
    type: 'handmade',
    group: 'Handmade, Crafts & Artisanal',
    examples: ['Handstitched Bifold Wallets', 'Leather Passport Covers', 'Artisan Tool Rolls'],
    placeholderName: 'e.g. Full-Grain Vegetable Tanned Handstitched Leather Bifold Wallet',
    priceLabel: 'Selling Price'
  },
  {
    id: 'handmade_candles',
    name: 'Hand-Poured Scented Soy Candles & Wax Melts',
    type: 'handmade',
    group: 'Handmade, Crafts & Artisanal',
    examples: ['Amber Glass Jar Candles', 'Lavender Wax Melts', 'Wood Wick Aromatherapy'],
    placeholderName: 'e.g. Pure Botanical Soy Wax Scented Candle with Crackling Wood Wick',
    priceLabel: 'Selling Price'
  },
  {
    id: 'handmade_calligraphy',
    name: 'Islamic Calligraphy, Oil Paintings & Canvas Art',
    type: 'handmade',
    group: 'Handmade, Crafts & Artisanal',
    examples: ['Ayat-ul-Kursi Gold Leaf Art', 'Textured Abstract Acrylics', 'Watercolor Landscapes'],
    placeholderName: 'e.g. 24K Gold Leaf 3D Textured Islamic Calligraphy Canvas Wall Art',
    priceLabel: 'Artwork Price'
  }
];

// Expanded Industry 3: Rentals, Equipment & Events
export const RENTAL_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'rental_vehicles',
    name: 'Luxury Car & Wedding Vehicle Rentals',
    type: 'rentals',
    group: 'Rentals & Leasing',
    examples: ['Mercedes Benz Chauffeur', 'Vintage Wedding Cars', 'Prado / Land Cruiser Hire', 'Coaster Van'],
    placeholderName: 'e.g. Mercedes S-Class V8 Wedding Car Rental with Chauffeur & Floral Decor',
    priceLabel: 'Daily / Event Rental Rate'
  },
  {
    id: 'rental_av_cameras',
    name: 'Camera, Drone & Film Gear Rentals',
    type: 'rentals',
    group: 'Rentals & Leasing',
    examples: ['Sony FX3 Cinema Rig', 'DJI Mavic 3 Cine Drone', 'Aputure LED Light Kit', 'Wireless Mics'],
    placeholderName: 'e.g. Complete Cinema Camera & Wireless Audio Production Rental Kit',
    priceLabel: 'Daily Rental Rate'
  },
  {
    id: 'rental_event_decor',
    name: 'Event Furniture, Tents & Banquet Setup Rentals',
    type: 'rentals',
    group: 'Rentals & Leasing',
    examples: ['Chiavari Chairs', 'Air-Conditioned Marquees', 'LED Dance Floor', 'Sound Systems'],
    placeholderName: 'e.g. Full Banquet Setup with Chiavari Chairs, Tables & Mood Lighting',
    priceLabel: 'Package Rental Fee'
  },
  {
    id: 'rental_machinery',
    name: 'Heavy Construction & Generator Equipment Rentals',
    type: 'rentals',
    group: 'Rentals & Leasing',
    examples: ['100kVA Silent Diesel Generator', 'Hydraulic Excavator', 'Scaffolding Towers'],
    placeholderName: 'e.g. 50kVA Silent Commercial Diesel Generator on Towable Trolley',
    priceLabel: 'Weekly / Monthly Rental Rate'
  }
];

// Expanded Industry 4: Real Estate & Architecture
export const REAL_ESTATE_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'real_estate_residential',
    name: 'Residential Homes, Villas & Luxury Apartments',
    type: 'real_estate',
    group: 'Real Estate & Properties',
    examples: ['10 Marla Luxury Villa', 'Penthouse Duplex Apartment', 'Ready-to-Move Furnished Flat'],
    placeholderName: 'e.g. Brand New 1 Kanal Designer Modern Villa with Basement & Pool',
    priceLabel: 'Demand / Asking Price'
  },
  {
    id: 'real_estate_commercial',
    name: 'Commercial Plots, Retail Shops & Corporate Offices',
    type: 'real_estate',
    group: 'Real Estate & Properties',
    examples: ['Main Boulevard Plaza', 'Food Court Kiosk', 'Corporate Floor for MNC'],
    placeholderName: 'e.g. High-Yield Commercial Corner Retail Shop in Prime Business District',
    priceLabel: 'Total Price / Monthly Rent'
  },
  {
    id: 'real_estate_shortterm',
    name: 'Short-Term Vacation Rentals & Luxury Farmhouses',
    type: 'real_estate',
    group: 'Real Estate & Properties',
    examples: ['Private Pool Farmhouse', 'Murree Mountain Villa', 'Beachfront Hut'],
    placeholderName: 'e.g. Exclusive Private Pool Luxury Resort Farmhouse for Family Events',
    priceLabel: 'Nightly / Daily Booking Rate'
  },
  {
    id: 'real_estate_construction',
    name: 'Architectural 3D Design & Turnkey House Construction',
    type: 'real_estate',
    group: 'Real Estate & Properties',
    examples: ['3D Elevation Render', 'Grey Structure Construction', 'A+ Complete Finishing'],
    placeholderName: 'e.g. Turnkey A+ Grade Architectural Construction & Interior Fit-Out',
    priceLabel: 'Rate Per Sq. Ft / Project Quote'
  }
];

// Expanded Industry 5: Industrial, Manufacturing & B2B
export const INDUSTRIAL_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'industrial_machinery',
    name: 'Industrial Machinery, CNC & Factory Equipment',
    type: 'industrial',
    group: 'Industrial & B2B Machinery',
    examples: ['Fiber Laser Cutting Machine', 'Plastic Injection Molding Machine', 'Rotary Screw Air Compressor'],
    placeholderName: 'e.g. High-Precision 3000W Fiber Laser Metal Cutting Machine',
    priceLabel: 'Unit FOB / CIF Price'
  },
  {
    id: 'industrial_solar',
    name: 'Commercial Solar Energy & Inverter Systems',
    type: 'industrial',
    group: 'Industrial & B2B Machinery',
    examples: ['20kW On-Grid Solar Plant', 'Industrial Lithium Battery Banks', 'Tier-1 Mono PERC Panels'],
    placeholderName: 'e.g. Turnkey 30kW Hybrid Industrial Solar Energy Power Plant',
    priceLabel: 'Complete Installed Price'
  },
  {
    id: 'industrial_packaging',
    name: 'Corrugated Mailer Boxes & Industrial Packaging',
    type: 'industrial',
    group: 'Industrial & B2B Machinery',
    examples: ['Custom Printed E-Commerce Boxes', 'Stretch Film Rolls', 'Biodegradable Poly Mailers'],
    placeholderName: 'e.g. Custom Printed Matte 3-Ply Corrugated Shipping Boxes (Batch of 1,000)',
    priceLabel: 'MOQ Batch Price'
  },
  {
    id: 'industrial_safety_tools',
    name: 'Safety Equipment, PPE & Industrial Tools',
    type: 'industrial',
    group: 'Industrial & B2B Machinery',
    examples: ['Steel Toe Safety Boots', 'Fire Suppression Systems', 'Industrial Power Tool Kits'],
    placeholderName: 'e.g. Certified Industrial Safety Harness & Personal Protection Equipment Kit',
    priceLabel: 'Wholesale Unit Rate'
  }
];

// Professional & Local Services
export const SERVICE_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'digital_marketing',
    name: 'Digital Marketing & Social Media Agency',
    type: 'service',
    group: 'Marketing & Digital Services',
    examples: ['Meta & TikTok Ads Management', 'SEO Optimization', 'Influencer PR Campaigns'],
    placeholderName: 'e.g. 30-Day Growth Acceleration Paid Ads & Video Content Retainer',
    priceLabel: 'Monthly Retainer Fee'
  },
  {
    id: 'web_dev_software',
    name: 'Web Development, App & Custom Software',
    type: 'service',
    group: 'Marketing & Digital Services',
    examples: ['Shopify Store Setup', 'Custom Mobile Apps (Flutter/React)', 'Custom ERP Portals'],
    placeholderName: 'e.g. High-Speed E-Commerce Shopify Plus Store Design & Conversion Setup',
    priceLabel: 'Project Starting Rate'
  },
  {
    id: 'design_branding',
    name: 'Graphic Design, Branding & Video Editing',
    type: 'service',
    group: 'Creative & Media',
    examples: ['Logo & Brand Identity Kit', 'Reels & TikTok Video Editing', 'Product 3D Mockups'],
    placeholderName: 'e.g. Full Corporate Visual Identity, Logo Guidelines & Packaging Suite',
    priceLabel: 'Project Quote'
  },
  {
    id: 'ac_repair_maintenance',
    name: 'AC, HVAC & Appliance Maintenance Studio',
    type: 'service',
    group: 'Home & Facilities Maintenance',
    examples: ['Inverter Deep Chemical Wash', 'Gas Refill & Leak Testing', 'Commercial HVAC Maintenance'],
    placeholderName: 'e.g. Hydro-Jet Chemical AC Deep Cleaning, Gas Top-Up & 30-Day Guarantee',
    priceLabel: 'Service Package Price'
  },
  {
    id: 'wedding_events',
    name: 'Event Management, Wedding Planning & Decor',
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
    id: 'business_consulting',
    name: 'Business Consulting & Executive Coaching',
    type: 'service',
    group: 'Professional & Business Services',
    examples: ['Supply Chain Optimization', 'Sales Team Training', 'Franchise Consulting'],
    placeholderName: 'e.g. 1-on-1 Sales Scaling & Executive Leadership Sprint',
    priceLabel: 'Consulting Fee'
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
    id: 'logistics_freight',
    name: 'Logistics, Courier & Cargo Shipping',
    type: 'service',
    group: 'B2B & Manufacturing',
    examples: ['International DHL/FedEx Cargo', 'COD Doorstep Courier Service', 'Warehousing Fulfillment'],
    placeholderName: 'e.g. Dedicated E-Commerce Doorstep COD Delivery & Warehousing Service',
    priceLabel: 'Per Parcel / Monthly Plan'
  }
];

export const ALL_CATEGORIES: CategoryDefinition[] = [
  ...PRODUCT_CATEGORIES,
  ...DIGITAL_CATEGORIES,
  ...HANDMADE_CATEGORIES,
  ...RENTAL_CATEGORIES,
  ...REAL_ESTATE_CATEGORIES,
  ...INDUSTRIAL_CATEGORIES,
  ...SERVICE_CATEGORIES
];

export const CATEGORY_NAMES = [
  ...ALL_CATEGORIES.map((c) => c.name),
  'Other Products & Services (Custom)'
];
