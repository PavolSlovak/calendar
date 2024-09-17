import { motion } from "framer-motion";
import { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};
export type ModalHandle = {
  open: () => void;
};
const Modal = forwardRef<ModalHandle, ModalProps>(
  ({ children, onClose }, ref) => {
    const dialog = useRef<HTMLDialogElement>(null);
    // expose the `open` method to other components using useImperativehandle
    useImperativeHandle(ref, () => {
      return {
        open: () => {
          if (dialog.current) {
            dialog.current.showModal(); // showModal() is a built-in method available on the <dialog> element
          }
        },
      };
    });
    // Handle backdrop click to close the modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === dialog.current) {
        onClose();
      }
    };

    const modalVariants = {
      hidden: {
        opacity: 0,
        y: -50,
      },
      visible: {
        opacity: 1,
        y: 0,
      },
    };

    return createPortal(
      <>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div className="absolute flex justify-center items-center w-full h-full">
            <motion.dialog
              ref={dialog}
              className="flex flex-col items-center rounded-lg shadow-lg w-full max-w-xl z-20"
              onClose={onClose}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              transition={{ type: "spring", stiffness: 120, duration: 0.1 }}
            >
              {children}
            </motion.dialog>
          </motion.div>
        </motion.div>
      </>,

      document.getElementById("modal-root")!
    );
  }
);
export default Modal;
