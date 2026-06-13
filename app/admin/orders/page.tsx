// app/admin/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Order {
  id: number;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
}

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('orders');
    if (stored) {
      setOrders(JSON.parse(stored));
    } else {
      // Demo orders
      const demoOrders: Order[] = [
        { id: 1001, customer: 'Sarah Johnson', date: '2026-06-10', total: 299, status: 'delivered', items: 2 },
        { id: 1002, customer: 'Emily Davis', date: '2026-06-11', total: 459, status: 'shipped', items: 1 },
        { id: 1003, customer: 'Jessica Brown', date: '2026-06-12', total: 189, status: 'processing', items: 3 },
        { id: 1004, customer: 'Ashley Wilson', date: '2026-06-13', total: 748, status: 'pending', items: 4 },
      ];
      setOrders(demoOrders);
      localStorage.setItem('orders', JSON.stringify(demoOrders));
    }
  }, []);

  const updateStatus = (id: number, newStatus: Order['status']) => {
    const updated = orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Manage Orders</h1>
        <p className="text-gray-500">View and update customer orders</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">${order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
