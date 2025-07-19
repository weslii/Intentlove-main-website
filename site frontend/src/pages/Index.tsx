import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { InstagramSection } from "@/components/InstagramSection";
import { MediaGallery } from "@/components/MediaGallery";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="pt-0">
        <Hero />
        <ProductGrid />
        <InstagramSection />
        <MediaGallery />
        <Features />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
