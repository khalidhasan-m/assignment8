# SunCart – Summer Essentials Store

A modern summer eCommerce platform where users can explore and purchase seasonal products like sunglasses, skincare, beach accessories, summer outfits, and more. Users can browse products, view details, and place orders after authentication.

## 🌐 Live URL

[https://my-live-url.vercel.app](https://my-live-url.vercel.app)


## ✨ Key Features

- 🛍️ **Product Browsing** — Browse 8+ summer products with search and category filtering
- 🔒 **Protected Routes** — Product details page is accessible only to logged-in users
- 🔐 **Authentication** — Email/password login and Google OAuth via BetterAuth
- 👤 **User Profile** — View your profile with name, email, and avatar
- ✏️ **Update Profile** — Update your display name and profile photo URL
- 🎠 **Hero Slider** — Auto-scrolling banner highlighting summer sales and hot deals
- 🌿 **Summer Care Tips** — Helpful skincare and hydration tips section
- 🏷️ **Top Brands Marquee** — Animated brand showcase using react-fast-marquee
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🎨 **Custom 404 Page** — Animated Lottie 404 error page

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** HeroUI
- **Authentication:** BetterAuth
- **Database:** MongoDB (via BetterAuth adapter)

## 📦 NPM Packages Used

| Package | Purpose |
|---|---|
| `better-auth` | Authentication (email/password + Google OAuth) |
| `@heroui/react` | UI component library |
| `tailwindcss` | Utility-first CSS framework |
| `@lottiefiles/dotlottie-web` | Lottie animation on 404 page |
| `framer-motion` | Page and UI animations |
| `embla-carousel-react` | Hero slider / carousel |
| `embla-carousel-autoplay` | Auto-play plugin for the slider |
| `react-fast-marquee` | Animated brand marquee |
| `react-hook-form` | Form state management |
| `react-icons` | Icon library |
| `react-toastify` | Toast notifications |
| `mongodb` | MongoDB client for BetterAuth |
| `kysely` | Query builder (BetterAuth dependency) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (e.g. MongoDB Atlas — free tier)
- A Google OAuth app (from Google Cloud Console)

### Installation

```bash
git clone https://github.com/khalidhasan-m/assignment8
cd assignment8
npm install



src/
├── app/
│   ├── (auth)/          # Login, Register, Profile, Update Profile
│   ├── (main)/          # Home page, Products, Product Details
│   └── api/auth/        # BetterAuth API route
├── components/          # Navbar, Footer, HeroSlider, PopularProducts, etc.
├── data/                # products.json, brands.json, slides.json, tips.json
└── lib/                 # BetterAuth config (auth.js, auth-client.js)