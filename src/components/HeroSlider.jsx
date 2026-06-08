"use client";

import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import slides from "@/data/slides.json";

export default function HeroSlider() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  return (
    <section className="w-full overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="min-w-full relative flex items-center justify-center py-20 px-6 overflow-hidden bg-gradient-to-r from-orange-400 to-yellow-300"
          >
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={idx === 0}
              loading={idx === 0 ? "eager" : "lazy"}
              className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative text-center max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow mb-4">
                {slide.title}
              </h1>

              <p className="text-white/90 text-lg sm:text-xl mb-8">
                {slide.subtitle}
              </p>

              <Link
                href="/products"
                className="bg-orange-500 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:bg-orange-600 transition text-md"
              >
                Shop Now 🛒
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
