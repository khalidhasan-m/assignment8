"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/storefront";

function formatOrderDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = authClient.useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authPending && !session) router.replace("/login?redirect=%2Forders");
  }, [authPending, session, router]);

  useEffect(() => {
    if (!session) return undefined;
    let active = true;
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders", { credentials: "include" });
        const result = await response.json().catch(() => ({}));
        if (response.status === 401) {
          router.replace("/login?redirect=%2Forders");
          return;
        }
        if (!response.ok) throw new Error(result.error || "Orders are temporarily unavailable.");
        if (active) setOrders(result.orders || []);
      } catch (loadError) {
        if (active) setError(loadError.message || "Orders are temporarily unavailable.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadOrders();
    return () => { active = false; };
  }, [session, router]);

  if (authPending || !session || loading) {
    return <main className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500" aria-live="polite">Loading your orders...</main>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">Account</p>
        <h1 className="text-4xl font-extrabold text-gray-800">My Orders</h1>
        <p className="mt-2 text-gray-500">Track your confirmed SunCart purchases.</p>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">{error}</div>}
      {!error && orders.length === 0 && (
        <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
          <p className="text-5xl mb-4" aria-hidden="true">📦</p>
          <h2 className="text-2xl font-extrabold text-gray-800">No orders yet</h2>
          <p className="mt-2 text-gray-500">Your confirmed orders will appear here.</p>
          <Link href="/products" className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600">Start shopping</Link>
        </div>
      )}

      <div className="space-y-5">
        {orders.map((order) => (
          <article key={order.orderNumber} className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">{order.orderNumber}</p>
                <p className="mt-1 text-xs text-gray-400">Placed {formatOrderDate(order.createdAt)}</p>
              </div>
              <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">{order.status}</span>
            </div>
            <div className="mt-5 space-y-2">
              {order.items?.map((item) => <div key={item.productId} className="flex justify-between gap-4 text-sm"><span className="text-gray-600">{item.name} × {item.quantity}</span><span className="font-semibold text-gray-800">{formatCurrency(item.lineTotalCents)}</span></div>)}
            </div>
            <div className="mt-5 flex flex-col gap-2 border-t pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="text-gray-500">{order.delivery?.label} · {order.delivery?.eta} · Cash on delivery</span>
              <strong className="text-lg text-orange-500">{formatCurrency(order.totals?.totalCents || 0)}</strong>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
