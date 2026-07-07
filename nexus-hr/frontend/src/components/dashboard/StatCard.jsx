import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, accent = 'from-primary-600 to-accent-purple' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 flex items-center justify-between"
    >
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-white`}>
        {Icon && <Icon size={20} />}
      </div>
    </motion.div>
  );
}
