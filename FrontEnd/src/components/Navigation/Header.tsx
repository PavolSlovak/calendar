import { useState } from "react";
import { useAuth } from "../../store/authContext";
import useNavbarSticky from "../../store/hooks/useNavbarSticky";
import NavbarLink from "../UI/NavLink";
import DropdownMenu from "./DropdownMenu";
import { BellIcon, UsersIcon } from "@heroicons/react/outline";

type HeaderProps = {
  handleToggle: () => void;
  openModal: () => void;
  path: string | undefined;
};

function Header({ handleToggle, openModal, path }: HeaderProps) {
  useNavbarSticky(); // Custom hook to add sticky behavior to the header
  const { currentUser } = useAuth();
  console.log(currentUser?.uid);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [invitationDropdownOpen, setInvitationDropdownOpen] = useState(false);

  function handleOpenDropdown(event: React.MouseEvent<HTMLDivElement>) {
    console.log(event.currentTarget.id);
    switch (event.currentTarget.id) {
      case "profile":
        setProfileDropdownOpen(!profileDropdownOpen);
        setNotificationDropdownOpen(false);
        setInvitationDropdownOpen(false);
        break;
      case "notifications":
        setNotificationDropdownOpen(!notificationDropdownOpen);
        setProfileDropdownOpen(false);
        setInvitationDropdownOpen(false);
        break;
      case "invitations":
        setInvitationDropdownOpen(!invitationDropdownOpen);
        setProfileDropdownOpen(false);
        setNotificationDropdownOpen(false);
        break;
    }
  }
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
          <>
            <DropdownMenu
              ID={"notifications"}
              handleClick={handleOpenDropdown}
              isOpen={notificationDropdownOpen}
              trigger={<BellIcon className="h-5 w-5" />}
            >
              <NavbarLink location={"/profile"} onActive={path}>
                Notifications
              </NavbarLink>
            </DropdownMenu>
            <DropdownMenu
              ID={"invitations"}
              handleClick={handleOpenDropdown}
              isOpen={invitationDropdownOpen}
              trigger={<UsersIcon className="h-5 w-5" />}
            >
              <NavbarLink location={"/profile"} onActive={path}>
                Team invitations
              </NavbarLink>
            </DropdownMenu>
            <DropdownMenu
              ID={"profile"}
              handleClick={handleOpenDropdown}
              isOpen={profileDropdownOpen}
              trigger={
                <span className="flex h-10 w-10  rounded-full bg-black"></span>
              }
            >
              <NavbarLink location={"/profile"} onActive={path}>
                Profile
              </NavbarLink>
            </DropdownMenu>
          </>
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
