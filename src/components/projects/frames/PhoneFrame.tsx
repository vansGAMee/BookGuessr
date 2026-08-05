"use client";

import React from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
  isSourceLayer?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, isSourceLayer = false }) => {
  return (
    <div className="flex justify-center my-4">
      <div
        className={`relative w-[280px] sm:w-[320px] rounded-[36px] border-4 p-3 shadow-2xl transition-all duration-300 ${
          isSourceLayer
            ? "border-blue-500/40 bg-[#0B0D10]"
            : "border-neutral-800 bg-neutral-900"
        }`}
      >
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
        </div>

        {/* Display Screen */}
        <div className="relative rounded-[28px] overflow-hidden min-h-[460px] bg-black flex items-center justify-center pt-6">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-neutral-500 rounded-full" />
      </div>
    </div>
  );
};
