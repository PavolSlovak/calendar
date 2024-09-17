import { ReactNode } from "react";
import { motion } from "framer-motion";

type CardProps = {
  children: ReactNode;
};
// Auth form animation
const authVariants = {
  hidden: { opacity: 0, y: "-5vh" },
  visible: {
    opacity: 1,
    y: 0,
  },
};
function Card({ children }: CardProps) {
  return (
    <motion.div
      className="flex justify-center min-h-screen"
      initial={"hidden"}
      animate={"visible"}
      variants={authVariants}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="flex flex-col w-full sm:w-lg max-w-lg h-3/5 bg-slate-100 rounded shadow-lg border border-slate-200 p-5 mt-10 ">
        {children}
      </div>
    </motion.div>
  );
}

export default Card;
