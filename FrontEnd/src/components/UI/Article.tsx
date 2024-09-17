import { useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
type ArticleProps = {
  children: React.ReactNode;
};
export default function Article({ children }: ArticleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const mainControls = useAnimation();
  useEffect(() => {
    if (isInView) {
      // Fire the animation
      mainControls.start("visible");
    }
  }, [isInView]);

  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: 75,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <motion.section
      ref={ref}
      initial={"hidden"}
      animate={mainControls}
      variants={sectionVariants}
    >
      {children}
    </motion.section>
  );
}
