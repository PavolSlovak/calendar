import { Fragment, useEffect, useState } from "react";
import { useAuth } from "../../store/authContext";
import useNavbarSticky from "../../store/hooks/useNavbarSticky";
import NavbarLink from "../UI/NavLink";
import DropdownMenu from "./DropdownMenu";
import {
  BellIcon,
  DotsVerticalIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { getInvitations, getNotifications } from "../../utils/http-firestore";
import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../UI/LoadingIndicator";
import type { Invitation, Notification } from "@shared/schemas";
import { useErrorBoundary } from "react-error-boundary";
import { format, fromUnixTime, parseISO } from "date-fns";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "../Calendar/CalendarBody";

type HeaderProps = {
  toggleMenu: () => void;
  openModal: () => void;
  path: string | undefined;
};
function Header({ toggleMenu, openModal, path }: HeaderProps) {
  useNavbarSticky(); // Custom hook to add sticky behavior to the header
  const { currentUser } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [invitationDropdownOpen, setInvitationDropdownOpen] = useState(false);
  const { showBoundary } = useErrorBoundary();
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
    enabled: !!currentUser?.uid,
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
    enabled: !!currentUser?.uid,
  });
  useEffect(() => {
    if (notStatus === "success" && notData) {
      setNotifications(notData);
      console.log("Notifications", notData);
    } else if (notIsError) {
      console.log("Error", notError);
      showBoundary(notError);
    }
  }, [notStatus, notData]);

  useEffect(() => {
    if (invStatus === "success" && invData) {
      setInvitations(invData);
      console.log("Invitations", invData);
    } else if (invIsError) {
      console.log("Error", invError);
      showBoundary(invError);
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
    <header className="flex w-screen  h-[80px] flex-shrink-0 items-center  top-0 bg-white z-40 ">
      <div className="flex h-full w-40 justify-center items-center">
        <span className="flex w-10 h-10  bg-black rounded"></span>
      </div>
      <nav className="flex flex-grow h-full justify-center items-center">
        <svg
          onClick={toggleMenu}
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

        {currentUser?.uid ? (
          <>
            <DropdownMenu
              ID={"notifications"}
              handleClick={handleOpenDropdown}
              isOpen={notificationDropdownOpen}
              trigger={<BellIcon className="h-5 w-5" />}
            >
              <h1>Notifications</h1>
              {notIsPending ? (
                <LoadingIndicator label="Invitations loading..." />
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
                <LoadingIndicator label="Invitations loading..." />
              ) : (
                invitations.map((dat: Invitation) => (
                  <Invitation key={dat.id} invitation={dat} />
                ))
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

function Invitation({ invitation }: { invitation: Invitation }) {
  const invitationDate = parseISO(invitation.timestamp);
  console.log("Invitation", invitationDate);
  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      {/* <img
        src={invitation.}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      /> */}
      <div className="flex-auto">
        <p className="text-gray-900">{invitation.invitedByUserId}</p>
        <p className="mt-0.5">
          <time dateTime={invitation.timestamp}>
            {format(invitationDate, "h:mm a")}
          </time>
        </p>
      </div>
      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Cancel
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}
