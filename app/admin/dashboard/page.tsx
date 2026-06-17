'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, TrendingUp, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';
import { displayNaira } from '@/lib/currency';
import { supabase } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (response.ok) {
        setStats(result);
      }
    };

    loadStats();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const statsCards = [
    { title: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-green-500' },
    { title: 'Total Users', value: stats.users, icon: Users, color: 'bg-purple-500' },
    { title: 'Revenue', value: displayNaira(stats.revenue), icon: TrendingUp, color: 'bg-accent' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Live store overview</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/products/new">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-accent to-accent/80 rounded-xl p-6 text-white cursor-pointer">
              <Plus className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold">Add New Product</h3>
              <p className="text-sm opacity-90">Create a new product listing</p>
            </motion.div>
          </Link>
          <Link href="/admin/orders">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer">
              <ShoppingBag className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold">Manage Orders</h3>
              <p className="text-sm opacity-90">Approve payments and track status</p>
            </motion.div>
          </Link>
          <Link href="/admin/users">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer">
              <Users className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold">Manage Users</h3>
              <p className="text-sm opacity-90">View customer accounts</p>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
