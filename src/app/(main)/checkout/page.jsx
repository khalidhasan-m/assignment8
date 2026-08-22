"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/components/CartProvider";
import {
  DELIVERY_OPTIONS,
  calculateTotals,
  formatCurrency,
  validateShippingAddress,
} from "@/lib/storefront";

const emptyAddress = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
  phone: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, hydrated, clearCart } = useCart();
  const { data: session, isPending: authPending } = authClient.useSession();
  const [deliveryId, setDeliveryId] = useState("standard");
  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const idempotencyKey = useRef(null);

  const totals = useMemo(() => calculateTotals(items, deliveryId), [items, deliveryId]);
  const addressForForm = useMemo(() => ({
    ...shippingAddress,
    fullName: shippingAddress.fullName || session?.user?.name || "",
  }), [shippingAddress, session?.user?.name]);

  useEffect(() => {
    if (!authPending && !session) router.replace("/login?redirect=%2Fcheckout");
  }, [authPending, session, router]);

  const handleAddressChange = (event) => {
    setShippingAddress((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    if (placingOrder || placedOrder) return;

    const addressError = validateShippingAddress(addressForForm);
    if (addressError) {
      setError(addressError);
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);
    setError("");
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID().replace(/-/g, "");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idempotencyKey: idempotencyKey.current,
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
          deliveryId,
          shippingAddress: addressForForm,
          paymentMethod: "cash_on_delivery",
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace("/login?redirect=%2Fcheckout");
        return;
      }
      if (!response.ok) {
        setError(result.error || "We could not place your order. Please try again.");
        return;
      }

      clearCart();
      setPlacedOrder(result);
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (authPending || !hydrated) {
    return <main className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500" aria-live="polite">Preparing secure checkout...</main>;
  }

  if (!session) {
    return <main className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500" aria-live="polite">Redirecting to login...</main>;
  }

  if (placedOrder) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="rounded-3xl bg-white p-10 shadow-lg">
          <p className="text-6xl mb-4" aria-hidden="true">✅</p>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-600">Order confirmed</p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-800">Thank you for your order</h1>
          <p className="mt-3 text-gray-500">Your order number is <strong className="text-gray-800">{placedOrder.orderNumber}</strong>.</p>
          <p className="mt-2 text-sm text-gray-500">Payment is collected on delivery. We will prepare your items for {totals.delivery.label.toLowerCase()}.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/orders" className="rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600">View my orders</Link>
            <Link href="/products" className="rounded-full border border-orange-500 px-6 py-3 font-bold text-orange-600 transition hover:bg-orange-50">Continue shopping</Link>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="rounded-3xl bg-white p-10 shadow-lg">
          <h1 className="text-3xl font-extrabold text-gray-800">Nothing to check out</h1>
          <p className="mt-3 text-gray-500">Add products to your cart before continuing.</p>
          <Link href="/products" className="mt-7 inline-flex rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600">Browse Products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">Secure checkout</p>
        <h1 className="text-4xl font-extrabold text-gray-800">Delivery details</h1>
        <p className="mt-2 text-gray-500">Choose how you want to receive your {itemCount} item{itemCount === 1 ? "" : "s"}.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="rounded-3xl bg-white p-6 shadow-lg" aria-labelledby="delivery-options-heading">
            <h2 id="delivery-options-heading" className="text-xl font-extrabold text-gray-800">1. Delivery option</h2>
            <div className="mt-5 space-y-3">
              {DELIVERY_OPTIONS.map((option) => (
                <label key={option.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${deliveryId === option.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}>
                  <input type="radio" name="deliveryId" value={option.id} checked={deliveryId === option.id} onChange={(event) => setDeliveryId(event.target.value)} className="mt-1 accent-orange-500" />
                  <span className="flex-1">
                    <span className="flex flex-col justify-between gap-1 sm:flex-row"><strong className="text-gray-800">{option.label}</strong><strong className="text-orange-600">{formatCurrency(option.feeCents)}</strong></span>
                    <span className="mt-1 block text-sm text-gray-500">{option.description} · {option.eta}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg" aria-labelledby="shipping-address-heading">
            <h2 id="shipping-address-heading" className="text-xl font-extrabold text-gray-800">2. Delivery address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["fullName", "Full name", "Your full name", "text", "name"],
                ["phone", "Phone number", "+1 555 123 4567", "tel", "tel"],
                ["line1", "Address line 1", "Street address", "text", "street-address"],
                ["line2", "Address line 2 (optional)", "Apartment, suite, etc.", "text", "address-line2"],
                ["city", "City", "City", "text", "address-level2"],
                ["state", "State / Province", "State or province", "text", "address-level1"],
                ["postalCode", "Postal code", "Postal code", "text", "postal-code"],
                ["country", "Country code", "US", "text", "country"],
              ].map(([name, label, placeholder, type, autoComplete]) => (
                <div key={name} className={name === "line1" || name === "line2" ? "sm:col-span-2" : ""}>
                  <label htmlFor={`checkout-${name}`} className="text-sm font-semibold text-gray-700">{label}</label>
                  <input id={`checkout-${name}`} name={name} type={type} value={addressForForm[name]}
 onChange={handleAddressChange} placeholder={placeholder} autoComplete={autoComplete} required={name !== "line2"} maxLength={name === "line1" || name === "line2" ? 160 : 100} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100" />
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-400">Order updates will be sent to {session.user.email}.</p>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg" aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="text-xl font-extrabold text-gray-800">3. Payment</h2>
            <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="font-bold text-gray-800">Cash on delivery</p>
              <p className="mt-1 text-sm text-gray-600">Pay the delivery partner when your order arrives. No card details are stored.</p>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl bg-white p-6 shadow-lg lg:sticky lg:top-24" aria-label="Checkout summary">
          <h2 className="text-xl font-extrabold text-gray-800">Order Summary</h2>
          <div className="mt-5 space-y-3 border-b pb-5">
            {items.map((item) => <div key={item.id} className="flex justify-between gap-4 text-sm"><span className="text-gray-600">{item.name} × {item.quantity}</span><span className="font-semibold text-gray-800">{formatCurrency(item.lineTotalCents)}</span></div>)}
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(totals.subtotalCents)}</span></div>
            <div className="flex justify-between text-gray-600"><span>{totals.delivery.label}</span><span>{formatCurrency(totals.shippingCents)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Estimated tax</span><span>{formatCurrency(totals.taxCents)}</span></div>
            <div className="flex justify-between border-t pt-4 text-lg font-extrabold text-gray-800"><span>Total</span><span className="text-orange-500">{formatCurrency(totals.totalCents)}</span></div>
          </div>
          {error && <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">{error}</p>}
          <button type="submit" disabled={placingOrder} className="mt-6 w-full rounded-xl bg-linear-to-r from-orange-500 to-yellow-500 py-3 font-bold text-white transition hover:from-orange-600 hover:to-yellow-600 disabled:cursor-not-allowed disabled:opacity-60">{placingOrder ? "Placing order..." : "Place order"}</button>
          <Link href="/cart" className="mt-4 block text-center text-sm font-semibold text-gray-400 transition hover:text-orange-500">Back to cart</Link>
        </aside>
      </form>
    </main>
  );
}
