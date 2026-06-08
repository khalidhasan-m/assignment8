"use client";

import { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import products from "@/data/products.json";

// ─── Slider Data ───────────────────────────────────────────────
const slides = [
  {
    id: 1,
    title: "Summer Sale 50% OFF! 🔥",
    subtitle: "Shop the hottest summer deals before they're gone!",
    bg: "from-orange-400 to-yellow-300",
    emoji: "🕶️",
  },
  {
    id: 2,
    title: "Hot Deals This Week 🌊",
    subtitle: "Beach accessories, skincare & outfits at unbeatable prices.",
    bg: "from-yellow-400 to-orange-300",
    emoji: "🏖️",
  },
  {
    id: 3,
    title: "Stay Cool This Summer ☀️",
    subtitle: "Explore our new summer collection — fresh styles just dropped!",
    bg: "from-amber-400 to-yellow-200",
    emoji: "🌴",
  },
];

// ─── Brands Data ───────────────────────────────────────────────
const brands = [
  { name: "SunShade", emoji: "🕶️", tagline: "Eye protection redefined" },
  { name: "GlowGuard", emoji: "🧴", tagline: "Skincare you can trust" },
  { name: "WaveWear", emoji: "👕", tagline: "Summer fashion forward" },
  { name: "AquaFun", emoji: "🏊", tagline: "Beach fun all day long" },
];

// ─── Summer Tips ───────────────────────────────────────────────
const tips = [
  {
    emoji: "🧴",
    title: "Apply Sunscreen Daily",
    desc: "Use SPF 30+ every morning and reapply every 2 hours when outdoors.",
  },
  {
    emoji: "💧",
    title: "Stay Hydrated",
    desc: "Drink at least 8 glasses of water daily. More if you're out in the sun!",
  },
  {
    emoji: "🕶️",
    title: "Protect Your Eyes",
    desc: "Wear UV-protection sunglasses to shield your eyes from harmful rays.",
  },
  {
    emoji: "👒",
    title: "Cover Up",
    desc: "Wear a wide-brim hat and light clothing to reduce direct sun exposure.",
  },
];

// ─── Star Rating ───────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= Math.round(rating)
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-sm text-gray-500 ml-1">({rating})</span>
    </div>
  );
}

// ─── Home Page ─────────────────────────────────────────────────
export default function HomePage() {
  const popularProducts = products.slice(0, 3);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  return (
    <main className="flex flex-col gap-16 pb-16">

      {/* ── HERO SLIDER ── */}
      <section className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`min-w-full bg-linear-to-r ${slide.bg} flex items-center justify-center py-20 px-6`}
            >
              <div className="text-center max-w-2xl">
                <div className="text-7xl mb-4">{slide.emoji}</div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow mb-4">
                  {slide.title}
                </h1>
                <p className="text-white/90 text-lg sm:text-xl mb-8">
                  {slide.subtitle}
                </p>
                <Link href="/products">
                  <button className="bg-white text-orange-500 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-orange-50 transition-all text-lg">
                    Shop Now 🛒
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-orange-500">
            🔥 Popular Products
          </h2>
          <p className="text-gray-500 mt-2">
            Our best-selling summer essentials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative overflow-hidden h-52">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <div className="p-5 flex flex-col gap-2">
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold text-gray-800">
                  {product.name}
                </h3>
                <StarRating rating={product.rating} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-extrabold text-orange-500">
                    ${product.price}
                  </span>
                  <Link href={`/products/${product.id}`}>
                    <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg transition-all text-sm">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/products">
            <button className="border-2 border-orange-400 text-orange-500 font-bold px-8 py-3 rounded-full hover:bg-orange-400 hover:text-white transition-all">
              View All Products →
            </button>
          </Link>
        </div>
      </section>

      {/* ── SUMMER CARE TIPS ── */}
      <section className="bg-orange-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-orange-500">
              🌞 Summer Care Tips
            </h2>
            <p className="text-gray-500 mt-2">
              Stay safe and healthy this summer season
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="text-5xl mb-4">{tip.emoji}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP BRANDS ── */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-orange-500">
            🏆 Top Brands
          </h2>
          <p className="text-gray-500 mt-2">
            Trusted brands for your summer needs
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-orange-400 to-yellow-300 rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-5xl mb-3">{brand.emoji}</div>
              <h3 className="text-xl font-extrabold text-white">
                {brand.name}
              </h3>
              <p className="text-white/80 text-sm mt-1">{brand.tagline}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}