import { motion } from "framer-motion";
import { ReactNode } from "react";

// discriminated union
type HintBoxProps = {
  mode: "hint";
  children: ReactNode;
};
type WarningBoxProps = {
  mode: "warning";
  severity: "low" | "medium" | "high"; // with ? its optional - can be undefined
  children: ReactNode;
};
type InfoBoxProps = HintBoxProps | WarningBoxProps;
const infoBoxVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

function InfoBox(props: InfoBoxProps) {
  const { children } = props;
  if (props.mode === "hint") {
    return (
      <aside className="infobox infobox-hint">
        <p>{children}</p>
      </aside>
    );
  }
  const { severity } = props;
  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={infoBoxVariants}
      transition={{ duration: 0.5 }}
      className={`infobox warning--${severity}`}
    >
      <p>{children}</p>
    </motion.aside>
  );
}

export default InfoBox;
