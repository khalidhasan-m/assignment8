"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import products from "@/data/products.json";
import { CART_STORAGE_KEY, sanitizeCartEntries, toPriceCents } from "@/lib/storefront";

const CartContext = createContext(null);

function getProduct(productId) {
  return products.find((product) => product.id === productId) || null;
}

export function CartProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(CART_STORAGE_KEY);
        if (stored) setEntries(sanitizeCartEntries(JSON.parse(stored)));
      } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Cart state remains usable for the current session when storage is unavailable.
    }
  }, [entries, hydrated]);

  const items = useMemo(
    () => entries
      .map(({ productId, quantity }) => {
        const product = getProduct(productId);
        if (!product) return null;
        const safeQuantity = Math.min(quantity, product.stock);
        return {
          ...product,
          quantity: safeQuantity,
          lineTotalCents: toPriceCents(product.price) * safeQuantity,
        };
      })
      .filter((item) => item && item.quantity > 0),
    [entries],
  );

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotalCents = items.reduce((total, item) => total + item.lineTotalCents, 0);

  const addItem = (productId, requestedQuantity = 1) => {
    const product = getProduct(productId);
    if (!product || product.stock < 1) return false;

    const quantity = Math.max(1, Math.floor(Number(requestedQuantity) || 1));
    setEntries((current) => {
      const existing = current.find((entry) => entry.productId === productId);
      const nextQuantity = Math.min((existing?.quantity || 0) + quantity, product.stock, 99);
      return existing
        ? current.map((entry) => entry.productId === productId ? { ...entry, quantity: nextQuantity } : entry)
        : [...current, { productId, quantity: nextQuantity }];
    });
    return true;
  };

  const updateItem = (productId, requestedQuantity) => {
    const product = getProduct(productId);
    if (!product) return;
    const quantity = Math.min(Math.max(0, Math.floor(Number(requestedQuantity) || 0)), product.stock, 99);
    setEntries((current) => quantity === 0
      ? current.filter((entry) => entry.productId !== productId)
      : current.map((entry) => entry.productId === productId ? { ...entry, quantity } : entry));
  };

  const removeItem = (productId) => setEntries((current) => current.filter((entry) => entry.productId !== productId));
  const clearCart = () => setEntries([]);
  const getQuantity = useCallback((productId) => entries.find((entry) => entry.productId === productId)?.quantity || 0, [entries]);

  const value = useMemo(() => ({
    items,
    itemCount,
    subtotalCents,
    hydrated,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getQuantity,
  }), [items, itemCount, subtotalCents, hydrated, getQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
