import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Zap, Sun, Activity } from "lucide-react";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/dashboard/live")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-10 flex items-center justify-center min-h-screen"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </motion.div>
    );
  }

  const chartData = [
    { name: "Grid Draw", value: data.grid_draw, color: "#3b82f6" },
    { name: "Solar Generation", value: data.solar_generation, color: "#f59e0b" },
  ];

  const MetricCard = ({ title, value, unit, icon: Icon, color, delay }) => (
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
          {value.toLocaleString()}
        </h1>
        <p className="mt-2 text-gray-500 text-sm">{unit}</p>
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
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-12"
      >
        <div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Live Dashboard
          </h1>
          <p className="text-gray-400 mt-4 text-xl">
            Real-time energy monitoring & insights
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            px-6 py-3 rounded-full
            bg-gradient-to-r from-green-500/20 to-emerald-500/20
            text-green-400 border border-green-500/30
            font-semibold backdrop-blur-sm
            shadow-lg hover:shadow-green-500/20
            transition-all duration-300
          "
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live Connection
          </div>
        </motion.button>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <MetricCard
          title="Grid Draw"
          value={data.grid_draw}
          unit="Watts"
          icon={Zap}
          color="text-blue-400"
          delay={0.1}
        />
        <MetricCard
          title="Solar Generation"
          value={data.solar_generation}
          unit="Watts"
          icon={Sun}
          color="text-yellow-400"
          delay={0.2}
        />
        <MetricCard
          title="Net Usage"
          value={Math.abs(data.net_usage)}
          unit={data.net_usage < 0 ? "Watts Surplus" : "Watts Deficit"}
          icon={Activity}
          color={data.net_usage < 0 ? "text-green-400" : "text-red-400"}
          delay={0.3}
        />
      </div>

      {/* Chart Section */}
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
        "
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Energy Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-8 mt-6">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-400">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
