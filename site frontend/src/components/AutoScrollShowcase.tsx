import React, { useRef } from "react";
import { Product } from "@/data/products";
import { useNavigate } from "react-router-dom";

interface AutoScrollShowcaseProps {
  products: Product[];
  title?: string;
}

export const AutoScrollShowcase: React.FC<AutoScrollShowcaseProps> = ({ products, title = "Looking for more?" }) => {
  const navigate = useNavigate();
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Duplicate products for seamless looping
  const displayProducts = [...products, ...products];
  const cardWidth = 360; // px, including gap
  const minRowWidth = displayProducts.length * cardWidth;

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] pt-12 pb-0 md:pb-12 bg-muted/40 overflow-x-auto border-t border-border/20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 font-sans tracking-tight">{title}</h2>
      <div
        ref={marqueeRef}
        className="group flex items-center gap-8 animate-marquee hover:animate-marquee-slow min-w-fit md:min-w-0 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] relative"
        style={{
          willChange: "transform",
          minWidth: `${minRowWidth}px`,
        }}
      >
        {displayProducts.map((product, idx) => {
          // Only show images for memory optimization
          let mainImage = '';
          if (Array.isArray(product.images)) {
            for (const img of product.images) {
              if (img === null || img === undefined) continue;
              let imgUrl = '';
              if (typeof img === 'string' && img.trim().startsWith('{')) {
                try {
                  const parsed = JSON.parse(img);
                  if (parsed.image) imgUrl = parsed.image;
                } catch {}
              } else if (typeof img === 'object') {
                if (img && typeof (img as any).image === 'string') imgUrl = (img as any).image;
              } else if (typeof img === 'string') {
                if (img.match(/\.(png|jpe?g|webp|gif)(\?.*)?$/i)) imgUrl = img;
              }
              if (imgUrl) {
                mainImage = imgUrl;
                break;
              }
            }
          }
          return (
            <div
              key={product.id + '-' + idx}
              className="min-w-[340px] max-w-[380px] aspect-[4/3] bg-muted rounded-2xl shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 border border-border/10 relative flex items-end justify-center"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 absolute inset-0">No image</div>
              )}
              {/* Overlay text */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-4 py-3 flex flex-col gap-1">
                <div className="font-semibold text-lg text-white truncate">{product.name}</div>
                <div className="font-bold text-primary text-xl">${product.price?.toFixed(2) ?? ''}</div>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 100s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 100s !important;
          }
        }
        .hover\:animate-marquee-slow:hover {
          animation: marquee-slow 300s linear infinite !important;
        }
      `}</style>
    </div>
  );
}; 