import { XIcon } from "@heroicons/react/outline";
import { ForwardRefComponent, motion } from "framer-motion";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  FunctionComponent,
  ReactElement,
  ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
} & ComponentPropsWithoutRef<"dialog">;

export type ModalHandle = {
  open: () => void;
};
// Define an interface to add the subcomponents
type ModalComponent = ForwardRefComponent<ModalHandle, ModalProps> & {
  Header: FunctionComponent<TModalHeaderProps>;
  Body: FunctionComponent<TModalBodyProps>;
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
      if (e.currentTarget === e.target) {
        onClose();
      }
    };

    const modalVariants = {
      hidden: {
        opacity: 0,
        y: -50,
        transition: {
          duration: 0.2,
        },
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.2,
        },
      },
    };

    return createPortal(
      <>
        {/* Backdrop */}

        <motion.div
          className="fixed flex justify-center items-center w-full h-full bg-black bg-opacity-50 z-10 "
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          variants={modalVariants}
        >
          <motion.dialog
            ref={dialog}
            className="flex flex-col items-center rounded-lg shadow-lg w-full max-w-xl z-20"
            onClose={onClose}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {children}
          </motion.dialog>
        </motion.div>
      </>,

      document.getElementById("modal-root")!
    );
  }
) as ModalComponent;

type TModalHeaderProps = {
  title: string;
  handleClose: () => void;
};
const ModalHeader: FunctionComponent<TModalHeaderProps> = ({
  title,
  handleClose,
}) => {
  return (
    <div className="my-4">
      <span
        className="absolute right-2 top-2 cursor-pointer"
        onClick={handleClose}
      >
        <XIcon className="h-6 w-6" />
      </span>
      <h1>{title}</h1>
    </div>
  );
};

type TModalBodyProps = {
  children: ReactNode;
};
const ModalBody: FunctionComponent<TModalBodyProps> = ({ children }) => {
  return <div className="px-4 w-full">{children}</div>;
};

type TModalFooterProps = {
  actions: ReactElement;
};
const ModalFooter: FunctionComponent<TModalFooterProps> = ({ actions }) => {
  return <div className="p-4">{actions}</div>;
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
