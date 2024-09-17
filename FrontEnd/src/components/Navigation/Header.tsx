import { useState } from "react";
import { useAuth } from "../../store/authContext";
import useNavbarSticky from "../../store/hooks/useNavbarSticky";
import NavbarLink from "../UI/NavLink";
import DropdownMenu from "./DropdownMenu";

type HeaderProps = {
  handleToggle: () => void;
  openModal: () => void;
  path: string | undefined;
};

function Header({ handleToggle, openModal, path }: HeaderProps) {
  useNavbarSticky(); // Custom hook to add sticky behavior to the header
  const { currentUser } = useAuth();
  console.log(currentUser?.uid);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <header className="flex w-screen h-20 items-center  top-0 bg-white ">
      <div className="flex h-full w-40 justify-center items-center">
        <span className="flex w-10 h-10  bg-black rounded"></span>
      </div>
      <nav className="flex flex-grow h-full justify-center items-center">
        <svg
          onClick={handleToggle}
          className=" flex sm:hidden h-10 w-6 hover:bg-slate-300 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <ul className="hidden sm:flex h-full ">
          <li className={`flex flex-col justify-center`}>
            <NavbarLink location={"/"} onActive={path}>
              Home
            </NavbarLink>
          </li>
          <li className={`flex flex-col justify-center`}>
            <NavbarLink location={"/calendar"} onActive={path}>
              Calendar
            </NavbarLink>
          </li>
          <li className={`flex flex-col justify-center`}>
            <NavbarLink location={"/teams"} onActive={path}>
              Teams
            </NavbarLink>
          </li>
        </ul>
      </nav>
      <div className="flex justify-center items-center h-full  w-60">
        <div className="mr-5">
          <button onClick={openModal} className="btn-blue h-10 mr-5">
            New Team
          </button>
        </div>

        {currentUser?.uid ? (
          <DropdownMenu
            path={path}
            onOpen={setDropdownOpen}
            isOpen={dropdownOpen}
          />
        ) : (
          <NavbarLink location={"/auth"} onActive={path}>
            Login
          </NavbarLink>
        )}
      </div>
    </header>
  );
}

export default Header;
