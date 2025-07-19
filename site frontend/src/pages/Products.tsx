import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { products, Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/hooks/use-search-store";
import Fuse from "fuse.js";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const categories = [
  "All",
  "Jars",
  "Cards",
  "Flowers"
];

const fuseOptions = {
  keys: ["name", "description", "tags", "theme", "type"],
  threshold: 0.4,
};

export const Products = () => {
  const { searchTerm, setSearchTerm } = useSearchStore();
  const location = useLocation();

  // Sync search term with query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    setSearchTerm(q);
  }, [location.search, setSearchTerm]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");

  const fuse = new Fuse(products, fuseOptions);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (searchTerm.trim()) {
      filtered = fuse.search(searchTerm.trim()).map(result => result.item);
    }
    filtered = filtered.filter((product) => {
      let matchesCategory = false;
      switch (selectedCategory) {
        case "All":
          matchesCategory = true;
          break;
        case "Jars":
          matchesCategory = product.type === "jar";
          break;
        case "Cards":
          matchesCategory = product.type === "card";
          break;
        case "Flowers":
          matchesCategory = product.type === "flower_stem" || product.type === "bouquet";
          break;
        default:
          matchesCategory = true;
      }
      return matchesCategory;
    });
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return filtered;
  }, [searchTerm, selectedCategory, sortBy, fuse]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-rose-light/20 to-background py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
                All Products
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover our complete collection of beautiful flower arrangements, 
                each crafted with love and attention to detail.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 border-b border-border/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "price")}
                  className="bg-background border border-border rounded-md px-3 py-1 text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8 text-muted-foreground"
            >
              Showing {filteredProducts.length} of {products.length} products
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Products; 