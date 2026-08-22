"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import products from "@/data/products.json";
import AddToCartButton from "@/components/AddToCartButton";

const allCategories = ["All", ...new Set(products.map((product) => product.category))];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} aria-hidden="true" className={`text-base ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}>
          ★
        </span>
      ))}
      <span className="text-xs text-gray-400 ml-1">({rating})</span>
    </div>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = [product.name, product.brand, product.category]
        .some((value) => value.toLowerCase().includes(normalizedSearch));
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-orange-500">🛍️ All Products</h1>
        <p className="text-gray-500 mt-2">Browse our full summer essentials collection</p>
      </div>

      <div className="relative max-w-lg mx-auto mb-8">
        <label htmlFor="product-search" className="sr-only">Search products or brands</label>
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" aria-hidden="true">🔍</span>
        <input
          id="product-search"
          type="search"
          placeholder="Search products or brands..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full border border-gray-300 rounded-full px-5 pl-11 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10" aria-label="Filter products by category">
        {allCategories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${activeCategory === category ? "bg-orange-500 text-white border-orange-500 shadow-md" : "bg-white text-gray-600 border-gray-300 hover:border-orange-500 hover:text-orange-500"}`}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-400 mb-6 text-center" aria-live="polite">
        Showing <span className="font-semibold text-orange-500">{filtered.length}</span> products
        {activeCategory !== "All" && <span> in <span className="font-semibold text-orange-500">{activeCategory}</span></span>}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <article key={product.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div className="relative overflow-hidden h-48 bg-gray-200">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 flex flex-col gap-2 flex-1">
                <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">{product.category}</span>
                <h2 className="text-base font-bold text-gray-800 leading-snug">{product.name}</h2>
                <p className="text-xs text-gray-400">{product.brand}</p>
                <StarRating rating={product.rating} />
                <p className={`text-xs font-medium ${product.stock > 0 ? "text-green-500" : "text-red-400"}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </p>

                <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                  <span className="text-xl font-extrabold text-orange-500">${product.price}</span>
                  <Link
                    href={`/products/${product.id}`}
                    className="bg-white border border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold px-3 py-2 rounded-lg transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  >
                    Details
                  </Link>
                </div>
                <AddToCartButton productId={product.id} stock={product.stock} compact />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-6xl mb-4" aria-hidden="true">🔎</p>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No products found</h2>
          <p className="text-gray-400 text-sm mb-6">Try a different search or category</p>
          <button type="button" onClick={clearFilters} className="bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-orange-600 transition-all">
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
}
