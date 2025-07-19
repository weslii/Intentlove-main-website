import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { StaggerContainer, StaggerItem, ScrollAnimation } from "./animations/ScrollAnimations";
import { fetchProducts } from "@/lib/fetchProducts";
import { useNavigate } from "react-router-dom";

export const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(data => {
        setProducts(data || []);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-24 text-xl text-muted-foreground">Loading products...</div>;
  if (error) return <div className="text-center py-24 text-xl text-destructive">{error}</div>;

  return (
    <section className="pt-24 pb-8 bg-gradient-to-b from-background to-rose-light/20 relative overflow-hidden">
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
        <ScrollAnimation direction="up" className="text-center mb-16">
          <motion.h2 
            className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Featured Arrangements
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover our handpicked selection of the most beautiful and romantic flower arrangements, 
            crafted with love and attention to detail.
          </motion.p>
        </ScrollAnimation>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product, index) => (
            <StaggerItem key={product.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <ProductCard {...product} />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollAnimation direction="up" delay={0.6} className="text-center mt-16">
          <motion.button 
            onClick={() => navigate('/products')}
            className="group text-primary hover:text-primary/80 font-semibold text-xl relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">View All Products</span>
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </ScrollAnimation>
      </div>
    </section>
  );
};