import { Heart, Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer id="footer-section" className="bg-background text-foreground border-t border-border/30">
      {/* Newsletter Signup */}
      <div className="flex flex-col items-center justify-center pt-6 pb-4">
        <div className="bg-muted/40 rounded-2xl px-4 py-6 max-w-md w-full text-center shadow-sm">
          <h3 className="text-2xl font-semibold mb-2">Keep your eyes on us</h3>
          <p className="text-muted-foreground text-base mb-4">Sign up to have access to new drops in advance and get special discounts for the launch.</p>
          <form className="flex items-center bg-muted/60 rounded-full overflow-hidden px-2 py-1">
            <Input type="email" placeholder="Your email" className="border-none bg-transparent focus:ring-0 text-base flex-1 min-w-0" />
            <Button type="submit" size="icon" className="rounded-full bg-foreground text-background ml-2 hover:bg-primary transition-colors">
              <ArrowRight className="h-5 w-5" />
              </Button>
          </form>
            </div>
          </div>
      <div className="container mx-auto px-4 pb-4 pt-2 flex flex-col md:flex-row md:justify-center md:items-center gap-4 text-center md:text-left">
        {/* Brand and Social */}
        <div className="flex flex-col items-center md:flex-row md:items-center gap-2 md:gap-6">
          <div className="flex items-center gap-2">
            <img src="/hunj.png" alt="Intent Love Logo" className="h-8 w-8 object-contain" />
            <span className="text-2xl font-serif font-bold tracking-tight">Intent Love</span>
          </div>
          <span className="text-base text-muted-foreground md:ml-6">Creating beautiful moments</span>
              </div>
        {/* Social and Links */}
        <div className="flex flex-col items-center md:flex-row md:items-center gap-2 md:gap-6">
          <div className="flex gap-2 justify-center">
            <a href="https://instagram.com/intentlove.ng" target="_blank" rel="noopener" className="hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener" className="hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener" className="hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          <nav className="hidden md:flex gap-4 justify-center text-sm text-muted-foreground md:ml-6">
            <button onClick={() => handleNavigation('/products')} className="hover:text-primary transition-colors cursor-pointer">Products</button>
            <button onClick={() => handleNavigation('/contact')} className="hover:text-primary transition-colors cursor-pointer">Contact</button>
          </nav>
        </div>
      </div>
      <div className="border-t border-border/30 pt-3 text-center text-xs text-muted-foreground">
        &copy; 2024 Intent Love. Made with <Heart className="inline h-4 w-4 text-primary mx-1" /> for love.
      </div>
    </footer>
  );
};