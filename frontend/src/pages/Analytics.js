import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";

function Analytics() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://127.0.0.1:8000/api/v1/analytics/history?period=${activeTab}`)

      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load analytics data");
        }
        return res.json();
      })
      .then((periodData) => {
        setData(Array.isArray(periodData) ? periodData : []);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load analytics data.");
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-10 flex items-center justify-center min-h-screen"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading analytics...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-10 flex items-center justify-center min-h-screen"
      >
        <div className="bg-[#111827]/90 border border-red-500/30 rounded-3xl p-10 text-center shadow-2xl">
          <p className="text-red-400 text-lg font-semibold">{error}</p>
          <p className="mt-3 text-gray-400">Please make sure the backend is running on port 8001.</p>
        </div>
      </motion.div>
    );
  }

  const tabs = [
    { id: "daily", label: "Daily", icon: Calendar },
    { id: "weekly", label: "Weekly", icon: BarChart3 },
    { id: "monthly", label: "Monthly", icon: TrendingUp }
  ];

  const currentData = data || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111827] border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value} kWh
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
          Usage Analytics
        </h1>
        <p className="text-gray-400 mt-4 text-xl">
          Comprehensive energy consumption insights
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex gap-4 mb-8"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300
                ${activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-white border border-blue-500/30 shadow-lg"
                  : "bg-[#111827]/50 text-gray-400 hover:bg-[#1E293B]/50 hover:text-white border border-gray-800"
                }
              `}
            >
              <Icon size={18} />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="
            bg-gradient-to-br from-[#111827]/80 to-[#1E293B]/80
            backdrop-blur-xl
            rounded-3xl
            p-8
            border border-gray-800/50
            shadow-2xl
          "
        >
          <h2 className="text-2xl font-bold mb-6 text-white">Energy Usage</h2>
          <div className="w-full h-80 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="label"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="usage"
                  fill="url(#usageGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="
            bg-gradient-to-br from-[#111827]/80 to-[#1E293B]/80
            backdrop-blur-xl
            rounded-3xl
            p-8
            border border-gray-800/50
            shadow-2xl
          "
        >
          <h2 className="text-2xl font-bold mb-6 text-white">Generation vs Usage</h2>
          <div className="w-full h-80 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="label"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="generation"
                  stackId="2"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            label: "Total Usage",
            value: currentData.reduce((sum, item) => sum + item.usage, 0),
            unit: "kWh",
            color: "text-blue-400"
          },
          {
            label: "Total Generation",
            value: currentData.reduce((sum, item) => sum + (item.generation || 0), 0),
            unit: "kWh",
            color: "text-green-400"
          },
          {
            label: "Average Daily",
            value: Math.round(currentData.reduce((sum, item) => sum + item.usage, 0) / currentData.length),
            unit: "kWh",
            color: "text-cyan-400"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
            className="
              bg-gradient-to-br from-[#111827]/80 to-[#1E293B]/80
              backdrop-blur-xl
              rounded-2xl
              p-6
              border border-gray-800/50
              shadow-lg
              text-center
            "
          >
            <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.label}</h3>
            <p className={`text-3xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm mt-1">{stat.unit}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Analytics;