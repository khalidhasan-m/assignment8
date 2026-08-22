"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-lg">
        <p className="text-5xl mb-4" aria-hidden="true">☀️</p>
        <h1 className="text-2xl font-extrabold text-gray-800">Something went wrong</h1>
        <p className="mt-3 text-gray-500">We could not load this page. Please try again.</p>
        <button type="button" onClick={() => reset()} className="mt-6 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
          Try again
        </button>
      </div>
    </main>
  );
}
