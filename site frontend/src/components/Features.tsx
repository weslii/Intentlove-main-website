import { motion } from "framer-motion";
import { Star, Quote, Heart, MessageCircle } from "lucide-react";
import { StaggerContainer, StaggerItem, ScrollAnimation } from "./animations/ScrollAnimations";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const loveStories = [
  {
    id: 1,
    title: "52 Years of marriage and still writing.",
    date: "MAY 11, 2025",
    category: "INTENT LOVE",
    story: "She passed away six years ago. But every month, he writes her a letter anyway. On the last Sunday of each month, he sits by the same window, with the same pen, and pours his heart onto paper. The romantic jar we created for their anniversary became the vessel for these precious letters...",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    review: "I'm Not Usually The Kind To Write Letters, But This One They Composed? Perfectly Captured My Feelings",
    author: "Sarah & Michael",
    occasion: "Anniversary Gift"
  },
  {
    id: 2,
    title: "The proposal that changed everything.",
    date: "MAY 8, 2025",
    category: "INTENT LOVE",
    story: "He planned everything perfectly. The romantic jar filled with handwritten notes, each one revealing a reason why he loved her. When she reached the last note, he was on one knee. The flowers were just the beginning of their forever...",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80",
    review: "The combination of flowers and heartfelt notes created such a special moment. It's not just a gift, it's an experience.",
    author: "Emma & James",
    occasion: "Proposal Setup"
  },
  {
    id: 3,
    title: "Valentine's Day surprise that brought tears.",
    date: "MAY 5, 2025",
    category: "INTENT LOVE",
    story: "I wanted something special for our first Valentine's Day together. The romantic jar with 14 handwritten reasons why I love her, one for each day leading up to Valentine's. When she opened the last note, she was speechless...",
    image: "https://images.unsplash.com/photo-1455659817273-f2fd6aaa3e8d?auto=format&fit=crop&w=800&q=80",
    review: "The flowers were fresh, the packaging was elegant, and the personal touch made all the difference.",
    author: "Jennifer & David",
    occasion: "Valentine's Day"
  },
  {
    id: 4,
    title: "Birthday surprise that exceeded expectations.",
    date: "MAY 2, 2025",
    category: "INTENT LOVE",
    story: "For her 30th birthday, I wanted something unforgettable. The custom arrangement with her favorite flowers, plus a romantic jar filled with 30 memories of our time together. She cried happy tears...",
    image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=800&q=80",
    review: "I ordered a custom arrangement and it exceeded all expectations. The attention to detail is pure genius.",
    author: "Lisa & Tom",
    occasion: "Birthday Surprise"
  },
  {
    id: 5,
    title: "Long-distance love made closer.",
    date: "APRIL 28, 2025",
    category: "INTENT LOVE",
    story: "Being apart for 6 months was hard, but Intent Love helped me send a piece of my heart. The romantic jar with daily love notes, plus beautiful flowers that lasted weeks. She felt my presence every day...",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80",
    review: "The romantic jar concept is pure genius. It's not just flowers, it's a daily reminder of love.",
    author: "Alex & Maria",
    occasion: "Long Distance Gift"
  },
  {
    id: 6,
    title: "Anniversary celebration to remember.",
    date: "APRIL 25, 2025",
    category: "INTENT LOVE",
    story: "Our 10th anniversary deserved something extraordinary. The custom arrangement with 10 roses, each representing a year of our journey, plus a romantic jar with our favorite memories. Pure magic...",
    image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=800&q=80",
    review: "The combination of flowers and heartfelt notes created such a special moment. Thank you Intent Love!",
    author: "Robert & Sarah",
    occasion: "10th Anniversary"
  }
];

export const Features = () => {
  // WhatsApp Button Scroll Logic
  const heroRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const [isHeroInView, setIsHeroInView] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);

  useEffect(() => {
    // Find the Hero section by id or tag
    const heroSection = document.getElementById("hero-section") || document.querySelector("section[data-hero-section]");
    heroRef.current = heroSection;
    if (!heroSection) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsHeroInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Find the Footer section by id
    const footerSection = document.getElementById("footer-section");
    footerRef.current = footerSection;
    if (!footerSection) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsFooterInView(entry.intersectionRatio > 0.2),
      { threshold: [0, 0.2, 1] }
    );
    observer.observe(footerSection);
    return () => observer.disconnect();
  }, []);

  const shouldHideWhatsapp = isHeroInView || isFooterInView;

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
          <motion.h2 
            className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Love Stories Shared
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Real stories from couples who've experienced the magic of our romantic arrangements.
          </motion.p>
        </ScrollAnimation>

        {/* Featured Story */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-soft hover:shadow-romantic transition-all duration-500 border border-white/50">
            <div className="relative">
              <img 
                src={loveStories[0].image} 
                alt={loveStories[0].title}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span>{loveStories[0].date}</span>
                <span>•</span>
                <span>{loveStories[0].category}</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                {loveStories[0].title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                {loveStories[0].story}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">3 comments</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">1/2</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Review Highlight */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft border border-white/50">
            <Quote className="h-8 w-8 text-primary mx-auto mb-4" />
            <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground mb-4">
              "{loveStories[0].review}"
            </blockquote>
            <p className="text-sm text-muted-foreground">The Review Highlight - Intent Love</p>
          </div>
        </motion.div>

        {/* Horizontal Scrolling Testimonials */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground text-center mb-8">
            More Love Stories
          </h3>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4" style={{ minWidth: 'max-content' }}>
              {loveStories.slice(1).map((story, index) => (
                <motion.div 
                  key={story.id}
                  className="w-80 flex-shrink-0"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-soft hover:shadow-romantic transition-all duration-500 border border-white/50 h-full">
                    <div className="relative">
                      <img 
                        src={story.image} 
                        alt={story.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <span>{story.date}</span>
                        <span>•</span>
                        <span>{story.category}</span>
                      </div>
                      
                      <h4 className="text-lg font-serif font-bold text-foreground mb-3 line-clamp-2">
                        {story.title}
                      </h4>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {story.story}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{story.author}</span>
                        <span className="text-xs text-primary font-medium">{story.occasion}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* WhatsApp CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.button 
            className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full shadow-romantic hover:shadow-soft transition-all duration-300 transform hover:scale-105"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            BUY NOW
          </motion.button>
        </motion.div>

        {/* Floating WhatsApp Button */}
        <motion.div 
          className="fixed bottom-6 left-6 z-50"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ 
            opacity: shouldHideWhatsapp ? 0 : 1, 
            scale: shouldHideWhatsapp ? 0.7 : 1, 
            x: shouldHideWhatsapp ? -100 : 0 
          }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.button 
            className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};