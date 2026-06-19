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
  isSold?: boolean;  // Changed from is_sold to isSold to match user page
  status?: 'available' | 'sold' | 'out_of_stock';
}

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      // Map the data to ensure consistent field names
      const mappedProducts = data.products?.map((p: any) => ({
        ...p,
        // Ensure both field names are available
        isSold: p.isSold || p.is_sold || false,
        status: p.status || (p.isSold || p.is_sold ? 'sold' : 'available'),
      }));

      setProducts(mappedProducts || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

      await fetchProducts();
      setSuccessMessage('Product deleted successfully');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const handleMarkAsSold = async (id: string) => {
    if (!confirm('Mark this product as sold? This will set stock to 0.')) return;

    setProcessingId(id);
    setError('');
    setSuccessMessage('');
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Please sign in again.');
      }

      // Use camelCase to match the user page
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          isSold: true,      // Camel case
          status: 'sold', 
          stock: 0 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark product as sold');
      }

      await fetchProducts();
      setSuccessMessage('Product marked as sold successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to mark product as sold');
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAsAvailable = async (id: string) => {
    if (!confirm('Mark this product as available again?')) return;

    setProcessingId(id);
    setError('');
    setSuccessMessage('');
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Please sign in again.');
      }

      // Use camelCase to match the user page
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          isSold: false,     // Camel case
          status: 'available',
          stock: 1
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark product as available');
      }

      await fetchProducts();
      setSuccessMessage('Product marked as available successfully!');
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
          <div className="flex gap-3">
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <Link href="/admin/products/new">
              <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition">
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
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
            // Check using the correct field name (isSold)
            const isSold = product.isSold === true || 
                          product.status === 'sold' || 
                          product.stock === 0;
            
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