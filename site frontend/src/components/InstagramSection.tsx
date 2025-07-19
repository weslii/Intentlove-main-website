import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { ScrollAnimation } from "./animations/ScrollAnimations";

export const InstagramSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-rose-light/20 to-background relative overflow-hidden">
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
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft mb-6 border border-white/50"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.4)"
            }}
            transition={{ duration: 0.6 }}
          >
            <Instagram className="h-8 w-8 text-primary" />
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Follow Our Journey
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Watch our creative process and discover the love stories we help bring to life through beautiful arrangements.
          </motion.p>
        </ScrollAnimation>

        {/* Instagram Embed */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 overflow-hidden">
            <iframe
              src="https://www.instagram.com/intentlove.ng/embed"
              className="w-full h-96 md:h-[500px]"
              frameBorder="0"
              scrolling="no"
              title="Intent Love Instagram Feed"
            />
          </div>
        </motion.div>

        {/* Follow Button */}
        <ScrollAnimation direction="up" delay={0.6} className="text-center mt-12">
          <motion.a
            href="https://www.instagram.com/intentlove.ng/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-hero text-white font-semibold px-8 py-4 rounded-full shadow-romantic hover:shadow-soft transition-all duration-300 transform hover:scale-105"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className="h-5 w-5" />
            Follow @intentlove.ng
          </motion.a>
        </ScrollAnimation>
      </div>
    </section>
  );
}; 