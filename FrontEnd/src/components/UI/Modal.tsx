import { ForwardRefComponent, motion } from "framer-motion";
import {
  forwardRef,
  FunctionComponent,
  ReactElement,
  ReactNode,
  RefAttributes,
  useImperativeHandle,
  useRef,
} from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};
export type ModalHandle = {
  open: () => void;
};
// Define an interface to add the subcomponents
type ModalComponent = FunctionComponent<ModalProps> &
  ForwardRefComponent<ModalHandle, ModalProps & RefAttributes<ModalHandle>> & {
    Body: FunctionComponent<TModalBodyProps>;
    Header: FunctionComponent<TModalHeaderProps>;
    Footer: FunctionComponent<TModalFooterProps>;
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
              exit="hidden"
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
) as ModalComponent;

type TModalHeaderProps = {
  title: string;
};
const ModalHeader: FunctionComponent<TModalHeaderProps> = ({ title }) => {
  return (
    <div className="p-4 relative">
      <span className="absolute top-4 right-4">x</span>
    </div>
  );
};

type TModalBodyProps = {
  children: ReactNode;
};
const ModalBody: FunctionComponent<TModalBodyProps> = ({ children }) => {
  return <div className="p-4">{children}</div>;
};
type TModalFooterProps = {
  handleClose: () => void;
  actions?: ReactElement;
};
const ModalFooter: FunctionComponent<TModalFooterProps> = ({
  handleClose,
  actions,
}) => {
  return (
    <div className="p-4">
      <button onClick={handleClose} className="text-black justify-end">
        Cancel
      </button>
      {actions}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
