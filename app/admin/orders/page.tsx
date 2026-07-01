'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  XCircle, 
  Eye, 
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Receipt,
  Info,
  DollarSign
} from 'lucide-react';
import { displayNaira } from '@/lib/currency';
import { supabase } from '@/lib/supabase/client';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'completed' | 'failed';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: number;
  subtotal?: number;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderItems?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    image?: string;
  }>;
}

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const loadOrders = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    const response = await fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error || 'Failed to fetch orders');
      return;
    }

    setOrders((result.orders || []).map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Customer',
      email: order.shippingAddress?.email || '',
      phone: order.shippingAddress?.phone || order.user?.phone || 'N/A',
      date: new Date(order.createdAt).toLocaleDateString(),
      total: order.total,
      subtotal: order.subtotal,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items?.length || 0,
      shippingAddress: order.shippingAddress,
      orderItems: order.items,
    })));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrder = async (id: string, updates: { status?: OrderStatus; paymentStatus?: PaymentStatus }) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    const response = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      await loadOrders();
      // Update selected order if modal is open
      if (selectedOrder?.id === id) {
        const updatedOrder = orders.find(o => o.id === id);
        if (updatedOrder) {
          setSelectedOrder({
            ...updatedOrder,
            orderItems: selectedOrder.orderItems,
            shippingAddress: selectedOrder.shippingAddress,
          });
        }
      }
    }
  };

  const viewOrderDetails = async (order: Order) => {
    setLoadingDetails(true);
    setIsModalOpen(true);
    
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      
      const response = await fetch(`/api/orders/${order.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const result = await response.json();
      
      if (response.ok) {
        setSelectedOrder({
          ...order,
          shippingAddress: result.order.shippingAddress,
          orderItems: result.order.items || [],
          subtotal: result.order.subtotal,
        });
      } else {
        setSelectedOrder(order);
      }
    } catch (error) {
      setSelectedOrder(order);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed': return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Manage Orders</h1>
        <p className="text-gray-500">View payments, approve orders, and update delivery status</p>
        <div className="mt-3 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md">
          <Info className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <p className="text-xs text-yellow-800">
            <span className="font-semibold">Note:</span> Delivery fees are paid in cash upon arrival. 
            Not included in online payments.
          </p>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
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
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">{order.orderNumber}</div>
                    <div className="text-xs text-gray-400">{order.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-800">{order.customer}</div>
                    <div className="text-xs text-gray-400">{order.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-800">{displayNaira(order.total)}</div>
                    <div className="text-xs text-yellow-600 flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>+ delivery on arrival</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => updateOrder(order.id, { paymentStatus: e.target.value as PaymentStatus })}
                      className={`text-sm border rounded-lg px-2 py-1 outline-none ${getPaymentStatusColor(order.paymentStatus)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Approved</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrder(order.id, { status: e.target.value as OrderStatus })}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={closeModal}
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {loadingDetails ? (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading order details...</p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Receipt className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order Details
                        </h3>
                        <span className="text-sm text-gray-500 font-mono">
                          {selectedOrder.orderNumber}
                        </span>
                      </div>
                      <button
                        onClick={closeModal}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
                      {/* Status Bar */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className={`rounded-lg border p-4 ${getStatusColor(selectedOrder.status)}`}>
                          <div className="flex items-center gap-3">
                            {getStatusIcon(selectedOrder.status)}
                            <div>
                              <div className="font-semibold">
                                Order Status: {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`rounded-lg border p-4 ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          <div className="flex items-center gap-3">
                            <DollarSign className="w-5 h-5" />
                            <div>
                              <div className="font-semibold">
                                Payment Status: {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Customer Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <User className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span className="font-medium">{selectedOrder.customer}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                              <a href={`mailto:${selectedOrder.email}`} className="text-blue-600 hover:underline">
                                {selectedOrder.email}
                              </a>
                            </div>
                            <div className="flex items-start gap-2">
                              <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                              <a href={`tel:${selectedOrder.phone}`} className="text-blue-600 hover:underline font-medium">
                                {selectedOrder.phone}
                              </a>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span>Order Date: {selectedOrder.date}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Package className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span>{selectedOrder.items} item(s)</span>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Shipping Address
                          </h4>
                          {selectedOrder.shippingAddress ? (
                            <div className="space-y-1 text-sm">
                              <p className="font-medium">
                                {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                              </p>
                              <p>{selectedOrder.shippingAddress.street}</p>
                              <p>
                                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                              </p>
                              <p>{selectedOrder.shippingAddress.country}</p>
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="flex items-start gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <a href={`tel:${selectedOrder.shippingAddress.phone}`} className="text-blue-600 hover:underline">
                                    {selectedOrder.shippingAddress.phone}
                                  </a>
                                </div>
                                <div className="flex items-start gap-2 text-sm mt-1">
                                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <a href={`mailto:${selectedOrder.shippingAddress.email}`} className="text-blue-600 hover:underline">
                                    {selectedOrder.shippingAddress.email}
                                  </a>
                                </div>
                              </div>
                              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <Truck className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-xs text-yellow-800">
                                    <span className="font-semibold">Delivery Fee:</span> Paid in cash upon arrival. 
                                    Not included in online payment.
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500">No shipping address available</p>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Order Items ({selectedOrder.items})
                        </h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Item</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Qty</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Price</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {selectedOrder.orderItems?.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm">
                                    <div className="font-medium">{item.name}</div>
                                    {item.size && <div className="text-xs text-gray-500">Size: {item.size}</div>}
                                    {item.color && <div className="text-xs text-gray-500">Color: {item.color}</div>}
                                  </td>
                                  <td className="px-4 py-3 text-sm">{item.quantity}</td>
                                  <td className="px-4 py-3 text-sm">{displayNaira(item.price)}</td>
                                  <td className="px-4 py-3 text-sm text-right font-semibold">
                                    {displayNaira(item.price * item.quantity)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-100 border-t border-gray-200">
                              <tr>
                                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-right">
                                  Subtotal:
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold text-right">
                                  {displayNaira(selectedOrder.subtotal || 0)}
                                </td>
                              </tr>
                              <tr className="bg-gray-200">
                                <td colSpan={3} className="px-4 py-3 text-base font-bold text-right">
                                  Total Paid Online:
                                </td>
                                <td className="px-4 py-3 text-base font-bold text-right text-green-600">
                                  {displayNaira(selectedOrder.total)}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={4} className="px-4 py-2 text-xs text-yellow-600 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Truck className="w-3 h-3" />
                                    <span>+ Delivery fee paid in cash upon arrival</span>
                                  </div>
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      {/* Update Status Section */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-3">Update Order Status</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Payment Status
                            </label>
                            <select
                              value={selectedOrder.paymentStatus}
                              onChange={(e) => {
                                updateOrder(selectedOrder.id, { 
                                  paymentStatus: e.target.value as PaymentStatus 
                                });
                                setSelectedOrder({
                                  ...selectedOrder,
                                  paymentStatus: e.target.value as PaymentStatus
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            >
                              <option value="pending">Pending</option>
                              <option value="completed">Approved</option>
                              <option value="failed">Failed</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Order Status
                            </label>
                            <select
                              value={selectedOrder.status}
                              onChange={(e) => {
                                updateOrder(selectedOrder.id, { 
                                  status: e.target.value as OrderStatus 
                                });
                                setSelectedOrder({
                                  ...selectedOrder,
                                  status: e.target.value as OrderStatus
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}