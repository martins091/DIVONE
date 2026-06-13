// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export default function AdminLanding() {
  const [stats, setStats] = useState({
    products: 0,
    pendingOrders: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    // Load stats from localStorage or API
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    setStats({
      products: products.length,
      pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
      users: users.length,
      revenue: orders.reduce((sum: number, o: any) => sum + o.total, 0)
    });
  }, []);

  const adminSections = [
    {
      title: 'Products',
      description: 'Manage your product catalog',
      icon: Package,
      href: '/admin/products',
      color: 'bg-blue-500',
    },
    {
      title: 'Orders',
      description: 'View and update orders',
      icon: ShoppingBag,
      href: '/admin/orders',
      color: 'bg-green-500',
    },
    {
      title: 'Users',
      description: 'Manage customer accounts',
      icon: Users,
      href: '/admin/users',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome to your store management center</p>
      </div>

      {/* Quick Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.products}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500 text-sm">Pending Orders</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.users}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500 text-sm">Revenue</p>
          <p className="text-2xl font-bold text-accent mt-1">${stats.revenue}</p>
        </div>
      </div>

      {/* Quick Access Grid */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={section.href}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer group">
                <div className={`${section.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{section.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{section.description}</p>
                <div className="flex items-center text-accent text-sm font-medium group-hover:gap-2 transition-all gap-1">
                  Manage <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-center py-8">
            Recent orders and activities will appear here
          </p>
        </div>
      </div>
    </div>
  );
}