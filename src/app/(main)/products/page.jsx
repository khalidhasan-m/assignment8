"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import products from "@/data/products.json";

// ─── All Categories ─────────────────────────────────────────
const allCategories = ["All", ...new Set(products.map((p) => p.category))];

// ─── Star Rating ─────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-base ${
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-gray-400 ml-1">({rating})</span>
    </div>
  );
}

// ─── Products Page ───────────────────────────────────────────
export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* ── Header ── */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-orange-500">
          🛍️ All Products
        </h1>
        <p className="text-gray-500 mt-2">
          Browse our full summer essentials collection
        </p>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative max-w-lg mx-auto mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search products or brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-full px-5 pl-11 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Category Filter ── */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
              activeCategory === cat
                ? "bg-orange-500 text-white border-orange-500 shadow-md"
                : "bg-white text-gray-600 border-gray-300 hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Results Count ── */}
      <p className="text-sm text-gray-400 mb-6 text-center">
        Showing{" "}
        <span className="font-semibold text-orange-500">{filtered.length}</span>{" "}
        products
        {activeCategory !== "All" && (
          <span>
            {" "}
            in{" "}
            <span className="font-semibold text-orange-500">
              {activeCategory}
            </span>
          </span>
        )}
      </p>

      {/* ── Products Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="text-base font-bold text-gray-800 leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-400">{product.brand}</p>
                <StarRating rating={product.rating} />

                {/* Stock */}
                <p
                  className={`text-xs font-medium ${product.stock > 0 ? "text-green-500" : "text-red-400"}`}
                >
                  {product.stock > 0
                    ? `✅ In Stock (${product.stock})`
                    : "❌ Out of Stock"}
                </p>

                {/* Price + Button */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-xl font-extrabold text-orange-500">
                    ${product.price}
                  </span>
                  <Link href={`/products/${product.id}`}>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-all text-sm cursor-pointer">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ── No Results ──
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🔎</p>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No products found
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Try a different search or category
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCategory("All");
            }}
            className="bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-orange-600 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
}
