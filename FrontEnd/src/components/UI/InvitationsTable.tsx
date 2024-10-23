import { XCircleIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";

type InvitationTableProps = {
  invitations: string[];
  handleDelete: (email: string) => void;
};
export const InvitationsTable = ({
  invitations,
  handleDelete,
}: InvitationTableProps) => {
  return (
    <>
      <div className="flex">
        <table className="w-full mt-2">
          <thead>
            <tr>
              <th colSpan={2} className="border border-black">
                Invitations
              </th>
            </tr>
          </thead>
          <tbody className="border border-black">
            {invitations.length === 0 ? (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <td colSpan={2} className="flex justify-center">
                  No invitations
                </td>
              </motion.tr>
            ) : (
              invitations.map((invitation) => (
                <motion.tr
                  className="border border-black text"
                  key={invitation}
                  initial={{ opacity: 0, y: 200 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <td className="border border-black">{invitation}</td>
                  <td className="flex justify-center ">
                    <button onClick={() => handleDelete(invitation)}>
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
