import { useEffect, useState } from "react";
import { useAuth } from "../../store/authContext";
import useNavbarSticky from "../../store/hooks/useNavbarSticky";
import NavbarLink from "../UI/NavLink";
import DropdownMenu from "./DropdownMenu";
import { BellIcon, UsersIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { getInvitations, getNotifications } from "../../utils/http-firestore";
import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../UI/LoadingIndicator";
import { Invitation, Notification } from "@shared/schemas";

type HeaderProps = {
  handleToggle: () => void;
  openModal: () => void;
  path: string | undefined;
};
function Header({ handleToggle, openModal, path }: HeaderProps) {
  useNavbarSticky(); // Custom hook to add sticky behavior to the header
  const { currentUser } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [invitationDropdownOpen, setInvitationDropdownOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const {
    status: notStatus,
    data: notData,
    isPending: notIsPending,
    isError: notIsError,
    error: notError,
  } = useQuery({
    queryKey: ["notifications"], // query key is an array with the query key and the query key object
    queryFn: () => getNotifications(),
  });
  const {
    status: invStatus,
    data: invData,
    isPending: invIsPending,
    isError: invIsError,
    error: invError,
  } = useQuery({
    queryKey: ["invitations"], // query key is an array with the query key and the query key object
    queryFn: () => getInvitations(),
  });
  useEffect(() => {
    if (notStatus === "success" && notData) {
      setNotifications(notData);
      console.log(notData);
    }
  }, [notStatus, notData]);

  useEffect(() => {
    if (invStatus === "success" && invData) {
      setInvitations(invData);
      console.log("Invitations", invData);
    }
  }, [invStatus, invData]);

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
          <li className={`flex flex-col justify-center h-full`}>
            <NavbarLink location={"/teams"} onActive={path}>
              Teams
            </NavbarLink>
          </li>
        </ul>
      </nav>
      <div className="flex h-full">
        <div className="flex items-center">
          <button onClick={openModal} className="btn-blue h-10 ">
            New Team
          </button>
        </div>

        {currentUser?.firebaseUID ? (
          <>
            <DropdownMenu
              ID={"notifications"}
              handleClick={handleOpenDropdown}
              isOpen={notificationDropdownOpen}
              trigger={<BellIcon className="h-5 w-5" />}
            >
              <h1>Notifications</h1>
              {notIsPending ? (
                <LoadingIndicator />
              ) : (
                <ul>
                  {notifications.map((dat: Notification) => (
                    <li key={dat.id}>{dat.notification.title}</li>
                  ))}
                </ul>
              )}
            </DropdownMenu>
            <DropdownMenu
              ID={"invitations"}
              handleClick={handleOpenDropdown}
              isOpen={invitationDropdownOpen}
              trigger={<UsersIcon className="h-5 w-5" />}
            >
              <h1>Invitations</h1>
              {invIsPending ? (
                <LoadingIndicator />
              ) : (
                <ul>
                  {invitations.map((dat: Invitation) => (
                    <li key={dat.id}>
                      User {dat.invitedByUserId} invited you to the team{" "}
                      {dat.invitedByUserId}{" "}
                    </li>
                  ))}
                </ul>
              )}
            </DropdownMenu>
            <DropdownMenu
              ID={"profile"}
              handleClick={handleOpenDropdown}
              isOpen={profileDropdownOpen}
              trigger={
                <span className="flex h-10 w-10  rounded-full bg-black"></span>
              }
            >
              <Link to={"/profile"}>Profile</Link>
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
