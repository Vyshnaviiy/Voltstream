import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

function Billing() {
  const [billing, setBilling] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/billing/summary")
      .then((res) => res.json())
      .then((data) => setBilling(data));
  }, []);

  if (!billing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-10 flex items-center justify-center min-h-screen"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading billing data...</p>
        </div>
      </motion.div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'overdue': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const progressPercentage = Math.min((billing.usage_percentage / 100) * 100, 100);

  const FinancialCard = ({ title, value, subtitle, icon: Icon, color, delay, isCurrency = true }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="
        bg-gradient-to-br from-[#111827]/80 to-[#1E293B]/80
        backdrop-blur-xl
        rounded-3xl
        p-8
        border border-gray-800/50
        shadow-2xl
        hover:shadow-cyan-500/10
        transition-all duration-300
        relative overflow-hidden
        group
      "
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`w-8 h-8 ${color}`} />
          <div className={`w-3 h-3 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`} />
        </div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h1 className="text-4xl font-black mt-2 text-white">
          {isCurrency ? '$' : ''}{value.toLocaleString()}
        </h1>
        {subtitle && <p className="mt-2 text-gray-500 text-sm">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-10"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-6xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Billing Center
        </h1>
        <p className="text-gray-400 mt-4 text-xl">
          Monitor your energy costs and payment history
        </p>
      </motion.div>

      {/* Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <FinancialCard
          title="Current Balance"
          value={billing.current_balance}
          subtitle="Available credits"
          icon={CreditCard}
          color="text-blue-400"
          delay={0.1}
        />
        <FinancialCard
          title="Projected Bill"
          value={billing.projected_bill}
          subtitle="Estimated for this month"
          icon={TrendingUp}
          color="text-orange-400"
          delay={0.2}
        />
        <FinancialCard
          title="Budget Usage"
          value={billing.usage_percentage}
          subtitle={`${billing.usage_percentage}% of limit`}
          icon={AlertTriangle}
          color={billing.usage_percentage > 90 ? "text-red-400" : "text-green-400"}
          delay={0.3}
          isCurrency={false}
        />
      </div>

      {/* Budget Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="
          bg-gradient-to-br from-[#111827]/80 to-[#1E293B]/80
          backdrop-blur-xl
          rounded-3xl
          p-8
          border border-gray-800/50
          shadow-2xl
          mb-8
        "
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Monthly Budget Progress</h2>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Used: ${billing.current_balance.toLocaleString()}</span>
            <span className="text-gray-400">Limit: ${billing.budget_limit.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ delay: 0.6, duration: 1 }}
              className={`h-full rounded-full ${
                progressPercentage > 90
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600'
              }`}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              {progressPercentage.toFixed(1)}% used
            </span>
            {progressPercentage > 90 && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle size={16} />
                Approaching limit
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Invoice History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="
          bg-gradient-to-br from-[#111827]/80 to-[#1E293B]/80
          backdrop-blur-xl
          rounded-3xl
          p-8
          border border-gray-800/50
          shadow-2xl
        "
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Invoice History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {billing.invoices.map((invoice, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className="border-b border-gray-800/50 hover:bg-gray-800/20"
                >
                  <td className="py-4 px-4 text-white">{invoice.date}</td>
                  <td className="py-4 px-4 text-white">${invoice.amount.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`
                      inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
                      ${getStatusColor(invoice.status)}
                    `}>
                      {invoice.status === 'paid' && <CheckCircle size={12} />}
                      {invoice.status === 'pending' && <Clock size={12} />}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Billing;
