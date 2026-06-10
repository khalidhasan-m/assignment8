"use client";

import { useEffect, useRef } from "react";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import Link from "next/link";

export default function NotFound() {
  const containerRef = useRef(null);

  useEffect(() => {
    const animation = new DotLottie({
      autoplay: true,
      loop: true,
      canvas: containerRef.current,
      src: "/animations/404.lottie",
    });

    return () => animation.destroy();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
      <canvas
        ref={containerRef}
        className="w-full max-w-70 sm:max-w-87.5 aspect-square"
      />

      <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 mt-4">
        Page Not Found
      </h1>

      <p className="text-gray-500 mt-2 text-sm sm:text-base">
        The page you are looking for doesn&apos;t exist.
      </p>

      <Link
        href="/"
        className="mt-6 mb-4 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition text-sm sm:text-base"
      >
        Go Home
      </Link>
    </div>
  );
}