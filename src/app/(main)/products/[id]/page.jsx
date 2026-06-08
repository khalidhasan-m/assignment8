"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import products from "@/data/products.json";

// ─── Star Rating ─────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl ${
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-gray-500 text-sm">({rating} / 5)</span>
    </div>
  );
}

// ─── Product Details Page ─────────────────────────────────────
export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const product = products.find((p) => p.id === parseInt(id));

  // ── Protect Route ──
  useEffect(() => {
    if (!isPending && !session) {
      router.push(`/login?redirect=/products/${id}`);
    }
  }, [session, isPending, id, router]);

  // ── Loading ──
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">☀️</div>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // ── Not Logged In ──
  if (!session) return null;

  // ── Product Not Found ──
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-6xl mb-4">🔎</p>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/products">
            <button className="bg-orange-400 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-500 transition-all">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">

      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:underline mb-8 text-sm"
      >
        ← Back to Products
      </Link>

      {/* Product Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">

        {/* Image */}
        <div className="h-72 md:h-full min-h-80 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="p-8 flex flex-col gap-5">

          {/* Category + Brand */}
          <div className="flex items-center gap-3">
            <span className="bg-orange-100 text-orange-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {product.category}
            </span>
            <span className="text-gray-400 text-sm">by {product.brand}</span>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <StarRating rating={product.rating} />

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-4xl font-extrabold text-orange-500">
              ${product.price}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
              Description
            </h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                product.stock > 0 ? "bg-green-400" : "bg-red-400"
              }`}
            />
            <span
              className={`text-sm font-semibold ${
                product.stock > 0 ? "text-green-500" : "text-red-400"
              }`}
            >
              {product.stock > 0
                ? `In Stock — ${product.stock} units left`
                : "Out of Stock"}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              disabled={product.stock === 0}
              className="flex-1 bg-linear-to-r from-orange-400 to-yellow-400 text-white font-bold py-3 rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛒 Add to Cart
            </button>
            <Link href="/products" className="flex-1">
              <button className="w-full border-2 border-orange-400 text-orange-500 font-bold py-3 rounded-xl hover:bg-orange-50 transition-all">
                Continue Shopping
              </button>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}