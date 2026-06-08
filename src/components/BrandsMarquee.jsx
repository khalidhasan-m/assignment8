"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import brands from "@/data/brands.json";

export default function BrandsMarquee() {
  return (
    <Marquee pauseOnHover speed={50}>
      {brands.map((brand) => (
        <div key={brand.id} className="mx-8 flex items-center gap-2">
          <Image
            src={brand.image}
            alt={brand.name}
            width={40}
            height={40}
            loading="lazy"
            className="object-contain"
          />
          <span className="font-medium">{brand.name}</span>
        </div>
      ))}
    </Marquee>
  );
}
