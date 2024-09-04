import React, { useState } from "react";
import { useDispatch } from "react-redux";

interface DropdownListProps {
  children: React.ReactNode;
}

function DropdownList({ children }: DropdownListProps) {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <select value={selectedValue} onChange={handleChange}>
      {children}
    </select>
  );
}

export default DropdownList;
