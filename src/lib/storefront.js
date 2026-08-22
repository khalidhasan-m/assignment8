export const CURRENCY = "USD";
export const TAX_RATE = 0.08;
export const CART_STORAGE_KEY = "suncart:cart:v1";

export const DELIVERY_OPTIONS = Object.freeze([
  {
    id: "standard",
    label: "Standard delivery",
    description: "Reliable doorstep delivery",
    eta: "5–7 business days",
    feeCents: 499,
  },
  {
    id: "express",
    label: "Express delivery",
    description: "Priority handling for your order",
    eta: "2–3 business days",
    feeCents: 1299,
  },
  {
    id: "pickup",
    label: "Local pickup",
    description: "Collect from our Summer City location",
    eta: "Ready in 1–2 business days",
    feeCents: 0,
  },
]);

export function getDeliveryOption(deliveryId) {
  return DELIVERY_OPTIONS.find((option) => option.id === deliveryId) || null;
}

export function toPriceCents(price) {
  return Math.round(Number(price) * 100);
}

export function calculateTotals(items, deliveryId = "standard") {
  const delivery = getDeliveryOption(deliveryId) || DELIVERY_OPTIONS[0];
  const subtotalCents = items.reduce(
    (total, item) => total + toPriceCents(item.price) * item.quantity,
    0,
  );
  const shippingCents = delivery.feeCents;
  const taxCents = Math.round(subtotalCents * TAX_RATE);

  return {
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents: subtotalCents + shippingCents + taxCents,
    delivery,
  };
}

export function formatCurrency(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
  }).format(cents / 100);
}

export function sanitizeCartEntries(entries) {
  if (!Array.isArray(entries)) return [];

  const quantities = new Map();
  for (const entry of entries) {
    const productId = Number(entry?.productId);
    const quantity = Number(entry?.quantity);
    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1) continue;
    quantities.set(productId, Math.min((quantities.get(productId) || 0) + quantity, 99));
  }

  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
}

export function validateShippingAddress(address) {
  const fields = ["fullName", "line1", "city", "state", "postalCode", "country", "phone"];
  if (!address || typeof address !== "object") return "Please provide a delivery address.";

  for (const field of fields) {
    if (typeof address[field] !== "string" || address[field].trim().length === 0) {
      return "Please complete every required delivery field.";
    }
  }

  if (address.line2 !== undefined && typeof address.line2 !== "string") return "Please provide a valid address line 2.";
  const line2 = address.line2?.trim() || "";
  if (address.fullName.trim().length > 100 || address.line1.trim().length > 160 || line2.length > 160) {
    return "One or more address fields are too long.";
  }
  if (address.city.trim().length > 80 || address.state.trim().length > 80 || address.phone.trim().length > 30) {
    return "One or more address fields are too long.";
  }
  if (!/^[A-Za-z]{2,3}$/.test(address.country.trim())) return "Country must be a valid two- or three-letter code.";
  if (!/^[A-Za-z0-9][A-Za-z0-9\s-]{2,11}$/.test(address.postalCode.trim())) return "Please enter a valid postal code.";

  return null;
}

export function normalizeShippingAddress(address) {
  return {
    fullName: address.fullName.trim().replace(/\s+/g, " "),
    line1: address.line1.trim(),
    line2: typeof address.line2 === "string" ? address.line2.trim() : "",
    city: address.city.trim(),
    state: address.state.trim(),
    postalCode: address.postalCode.trim().toUpperCase(),
    country: address.country.trim().toUpperCase(),
    phone: address.phone.trim(),
  };
}
