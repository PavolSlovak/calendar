import { motion } from "framer-motion";
import { ReactNode } from "react";

// discriminated union
type InfoBoxProps = {
  mode: "hint" | "warning" | "success";
  severity: "low" | "medium" | "high";
  children: ReactNode;
};

const infoBoxVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

function InfoBox(props: InfoBoxProps) {
  const { children, severity, mode } = props;

  let styles;
  switch (mode) {
    case "hint":
      styles = "infobox infobox-hint";
      break;
    case "warning":
      styles = `infobox warning--${severity}`;
      break;
    case "success":
      styles = "infobox infobox-success";
      break;
  }

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={infoBoxVariants}
      transition={{ duration: 0.5 }}
      className={styles}
    >
      <p>{children}</p>
    </motion.aside>
  );
}

export default InfoBox;
