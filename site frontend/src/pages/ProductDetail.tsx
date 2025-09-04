import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts, fetchProductById } from "@/lib/fetchProducts";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutoScrollShowcase } from "@/components/AutoScrollShowcase";
import { useCartStore } from "@/hooks/use-cart-store";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Check } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToCart = useCartStore(state => state.addToCart);
  const [allProducts, setAllProducts] = useState([]);
  const [added, setAdded] = useState(false);

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

  useEffect(() => {
    fetchProducts().then(data => setAllProducts(data || []));
  }, []);

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
                {(Array.isArray(product.images) ? product.images : []).map((img: any, idx: number) => {
                  let media = '';
                  if (typeof img === 'string' && img.trim().startsWith('{')) {
                    try {
                      const parsed = JSON.parse(img);
                      media = parsed.video || parsed.image || '';
                    } catch {
                      media = '';
                    }
                  } else if (typeof img === 'object' && img !== null) {
                    media = img.video || img.image || '';
                  } else if (typeof img === 'string') {
                    media = img;
                  }
                  return (
                    <div
                      key={media}
                      className="w-[75vw] h-[calc(75vw*16/9)] max-w-[340px] max-h-[605px] aspect-[9/16] bg-muted rounded-2xl shadow-lg flex-shrink-0 snap-center overflow-hidden flex items-center justify-center"
                    >
                      {typeof media === 'string' && media ? (
                        decodeURIComponent(media).split('?')[0].match(/\.(mp4|webm|mov)$/i)
                          ? (
                            <video
                              src={media}
                              autoPlay
                              muted
                              loop
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <img
                              src={media}
                              alt={product.name + ' ' + (idx + 1)}
                              loading="lazy"
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">No image</div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Desktop: vertical scroll with sticky info */}
              <div className="hidden md:flex flex-col gap-6 overflow-y-auto pr-2">
                {(Array.isArray(product.images) ? product.images : []).map((img: any, idx: number) => {
                  let media = '';
                  if (typeof img === 'string' && img.trim().startsWith('{')) {
                    try {
                      const parsed = JSON.parse(img);
                      media = parsed.video || parsed.image || '';
                    } catch {
                      media = '';
                    }
                  } else if (typeof img === 'object' && img !== null) {
                    media = img.video || img.image || '';
                  } else if (typeof img === 'string') {
                    media = img;
                  }
                  return (
                    <div
                      key={media}
                      className="w-full aspect-[9/16] max-h-[700px] bg-muted rounded-2xl shadow-lg overflow-hidden flex items-center justify-center"
                    >
                      {typeof media === 'string' && media ? (
                        decodeURIComponent(media).split('?')[0].match(/\.(mp4|webm|mov)$/i)
                          ? (
                            <video
                              src={media}
                              autoPlay
                              muted
                              loop
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <img
                              src={media}
                              alt={product.name + ' ' + (idx + 1)}
                              loading="lazy"
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">No image</div>
                      )}
                    </div>
                  );
                })}
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
                <span className="text-2xl font-bold text-primary">₦{product.price.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</span>
                {product.originalprice && (
                  <span className="text-lg text-muted-foreground line-through">₦{product.originalprice.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</span>
                )}
              </div>
              {product.id === 'card-custom' || product.id === 'jar-custom' || product.id === 'custom-package' || product.theme === 'custom' || product.theme === 'Custom' || product.theme?.toLowerCase() === 'custom' ? (
                <Button
                  size="lg"
                  className="rounded-full px-8 py-4 text-lg font-semibold bg-primary text-white hover:bg-primary/90"
                  onClick={() => navigate('/customise')}
                >
                  Customise
                </Button>
              ) : (
                <Button
                  size="lg"
                  className={`rounded-full px-8 py-4 text-lg font-semibold relative transition-all duration-300 ${added ? 'bg-green-500 text-white' : ''}`}
                  onClick={() => {
                    addToCart({ productId: product.id, quantity: 1 });
                    toast({ title: 'Added to cart!', description: `${product.name} has been added to your cart.` });
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1200);
                  }}
                  disabled={added}
                >
                  <span className="flex items-center gap-2">
                    {added ? (
                      <Check className="h-6 w-6 animate-bounceIn" />
                    ) : (
                      <ShoppingCart className="h-6 w-6" />
                    )}
                    {added ? 'Added!' : 'Add to Cart'}
                  </span>
                  <style>{`
                    @keyframes bounceIn {
                      0% { transform: scale(0.5); opacity: 0; }
                      60% { transform: scale(1.2); opacity: 1; }
                      100% { transform: scale(1); opacity: 1; }
                    }
                    .animate-bounceIn {
                      animation: bounceIn 0.6s cubic-bezier(.68,-0.55,.27,1.55);
                    }
                  `}</style>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <AutoScrollShowcase products={allProducts.filter((p: any) => p.id !== product.id)} />
      <Footer />
    </div>
  );
};

export default ProductDetail; 