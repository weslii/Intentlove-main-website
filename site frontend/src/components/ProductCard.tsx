import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "@/hooks/use-favorites-store";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
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
  rating, 
  reviewCount, 
  isOnSale, 
  isFavorite 
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);
  const navigate = useNavigate();

  return (
    <motion.div
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
          <motion.img 
            src={image} 
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Glass morphism overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Badges */}
          {isOnSale && (
            <motion.div 
              className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              Sale
            </motion.div>
          )}
          
          {/* Favorite Button */}
          <motion.div
            className="absolute top-3 right-3"
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
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
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
                    ${price}
                  </motion.span>
                  {originalPrice && (
                    <motion.span 
                      className="text-sm text-gray-300 line-through"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      ${originalPrice}
                    </motion.span>
                  )}
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="romantic" size="sm" className="rounded-full px-4">
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