import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Main Table Component
const Table = ({ children }: { children: ReactNode }) => (
  <table className=" min-w-full ">{children}</table>
);

// Header Component
Table.Header = ({ children }: { children: ReactNode }) => (
  <thead className="border">{children}</thead>
);

// Header Cell Component
Table.HeaderCell = ({ children }: { children: ReactNode }) => (
  <th className="px-4 py-2 font-semibold border justify-center">{children}</th>
);

// Body Component
Table.Body = ({ children }: { children: ReactNode }) => (
  <tbody>{children}</tbody>
);

// Animated Row Component with AnimatePresence
Table.Row = ({ children, key }: { children: ReactNode; key: string }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    key={key}
  >
    {children}
  </motion.tr>
);

// Animated Cell Component with hover effect
Table.Cell = ({ children }: { children: ReactNode }) => (
  <motion.td className="px-4 py-2 border text-center">{children}</motion.td>
);

export default Table;
