'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    originalPrice: '',
    sizes: '',
    colors: '',
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load product');
        }

        const product = data.product;
        setFormData({
          name: product.name || '',
          price: product.price?.toString() || '',
          category: product.category || '',
          stock: product.stock?.toString() || '',
          description: product.description || '',
          originalPrice: product.originalPrice?.toString() || '',
          sizes: (product.sizes || []).join(', '),
          colors: (product.colors || []).join(', '),
        });
        setExistingImages(product.images || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load product');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const removeNewImage = (index: number) => {
    setImageFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setImagePreviews((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const uploadImages = async () => {
    const urls: string[] = [];

    for (const file of imageFiles) {
      const extension = file.name.split('.').pop();
      const safeName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const path = `products/${crypto.randomUUID()}-${safeName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Please sign in again before updating a product.');
      }

      const uploadedImages = await uploadImages();
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          category: formData.category,
          stock: parseInt(formData.stock, 10),
          description: formData.description,
          images: [...existingImages, ...uploadedImages],
          sizes: formData.sizes.split(',').map((item) => item.trim()).filter(Boolean),
          colors: formData.colors.split(',').map((item) => item.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="min-h-screen bg-gray-50 p-6 text-gray-500">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h1 className="text-2xl font-serif font-bold text-gray-800 mb-6">Edit Product</h1>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
                <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₦)</label>
                <input type="number" step="0.01" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none">
                  <option value="">Select category</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Sweaters">Sweaters</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Evening Wear">Evening Wear</option>
                  <option value="Casual Chic">Casual Chic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input type="number" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
              <input type="text" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} placeholder="XS, S, M, L, XL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
              <input type="text" value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} placeholder="Black, Ivory, Navy" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
              <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center hover:border-accent hover:bg-accent/5">
                <Upload className="mb-3 h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Upload more product images</span>
                <span className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP or GIF up to 5MB each</span>
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={handleImageChange} className="hidden" />
              </label>

              {(existingImages.length > 0 || imagePreviews.length > 0) && (
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {existingImages.map((image, index) => (
                    <div key={image} className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                      <img src={image} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(index)} className="absolute right-2 top-2 rounded-full bg-white p-1 text-red-600 shadow" aria-label="Remove image">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.map((preview, index) => (
                    <div key={preview} className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                      <img src={preview} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeNewImage(index)} className="absolute right-2 top-2 rounded-full bg-white p-1 text-red-600 shadow" aria-label="Remove image">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition disabled:opacity-50">
              <Save className="w-5 h-5" />
              {loading ? 'Updating Product...' : 'Update Product'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
