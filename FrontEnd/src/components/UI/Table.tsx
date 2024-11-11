import React from "react";

type TableProps = {
  headerCols: string[];
  membersEmailArray: string[];
  onDelete: (email: string) => void;
};

export const Table = ({
  headerCols,
  membersEmailArray,
  onDelete,
}: TableProps) => {
  return (
    <table>
      <thead>
        <TableHeader columns={headerCols} />
      </thead>
      <tbody>
        {membersEmailArray.map((email, index) => (
          <TableRow key={index} email={email} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
};

// TableHeader Component
type TableHeaderProps = {
  columns: string[];
};

const TableHeader = ({ columns }: TableHeaderProps) => (
  <tr>
    {columns.map((col, index) => (
      <th key={index}>{col}</th>
    ))}
  </tr>
);

// TableRow Component
type TableRowProps = {
  email: string;
  onDelete: (email: string) => void;
};

const TableRow = ({ email, onDelete }: TableRowProps) => (
  <tr>
    <td>{email}</td>
    <td>
      <button onClick={() => onDelete(email)}>Delete</button>
    </td>
  </tr>
);
