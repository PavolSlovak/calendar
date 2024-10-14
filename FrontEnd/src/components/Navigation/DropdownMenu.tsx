import React from "react";

type DropdownMenuProps = {
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;

  isOpen: boolean;
  children?: React.ReactNode;
  trigger: React.ReactNode;
  ID: string;
};
function DropdownMenu({
  handleClick,
  isOpen,
  children,
  trigger,
  ID,
}: DropdownMenuProps) {
  return (
    <div id={ID} onClick={handleClick} className="linkclasses">
      <div>{trigger}</div>

      {isOpen && (
        <div className="absolute top-20 right-0 w-1/2 sm:w-1/3 bg-white shadow-lg">
          <ul>
            <li>{children}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
