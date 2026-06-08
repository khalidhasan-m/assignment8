"use client";

import Link from "next/link";
import Image from "next/image";
import products from "@/data/products.json";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-sm text-gray-500 ml-2">({rating})</span>
    </div>
  );
}

export default function PopularProducts() {
  const popularProducts = products.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-14">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-10">
        🔥 Popular Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
          >
            <div className="relative h-52 bg-gray-200">
              <Image
                src={product.image}
                alt={product.name}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <h3 className="font-bold text-gray-800">{product.name}</h3>

              <StarRating rating={product.rating} />

              <div className="flex justify-between items-center mt-3">
                <span className="text-orange-500 font-bold text-xl">
                  ${product.price}
                </span>

                <Link href={`/products/${product.id}`}>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
                    View
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
