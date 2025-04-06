"use client";
import Image from "next/image";
import asuLogo from "../assets/images/asu.png";
import ucsdLogo from "../assets/images/ucsd.png";
import uclaLogo from "../assets/images/ucla.png";
import nyuLogo from "../assets/images/nyu.png";

const images = [
  { src: asuLogo, alt: "ASU Logo" },
  { src: ucsdLogo, alt: "UCSD Logo" },
  { src: uclaLogo, alt: "UCLA Logo" },
  { src: nyuLogo, alt: "NYU Logo" },
];

export const LogoTicker = () => {
  return (
    <div className="bg-black text-white py-[72px] sm:py-24 overflow-hidden">
      <div className="container">
        <h2 className="text-xl text-center text-white/70">
          Trusted by students from top universities
        </h2>

        {/* Ticker Container */}
        <div className="relative mt-9 overflow-hidden w-full">
          <div className="whitespace-nowrap animate-marquee flex gap-24">
            {[...images, ...images, ...images].map(({ src, alt }, index) => (
              <Image
                key={`${alt}-${index}`}
                src={src}
                alt={alt}
                className={`h-14 w-auto flex-none filter saturate-0 ${
                  alt === "UCSD Logo" ? "opacity-50" : ""
                }`}
              />
            ))}
          </div>

          {/* Optional gradient edges */}
          <div className="pointer-events-none absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-black via-black/50 to-transparent z-10" />
        </div>
      </div>
    </div>
  );
};
