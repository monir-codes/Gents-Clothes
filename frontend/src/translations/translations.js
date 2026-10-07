/**
 * Comprehensive Bilingual Translations Dictionary (Bengali ⇄ English)
 * for রঙবতী (Ronggoboti) Luxury Women's Fashion House
 */

export const BILINGUAL_SYNONYMS = {
  // Bengali -> English
  'শাড়ি': ['saree', 'sari', 'shari', 'sharee'],
  'জামদানি': ['jamdani', 'dhakai jamdani'],
  'কাতান': ['katan', 'katan silk', 'mirpur katan'],
  'বেনারসি': ['benarasi', 'banarasi', 'benarasi katan'],
  'সিল্ক': ['silk', 'pure silk', 'half silk', 'soft silk'],
  'সুতি': ['cotton', 'pure cotton', 'handloom', 'tant'],
  'তাঁত': ['tant', 'handloom', 'tangail tant'],
  'জর্জেট': ['georgette', 'weightless georgette'],
  'অরগাঞ্জা': ['organza', 'tissue'],
  'মসলিন': ['muslin', 'dhakai muslin'],
  'বাটিক': ['batik', 'block print'],
  'থ্রি পিস': ['three piece', '3 piece', 'salwar kameez', 'lawn'],
  '৩ পিস': ['three piece', '3 piece', 'salwar kameez'],
  '৩-পিস': ['three piece', '3 piece', 'salwar kameez'],
  'টু পিস': ['two piece', '2 piece', 'kurti pant'],
  '২ পিস': ['two piece', '2 piece', 'kurti pant'],
  '২-পিস': ['two piece', '2 piece', 'kurti pant'],
  'সালোয়ার কামিজ': ['salwar kameez', 'salwar suit', 'three piece'],
  'পাকিস্তানি লন': ['pakistani lawn', 'lawn 3 piece', 'luxury lawn'],
  'কুর্তি': ['kurti', 'kurtis', 'tunic', 'top'],
  'টিউনিক': ['tunic', 'tops', 'kurti'],
  'টপস': ['tops', 'western tops', 'tunics'],
  'লেহেঙ্গা': ['lehenga', 'lehengas', 'ghagra', 'choli'],
  'ব্রাইডাল': ['bridal', 'wedding', 'reception'],
  'গাউন': ['gown', 'gowns', 'maxi dress', 'frock'],
  'আবায়া': ['abaya', 'abayas', 'dubai cherry', 'cherry abaya'],
  'বোরকা': ['borka', 'burqa', 'abaya', 'modest'],
  'হিজাব': ['hijab', 'hijabs', 'khimar', 'scarf'],
  'খিমার': ['khimar', 'hijab'],
  'কর্ড সেট': ['co-ord', 'co-ord sets', 'coord', 'two piece'],
  'প্লাজো': ['palazzo', 'trousers', 'pants'],
  'শাল': ['shawl', 'shawls', 'kashmiri shawl', 'pashmina'],
  'ঈদ': ['eid', 'eid collection', 'festive'],
  'লাল': ['red', 'crimson', 'maroon'],
  'কালো': ['black'],
  'সাদা': ['white', 'off-white'],
  'নীল': ['blue', 'navy'],
  'সবুজ': ['green', 'emerald'],
  'হলুদ': ['yellow', 'mustard', 'haldi'],
  'গোলাপি': ['pink', 'rose'],

  // English -> Bengali
  'saree': ['শাড়ি', 'শাড়ি'],
  'jamdani': ['জামদানি', 'ঢাকাই জামদানি'],
  'katan': ['কাতান', 'কাতান শাড়ি'],
  'benarasi': ['বেনারসি', 'বেনারসী'],
  'silk': ['সিল্ক', 'রেশম'],
  'cotton': ['সুতি', 'কটন', 'খাদি'],
  'three piece': ['থ্রি পিস', '৩-পিস', 'সালোয়ার কামিজ'],
  'two piece': ['টু পিস', '২-পিস'],
  'salwar kameez': ['সালোয়ার কামিজ', 'থ্রি পিস'],
  'kurti': ['কুর্তি', 'টিউনিক'],
  'lehenga': ['লেহেঙ্গা', 'চোলি'],
  'abaya': ['আবায়া', 'বোরকা'],
  'borka': ['বোরকা', 'আবায়া'],
  'hijab': ['হিজাব', 'স্কার্ফ'],
  'gown': ['গাউন', 'ম্যাক্সি ড্রেস'],
  'co-ord': ['কর্ড সেট', 'কো-অর্ড']
};

export const translations = {
  bn: {
    // Top Announcement & Branding
    brandName: 'রঙবতী',
    brandTagline: 'অভিজাত ও আধুনিক উইমেন ফ্যাশন',
    currency: '৳',
    
    // Navbar
    nav: {
      shop: 'শপ',
      collections: 'কালেকশন',
      newArrivals: 'নতুন আগমন',
      sale: 'অফার / সেল',
      about: 'আমাদের সম্পর্কে',
      faq: 'সাধারণ জিজ্ঞাসা',
      contact: 'যোগাযোগ',
      trackOrder: 'অর্ডার ট্র্যাক',
      wishlist: 'উইশলিস্ট',
      cart: 'শপিং ব্যাগ',
      search: 'অনুসন্ধান করুন...',
      login: 'প্রবেশ করুন',
      register: 'রেজিস্টার',
      profile: 'প্রোফাইল',
      dashboard: 'ড্যাশবোর্ড',
      logout: 'লগআউট',
      welcome: 'স্বাগতম',
      guest: 'অতিথি',
      adminPanel: 'অ্যাডমিন প্যানেল'
    },

    // Search
    search: {
      placeholder: 'শাড়ি, ৩-পিস, কুর্তি, লেহেঙ্গা বা ক্যাটাগরি খুঁজুন...',
      popularSearches: 'জনপ্রিয় অনুসন্ধান',
      aiRecommend: 'আপনার জন্য এআই রিকমেন্ডেশন',
      searchBtn: 'খুঁজুন',
      noResults: 'কোনো ফলাফল পাওয়া যায়নি',
      resultsFor: 'অনুসন্ধানের ফলাফল:'
    },

    // Hero & Home
    home: {
      heroTagline: 'বাংলার ঐতিহ্য ও আধুনিক আভিজাত্য',
      exploreBtn: 'কালেকশন দেখুন',
      shopNow: 'এখনই শপ করুন',
      categoriesTitle: 'ক্যাটাগরি সমূহ',
      categoriesSubtitle: 'আপনার পছন্দের পোশাকের এক্সক্লুসিভ কালেকশন',
      featuredTitle: 'নির্বাচিত কালেকশন',
      featuredSubtitle: 'উৎসব ও আভিজাত্যের সেরা ডিজাইন',
      trendingTitle: 'জনপ্রিয় পোশাক',
      trendingSubtitle: 'সবার পছন্দের শীর্ষে থাকা কালেকশন',
      whyChooseUs: 'কেন রঙবতী সেরা?',
      reviewsTitle: 'আমাদের সন্তুষ্ট গ্রাহকদের মতামত',
      reviewsSubtitle: 'দেশজুড়ে হাজারো নারীর বিশ্বস্ত ফ্যাশন ব্র্যান্ড',
      instagramTitle: 'ইনস্টাগ্রাম গ্যালারি',
      newsletterTitle: 'রঙবতী ক্লাবে যুক্ত হোন',
      newsletterSubtitle: 'নতুন কালেকশন ও স্পেশাল অফার সবার আগে পেতে সাবস্ক্রাইব করুন',
      subscribeBtn: 'সাবস্ক্রাইব',
      emailPlaceholder: 'আপনার ইমেইল অ্যাড্রেস লিখুন...'
    },

    // Product & Shop
    shop: {
      allProducts: 'সকল পোশাক',
      filterBy: 'ফিল্টার',
      sortBy: 'সাজান',
      categories: 'ক্যাটাগরি',
      size: 'সাইজ',
      price: 'মূল্য',
      priceRange: 'মূল্য সীমা',
      allPrices: 'সকল মূল্য',
      under1000: '৳১,০০০ এর নিচে',
      range1000to2000: '৳১,০০০ - ৳২,০০০',
      range2000to5000: '৳২,০০০ - ৳৫,০০০',
      over5000: '৳৫,০০০ এর উপরে',
      sortFeatured: 'নির্বাচিত',
      sortNewest: 'নতুন আগমন',
      sortPriceLowHigh: 'মূল্য: কম থেকে বেশি',
      sortPriceHighLow: 'মূল্য: বেশি থেকে কম',
      clearFilters: 'ফিল্টার মুছুন',
      showingResults: 'মোট প্রডাক্ট পাওয়া গেছে:',
      noProductsFound: 'কোনো পোশাক পাওয়া যায়নি',
      tryDifferentFilter: 'অন্য কোনো ফিল্টার বা কিওয়ার্ড দিয়ে চেষ্টা করুন।'
    },

    // Product Card & Details
    product: {
      addToCart: 'কার্টে যোগ করুন',
      addedToCart: 'কার্টে যোগ হয়েছে',
      buyNow: 'এখনই কিনুন',
      viewDetails: 'বিস্তারিত দেখুন',
      inStock: 'স্টকে আছে',
      outOfStock: 'স্টক আউট',
      selectSize: 'সাইজ নির্বাচন করুন',
      selectColor: 'রং নির্বাচন করুন',
      fabricDetails: 'ফ্যাব্রিক ও কাপড়ের বিবরণ',
      deliveryInfo: 'ডেলিভারি তথ্য',
      cashOnDeliveryAvailable: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা',
      easyReturns: '৭ দিনের সহজ রিটার্ন ও এক্সচেঞ্জ গ্যারান্টি',
      fastDeliveryTime: 'ঢাকায় ২-৩ দিন, ঢাকার বাইরে ৩-৫ দিনে ডেলিভারি',
      share: 'শেয়ার করুন',
      reviews: 'রিভিউ'
    },

    // Cart Drawer & Checkout
    cart: {
      title: 'আপনার শপিং ব্যাগ',
      emptyTitle: 'আপনার শপিং ব্যাগ খালি!',
      emptySubtitle: 'আপনার পছন্দের পোশাকগুলো ব্যাগে যোগ করুন।',
      continueShopping: 'শপিং চালিয়ে যান',
      subtotal: 'সাবটোটাল',
      deliveryFee: 'ডেলিভারি চার্জ',
      total: 'সর্বমোট',
      checkoutBtn: 'অর্ডার করতে এগিয়ে যান',
      freeDeliveryNotice: '৳৫,০০০ এর অর্ডারে ফ্রি ডেলিভারি!',
      qty: 'পরিমাণ',
      remove: 'মুছুন'
    },

    // Checkout
    checkout: {
      title: 'অর্ডার কনফার্মেশন',
      shippingAddress: 'ডেলিভারি ঠিকানা',
      fullName: 'আপনার সম্পূর্ণ নাম',
      phoneNumber: 'মোবাইল নম্বর',
      address: 'সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা)',
      city: 'শহর / জেলা',
      insideDhaka: 'ঢাকার ভিতরে (৳৭০)',
      subDhaka: 'সাব-ঢাকা / পার্শ্ববর্তী (৳১০০)',
      outsideDhaka: 'ঢাকার বাইরে (৳১২০)',
      paymentMethod: 'পেমেন্ট পদ্ধতি',
      cashOnDelivery: 'ক্যাশ অন ডেলিভারি (Cash on Delivery)',
      advancePayment: 'অগ্রিম পেমেন্ট (bKash / Nagad)',
      couponCode: 'কুপন কোড',
      applyCoupon: 'প্রয়োগ করুন',
      orderSummary: 'অর্ডারের বিবরণ',
      placeOrder: 'অর্ডার নিশ্চিত করুন (Confirm Order)',
      placingOrder: 'অর্ডার প্রক্রিয়াধীন...',
      orderSuccessTitle: 'ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে।',
      orderSuccessSubtitle: 'আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।'
    },

    // Features Bar
    features: {
      fastDelivery: 'দ্রুত ডেলিভারি',
      fastDeliveryDesc: 'সারা বাংলাদেশে হোম ডেলিভারি',
      authentic: '১০০% আসল পোশাক',
      authenticDesc: 'প্রিমিয়াম কোয়ালিটি ও সূক্ষ্ম ফিনিশিং',
      support: '২৪/৭ কাস্টমার সাপোর্ট',
      supportDesc: 'যেকোনো প্রয়োজনে সার্বক্ষণিক পাশে',
      cod: 'ক্যাশ অন ডেলিভারি',
      codDesc: 'পণ্য দেখে মূল্য পরিশোধের নিশ্চয়তা'
    },

    // Footer
    footer: {
      shopCol: 'শপ ক্যাটাগরি',
      supportCol: 'সাহায্য ও পলিসি',
      newsletterCol: 'নিউজলেটার',
      popularSearches: 'রঙবতী জনপ্রিয় অনুসন্ধান',
      copyright: 'রঙবতী (Ronggoboti). সর্বস্বত্ব সংরক্ষিত।',
      privacyPolicy: 'গোপনীয়তা নীতি',
      termsOfService: 'শর্তাবলী'
    }
  },

  en: {
    // Top Announcement & Branding
    brandName: 'Ronggoboti',
    brandTagline: 'Exclusive & Modern Women\'s Fashion',
    currency: '৳',
    
    // Navbar
    nav: {
      shop: 'Shop',
      collections: 'Collections',
      newArrivals: 'New Arrivals',
      sale: 'Sale',
      about: 'About Us',
      faq: 'FAQ',
      contact: 'Contact',
      trackOrder: 'Track Order',
      wishlist: 'Wishlist',
      cart: 'Cart',
      search: 'Search products...',
      login: 'Login',
      register: 'Register',
      profile: 'Profile',
      dashboard: 'Dashboard',
      logout: 'Logout',
      welcome: 'Welcome',
      guest: 'Guest',
      adminPanel: 'Admin Panel'
    },

    // Search
    search: {
      placeholder: 'Search Sarees, Three Piece, Kurtis, Lehengas...',
      popularSearches: 'Popular Searches',
      aiRecommend: 'AI Recommended for You',
      searchBtn: 'Search',
      noResults: 'No products found',
      resultsFor: 'Search results for:'
    },

    // Hero & Home
    home: {
      heroTagline: 'Bengali Heritage & Contemporary Luxury',
      exploreBtn: 'Explore Collections',
      shopNow: 'Shop Now',
      categoriesTitle: 'Shop By Category',
      categoriesSubtitle: 'Curated styles for every celebration',
      featuredTitle: 'Featured Collections',
      featuredSubtitle: 'Exquisite designs crafted to perfection',
      trendingTitle: 'Trending Now',
      trendingSubtitle: 'Most loved by our community',
      whyChooseUs: 'Why Choose Ronggoboti?',
      reviewsTitle: 'What Our Muses Say',
      reviewsSubtitle: 'Trusted by thousands of fashion-forward women nationwide',
      instagramTitle: 'Instagram Gallery',
      newsletterTitle: 'Join the Ronggoboti Club',
      newsletterSubtitle: 'Subscribe for exclusive collections, VIP deals, and style guides',
      subscribeBtn: 'Subscribe',
      emailPlaceholder: 'Enter your email address...'
    },

    // Product & Shop
    shop: {
      allProducts: 'All Products',
      filterBy: 'Filter',
      sortBy: 'Sort By',
      categories: 'Categories',
      size: 'Size',
      price: 'Price',
      priceRange: 'Price Range',
      allPrices: 'All Prices',
      under1000: 'Under ৳1,000',
      range1000to2000: '৳1,000 - ৳2,000',
      range2000to5000: '৳2,000 - ৳5,000',
      over5000: 'Over ৳5,000',
      sortFeatured: 'Featured',
      sortNewest: 'Newest Arrivals',
      sortPriceLowHigh: 'Price: Low to High',
      sortPriceHighLow: 'Price: High to Low',
      clearFilters: 'Clear Filters',
      showingResults: 'Total products found:',
      noProductsFound: 'No products found',
      tryDifferentFilter: 'Try adjusting your filters or search keywords.'
    },

    // Product Card & Details
    product: {
      addToCart: 'Add to Cart',
      addedToCart: 'Added to Cart',
      buyNow: 'Buy Now',
      viewDetails: 'View Details',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      selectSize: 'Select Size',
      selectColor: 'Select Color',
      fabricDetails: 'Fabric & Material Details',
      deliveryInfo: 'Delivery Information',
      cashOnDeliveryAvailable: 'Nationwide Cash on Delivery across Bangladesh',
      easyReturns: '7-Day Hassle-Free Return & Exchange Policy',
      fastDeliveryTime: '2-3 days in Dhaka, 3-5 days outside Dhaka',
      share: 'Share',
      reviews: 'Reviews'
    },

    // Cart Drawer & Checkout
    cart: {
      title: 'Your Shopping Bag',
      emptyTitle: 'Your shopping bag is empty!',
      emptySubtitle: 'Explore our latest collections to add your favorites.',
      continueShopping: 'Continue Shopping',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      total: 'Total',
      checkoutBtn: 'Proceed to Checkout',
      freeDeliveryNotice: 'Free Delivery on orders over ৳5,000!',
      qty: 'Qty',
      remove: 'Remove'
    },

    // Checkout
    checkout: {
      title: 'Checkout Confirmation',
      shippingAddress: 'Shipping Address',
      fullName: 'Full Name',
      phoneNumber: 'Mobile Phone Number',
      address: 'Full Street Address / Area',
      city: 'City / District',
      insideDhaka: 'Inside Dhaka (৳70)',
      subDhaka: 'Sub-Dhaka / Adjacent (৳100)',
      outsideDhaka: 'Outside Dhaka (৳120)',
      paymentMethod: 'Payment Method',
      cashOnDelivery: 'Cash on Delivery (COD)',
      advancePayment: 'Advance Mobile Payment (bKash / Nagad)',
      couponCode: 'Coupon Code',
      applyCoupon: 'Apply',
      orderSummary: 'Order Summary',
      placeOrder: 'Confirm & Place Order',
      placingOrder: 'Processing order...',
      orderSuccessTitle: 'Thank you! Your order has been placed.',
      orderSuccessSubtitle: 'Our customer support will contact you shortly to confirm delivery.'
    },

    // Features Bar
    features: {
      fastDelivery: 'Fast Home Delivery',
      fastDeliveryDesc: 'Nationwide delivery across all 64 districts',
      authentic: '100% Authentic Quality',
      authenticDesc: 'Finest handpicked fabrics & craftsmanship',
      support: '24/7 Dedicated Support',
      supportDesc: 'Ready to assist with styling & orders',
      cod: 'Cash on Delivery',
      codDesc: 'Pay upon checking your delivery'
    },

    // Footer
    footer: {
      shopCol: 'Shop Categories',
      supportCol: 'Customer Support',
      newsletterCol: 'Newsletter',
      popularSearches: 'Popular Searches at Ronggoboti',
      copyright: 'Ronggoboti. All Rights Reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service'
    }
  }
};
