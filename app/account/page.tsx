'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogOut, Package, User, Settings } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  items: number;
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-ABC123',
      date: 'Dec 15, 2024',
      total: 891,
      status: 'delivered',
      items: 2,
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-DEF456',
      date: 'Dec 10, 2024',
      total: 450,
      status: 'shipped',
      items: 1,
    },
  ]);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'settings'>('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Mock user data
    setUser({
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Fashion Street, NY 10001',
    });
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-background min-h-screen flex items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h1 className="font-serif text-5xl font-bold text-foreground">My Account</h1>
            <p className="text-foreground/60 mt-2">Welcome back, {user.name}!</p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all rounded font-medium"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-lg p-6 border border-border space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all ${
                  activeTab === 'orders'
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-secondary text-foreground'
                }`}
              >
                <Package size={20} />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all ${
                  activeTab === 'profile'
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-secondary text-foreground'
                }`}
              >
                <User size={20} />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all ${
                  activeTab === 'settings'
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-secondary text-foreground'
                }`}
              >
                <Settings size={20} />
                Settings
              </button>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">Order History</h2>

                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        className="bg-white rounded-lg p-6 border border-border"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-foreground">{order.orderNumber}</h3>
                            <p className="text-sm text-foreground/60">{order.date}</p>
                          </div>
                          <span className={`px-4 py-2 rounded font-medium text-sm ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-foreground/60 text-sm">{order.items} items</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground text-lg">${order.total}</p>
                          </div>
                        </div>

                        <button className="mt-4 text-accent hover:text-accent/80 text-sm font-medium">
                          View Details →
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground/60">No orders yet. Start shopping!</p>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Personal Information</h2>

                <div className="bg-white rounded-lg p-8 border border-border space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground/60 mb-2">Name</label>
                      <p className="text-lg font-semibold text-foreground">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/60 mb-2">Email</label>
                      <p className="text-lg font-semibold text-foreground">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/60 mb-2">Phone</label>
                      <p className="text-lg font-semibold text-foreground">{user.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/60 mb-2">Address</label>
                      <p className="text-lg font-semibold text-foreground">{user.address}</p>
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-accent text-accent-foreground font-medium rounded hover:bg-accent/90 transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Account Settings</h2>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Email Preferences</h3>
                    <p className="text-foreground/60 text-sm mb-4">Choose what emails you&apos;d like to receive</p>
                    <label className="flex items-center gap-3 mb-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-foreground">Order updates</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-foreground">Promotional emails</span>
                    </label>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Danger Zone</h3>
                    <button className="px-6 py-3 bg-red-50 text-red-600 font-medium rounded hover:bg-red-100 transition-colors border border-red-200">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
