import React from "react";
import { motion } from "framer-motion";

import img1 from "../assets/LandingPageAssests/landingpage1.jpg";
import img2 from "../assets/LandingPageAssests/landingpage2.jpg";
import img3 from "../assets/LandingPageAssests/landingpage3.jpg";
import img4 from "../assets/LandingPageAssests/landingpage4.jpg";
import img5 from "../assets/LandingPageAssests/landingpage5.jpg";
import img6 from "../assets/LandingPageAssests/landingpage6.jpg";
import img7 from "../assets/LandingPageAssests/landingpage7.jpg";

const images = [img1, img4, img7, img3, img5, img6, img2];
// OPTIMIZATION: Create the duplicated array once outside the component
// to avoid recreating it on every single render.
const marqueeImages = [...images, ...images];

const BackgroundMarquee = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-black">
      <motion.div
        // OPTIMIZATION: 'will-change-transform' optimizes GPU usage
        className="flex h-full w-max will-change-transform"
        initial={{ x: "-50%" }}
        animate={{ x: "0%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 90,
        }}
      >
        {marqueeImages.map((src, index) => (
          <div key={index} className="relative w-[32vw] h-full flex-shrink-0">
            {/* PERFORMANCE FIXES:
               1. loading="lazy": Don't load off-screen images immediately.
               2. decoding="async": Decodes image off the main thread (Fixes the "Hang").
            */}
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>

      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
    </div>
  );
};

export default BackgroundMarquee;
