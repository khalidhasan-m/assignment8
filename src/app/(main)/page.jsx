"use client";

import HeroSlider from "@/components/HeroSlider";
import PopularProducts from "@/components/PopularProducts";
import SummerTips from "@/components/SummerTips";
import BrandsMarquee from "@/components/BrandsMarquee";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <HeroSlider />

      {/* PRODUCTS */}
      <PopularProducts />

      {/* TIPS */}
      <SummerTips />

      {/* BRANDS */}
      <section className="my-10">
        <BrandsMarquee />
      </section>
    </main>
  );
}
