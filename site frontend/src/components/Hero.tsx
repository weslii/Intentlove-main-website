import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "./animations/ScrollAnimations";
import heroImage from "@/assets/hero-flowers.jpg";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section 
      ref={containerRef}
      id="hero-section"
      data-hero-section
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Background with Parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          scale, 
          y: y,
          willChange: 'transform'
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-white px-4 w-full h-full flex flex-col justify-between"
        style={{ opacity }}
      >
        {/* Top section - empty for now, could add navigation here */}
        <div className="flex-1"></div>

        {/* Bottom section with text positioned like reference */}
        <div className="flex flex-col md:block justify-start items-start pb-8 md:pb-16 pl-2 md:pl-0">
          {/* Bottom Left - Main Brand Name */}
          <motion.div 
            className="text-left mb-2 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Tagline - above on mobile, right on desktop */}
            <motion.div 
              className="text-left md:text-right mb-2 md:mb-0 md:absolute md:bottom-16 md:right-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <p className="text-2xl md:text-4xl font-semibold leading-tight mb-2">
                Romantic Jars
              </p>
              <p className="text-xl md:text-3xl font-semibold leading-tight">
                Notes & Flowers
              </p>
            </motion.div>
            
            <h1 className="text-8xl md:text-[10rem] font-bold leading-tight md:mt-16" style={{ fontFamily: 'Allura, cursive' }}>
              Intent Love
            </h1>
            {/* Action buttons - below brand name on mobile, under brand on desktop */}
          <motion.div 
              className="flex flex-row gap-4 mt-2 md:mt-4 md:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="romantic"
                size="lg"
                className="text-lg px-8 py-4 rounded-full"
                onClick={() => navigate('/products')}
              >
                Shop Now
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="soft"
                size="lg"
                className="text-lg px-8 py-4 rounded-full"
                onClick={() => navigate('/customise')}
              >
                Custom
              </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating decorative elements - reduced for performance */}
        <motion.div 
          className="absolute top-10 left-10 w-4 h-4 bg-rose-light rounded-full"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-6 h-6 bg-lavender rounded-full"
          animate={{ 
            y: [0, -8, 0],
            x: [0, 5, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </motion.div>
    </section>
  );
};