import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import { productsApi } from "@/api/adminApi";
import { Product, uploadMedia, UploadedMedia, deleteMedia } from "@/lib/supabaseClient";
import { MediaUpload } from "@/components/MediaUpload";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Download,
  Plus,
  MoreHorizontal,
  Package,
  Tag,
  TrendingUp,
  Star,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Settings,
  X,
  Save,
  Loader2,
  Video,
} from "lucide-react";

// Filter options for the admin interface

const typeOptions = ["all", "jar", "card", "bouquet", "flower_stem", "package"];
const themeOptions = ["all", "romantic", "birthday", "anniversary", "apology", "custom"];
const statusOptions = ["all", "active", "inactive", "draft"];

export const Products: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        // Close all dropdowns
        document.querySelectorAll('[id^="dropdown-"]').forEach(dropdown => {
          dropdown.classList.add('hidden');
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close modals when clicking outside
  useEffect(() => {
    const handleModalClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.classList.contains('modal-overlay')) {
        handleCloseModals();
      }
    };

    if (viewModalOpen || editModalOpen) {
      document.addEventListener('mousedown', handleModalClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleModalClickOutside);
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [viewModalOpen, editModalOpen]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch real products from Supabase database
      const data = await productsApi.getProducts();
      setProducts(data);
    } catch (error: any) {
      console.error('Error loading products:', error);
      const errorMessage = error?.message || 'Failed to load products. Please try again.';
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Product action handlers
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditingProduct({
      id: product.id,
      name: product.name,
      type: product.type,
      theme: product.theme,
      description: product.description,
      image: product.image,
      images: product.images,
      price: product.price,
      originalprice: product.originalprice,
      isonsale: product.isonsale,
      isfavorite: product.isfavorite,
      size: product.size,
      tags: product.tags,
    });
    setUploadedMedia([]); // Reset uploaded media when editing
    setEditModalOpen(true);
  };

  const handleCopyProductId = (product: Product) => {
    navigator.clipboard.writeText(product.id);
    // You could add a toast notification here
    console.log('Product ID copied:', product.id);
  };

  const handleProductSettings = (product: Product) => {
    // Open product settings or advanced options
    console.log('Product settings for:', product.id);
    alert(`Settings for ${product.name} will be implemented soon!`);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      try {
        await productsApi.deleteProduct(product.id);
        // Refresh the products list
        await loadProducts();
        console.log('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const newActiveStatus = !product.active;
      await productsApi.toggleProductActive(product.id, newActiveStatus);
      await loadProducts();
      toast.success(`Product ${newActiveStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling product active status:', error);
      toast.error('Failed to update product status. Please try again.');
    }
  };

  const handleExportProducts = () => {
    try {
      // Prepare data for export
      const exportData = filteredProducts.map(product => ({
        ID: product.id,
        Name: product.name,
        Type: product.type,
        Theme: product.theme || 'N/A',
        Size: product.size || 'Regular',
        Price: product.price,
        'Original Price': product.originalprice || 'N/A',
        'On Sale': product.isonsale ? 'Yes' : 'No',
        Active: product.active ? 'Yes' : 'No',
        Favorite: product.isfavorite ? 'Yes' : 'No',
        Description: product.description || 'N/A',
        Tags: product.tags ? product.tags.join(', ') : 'N/A',
        'Image URL': product.image || 'N/A',
        'Media Count': Array.isArray(product.images) ? product.images.length : 0
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${exportData.length} products to CSV!`);
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Failed to export products. Please try again.');
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct.id) return;
    
    try {
      setEditLoading(true);
      
      // Automatically determine if product is on sale based on prices
      const finalProduct = {
        ...editingProduct,
        isonsale: (editingProduct.originalprice && editingProduct.price) 
          ? editingProduct.originalprice > editingProduct.price 
          : false
      };

      // Add uploaded media to the product (combine with existing media)
      if (uploadedMedia.length > 0) {
        const newMediaData = uploadedMedia.map(media => {
          if (media.type === 'image') {
            return JSON.stringify({ image: media.url, filename: media.filename });
          } else {
            return JSON.stringify({ video: media.url, filename: media.filename });
          }
        });
        
        // Combine existing media with new media
        const existingMedia = editingProduct.images || selectedProduct?.images || [];
        finalProduct.images = [...existingMedia, ...newMediaData];
      }
      
      await productsApi.updateProduct(editingProduct.id, finalProduct);
      await loadProducts(); // Refresh the list
      handleCloseModals();
      
      // Show success message with media info
      if (uploadedMedia.length > 0) {
        const mediaCount = uploadedMedia.length;
        const mediaTypes = uploadedMedia.map(m => m.type).join(', ');
        toast.success(`Product updated successfully!\nMedia added: ${mediaCount} file(s)\nTypes: ${mediaTypes}`);
      } else {
        toast.success('Product updated successfully!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.type || !newProduct.price) {
      toast.error('Please fill in all required fields (Name, Type, Price)');
      return;
    }
    
    try {
      setAddLoading(true);
      
      // Generate ID based on type and theme (following the pattern from the database)
      let generatedId = '';
      if (newProduct.type && newProduct.theme) {
        generatedId = `${newProduct.type}-${newProduct.theme.toLowerCase()}`;
      } else if (newProduct.type) {
        // If no theme, use a generic pattern
        generatedId = `${newProduct.type}-${newProduct.name?.toLowerCase().replace(/\s+/g, '-')}`;
      } else {
        // Fallback: use name-based ID
        generatedId = newProduct.name?.toLowerCase().replace(/\s+/g, '-') || `product-${Date.now()}`;
      }
      
      // Automatically determine if product is on sale based on prices
      const finalProduct = {
        ...newProduct,
        id: generatedId,
        isonsale: (newProduct.originalprice && newProduct.price) 
          ? newProduct.originalprice > newProduct.price 
          : false
      };

      // Add uploaded media to the product
      if (uploadedMedia.length > 0) {
        const mediaData = uploadedMedia.map(media => {
          if (media.type === 'image') {
            return JSON.stringify({ image: media.url, filename: media.filename });
          } else {
            return JSON.stringify({ video: media.url, filename: media.filename });
          }
        });
        finalProduct.images = mediaData;
      }
      
      await productsApi.createProduct(finalProduct as Product);
      await loadProducts(); // Refresh the list
      handleCloseModals();
      
      // Show success message with media info
      if (uploadedMedia.length > 0) {
        const mediaCount = uploadedMedia.length;
        const mediaTypes = uploadedMedia.map(m => m.type).join(', ');
        toast.success(`Product created successfully!\nMedia added: ${mediaCount} file(s)\nTypes: ${mediaTypes}`);
      } else {
        toast.success('Product created successfully!');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setAddModalOpen(false);
    setSelectedProduct(null);
    setEditingProduct({});
    setNewProduct({});
    setUploadedMedia([]);
  };

  const handleMediaUploaded = (media: UploadedMedia) => {
    setUploadedMedia(prev => [...prev, media]);
  };

  const handleMediaRemoved = async (filename: string) => {
    try {
      // Delete from Supabase storage
      await deleteMedia(filename);
      
      // Remove from uploaded media state
      setUploadedMedia(prev => prev.filter(m => m.filename !== filename));
      
      // Remove from editing product's images array
      setEditingProduct(prev => {
        if (!prev.images) return prev;
        
        const updatedImages = prev.images.filter(mediaString => {
          try {
            const parsed = JSON.parse(mediaString);
            return parsed.filename !== filename;
          } catch {
            // For older media without filename, try to match by URL
            return !mediaString.includes(filename);
          }
        });
        
        return { ...prev, images: updatedImages };
      });
      
      toast.success(`Media file deleted successfully!\nFile: ${filename}`);
    } catch (error) {
      console.error('Failed to delete media:', error);
      toast.error(`Failed to delete media file!\n${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteSavedMedia = async (productId: string, filename: string) => {
    try {
      // Delete from Supabase storage
      await deleteMedia(filename);
      
      // Get current product
      const product = products.find(p => p.id === productId);
      if (!product) {
        toast.error('Product not found');
        return;
      }
      
      // Remove media from product's images array
      const updatedImages = product.images.filter(mediaString => {
        try {
          const parsed = JSON.parse(mediaString);
          return parsed.filename !== filename;
        } catch {
          // For older media without filename, try to match by URL
          return !mediaString.includes(filename);
        }
      });
      
      // Update product in database
      await productsApi.updateProduct(productId, { images: updatedImages });
      
      // Refresh products list
      await loadProducts();
      
      toast.success(`Media file deleted successfully!\nFile: ${filename}`);
    } catch (error) {
      console.error('Failed to delete saved media:', error);
      toast.error(`Failed to delete media file!\n${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };



  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesType = typeFilter === "all" || product.type === typeFilter;
    const matchesTheme = themeFilter === "all" || product.theme === themeFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && product.active) ||
      (statusFilter === "inactive" && !product.active);

    return matchesSearch && matchesType && matchesTheme && matchesStatus;
  });

  const totalRevenue = products.reduce((sum, product) => sum + (product.price || 0), 0);
  const totalProducts = products.length;
  const onSaleProducts = products.filter(product => product.isonsale).length;

  if (loading) {
    return (
      <div className="admin-content flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-content flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Products</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadProducts}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadProducts} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button variant="outline" onClick={handleExportProducts}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Sale</p>
                <p className="text-2xl font-bold">{onSaleProducts}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <Tag className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{typeOptions.length - 1}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Theme</label>
              <select
                value={themeFilter}
                onChange={(e) => setThemeFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {themeOptions.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Product Image/Video */}
              <div className="relative mb-4">
                {(() => {
                  // Handle the complex image/video format from database
                  let imageUrl = '';
                  let videoUrl = '';
                  
                  // First try the direct image field
                  if (typeof product.image === 'string' && product.image.trim()) {
                    imageUrl = product.image;
                  } else if (Array.isArray(product.images) && product.images.length > 0) {
                    // Parse the JSON strings in the images array
                    for (const mediaItem of product.images) {
                      if (typeof mediaItem === 'string') {
                        // Check if it's a direct URL (starts with http/https)
                        if (mediaItem.startsWith('http')) {
                          // Determine if it's a video or image based on file extension
                          const lowerUrl = mediaItem.toLowerCase();
                          if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.avi') || lowerUrl.includes('.webm')) {
                            if (!videoUrl) videoUrl = mediaItem;
                          } else {
                            if (!imageUrl) imageUrl = mediaItem;
                          }
                        } else {
                          // Try to parse as JSON
                          try {
                            const parsed = JSON.parse(mediaItem);
                            if (parsed.image && typeof parsed.image === 'string' && !imageUrl) {
                              imageUrl = parsed.image;
                            }
                            if (parsed.video && typeof parsed.video === 'string' && !videoUrl) {
                              videoUrl = parsed.video;
                            }
                          } catch (error) {
                            // If it's not JSON and not a URL, skip it
                            continue;
                          }
                        }
                      }
                    }
                  }
                  
                  // Prioritize image if available, otherwise show video
                  if (imageUrl) {
                    return (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    );
                  } else if (videoUrl) {
                    return (
                      <video
                        src={videoUrl}
                        className="w-full h-48 object-cover rounded-lg"
                        controls
                        muted
                        loop
                        onError={(e) => {
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    );
                  }
                  return null;
                })()}
                <div className={`w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center ${(() => {
                  // Check if we have any valid images
                  if (typeof product.image === 'string' && product.image.trim()) return 'hidden';
                  if (Array.isArray(product.images) && product.images.length > 0) {
                    for (const imageItem of product.images) {
                      if (typeof imageItem === 'string') {
                        // Check if it's a direct URL
                        if (imageItem.startsWith('http')) {
                          return 'hidden';
                        }
                        // Try to parse as JSON
                        try {
                          const parsed = JSON.parse(imageItem);
                          if (parsed.image && typeof parsed.image === 'string') {
                            return 'hidden';
                          }
                        } catch (error) {
                          // Continue checking other items
                        }
                      }
                    }
                  }
                  return '';
                })()}`}>
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No media available</p>
                  </div>
                </div>
                                 {product.isonsale && (
                   <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                     SALE
                   </span>
                 )}
                <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                  <Star className="w-3 h-3 fill-current" />
                  <span>4.8</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>

                                                 {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
                  {product.isonsale && product.originalprice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(product.originalprice)}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{product.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Theme</p>
                    <p className="font-medium">{product.theme || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-medium capitalize">{product.size || 'Regular'}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {product.tags && product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-muted text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewProduct(product)}
                      title="View Product"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditProduct(product)}
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <div className="relative dropdown-container">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          // Toggle dropdown for this product
                          const dropdownId = `dropdown-${product.id}`;
                          const dropdown = document.getElementById(dropdownId);
                          if (dropdown) {
                            dropdown.classList.toggle('hidden');
                          }
                        }}
                        title="More Options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      {/* Dropdown Menu */}
                      <div 
                        id={`dropdown-${product.id}`}
                        className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 hidden"
                      >
                        <div className="py-1">
                          <button
                            onClick={() => handleCopyProductId(product)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Product ID
                          </button>
                          <button
                            onClick={() => handleProductSettings(product)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </button>
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Product Detail
                          </button>
                          <button
                            onClick={() => handleToggleActive(product)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {product.active ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Deactivate Product
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                Activate Product
                              </>
                            )}
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Product
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      product.active 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                    title={product.active ? 'Click to deactivate' : 'Click to activate'}
                  >
                    {product.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* View Product Modal */}
      {viewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Product Details</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModals}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {(() => {
                  // Handle the complex image/video format from database
                  let imageUrl = '';
                  let videoUrl = '';
                  
                  // First try the direct image field
                  if (typeof selectedProduct.image === 'string' && selectedProduct.image.trim()) {
                    imageUrl = selectedProduct.image;
                  } else if (Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0) {
                    // Parse the JSON strings in the images array
                    for (const mediaItem of selectedProduct.images) {
                      if (typeof mediaItem === 'string') {
                        // Check if it's a direct URL (starts with http/https)
                        if (mediaItem.startsWith('http')) {
                          // Determine if it's a video or image based on file extension
                          const lowerUrl = mediaItem.toLowerCase();
                          if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.avi') || lowerUrl.includes('.webm')) {
                            if (!videoUrl) videoUrl = mediaItem;
                          } else {
                            if (!imageUrl) imageUrl = mediaItem;
                          }
                        } else {
                          // Try to parse as JSON
                          try {
                            const parsed = JSON.parse(mediaItem);
                            if (parsed.image && typeof parsed.image === 'string' && !imageUrl) {
                              imageUrl = parsed.image;
                            }
                            if (parsed.video && typeof parsed.video === 'string' && !videoUrl) {
                              videoUrl = parsed.video;
                            }
                          } catch (error) {
                            // If it's not JSON and not a URL, skip it
                            continue;
                          }
                        }
                      }
                    }
                  }
                  
                  // Prioritize image if available, otherwise show video
                  if (imageUrl) {
                    return (
                      <img 
                        src={imageUrl} 
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    );
                  } else if (videoUrl) {
                    return (
                      <video
                        src={videoUrl}
                        className="w-full h-64 object-cover rounded-lg"
                        controls
                        muted
                        loop
                        onError={(e) => {
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    );
                  } else {
                    return (
                      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No media available</p>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold">{selectedProduct.name}</h3>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {formatCurrency(selectedProduct.price)}
                  </p>
                  {selectedProduct.isonsale && selectedProduct.originalprice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatCurrency(selectedProduct.originalprice)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span className="capitalize">{selectedProduct.type}</span>
                  </div>
                  {selectedProduct.theme && (
                    <div className="flex justify-between">
                      <span className="font-medium">Theme:</span>
                      <span>{selectedProduct.theme}</span>
                    </div>
                  )}
                  {selectedProduct.size && (
                    <div className="flex justify-between">
                      <span className="font-medium">Size:</span>
                      <span className="capitalize">{selectedProduct.size}</span>
                    </div>
                  )}
                                     <div className="flex justify-between">
                     <span className="font-medium">On Sale:</span>
                     <span>{selectedProduct.isonsale ? 'Yes' : 'No'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="font-medium">Favorite:</span>
                     <span>{selectedProduct.isfavorite ? 'Yes' : 'No'}</span>
                   </div>
                </div>

                {selectedProduct.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedProduct.description}</p>
                  </div>
                )}

                {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div>
                    <h4 className="font-medium mb-2">Additional Media</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProduct.images.slice(1).map((mediaItem, index) => {
                        let imageUrl = '';
                        let videoUrl = '';
                        if (typeof mediaItem === 'string') {
                          // Check if it's a direct URL
                          if (mediaItem.startsWith('http')) {
                            const lowerUrl = mediaItem.toLowerCase();
                            if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.avi') || lowerUrl.includes('.webm')) {
                              videoUrl = mediaItem;
                            } else {
                              imageUrl = mediaItem;
                            }
                          } else {
                            // Try to parse as JSON
                            try {
                              const parsed = JSON.parse(mediaItem);
                              if (parsed.image && typeof parsed.image === 'string') {
                                imageUrl = parsed.image;
                              }
                              if (parsed.video && typeof parsed.video === 'string') {
                                videoUrl = parsed.video;
                              }
                            } catch (error) {
                              // Skip invalid items
                            }
                          }
                        }
                        
                        if (videoUrl) {
                          return (
                            <video
                              key={index}
                              src={videoUrl}
                              className="w-full h-20 object-cover rounded"
                              muted
                              loop
                            >
                              <source src={videoUrl} type="video/mp4" />
                            </video>
                          );
                        } else if (imageUrl) {
                          return (
                            <img
                              key={index}
                              src={imageUrl}
                              alt={`${selectedProduct.name} ${index + 2}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          );
                        } else {
                          return (
                            <div
                              key={index}
                              className="w-full h-20 bg-gray-100 rounded flex items-center justify-center"
                            >
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
          <div 
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModals}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={editingProduct.type || ''} 
                    onValueChange={(value) => setEditingProduct({...editingProduct, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jar">Jar</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bouquet">Bouquet</SelectItem>
                      <SelectItem value="flower_stem">Flower Stem</SelectItem>
                      <SelectItem value="package">Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={editingProduct.theme || ''} 
                    onValueChange={(value) => setEditingProduct({...editingProduct, theme: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Romantic">Romantic</SelectItem>
                      <SelectItem value="Birthday">Birthday</SelectItem>
                      <SelectItem value="Anniversary">Anniversary</SelectItem>
                      <SelectItem value="Apology">Apology</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">Size</Label>
                  <Select 
                    value={editingProduct.size || ''} 
                    onValueChange={(value) => setEditingProduct({...editingProduct, size: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="mega">Mega</SelectItem>
                      <SelectItem value="super">Super</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="originalprice">Original Price</Label>
                  <Input
                    id="originalprice"
                    type="number"
                    step="0.01"
                    value={editingProduct.originalprice || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, originalprice: parseFloat(e.target.value)})}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    If original price is higher than current price, product will automatically be marked as "On Sale"
                  </p>
                  {editingProduct.originalprice && editingProduct.price && editingProduct.originalprice > editingProduct.price && (
                    <div className="flex items-center mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-green-700 font-medium">This product will be marked as "On Sale"</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Product Media</Label>
                  <MediaUpload
                    onMediaUploaded={handleMediaUploaded}
                    onMediaRemoved={handleMediaRemoved}
                    onDeleteSavedMedia={handleDeleteSavedMedia}
                    existingMedia={[
                      ...(editingProduct.images || selectedProduct?.images || []),
                      ...uploadedMedia.map(media => {
                        if (media.type === 'image') {
                          return JSON.stringify({ image: media.url, filename: media.filename });
                        } else {
                          return JSON.stringify({ video: media.url, filename: media.filename });
                        }
                      })
                    ]}
                    productId={selectedProduct?.id}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload images or videos for this product. Images will be prioritized over videos in display.
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={editingProduct.tags?.join(', ') || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    placeholder="romantic, gift, jar"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isfavorite"
                    checked={editingProduct.isfavorite || false}
                    onCheckedChange={(checked) => setEditingProduct({...editingProduct, isfavorite: checked as boolean})}
                  />
                  <Label htmlFor="isfavorite">Favorite</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={editingProduct.active !== false} // Default to true if undefined
                    onCheckedChange={(checked) => setEditingProduct({...editingProduct, active: checked as boolean})}
                  />
                  <Label htmlFor="active">Active (Visible on website)</Label>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleSaveProduct} 
                    disabled={editLoading}
                    className="w-full"
                  >
                    {editLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
          <div 
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModals}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-name">Product Name *</Label>
                  <Input
                    id="new-name"
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <Label htmlFor="new-type">Type *</Label>
                  <Select 
                    value={newProduct.type || ''} 
                    onValueChange={(value) => setNewProduct({...newProduct, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jar">Jar</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bouquet">Bouquet</SelectItem>
                      <SelectItem value="flower_stem">Flower Stem</SelectItem>
                      <SelectItem value="package">Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="new-theme">Theme</Label>
                  <Select 
                    value={newProduct.theme || ''} 
                    onValueChange={(value) => setNewProduct({...newProduct, theme: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Romantic">Romantic</SelectItem>
                      <SelectItem value="Birthday">Birthday</SelectItem>
                      <SelectItem value="Anniversary">Anniversary</SelectItem>
                      <SelectItem value="Apology">Apology</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="new-size">Size</Label>
                  <Select 
                    value={newProduct.size || ''} 
                    onValueChange={(value) => setNewProduct({...newProduct, size: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="mega">Mega</SelectItem>
                      <SelectItem value="super">Super</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="new-price">Price *</Label>
                  <Input
                    id="new-price"
                    type="number"
                    step="0.01"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="new-originalprice">Original Price</Label>
                  <Input
                    id="new-originalprice"
                    type="number"
                    step="0.01"
                    value={newProduct.originalprice || ''}
                    onChange={(e) => setNewProduct({...newProduct, originalprice: parseFloat(e.target.value)})}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    If original price is higher than current price, product will automatically be marked as "On Sale"
                  </p>
                  {newProduct.originalprice && newProduct.price && newProduct.originalprice > newProduct.price && (
                    <div className="flex items-center mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-green-700 font-medium">This product will be marked as "On Sale"</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Product Media</Label>
                  <MediaUpload
                    onMediaUploaded={handleMediaUploaded}
                    onMediaRemoved={handleMediaRemoved}
                    existingMedia={uploadedMedia.map(media => {
                      if (media.type === 'image') {
                        return JSON.stringify({ image: media.url, filename: media.filename });
                      } else {
                        return JSON.stringify({ video: media.url, filename: media.filename });
                      }
                    })}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload images or videos for this product. Images will be prioritized over videos in display.
                  </p>
                </div>

                <div>
                  <Label htmlFor="new-description">Description</Label>
                  <Textarea
                    id="new-description"
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="new-tags">Tags (comma-separated)</Label>
                  <Input
                    id="new-tags"
                    value={newProduct.tags?.join(', ') || ''}
                    onChange={(e) => setNewProduct({
                      ...newProduct, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    placeholder="romantic, gift, jar"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new-isfavorite"
                    checked={newProduct.isfavorite || false}
                    onCheckedChange={(checked) => setNewProduct({...newProduct, isfavorite: checked as boolean})}
                  />
                  <Label htmlFor="new-isfavorite">Favorite</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new-active"
                    checked={newProduct.active !== false} // Default to true
                    onCheckedChange={(checked) => setNewProduct({...newProduct, active: checked as boolean})}
                  />
                  <Label htmlFor="new-active">Active (Visible on website)</Label>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleAddProduct} 
                    disabled={addLoading}
                    className="w-full"
                  >
                    {addLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Product
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 