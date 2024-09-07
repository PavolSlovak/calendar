import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Navigation/Header";
import MenuColumn from "../Navigation/MenuColumn";
import { AnimatePresence } from "framer-motion";
import CreateTeam from "../Teams/CreateTeamForms/CreateTeam";
import useScreenController from "../../store/hooks/useScreenController";
import { Outlet, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../store";

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
  const path: string = location.pathname;

  useEffect(() => {
    setCurrentPath(path);
  }, [path]);

  return (
    <div id="page-container" className=" min-h-screen flex flex-col  ">
      <div id="content-wrap" className="flex flex-col grow">
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
          <div className="grow">
            <Outlet />
          </div>
        </Provider>
      </div>
      <Footer />
    </div>
  );
}

export default Root;
