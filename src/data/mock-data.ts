export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: {
    perDay: number;
    perWeek: number;
    perMonth: number;
  };
  images: string[];
  location: string;
  vendorId: string;
  vendorName: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  securityDeposit: number;
  features: string[];
}

export interface Booking {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  startDate: string;
  endDate: string;
  duration: number;
  durationType: 'day' | 'week' | 'month';
  totalPrice: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  location: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PendingVendor {
  id: string;
  name: string;
  companyName: string;
  email: string;
  gstin: string;
  signupDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export const categories = [
  { id: 'cameras', name: 'Cameras', icon: 'Camera' },
  { id: 'laptops', name: 'Laptops', icon: 'Laptop' },
  { id: 'furniture', name: 'Furniture', icon: 'Armchair' },
  { id: 'vehicles', name: 'Vehicles', icon: 'Car' },
  { id: 'tools', name: 'Tools', icon: 'Wrench' },
  { id: 'party', name: 'Party Equipment', icon: 'PartyPopper' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Canon EOS R5 Mirrorless Camera',
    description: 'Professional full-frame mirrorless camera with 45MP sensor and 8K video recording. Perfect for photography and videography projects.',
    category: 'cameras',
    price: { perDay: 50, perWeek: 300, perMonth: 1000 },
    images: ['/images/products/canon_eos_r5.png'],
    location: 'New York, NY',
    vendorId: 'v1',
    vendorName: 'ProGear Rentals',
    rating: 4.8,
    reviewCount: 124,
    available: true,
    securityDeposit: 500,
    features: ['45MP Full-Frame Sensor', '8K Video Recording', '5-Axis Image Stabilization', 'Dual Card Slots'],
  },
  {
    id: '2',
    name: 'MacBook Pro 16" M3 Max',
    description: 'High-performance laptop with M3 Max chip, 36GB RAM, and 1TB SSD. Ideal for video editing, design, and development work.',
    category: 'laptops',
    price: { perDay: 80, perWeek: 500, perMonth: 1800 },
    images: ['/images/products/macbook_pro.png'],
    location: 'San Francisco, CA',
    vendorId: 'v2',
    vendorName: 'TechRent Solutions',
    rating: 4.9,
    reviewCount: 89,
    available: true,
    securityDeposit: 1000,
    features: ['M3 Max Chip', '36GB Unified Memory', '1TB SSD Storage', '16" Liquid Retina XDR Display'],
  },
  {
    id: '3',
    name: 'Tesla Model 3 Long Range',
    description: 'Electric vehicle with autopilot, 358 mile range, and premium interior. Perfect for weekend trips or daily commuting.',
    category: 'vehicles',
    price: { perDay: 120, perWeek: 700, perMonth: 2500 },
    images: ['/images/products/tesla_model_3.png'],
    location: 'Los Angeles, CA',
    vendorId: 'v3',
    vendorName: 'Green Auto Rentals',
    rating: 4.7,
    reviewCount: 203,
    available: true,
    securityDeposit: 2000,
    features: ['358 Mile Range', 'Autopilot', 'Premium Interior', 'Supercharger Access'],
  },
  {
    id: '4',
    name: 'Modern Velvet Sofa Set',
    description: '3-seater luxury velvet sofa with matching armchairs. Perfect for home staging, events, or temporary living arrangements.',
    category: 'furniture',
    price: { perDay: 40, perWeek: 250, perMonth: 800 },
    images: ['/images/products/velvet_sofa.png'],
    location: 'Chicago, IL',
    vendorId: 'v4',
    vendorName: 'Urban Furniture Co.',
    rating: 4.6,
    reviewCount: 67,
    available: true,
    securityDeposit: 300,
    features: ['Premium Velvet Upholstery', 'Modern Design', 'Includes 2 Armchairs', 'Deep Seating Comfort'],
  },
  {
    id: '5',
    name: 'DJI Mavic 3 Pro Drone',
    description: 'Professional drone with 4/3 CMOS Hasselblad camera, 46-minute flight time, and obstacle sensing in all directions.',
    category: 'cameras',
    price: { perDay: 60, perWeek: 350, perMonth: 1200 },
    images: ['/images/products/dji_mavic_3.png'],
    location: 'Miami, FL',
    vendorId: 'v1',
    vendorName: 'ProGear Rentals',
    rating: 4.9,
    reviewCount: 156,
    available: true,
    securityDeposit: 800,
    features: ['4/3 CMOS Hasselblad Camera', '46min Flight Time', 'Omnidirectional Obstacle Sensing', '15km Transmission Range'],
  },
  {
    id: '6',
    name: 'Mountain Bike - Full Suspension',
    description: 'High-end mountain bike with full suspension, 29" wheels, and hydraulic disc brakes. Perfect for trail riding and adventures.',
    category: 'vehicles',
    price: { perDay: 30, perWeek: 180, perMonth: 600 },
    images: ['/images/products/mountain_bike.png'],
    location: 'Denver, CO',
    vendorId: 'v5',
    vendorName: 'Adventure Gear Rentals',
    rating: 4.7,
    reviewCount: 92,
    available: true,
    securityDeposit: 400,
    features: ['Full Suspension', '29" Wheels', 'Hydraulic Disc Brakes', 'Carbon Fiber Frame'],
  },
  {
    id: '7',
    name: 'Professional Power Drill Set',
    description: 'Complete cordless drill set with multiple bits, batteries, and carrying case. Ideal for DIY projects and renovations.',
    category: 'tools',
    price: { perDay: 15, perWeek: 80, perMonth: 250 },
    images: ['/images/products/power_drill.png'],
    location: 'Seattle, WA',
    vendorId: 'v6',
    vendorName: 'ToolShare Pro',
    rating: 4.8,
    reviewCount: 143,
    available: true,
    securityDeposit: 100,
    features: ['20V Lithium Battery', '2 Batteries Included', '50+ Drill Bits', 'Carrying Case'],
  },
  {
    id: '8',
    name: 'Espresso Machine - Commercial Grade',
    description: 'Professional espresso machine with dual boilers, PID temperature control, and steam wand. Perfect for events and pop-ups.',
    category: 'party',
    price: { perDay: 45, perWeek: 280, perMonth: 900 },
    images: ['/images/products/espresso_machine.png'],
    location: 'Portland, OR',
    vendorId: 'v7',
    vendorName: 'EventPro Supplies',
    rating: 4.6,
    reviewCount: 78,
    available: true,
    securityDeposit: 500,
    features: ['Dual Boiler System', 'PID Temperature Control', 'Commercial Grade', 'Professional Steam Wand'],
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    productId: '1',
    productName: 'Canon EOS R5 Mirrorless Camera',
    productImage: '/images/products/canon_eos_r5.png',
    customerId: 'c1',
    customerName: 'John Doe',
    vendorId: 'v1',
    vendorName: 'ProGear Rentals',
    startDate: '2026-02-05',
    endDate: '2026-02-08',
    duration: 3,
    durationType: 'day',
    totalPrice: 150,
    status: 'active',
    location: 'New York, NY',
  },
  {
    id: 'b2',
    productId: '3',
    productName: 'Tesla Model 3 Long Range',
    productImage: '/images/products/tesla_model_3.png',
    customerId: 'c2',
    customerName: 'Jane Smith',
    vendorId: 'v3',
    vendorName: 'Green Auto Rentals',
    startDate: '2026-02-01',
    endDate: '2026-02-08',
    duration: 1,
    durationType: 'week',
    totalPrice: 700,
    status: 'active',
    location: 'Los Angeles, CA',
  },
  {
    id: 'b3',
    productId: '2',
    productName: 'MacBook Pro 16" M3 Max',
    productImage: '/images/products/macbook_pro.png',
    customerId: 'c3',
    customerName: 'Mike Johnson',
    vendorId: 'v2',
    vendorName: 'TechRent Solutions',
    startDate: '2026-01-15',
    endDate: '2026-01-22',
    duration: 1,
    durationType: 'week',
    totalPrice: 500,
    status: 'completed',
    location: 'San Francisco, CA',
  },
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userId: 'u1',
    userName: 'Sarah Williams',
    rating: 5,
    comment: 'Amazing camera! Perfect condition and the vendor was very helpful.',
    date: '2026-01-25',
  },
  {
    id: 'r2',
    productId: '1',
    userId: 'u2',
    userName: 'Tom Brown',
    rating: 4,
    comment: 'Great quality, would rent again.',
    date: '2026-01-20',
  },
  {
    id: 'r3',
    productId: '2',
    userId: 'u3',
    userName: 'Emily Davis',
    rating: 5,
    comment: 'Excellent laptop for video editing. Fast delivery!',
    date: '2026-01-18',
  },
];

export const mockPendingVendors: PendingVendor[] = [
  {
    id: 'pv1',
    name: 'Robert Fox',
    companyName: 'Fox Rentals Ltd',
    email: 'robert@foxrentals.com',
    gstin: '07AAAAA0000A1Z5',
    signupDate: '2026-01-28',
    status: 'pending'
  },
  {
    id: 'pv2',
    name: 'Arlene McCoy',
    companyName: 'McCoy AV Solutions',
    email: 'arlene@mccoyav.com',
    gstin: '27BBBBB1111B2Z6',
    signupDate: '2026-01-29',
    status: 'pending'
  },
  {
    id: 'pv3',
    name: 'Cody Fisher',
    companyName: 'Fisher Tool Hire',
    email: 'cody@fisherhire.com',
    gstin: '33CCCCC2222C3Z7',
    signupDate: '2026-01-30',
    status: 'pending'
  }
];
