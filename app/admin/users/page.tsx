// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, User, Trash2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  joinedDate: string;
  ordersCount: number;
  totalSpent: number;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('users');
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      const demoUsers = [
        { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', joinedDate: '2026-01-15', ordersCount: 5, totalSpent: 1250 },
        { id: 2, name: 'Emily Davis', email: 'emily@example.com', joinedDate: '2026-02-20', ordersCount: 3, totalSpent: 890 },
        { id: 3, name: 'Jessica Brown', email: 'jessica@example.com', joinedDate: '2026-03-10', ordersCount: 2, totalSpent: 450 },
      ];
      setUsers(demoUsers);
      localStorage.setItem('users', JSON.stringify(demoUsers));
    }
  }, []);

  const handleDeleteUser = (id: number) => {
    if (confirm('Delete this user? This action cannot be undone.')) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Manage Users</h1>
        <p className="text-gray-500">View and manage registered customers</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {user.joinedDate}
                    </span>
                  </div>
                  <div className="flex gap-6 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Orders</p>
                      <p className="text-lg font-semibold text-gray-800">{user.ordersCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Spent</p>
                      <p className="text-lg font-semibold text-accent">${user.totalSpent}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
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