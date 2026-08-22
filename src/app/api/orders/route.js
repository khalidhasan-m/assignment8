import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getOrdersCollection, releaseProduct, reserveProduct } from "@/lib/orders";
import products from "@/data/products.json";
import {
  calculateTotals,
  getDeliveryOption,
  normalizeShippingAddress,
  sanitizeCartEntries,
  validateShippingAddress,
} from "@/lib/storefront";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message, status) {
  return NextResponse.json({ error: message }, { status });
}

async function getSession(request) {
  try {
    return await getAuth().api.getSession({ headers: request.headers });
  } catch (error) {
    console.error("[Orders API] Session lookup failed", error);
    return null;
  }
}

export async function GET(request) {
  const session = await getSession(request);
  if (!session?.user?.id) return jsonError("Authentication is required.", 401);

  try {
    const { collection, indexesPromise } = getOrdersCollection();
    await indexesPromise;
    const orders = await collection
      .find({ userId: session.user.id }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(25)
      .toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[Orders API] Could not load orders", error);
    return jsonError("Orders are temporarily unavailable.", 503);
  }
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session?.user?.id) return jsonError("Authentication is required.", 401);

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 32_768) return jsonError("Request is too large.", 413);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Please provide a valid order request.", 400);
  }

  const idempotencyKey = typeof payload?.idempotencyKey === "string" ? payload.idempotencyKey.trim() : "";
  if (!/^[A-Za-z0-9_-]{16,100}$/.test(idempotencyKey)) return jsonError("Please retry checkout from the current cart.", 400);

  const entries = sanitizeCartEntries(payload?.items);
  if (entries.length === 0 || entries.length > 20) return jsonError("Your cart is empty or contains too many different products.", 400);

  const delivery = getDeliveryOption(payload?.deliveryId);
  if (!delivery) return jsonError("Please choose a valid delivery option.", 400);

  const addressError = validateShippingAddress(payload?.shippingAddress);
  if (addressError) return jsonError(addressError, 400);
  if (payload?.paymentMethod !== "cash_on_delivery") return jsonError("Cash on delivery is the available payment method.", 400);

  const orderItems = [];
  for (const entry of entries) {
    const product = products.find((item) => item.id === entry.productId);
    if (!product) return jsonError("One or more products are no longer available.", 400);
    if (entry.quantity > product.stock) return jsonError(`${product.name} has only ${product.stock} item${product.stock === 1 ? "" : "s"} available.`, 409);

    orderItems.push({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      image: product.image,
      price: product.price,
      quantity: entry.quantity,
    });
  }

  const totals = calculateTotals(orderItems, delivery.id);
  const reservedItems = [];
  const now = new Date();
  const orderNumber = `SC-${now.getTime().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  let collection;

  try {
    const orderCollection = getOrdersCollection();
    collection = orderCollection.collection;
    await orderCollection.indexesPromise;

    const existingOrder = await collection.findOne(
      { userId: session.user.id, idempotencyKey },
      { projection: { _id: 0, orderNumber: 1, status: 1, totals: 1 } },
    );
    if (existingOrder) return NextResponse.json(existingOrder);

    for (const item of orderItems) {
      await reserveProduct(item.productId, item.quantity, products.find((product) => product.id === item.productId));
      reservedItems.push(item);
    }
    await collection.insertOne({
      orderNumber,
      idempotencyKey,
      userId: session.user.id,
      customerEmail: session.user.email,
      items: orderItems.map((item) => ({
        ...item,
        priceCents: Math.round(item.price * 100),
        lineTotalCents: Math.round(item.price * 100) * item.quantity,
      })),
      delivery: {
        id: delivery.id,
        label: delivery.label,
        eta: delivery.eta,
        feeCents: delivery.feeCents,
      },
      shippingAddress: normalizeShippingAddress(payload.shippingAddress),
      paymentMethod: "cash_on_delivery",
      status: "confirmed",
      totals,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ orderNumber, status: "confirmed", totals }, { status: 201 });
  } catch (error) {
    await Promise.allSettled(reservedItems.map((item) => releaseProduct(item.productId, item.quantity)));
    if (error?.code === 11000) return jsonError("Please submit the order again.", 409);
    if (error?.message?.startsWith("Insufficient stock")) return jsonError("One or more items sold out. Please refresh your cart.", 409);
    console.error("[Orders API] Order creation failed", error);
    return jsonError("We could not place your order right now.", 503);
  }
}
