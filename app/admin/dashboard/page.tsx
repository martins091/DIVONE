// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0
  });

  useEffect(() => {
    // Load products from localStorage
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Demo products
      const demoProducts = [
        { id: 1, name: 'Silk Evening Gown', price: 299, category: 'Dresses', stock: 15 },
        { id: 2, name: 'Cashmere Sweater', price: 189, category: 'Sweaters', stock: 8 },
        { id: 3, name: 'Leather Handbag', price: 459, category: 'Accessories', stock: 5 },
      ];
      setProducts(demoProducts);
      localStorage.setItem('products', JSON.stringify(demoProducts));
    }

    // Load stats
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      revenue: orders.reduce((sum: number, order: any) => sum + order.total, 0)
    });
  }, [products.length]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  const statsCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-green-500' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-purple-500' },
    { title: 'Revenue', value: `$${stats.revenue}`, icon: TrendingUp, color: 'bg-accent' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/products/new">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-accent to-accent/80 rounded-xl p-6 text-white cursor-pointer"
            >
              <Plus className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold">Add New Product</h3>
              <p className="text-sm opacity-90">Create a new product listing</p>
            </motion.div>
          </Link>
          
          <Link href="/admin/orders">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer"
            >
              <ShoppingBag className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold">Manage Orders</h3>
              <p className="text-sm opacity-90">View and update order status</p>
            </motion.div>
          </Link>
          
          <Link href="/admin/users">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer"
            >
              <Users className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold">Manage Users</h3>
              <p className="text-sm opacity-90">View registered customers</p>
            </motion.div>
          </Link>
        </div>

        {/* Recent Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Recent Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${product.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
