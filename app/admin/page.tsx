'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Package, ShoppingCart, DollarSign, Plus, Edit2, Trash2 } from 'lucide-react';
import { displayNaira } from '@/lib/currency';

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  sales: number;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
  date: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'payments'>('dashboard');
  const [products, setProducts] = useState<AdminProduct[]>([
    {
      id: '1',
      name: 'Silk Evening Gown',
      price: 450,
      stock: 12,
      category: 'Evening Wear',
      sales: 45,
    },
    {
      id: '2',
      name: 'Classic Wool Blazer',
      price: 320,
      stock: 8,
      category: 'Casual Chic',
      sales: 32,
    },
    {
      id: '3',
      name: 'Leather Structured Bag',
      price: 380,
      stock: 5,
      category: 'Accessories',
      sales: 28,
    },
  ]);

  const [orders, setOrders] = useState<AdminOrder[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'Sarah Johnson',
      total: 891,
      status: 'delivered',
      date: 'Dec 15, 2024',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'Emma Wilson',
      total: 450,
      status: 'shipped',
      date: 'Dec 14, 2024',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customer: 'Jessica Lee',
      total: 620,
      status: 'pending',
      date: 'Dec 13, 2024',
    },
  ]);

  const stats = [
    { label: 'Total Revenue', value: displayNaira(45230000), icon: DollarSign, color: 'bg-accent' },
    { label: 'Total Orders', value: '342', icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Products', value: '24', icon: Package, color: 'bg-green-500' },
    { label: 'Avg Order Value', value: displayNaira(132170), icon: BarChart3, color: 'bg-purple-500' },
  ];

  const [paymentConfirmations] = useState([
    {
      id: '1',
      orderId: 'ORD-2024-ABC123',
      customerName: 'Sarah Johnson',
      amount: 125000,
      transactionRef: 'TRF-001234567',
      status: 'pending',
      date: 'Dec 20, 2024',
    },
    {
      id: '2',
      orderId: 'ORD-2024-DEF456',
      customerName: 'Emma Wilson',
      amount: 85000,
      transactionRef: 'TRF-001234568',
      status: 'verified',
      date: 'Dec 19, 2024',
    },
  ]);

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);

  return (
    <div className="pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <p className="text-foreground/60">Manage your DIVONE store</p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
          {['dashboard', 'products', 'orders', 'payments'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              {tab === 'payments' ? 'Payment Confirmations' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-white rounded-lg p-6 border border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-foreground/60 text-sm font-medium mb-2">{stat.label}</p>
                        <p className="font-serif text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg text-white`}>
                        <Icon size={24} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Revenue Chart */}
            <motion.div
              className="bg-white rounded-lg p-8 border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Top Selling Products</h2>
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground mb-1">{product.name}</p>
                      <p className="text-sm text-foreground/60">{product.sales} sales</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${(product.sales / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                    <p className="font-bold text-foreground">{displayNaira(product.price * product.sales)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground">Products</h2>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-medium rounded hover:bg-accent/90 transition-colors">
                <Plus size={20} />
                Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Product</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Category</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Price</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Stock</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Sales</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <motion.tr
                      key={product.id}
                      className="border-b border-border hover:bg-secondary/30 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4 text-foreground font-medium">{product.name}</td>
                      <td className="px-6 py-4 text-foreground/60">{product.category}</td>
                      <td className="px-6 py-4 text-foreground font-bold">{displayNaira(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          product.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground">{product.sales}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Recent Orders</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Order ID</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Customer</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Total</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Status</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Date</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <motion.tr
                      key={order.id}
                      className="border-b border-border hover:bg-secondary/30 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4 text-foreground font-medium">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-foreground">{order.customer}</td>
                      <td className="px-6 py-4 text-foreground font-bold">{displayNaira(order.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground/60">{order.date}</td>
                      <td className="px-6 py-4">
                        <button className="text-accent hover:text-accent/80 font-medium text-sm">
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Payment Confirmations Tab */}
        {activeTab === 'payments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Payment Confirmations</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Order ID</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Customer</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Amount</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Transaction Ref</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Status</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Date</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentConfirmations.map(payment => (
                    <motion.tr
                      key={payment.id}
                      className="border-b border-border hover:bg-secondary/30 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4 text-foreground font-medium">{payment.orderId}</td>
                      <td className="px-6 py-4 text-foreground">{payment.customerName}</td>
                      <td className="px-6 py-4 text-foreground font-bold">{displayNaira(payment.amount)}</td>
                      <td className="px-6 py-4 text-foreground font-mono text-sm">{payment.transactionRef}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          payment.status === 'verified'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground/60">{payment.date}</td>
                      <td className="px-6 py-4">
                        <button className="text-accent hover:text-accent/80 font-medium text-sm">
                          {payment.status === 'pending' ? 'Verify' : 'View'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
