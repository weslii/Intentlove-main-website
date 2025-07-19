import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "@/lib/fetchProducts";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutoScrollShowcase } from "@/components/AutoScrollShowcase";
import { useCartStore } from "@/hooks/use-cart-store";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProductById(id)
      .then(data => {
        setProduct(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-24 text-xl text-muted-foreground">Loading product...</div>;
  if (error || !product) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Image/Video Gallery */}
            <div className="w-full md:w-1/2 lg:w-2/3">
              {/* Mobile: horizontal scroll */}
              <div className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                {product.images.map((media: string, idx: number) => (
                  <div
                    key={media}
                    className="w-[75vw] h-[calc(75vw*16/9)] max-w-[340px] max-h-[605px] aspect-[9/16] bg-muted rounded-2xl shadow-lg flex-shrink-0 snap-center overflow-hidden flex items-center justify-center"
                  >
                    {media.match(/\.(mp4|webm)$/)
                      ? (
                        <video
                          src={media}
                          controls
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <img
                          src={media}
                          alt={product.name + ' ' + (idx + 1)}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      )}
                  </div>
                ))}
              </div>
              {/* Desktop: vertical scroll with sticky info */}
              <div className="hidden md:flex flex-col gap-6 overflow-y-auto pr-2">
                {product.images.map((media: string, idx: number) => (
                  <div
                    key={media}
                    className="w-[320px] aspect-[9/16] bg-muted rounded-2xl shadow-lg overflow-hidden flex items-center justify-center"
                  >
                    {media.match(/\.(mp4|webm)$/)
                      ? (
                        <video
                          src={media}
                          controls
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <img
                          src={media}
                          alt={product.name + ' ' + (idx + 1)}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      )}
                  </div>
                ))}
              </div>
            </div>
            {/* Product Info (sticky on desktop) */}
            <div className="flex-1 md:sticky md:top-24">
              <h1 className="text-4xl font-serif font-bold mb-2">{product.name}</h1>
              {product.theme && (
                <span className="inline-block mb-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  {product.theme}
                </span>
              )}
              <p className="text-lg text-muted-foreground mb-4">{product.description}</p>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <Button size="lg" className="rounded-full px-8 py-4 text-lg font-semibold" onClick={() => {
                addToCart({ productId: product.id, quantity: 1 });
                toast({ title: 'Added to cart!', description: `${product.name} has been added to your cart.` });
                navigate('/cart');
              }}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </main>
      <AutoScrollShowcase products={products.filter(p => p.id !== product.id)} />
      <Footer />
    </div>
  );
};

export default ProductDetail; 