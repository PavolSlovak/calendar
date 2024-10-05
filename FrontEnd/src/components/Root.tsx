import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Navigation/Header";
import MenuColumn from "./Navigation/MenuColumn";
import { AnimatePresence } from "framer-motion";
import CreateTeam from "./Teams/CreateTeamForms/CreateTeam";
import useScreenController from "../store/hooks/useScreenController";
import { Outlet, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store";
import { getToken } from "firebase/messaging";

function Root() {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState<boolean>(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

  const { isMobile, closeMobileOnResize } = useScreenController({
    openMobileMenu,
    setOpenMobileMenu,
  });
  isMobile(); // Custom hook to check if the screen is mobile
  closeMobileOnResize(); // Custom hook to close the mobile menu on sm screen

  function handleMobileMenu(): void {
    setOpenMobileMenu(!openMobileMenu);
  }
  function openModal(): void {
    setIsCreateTeamOpen(true);
  }

  function closeModal(): void {
    setIsCreateTeamOpen(false);
  }
  const [currentPath, setCurrentPath] = useState<string | undefined>();

  const location = useLocation();
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <div id="page-container" className="flex flex-col min-h-screen">
      <Provider store={store}>
        <Header
          handleToggle={handleMobileMenu}
          openModal={openModal}
          path={currentPath}
        />
        <AnimatePresence>
          {openMobileMenu && (
            <MenuColumn handleToggle={handleMobileMenu} path={currentPath} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isCreateTeamOpen && <CreateTeam onDone={closeModal} />}
        </AnimatePresence>
        <main className="flex grow justify-center">
          <Outlet />
        </main>
      </Provider>
      <Footer />
    </div>
  );
}

export default Root;
