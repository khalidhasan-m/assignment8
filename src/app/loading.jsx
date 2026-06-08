import React from "react";

const loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-spin">☀️</div>
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default loading;
