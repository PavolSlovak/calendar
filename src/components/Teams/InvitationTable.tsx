import { AnimatePresence, motion } from "framer-motion";
import { User } from "../../dummy_users";
import Button from "../UI/Button";

type InvitationTableProps = {
  TeamMembers: User[];
  handleDelete: (id: number) => void;
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

function InvitationTable({ TeamMembers, handleDelete }: InvitationTableProps) {
  return (
    <>
      <p className="pb-2">Invitations:</p>

      <AnimatePresence>
        {TeamMembers.length === 0 ? (
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
            {TeamMembers.map((member: User) => (
              <motion.li
                className="flex w-full border items-center"
                key={member.id}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.5 }}
                variants={tableVariants}
              >
                <span className="text-sm flex w-2/3">{member.email}</span>
                <span className="text-sm flex w-1/3 justify-end">
                  <Button
                    className="btn-delete"
                    onClick={() => handleDelete(member.id)}
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
