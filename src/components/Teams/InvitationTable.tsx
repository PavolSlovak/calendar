import { AnimatePresence, motion } from "framer-motion";
import Button from "../UI/Button";

type InvitationTableProps = {
  invitations: string[];
  handleDelete: (invitation: string) => void;
};

const tableVariants = {
  hidden: {
    opacity: 0,
    y: 200,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function InvitationTable({ invitations, handleDelete }: InvitationTableProps) {
  return (
    <>
      <p className="pb-2">Invitations:</p>

      <AnimatePresence>
        {invitations.length === 0 ? (
          <motion.p
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            No invitations
          </motion.p>
        ) : (
          <ul>
            {invitations.map((invitation) => (
              <motion.li
                key={invitation}
                className="flex w-full border items-center"
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.5 }}
                variants={tableVariants}
              >
                <span className="text-sm flex w-2/3">{invitation}</span>
                <span className="text-sm flex w-1/3 justify-end">
                  <Button
                    className="btn-delete"
                    onClick={() => handleDelete(invitation)}
                  >
                    x
                  </Button>
                </span>
              </motion.li>
            ))}
          </ul>
        )}
      </AnimatePresence>
    </>
  );
}

export default InvitationTable;
