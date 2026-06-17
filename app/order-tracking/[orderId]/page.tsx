// app/order-tracking/[orderId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  Home, 
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { displayNaira } from '@/lib/currency';

interface OrderStatus {
  status: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const ORDER_STATUSES: Record<string, OrderStatus> = {
  pending: {
    status: 'pending',
    label: 'Payment Pending Verification',
    description: 'Your payment is being verified by our team. We\'ll notify you once confirmed.',
    icon: <Clock className="w-6 h-6" />,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  },
  confirmed: {
    status: 'confirmed',
    label: 'Payment Confirmed',
    description: 'Your payment has been verified. Your order is being prepared.',
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  processing: {
    status: 'processing',
    label: 'Processing Order',
    description: 'Your order is being packed and prepared for shipping.',
    icon: <Package className="w-6 h-6" />,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
  shipped: {
    status: 'shipped',
    label: 'Order Shipped',
    description: 'Your order has been shipped and is on its way to you.',
    icon: <Truck className="w-6 h-6" />,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  delivered: {
    status: 'delivered',
    label: 'Order Delivered',
    description: 'Your order has been delivered. Enjoy your purchase!',
    icon: <Home className="w-6 h-6" />,
    color: 'text-green-600 bg-green-50 border-green-200',
  },
};

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const initialStatus = searchParams.get('status') || 'pending';
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStatus, setCurrentStatus] = useState(initialStatus);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();

        if (response.ok) {
          setOrder(result.order);
          setCurrentStatus(result.order.status || initialStatus);
        } else {
          setError('Failed to load order details');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, initialStatus, router]);

  const statusInfo = ORDER_STATUSES[currentStatus] || ORDER_STATUSES.pending;

  // Get status color for timeline
  const getStatusColor = (statusKey: string) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      processing: 'bg-indigo-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
    };
    return colors[statusKey as keyof typeof colors] || 'bg-gray-300';
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="pt-32 pb-20 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Order Not Found</h1>
          <p className="text-foreground/60 mb-8">{error || 'We couldn\'t find your order.'}</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-4 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-foreground mb-4">
            Order Tracking
          </h1>
          <p className="text-lg text-foreground/70">
            Track your order status in real-time
          </p>
        </motion.div>

        {/* Order Status Card */}
        <motion.div
          className={`rounded-lg border p-8 mb-8 ${statusInfo.color}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/50 rounded-full">
              {statusInfo.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {statusInfo.label}
              </h2>
              <p className="text-foreground/70">
                {statusInfo.description}
              </p>
              {currentStatus === 'pending' && (
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>You'll receive email updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Verification within 24 hours</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Order Info */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/60">Order ID:</span>
                <span className="font-mono font-semibold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Total:</span>
                <span className="font-bold">{displayNaira(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Payment:</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <div className="flex items-center gap-2 mt-2">
                <Phone className="w-4 h-4 text-foreground/60" />
                <span className="text-foreground/60">{order.shippingAddress?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-foreground/60" />
                <span className="text-foreground/60">{order.shippingAddress?.email}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Timeline */}
        <motion.div
          className="bg-card rounded-lg border border-border p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Order Timeline
          </h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Status steps */}
            {Object.entries(ORDER_STATUSES).map(([key, status], index) => {
              const isCompleted = Object.keys(ORDER_STATUSES).indexOf(currentStatus) >= index;
              const isActive = key === currentStatus;
              
              return (
                <div key={key} className="relative flex items-start gap-6 mb-8 last:mb-0">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? getStatusColor(key) : 'bg-gray-200'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                    )}
                  </div>

                  {/* Status content */}
                  <div className={`flex-1 pt-0.5 ${isActive ? '' : 'opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      <h4 className={`font-semibold ${isActive ? 'text-foreground' : 'text-foreground/70'}`}>
                        {status.label}
                      </h4>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-medium rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/60 mt-1">
                      {status.description}
                    </p>
                    {isActive && currentStatus === 'pending' && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                        <span>Waiting for admin verification...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Contact Admin */}
        <motion.div
          className="bg-accent/5 border border-accent/20 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            Need Help?
          </h4>
          <p className="text-sm text-foreground/70 mb-4">
            If you have any questions about your order, please contact our customer support team.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:support@yourstore.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              Contact Form
            </Link>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="mt-8 text-center flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/shop"
            className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors"
          >
            View All Orders
          </Link>
        </motion.div>
      </div>
    </div>
  );
}