import { useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
type ArticleProps = {
  children: React.ReactNode;
};
export default function MainBanner({ children }: ArticleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const mainControls = useAnimation();
  useEffect(() => {
    if (isInView) {
      // Fire the animation
      mainControls.start("visible");
    }
  }, [isInView]);

  const bannerVariants = {
    hidden: {
      opacity: 0,
      x: 500,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  };
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.5,
        delay: 0.25,
        type: "spring",
        stiffness: 50,
      }}
      variants={bannerVariants}
    >
      {children}
    </motion.section>
  );
}
