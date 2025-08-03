import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "@/hooks/use-favorites-store";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useRef, useEffect, useState } from "react";
import { useCartStore } from "@/hooks/use-cart-store";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  video?: string;
  rating?: number;
  reviewCount?: number;
  isOnSale?: boolean;
  isFavorite?: boolean;
}

export const ProductCard = ({ 
  id,
  name, 
  price, 
  originalPrice, 
  image, 
  video,
  rating, 
  reviewCount, 
  isOnSale, 
  isFavorite 
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [fade, setFade] = useState(true); // true = visible, false = hidden
  const [visibleMedia, setVisibleMedia] = useState<'image' | 'video'>('image');
  const [transitioning, setTransitioning] = useState<null | 'toVideo' | 'toImage'>(null);
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const videoTimeout = useRef<NodeJS.Timeout | null>(null);
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);
  const navigate = useNavigate();
  const addToCart = useCartStore(state => state.addToCart);

  // Remove all previous media extraction logic
  const hasVideo = typeof video === 'string' && decodeURIComponent(video).split('?')[0].match(/\.(mp4|webm|mov)$/i);

  // Intersection Observer for mobile
  useEffect(() => {
    if (!isMobile) return;
    const node = cardRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isMobile]);

  // Handle video show logic
  useEffect(() => {
    if (isMobile) {
      if (isInView && hasVideo) {
        videoTimeout.current = setTimeout(() => setShowVideo(true), 1000);
      } else {
        setShowVideo(false);
        if (videoTimeout.current) clearTimeout(videoTimeout.current);
      }
    }
  }, [isInView, isMobile, hasVideo]);

  // Desktop hover logic
  useEffect(() => {
    if (!isMobile && isHovered && hasVideo) {
      videoTimeout.current = setTimeout(() => setShowVideo(true), 300);
    } else if (!isMobile) {
      setShowVideo(false);
      if (videoTimeout.current) clearTimeout(videoTimeout.current);
    }
  }, [isHovered, isMobile, hasVideo]);

  // Handle smooth crossfade transition between image and video
  useEffect(() => {
    if (showVideo && visibleMedia === 'image') {
      setTransitioning('toVideo');
      setFade(false); // start fade out
      const timeout = setTimeout(() => {
        setVisibleMedia('video');
        setFade(true); // fade in new media
        setTransitioning(null);
      }, 600); // fade out duration (ms)
      return () => clearTimeout(timeout);
    } else if (!showVideo && visibleMedia === 'video') {
      setTransitioning('toImage');
      setFade(false); // start fade out
      const timeout = setTimeout(() => {
        setVisibleMedia('image');
        setFade(true); // fade in new media
        setTransitioning(null);
      }, 600); // fade out duration (ms)
      return () => clearTimeout(timeout);
    }
  }, [showVideo, visibleMedia]);

  useEffect(() => {
    return () => {
      if (videoTimeout.current) clearTimeout(videoTimeout.current);
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => navigate(`/products/${id}`)}
      className="cursor-pointer"
    >
      <Card className="group overflow-hidden bg-white/80 backdrop-blur-sm border-border/50 hover:shadow-romantic transition-all duration-500 h-full">
        <div className="relative overflow-hidden h-full">
          <div className="aspect-[9/16] w-full h-auto relative">
            {/* Crossfade: render both during transition, otherwise only one */}
            <div className="z-0" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 0 }}>
              {/* Image on top, fades out when going to video */}
              {(visibleMedia === 'image' || transitioning === 'toVideo') && image && (
                <motion.img
                  src={image}
                  alt={name}
                  loading="lazy"
                  className="w-full h-full object-cover absolute inset-0"
                  style={{
                    opacity: transitioning === 'toVideo' ? (fade ? 1 : 0) : 1,
                    transition: 'opacity 600ms',
                    zIndex: 2,
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              )}
              {/* Video underneath, fades in when becoming visible */}
              {(visibleMedia === 'video' || transitioning === 'toVideo') && hasVideo && (
                <video
                  src={video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover absolute inset-0"
                  poster={image}
                  style={{
                    opacity: visibleMedia === 'video' && !transitioning ? (fade ? 1 : 0) : 1,
                    transition: 'opacity 600ms',
                    zIndex: 1,
                  }}
                />
              )}
              {/* Video on top, fades out when going to image */}
              {transitioning === 'toImage' && hasVideo && (
                <video
                  src={video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover absolute inset-0"
                  poster={image}
                  style={{
                    opacity: fade ? 1 : 0,
                    transition: 'opacity 600ms',
                    zIndex: 2,
                  }}
                />
              )}
              {/* Image underneath, fades in when becoming visible */}
              {transitioning === 'toImage' && image && (
                <motion.img
                  src={image}
                  alt={name}
                  loading="lazy"
                  className="w-full h-full object-cover absolute inset-0"
                  style={{
                    opacity: 1,
                    zIndex: 1,
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              )}
              {/* Fallback if no image or video */}
              {!image && !hasVideo && (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 absolute inset-0">No image</div>
              )}
            </div>
          </div>
          
          {/* Glass morphism overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Badges */}
          {isOnSale && (
            <motion.div 
              className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-10"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              Sale
            </motion.div>
          )}
          
          {/* Favorite Button */}
          <motion.div
            className="absolute top-3 right-3 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-muted-foreground hover:text-primary rounded-full"
              onClick={e => {
                e.stopPropagation();
                toggleFavorite(id);
                toast({
                  title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
                  description: isFavorite ? `${name} removed from your favorites.` : `${name} added to your favorites.`
                });
              }}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <motion.div
                animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-primary' : ''}`} />
              </motion.div>
            </Button>
          </motion.div>

          {/* Product Info Overlay at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-2 mb-3">
                {name}
              </h3>

              {/* Price and Add to Cart Button */}
<div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <motion.span 
      className="text-lg font-bold text-white"
      whileHover={{ scale: 1.05 }}
    >
      ₦{price.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </motion.span>

    {originalPrice && (
      <motion.span 
        className="text-sm text-gray-300 line-through"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ₦{originalPrice.toLocaleString("en-NG", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}
      </motion.span>
    )}
  </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="romantic"
                    size="sm"
                    className="rounded-full px-4"
                    onClick={e => {
                      e.stopPropagation();
                      addToCart({ productId: id, quantity: 1 });
                      toast({
                        title: 'Added to cart!',
                        description: `${name} has been added to your cart.`
                      });
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons Overlay */}
          {/* Removed overlay action buttons on hover as requested */}
        </div>
      </Card>
    </motion.div>
  );
};