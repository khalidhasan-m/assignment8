"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useCart } from "@/components/CartProvider";
import { calculateTotals, formatCurrency } from "@/lib/storefront";

export default function CartPage() {
  const { items, itemCount, hydrated, updateItem, removeItem, clearCart } = useCart();
  const totals = useMemo(() => calculateTotals(items), [items]);

  if (!hydrated) {
    return <main className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-500" aria-live="polite">Loading your cart...</main>;
  }

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="rounded-3xl bg-white p-10 shadow-lg">
          <p className="text-6xl mb-4" aria-hidden="true">🛒</p>
          <h1 className="text-3xl font-extrabold text-gray-800">Your cart is empty</h1>
          <p className="mt-3 text-gray-500">Explore the summer collection and add your favorites.</p>
          <Link href="/products" className="mt-7 inline-flex rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600">Browse Products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">Your selection</p>
          <h1 className="text-4xl font-extrabold text-gray-800">Shopping Cart</h1>
          <p className="mt-2 text-gray-500" aria-live="polite">{itemCount} item{itemCount === 1 ? "" : "s"} ready for checkout.</p>
        </div>
        <button type="button" onClick={clearCart} className="text-left text-sm font-semibold text-gray-400 transition hover:text-red-500 sm:text-right">Clear cart</button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4" aria-label="Cart items">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-md sm:flex-row sm:items-center">
              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-32">
                <Image src={item.image} alt={item.name} fill sizes="128px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">{item.category}</p>
                <h2 className="mt-1 truncate text-lg font-bold text-gray-800">{item.name}</h2>
                <p className="text-sm text-gray-400">{item.brand} · {formatCurrency(item.price * 100)} each</p>
                <p className="mt-2 text-lg font-extrabold text-orange-500">{formatCurrency(item.lineTotalCents)}</p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <div className="flex items-center rounded-lg border border-gray-200" aria-label={`Quantity for ${item.name}`}>
                  <button type="button" onClick={() => updateItem(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`} className="px-3 py-2 text-lg text-gray-500 transition hover:bg-orange-50">−</button>
                  <span className="min-w-10 text-center text-sm font-bold text-gray-700" aria-live="polite">{item.quantity}</span>
                  <button type="button" onClick={() => updateItem(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} aria-label={`Increase ${item.name} quantity`} className="px-3 py-2 text-lg text-gray-500 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40">+</button>
                </div>
                <button type="button" onClick={() => removeItem(item.id)} className="text-sm font-semibold text-red-400 transition hover:text-red-600">Remove</button>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-3xl bg-white p-6 shadow-lg lg:sticky lg:top-24" aria-label="Order summary">
          <h2 className="text-xl font-extrabold text-gray-800">Order Summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(totals.subtotalCents)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Standard delivery</span><span>{formatCurrency(totals.shippingCents)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Estimated tax</span><span>{formatCurrency(totals.taxCents)}</span></div>
            <div className="border-t pt-4 flex justify-between text-lg font-extrabold text-gray-800"><span>Total</span><span className="text-orange-500">{formatCurrency(totals.totalCents)}</span></div>
          </div>
          <Link href="/checkout" className="mt-6 flex w-full items-center justify-center rounded-xl bg-linear-to-r from-orange-500 to-yellow-500 py-3 font-bold text-white transition hover:from-orange-600 hover:to-yellow-600">Continue to Delivery</Link>
          <Link href="/products" className="mt-4 block text-center text-sm font-semibold text-gray-400 transition hover:text-orange-500">Continue shopping</Link>
        </aside>
      </div>
    </main>
  );
}
