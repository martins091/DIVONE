'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, User } from 'lucide-react';
import { displayNaira } from '@/lib/currency';
import { supabase } from '@/lib/supabase/client';

interface Customer {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  ordersCount: number;
  totalSpent: number;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to fetch users');
        return;
      }

      setUsers(result.users || []);
    };

    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Manage Users</h1>
        <p className="text-gray-500">View registered customers and spending history</p>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-6">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.joinedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-6 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Orders</p>
                    <p className="text-lg font-semibold text-gray-800">{user.ordersCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Spent</p>
                    <p className="text-lg font-semibold text-accent">{displayNaira(user.totalSpent)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users registered yet.</p>
        </div>
      )}
    </div>
  );
}
