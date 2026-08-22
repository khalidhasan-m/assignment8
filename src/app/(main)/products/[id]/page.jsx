"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import products from "@/data/products.json";
import { authClient } from "@/lib/auth-client";
import AddToCartButton from "@/components/AddToCartButton";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Rated ${rating} out of 5`}>
      <div aria-hidden="true" className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-lg ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
        ))}
      </div>
      <span className="text-sm text-gray-500">({rating})</span>
    </div>
  );
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params.id) ? params.id[0] : String(params.id ?? "");
  const { data: session, isPending: authPending } = authClient.useSession();

  useEffect(() => {
    if (!authPending && !session) {
      const destination = `/products/${encodeURIComponent(productId)}`;
      router.replace(`/login?redirect=${encodeURIComponent(destination)}`);
    }
  }, [session, authPending, router, productId]);

  const product = useMemo(() => {
    const id = Number.parseInt(productId, 10);
    return Number.isInteger(id) ? products.find((item) => item.id === id) ?? null : null;
  }, [productId]);

  if (authPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" aria-live="polite">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin" aria-hidden="true">☀️</div>
          <p className="text-gray-500 font-medium">Checking login...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-500" aria-live="polite">Redirecting to login...</div>;
  }

  if (!product) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products" className="inline-flex bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition-all">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/products" className="inline-block mb-8 text-orange-500 hover:text-orange-600 font-semibold transition">← Back to Products</Link>

      <article className="bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="h-72 md:h-full min-h-80 overflow-hidden bg-gray-200 relative">
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover" />
        </div>

        <div className="p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="bg-orange-100 text-orange-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{product.category}</span>
            <span className="text-xs font-medium text-gray-500 uppercase">Brand: {product.brand}</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-snug mb-3">{product.name}</h1>
            <p className="text-gray-600 text-base leading-relaxed">{product.description}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-semibold mb-2">Ratings</p>
            <StarRating rating={product.rating} />
          </div>

          <div className="border-t border-b py-4">
            <p className="text-gray-600 text-sm mb-1">Price</p>
            <span className="text-3xl font-extrabold text-orange-500">${product.price}</span>
          </div>

          <div className="flex items-center gap-2" aria-live="polite">
            <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-green-400" : "bg-red-500"}`} aria-hidden="true" />
            <span className={`text-sm font-semibold ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <AddToCartButton productId={product.id} stock={product.stock} />
            <Link href="/cart" className="flex-1 inline-flex items-center justify-center border-2 border-orange-500 text-orange-500 font-bold py-3 rounded-xl hover:bg-orange-50 transition-all">
              View Cart
            </Link>
          </div>
          <Link href="/products" className="text-center text-sm text-gray-400 hover:text-orange-500">Continue Shopping</Link>
        </div>
      </article>
    </main>
  );
}
