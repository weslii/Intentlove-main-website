import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Heart, Search, ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearchStore } from "@/hooks/use-search-store";
import { useCartStore } from "@/hooks/use-cart-store";
import { getCurrentUser, signOutUser } from "@/lib/orderService";
import { toast } from "@/hooks/use-toast";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 0.98]);
  const headerBlur = useTransform(scrollY, [0, 100], [8, 16]);
  const { setShowWhatsAppModal } = useWhatsApp();
  
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useSearchStore();
  const cartCount = useCartStore(state => state.items.reduce((sum, item) => sum + item.quantity, 0));

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    if (path === '/contact') {
      // Open WhatsApp modal instead of navigating
      setShowWhatsAppModal(true);
      closeMenu();
      return;
    }
    navigate(path);
    closeMenu();
  };

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        // User is not logged in
        setCurrentUser(null);
      }
    };
    
    checkUser();
  }, []);

  const handleProfileClick = () => {
    if (currentUser) {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    } else {
      navigate('/login');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setIsProfileMenuOpen(false);
      toast({
        title: "Signed out successfully 👋",
        description: "You have been signed out of your account.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
    return unsubscribe;
  }, [scrollY]);

  useEffect(() => {
    const checkBackgroundColor = () => {
      // Get the element behind the header (usually the hero section)
      const heroSection = document.querySelector('section') || document.body;
      const rect = heroSection.getBoundingClientRect();
      
      // Create a canvas to sample the background color
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Take a screenshot of the area behind the header
      const video = document.createElement('video');
      video.style.display = 'none';
      document.body.appendChild(video);
      
      // Use html2canvas or similar approach to get background color
      // For now, we'll use a simpler approach based on scroll position
      const scrollTop = window.scrollY;
      const heroHeight = rect.height;
      
      // If we're in the hero section (first section), assume it's dark
      if (scrollTop < heroHeight) {
        setIsDarkBackground(true);
      } else {
        setIsDarkBackground(false);
      }
    };

    checkBackgroundColor();
    window.addEventListener('scroll', checkBackgroundColor);
    window.addEventListener('resize', checkBackgroundColor);
    
    return () => {
      window.removeEventListener('scroll', checkBackgroundColor);
      window.removeEventListener('resize', checkBackgroundColor);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle mobile menu
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        mobileButtonRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !mobileButtonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }

      // Handle profile menu
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        profileButtonRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        closeProfileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isProfileMenuOpen]);

  // Determine text color: always dark on /products and /cart, otherwise adaptive
  const isLightPage = location.pathname.startsWith("/products") || location.pathname.startsWith("/cart");
  const textColorClass = isLightPage ? 'text-foreground' : (isDarkBackground ? 'text-white' : 'text-foreground');
  const iconColorClass = isLightPage ? 'text-foreground' : (isDarkBackground ? 'text-white' : 'text-foreground');
  const hoverColorClass = isLightPage ? 'hover:text-primary' : (isDarkBackground ? 'hover:text-white' : 'hover:text-primary');

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
              <img src="/hunj.png" alt="Intent Love Logo" className="h-8 w-8 object-contain" />
              </motion.div>
            <h1 className={`text-2xl font-serif font-bold ${textColorClass}`}>
              Intent Love
              </h1>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Contact", path: "/contact" }
              ].map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative ${textColorClass}/80 ${hoverColorClass} transition-colors py-2 bg-transparent border-none cursor-pointer`}
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.name}
                  <motion.div
                  className={`absolute bottom-0 left-0 h-0.5 ${isDarkBackground ? 'bg-white' : 'bg-primary'}`}
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <motion.div 
                className={`hidden lg:flex items-center relative ${iconColorClass}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Search className={`absolute left-3 h-4 w-4 ${iconColorClass}`} />
                <Input 
                  placeholder="Search products..." 
                className={`pl-10 w-64 ${isDarkBackground ? 'bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70' : 'bg-background/80 backdrop-blur-sm border-border/50'} focus:border-primary/50`}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className={`absolute right-1 top-1/2 -translate-y-1/2 ${iconColorClass}`}
                  onClick={handleSearch}
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={iconColorClass}
                  onClick={handleProfileClick}
                  ref={profileButtonRef}
                >
                  <User className="h-5 w-5" />
                </Button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {isProfileMenuOpen && currentUser && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-48 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      ref={profileMenuRef}
                    >
                      <div className="p-3 border-b border-border/50">
                        <p className="font-medium text-sm">{currentUser.user_metadata?.full_name || currentUser.email}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                      </div>
                      <div className="p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-sm"
                          onClick={() => {
                            navigate('/account');
                            closeProfileMenu();
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          My Account
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button variant="ghost" size="icon" className={`relative ${iconColorClass}`} onClick={() => navigate('/cart')}>
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                  <motion.span
                  className={`absolute -top-1 -right-1 ${isDarkBackground ? 'bg-white text-black' : 'bg-primary text-primary-foreground'} text-xs rounded-full h-5 w-5 flex items-center justify-center`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  >
                      {cartCount}
                  </motion.span>
                  )}
                </Button>
              </motion.div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden ${iconColorClass}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              ref={mobileButtonRef}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
          <motion.div
              className="md:hidden overflow-hidden bg-background/80 backdrop-blur-md border border-border/20 rounded-lg mt-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              ref={mobileMenuRef}
          >
              <nav className="pt-4 pb-2 space-y-2 px-4">
                {[
                  { name: "Home", path: "/" },
                  { name: "Products", path: "/products" },
                  { name: "Contact", path: "/contact" }
                ].map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`block py-2 ${textColorClass}/80 ${hoverColorClass} transition-colors w-full text-left bg-transparent border-none cursor-pointer`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                    {item.name}
                  </motion.button>
              ))}
            </nav>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};