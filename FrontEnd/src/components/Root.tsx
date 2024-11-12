import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Navigation/Header";
import MenuColumn from "./Navigation/MenuColumn";
import { AnimatePresence } from "framer-motion";
import useScreenController from "../store/hooks/useScreenController";
import { Outlet, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store";
import NewTeamModal from "./Teams/NewTeamModal";

function Root() {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState<boolean>(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] =
    useState<boolean>(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

  // Custom hook to check if the screen is mobile and close the mobile menu on resize
  useScreenController({ openMobileMenu, setOpenMobileMenu });

  const [currentPath, setCurrentPath] = useState<string | undefined>();

  const location = useLocation();
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <div id="page-container" className="flex flex-col min-h-screen">
      <Provider store={store}>
        <Header
          toggleMenu={() => setOpenMobileMenu(!openMobileMenu)}
          openModal={() => setIsCreateTeamOpen(true)}
          path={currentPath}
        />

        <AnimatePresence>
          {openMobileMenu && (
            <MenuColumn
              handleToggle={() => setOpenMobileMenu(!openMobileMenu)}
              path={currentPath}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isCreateTeamOpen && (
            <NewTeamModal onDone={() => setIsCreateTeamOpen(false)} />
          )}
        </AnimatePresence>

        <main className="flex-grow">
          <Outlet />
        </main>
      </Provider>
      <Footer />
    </div>
  );
}

export default Root;
