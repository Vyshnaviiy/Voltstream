import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Fan,
  WashingMachine,
  Refrigerator,
  Tv,
  Car,
  Droplets,
  Zap,
  Power
} from "lucide-react";

function Devices() {
  const [devices, setDevices] = useState([]);

  // Icon mapping
  const iconMap = {
    fan: Fan,
    "washing-machine": WashingMachine,
    fridge: Refrigerator,
    tv: Tv,
    car: Car,
    droplets: Droplets
  };

  // Fetch devices
  const loadDevices = useCallback(async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/devices"
      );

      const data = await response.json();

      setDevices(
        Array.isArray(data)
          ? data
          : data.devices || []
      );

    } catch (error) {

      console.error(
        "Failed to load devices:",
        error
      );

    }

  }, []);

  useEffect(() => {

    loadDevices();

    const handleDeviceUpdate = () => {

      loadDevices();

    };

    window.addEventListener(
      "device-updated",
      handleDeviceUpdate
    );

    return () => {

      window.removeEventListener(
        "device-updated",
        handleDeviceUpdate
      );

    };

  }, [loadDevices]);

  // Toggle device
  const toggleDevice = async (id) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;

    const newStatus = device.status === "ON" ? "OFF" : "ON";
    await fetch(`http://127.0.0.1:8000/api/v1/devices/${id}`, {

      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    loadDevices();
  };

  const DeviceCard = ({ device, index }) => {
    const Icon = iconMap[device.icon] || Zap;
    const isOn = device.status === "ON";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className={`
          bg-gradient-to-br from-[#111827]/80 to-[#1E293B]/80
          backdrop-blur-xl
          rounded-3xl
          p-6
          border border-gray-800/50
          shadow-2xl
          hover:shadow-cyan-500/10
          transition-all duration-300
          relative overflow-hidden
          group
          ${isOn ? 'ring-2 ring-cyan-500/30' : ''}
        `}
      >
        {/* Glow effect for active devices */}
        {isOn && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 rounded-3xl blur-sm" />
        )}

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`
              p-3 rounded-2xl
              ${isOn
                ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
                : 'bg-gray-800/50 border border-gray-700'
              }
            `}>
              <Icon
                size={24}
                className={isOn ? 'text-cyan-400' : 'text-gray-400'}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleDevice(device.id)}
              className={`
                relative w-12 h-6 rounded-full transition-all duration-300
                ${isOn
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  : 'bg-gray-600'
                }
              `}
            >
              <motion.div
                animate={{ x: isOn ? 24 : 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-lg absolute top-0.5"
              />
            </motion.button>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">{device.name}</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Power size={16} className={isOn ? 'text-green-400' : 'text-gray-500'} />
              <span className={`text-sm font-medium ${isOn ? 'text-green-400' : 'text-gray-500'}`}>
                {device.status}
              </span>
            </div>

            {device.power_consumption !== undefined && (
              <div className="flex items-center gap-1">
                <Zap size={14} className="text-yellow-400" />
                <span className="text-sm text-gray-400">
                  {device.power_consumption}W
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
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
          Smart Control
        </h1>
        <p className="text-gray-400 mt-4 text-xl">
          Manage your connected devices and monitor energy usage
        </p>
      </motion.div>

      {/* Devices Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {devices.map((device, index) => (
          <DeviceCard key={device.id} device={device} index={index} />
        ))}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            label: "Active Devices",
            value: devices.filter(d => d.status === "ON").length,
            unit: "devices",
            color: "text-green-400"
          },
          {
            label: "Total Power",
            value: devices.filter(d => d.status === "ON").reduce((sum, d) => sum + (d.power_consumption || 0), 0),
            unit: "Watts",
            color: "text-yellow-400"
          },
          {
            label: "Energy Saved",
            value: Math.round(devices.filter(d => d.status === "OFF").reduce((sum, d) => sum + (d.power_consumption || 0), 0) * 0.1),
            unit: "kWh/month",
            color: "text-blue-400"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
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

export default Devices;
