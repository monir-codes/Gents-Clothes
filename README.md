# GentFits - Premium Luxury Menswear eCommerce

GentFits is a full-stack, state-of-the-art eCommerce platform built specifically for luxury menswear in Bangladesh. Designed with a premium aesthetic, it offers a seamless shopping experience for customers and a powerful, dynamic admin dashboard for store management.

## 🚀 Tech Stack

### Frontend (Client-Side)
- **Framework:** React.js (Vite)
- **State Management:** Zustand
- **Animations:** Framer Motion (Premium cinematic effects, parallax, page transitions)
- **UI & Icons:** Vanilla CSS (CSS Modules), Lucide React
- **Sliders/Carousels:** Swiper
- **SEO & Metadata:** React Helmet Async (Dynamic product-specific SEO generation)
- **Image Editing:** React Easy Crop (Mobile-friendly custom image cropper for Admin)
- **Routing:** React Router DOM

### Backend (Server-Side)
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT)
- **Storage:** ImgBB API for seamless image hosting
- **Architecture:** Serverless functions ready

### Deployment & DevOps
- **Hosting:** Vercel (both Frontend and Serverless Backend)
- **SEO Optimization:** Build-time dynamic `sitemap.xml` generation directly from the database

## ✨ Key Features & Characteristics

### 🛍️ Customer Experience
- **Cinematic UI/UX:** High-end luxury design language with smooth micro-interactions, parallax scrolling, and Ken Burns (cinematic zoom) effects on hero slideshows.
- **Dynamic SEO:** Every product automatically generates its own highly optimized SEO keywords (e.g., "Cash on delivery mens clothing BD", "Buy Panjabi online") to rank effortlessly on Google.
- **Smart Recommendations:** Integrated AI-based size recommender and dynamic related products.
- **Seamless Checkout:** Optimized for Cash on Delivery (COD) and nationwide home delivery in Bangladesh.
- **Recently Viewed & Wishlist:** Persistent local storage integration for a personalized shopping journey.

### ⚙️ Admin Panel Power
- **In-App Image Cropper:** Admins can crop product images and hero banners directly within the app (desktop & mobile friendly) before uploading, ensuring perfect aspect ratios without external tools.
- **AI Content Generation:** One-click AI generation for product descriptions directly from the dashboard.
- **Dynamic Content Control:** Complete control over homepage hero slideshows, static pages (About, Terms, FAQ), and featured collections without touching the code.
- **Automated Sitemap:** Newly added products are instantly baked into the frontend's XML sitemap upon the next deployment.

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/monir-codes/GentFits.git
   cd GentFits
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file with your MONGO_URI, JWT_SECRET, etc.
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---
*Built with passion for delivering the best menswear shopping experience in Bangladesh.*
