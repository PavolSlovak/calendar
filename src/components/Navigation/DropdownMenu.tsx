import NavbarLink from "../UI/NavLink";
type DropdownMenuProps = {
  path: string | undefined;
  onOpen: (value: boolean) => void;
  isOpen: boolean;
};
function DropdownMenu({ path, onOpen, isOpen }: DropdownMenuProps) {
  return (
    <div className="flex  items-center justify-center  w-10 h-10">
      <span
        className="flex h-10 w-10  rounded-full bg-black"
        onClick={() => onOpen(!isOpen)}
      ></span>

      {isOpen && (
        <div className="absolute top-16 right-0 bg-white shadow-lg">
          <ul>
            <li>
              <NavbarLink location={"/profile"} onActive={path}>
                Profile
              </NavbarLink>
            </li>
            <li>
              <NavbarLink location={"/auth?logout"} onActive={path}>
                Logout
              </NavbarLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
