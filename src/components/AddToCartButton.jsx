"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { toast } from "react-toastify";

export default function AddToCartButton({ productId, stock, compact = false }) {
  const { addItem, getQuantity } = useCart();
  const [added, setAdded] = useState(false);
  const quantity = getQuantity(productId);
  const outOfStock = stock < 1 || quantity >= stock;

  const handleAdd = () => {
    if (outOfStock) return;
    const didAdd = addItem(productId);
    if (didAdd) {
      setAdded(true);
      toast.success("Added to cart");
      window.setTimeout(() => setAdded(false), 1600);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={outOfStock}
      aria-label={outOfStock ? (stock < 1 ? "Out of stock" : "Maximum stock already in cart") : `Add ${quantity ? "another " : ""}item to cart`}
      className={compact
        ? "rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        : "flex-1 rounded-xl bg-linear-to-r from-orange-500 to-yellow-500 py-3 font-bold text-white transition hover:from-orange-600 hover:to-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"}
    >
      {outOfStock ? (stock < 1 ? "Out of Stock" : "Max in Cart") : added ? "Added" : "Add to Cart"}
    </button>
  );
}
