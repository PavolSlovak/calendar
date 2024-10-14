import React from "react";
import NavbarLink from "../UI/NavLink";
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
    <div
      id={ID}
      onClick={handleClick}
      className="flex items-center justify-center"
    >
      <div>{trigger}</div>

      {isOpen && (
        <div className="absolute top-16 right-0 bg-white shadow-lg">
          <ul>
            <li>{children}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
