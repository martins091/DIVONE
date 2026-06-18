// app/admin/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, Tag, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { displayNaira } from '@/lib/currency';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  image?: string;
  isSold?: boolean;
  status?: 'available' | 'sold' | 'out_of_stock';
}

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch products');
        }

        setProducts(data.products || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Please sign in again before deleting products.');
      }

      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const handleMarkAsSold = async (id: string) => {
    if (!confirm('Mark this product as sold? This will set stock to 0.')) return;

    setProcessingId(id);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Please sign in again.');
      }

      // Use the existing PUT endpoint
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          isSold: true, 
          status: 'sold', 
          stock: 0 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark product as sold');
      }

      // Update the product in the local state
      setProducts(products.map(p => 
        p.id === id 
          ? { ...p, isSold: true, status: 'sold', stock: 0 }
          : p
      ));

      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to mark product as sold');
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAsAvailable = async (id: string) => {
    if (!confirm('Mark this product as available again?')) return;

    setProcessingId(id);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Please sign in again.');
      }

      // Use the existing PUT endpoint
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          isSold: false, 
          status: 'available' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark product as available');
      }

      // Update the product in the local state
      setProducts(products.map(p => 
        p.id === id 
          ? { ...p, isSold: false, status: 'available' }
          : p
      ));

      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to mark product as available');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-800">Manage Products</h1>
            <p className="text-gray-500">Add, edit, or remove products from your store</p>
          </div>
          <Link href="/admin/products/new">
            <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition">
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500">
            Loading products...
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => {
            const isSold = product.isSold || product.status === 'sold' || product.stock === 0;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition ${
                  isSold ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
                }`}
              >
                <div className="relative h-44 bg-gray-100">
                  {product.image ? (
                    product.image.startsWith('http') ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full" style={{ background: product.image }} />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
                  )}
                  
                  {/* Sold Badge */}
                  {isSold && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        <XCircle className="w-3 h-3" />
                        SOLD
                      </span>
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  {isSold && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-red-600/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xl transform -rotate-12">
                        SOLD OUT
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold text-lg ${isSold ? 'text-gray-500' : 'text-gray-800'}`}>
                      {product.name}
                    </h3>
                    {isSold ? (
                      <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                        Unavailable
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Available
                      </span>
                    )}
                  </div>
                  
                  <p className="text-2xl font-bold text-accent mb-2">{displayNaira(product.price)}</p>
                  <p className="text-sm text-gray-500 mb-1">Category: {product.category}</p>
                  <p className={`text-sm mb-4 ${isSold ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                    Stock: {product.stock} units {isSold && '(Sold Out)'}
                  </p>
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>
                    
                    {isSold ? (
                      <button
                        onClick={() => handleMarkAsAvailable(product.id)}
                        disabled={processingId === product.id}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {processingId === product.id ? 'Updating...' : 'Mark Available'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkAsSold(product.id)}
                        disabled={processingId === product.id}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-orange-50 text-orange-600 rounded hover:bg-orange-100 transition disabled:opacity-50"
                      >
                        <Tag className="w-4 h-4" />
                        {processingId === product.id ? 'Updating...' : 'Mark Sold'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found. Add your first product!</p>
          </div>
        )}
      </div>
    </div>
  );
}