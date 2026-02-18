import { Warehouse } from "lucide-react";
import { motion } from "framer-motion";

const MotionWarehouse = motion(Warehouse);

export default function AnimatedWarehouse({ stock }: { stock: string }) {
  return (
    <MotionWarehouse
      size={20}
      className={stock == "low" ? "text-red-500" : "text-green-500"}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    />
  );
}
