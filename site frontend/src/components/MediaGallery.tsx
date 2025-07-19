import { motion } from "framer-motion";
import { Play, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "./animations/ScrollAnimations";

// Mock media data - replace with your actual videos and images
const mediaItems = [
  {
    id: 1,
    type: "video",
    src: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80",
    title: "Romantic Rose Arrangement",
    description: "Watch how we create the perfect romantic bouquet"
  },
  {
    id: 2,
    type: "image",
    src: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80",
    title: "Pink Peony Paradise",
    description: "Beautiful peony arrangements for special occasions"
  },
  {
    id: 3,
    type: "video",
    src: "https://images.unsplash.com/photo-1455659817273-f2fd6aaa3e8d?auto=format&fit=crop&w=600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1455659817273-f2fd6aaa3e8d?auto=format&fit=crop&w=600&q=80",
    title: "Custom Gift Wrapping",
    description: "See our unique gift wrapping process"
  },
  {
    id: 4,
    type: "image",
    src: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=600&q=80",
    title: "Lavender Dreams",
    description: "Elegant lavender arrangements"
  }
];

export const MediaGallery = () => {
  return (
    <section className="pt-4 md:pt-8 pb-24 bg-gradient-to-b from-rose-light/20 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-lavender/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-rose-medium/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Staggered Media Grid */}
        <div className="space-y-8 md:space-y-16">
          {mediaItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={`flex flex-row lg:flex-row gap-4 md:gap-8 lg:gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Media Content */}
              <motion.div 
                className={`flex-1 relative group ${index % 2 === 1 ? 'order-2 lg:order-1' : 'order-1'} max-w-xs lg:max-w-sm xl:max-w-md`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-soft group-hover:shadow-romantic transition-all duration-500">
                  <img 
                    src={item.src} 
                    alt={item.title}
                    className="w-full aspect-[9/16] object-cover"
                  />
                  
                  {/* Video Play Button Overlay */}
                  {item.type === "video" && (
                    <motion.div
                      className="absolute inset-0 bg-black/30 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="w-8 h-8 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Play className="h-4 w-4 md:h-8 md:w-8 text-primary ml-0.5 md:ml-1" />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Action Buttons Overlay */}
                  <motion.div
                    className="absolute top-1 right-1 md:top-4 md:right-4 flex gap-1 md:gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button variant="ghost" size="icon" className="w-6 h-6 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full">
                      <Heart className="h-2 w-2 md:h-4 md:w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-6 h-6 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full">
                      <Eye className="h-2 w-2 md:h-4 md:w-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Text Content */}
              <motion.div 
                className={`flex-1 text-center lg:text-left ${index % 2 === 1 ? 'order-1 lg:order-2' : 'order-2'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.2 }}
              >
                <motion.h3 
                  className="text-lg md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-1 md:mb-4"
                  whileHover={{ color: 'hsl(var(--primary))' }}
                  transition={{ duration: 0.3 }}
                >
                  {item.title}
                </motion.h3>
                <motion.p 
                  className="text-xs md:text-lg text-muted-foreground leading-relaxed mb-2 md:mb-6"
                >
                  {item.description}
                </motion.p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="soft" size="sm" className="rounded-full px-3 md:px-8 text-xs md:text-base">
                    {item.type === "video" ? "Watch" : "View"}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 