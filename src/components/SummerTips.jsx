"use client";

import tips from "@/data/tips.json";

export default function SummerTips() {
  return (
    <section className="bg-orange-50 py-14 px-4 mt-14">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-orange-500 text-center mb-10">
          🌞 Summer Care Tips
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((tip, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl text-center">
              <div className="text-5xl mb-3">{tip.emoji}</div>
              <h3 className="font-bold mb-2">{tip.title}</h3>
              <p className="text-gray-500 text-sm">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
