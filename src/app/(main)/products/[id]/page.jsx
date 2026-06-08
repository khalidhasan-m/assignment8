"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import products from "@/data/products.json";
import { authClient } from "@/lib/auth-client";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-2">
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
      <span className="text-sm text-gray-500">({rating})</span>
    </div>
  );
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const { data: session, isPending: authPending } = authClient.useSession();

  // ── Auth Guard ──
  useEffect(() => {
    if (!authPending && !session) {
      router.push(`/login?redirect=/products/${params.id}`);
    }
  }, [session, authPending, router, params.id]);

  // ── Find Product (static data — no effect needed) ──
  const product = useMemo(() => {
    return products.find((p) => p.id === parseInt(params.id)) ?? null;
  }, [params.id]);

  // ── Auth Loading ──
  if (authPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">☀️</div>
          <p className="text-gray-500 font-medium">Checking login...</p>
        </div>
      </div>
    );
  }

  // ── Not logged in (redirect in progress) ──
  if (!session) return null;

  // ── Product Not Found ──
  if (!product) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-500 mb-8">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/products">
            <button className="bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition-all">
              Back to Products
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-block mb-8 text-orange-500 hover:text-orange-600 font-semibold transition"
      >
        ← Back to Products
      </Link>

      {/* Product Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Image */}
        <div className="h-72 md:h-full min-h-80 overflow-hidden bg-gray-200">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            loading="eager"
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
            <span className="text-xs font-medium text-gray-500 uppercase">
              Brand: {product.brand}
            </span>
          </div>

          {/* Title + Description */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-snug mb-3">
              {product.name}
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-2">Ratings</p>
            <StarRating rating={product.rating} />
          </div>

          {/* Price */}
          <div className="border-t border-b py-4">
            <p className="text-gray-600 text-sm mb-1">Price</p>
            <span className="text-3xl font-extrabold text-orange-500">
              ${product.price}
            </span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                product.stock > 0 ? "bg-green-400" : "bg-red-500"
              }`}
            />
            <span
              className={`text-sm font-semibold ${
                product.stock > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} left)`
                : "Out of Stock"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              disabled={product.stock === 0}
              className="flex-1 bg-linear-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛒 Add to Cart
            </button>
            <Link href="/products" className="flex-1">
              <button className="w-full border-2 border-orange-500 text-orange-500 font-bold py-3 rounded-xl hover:bg-orange-50 transition-all cursor-pointer">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}