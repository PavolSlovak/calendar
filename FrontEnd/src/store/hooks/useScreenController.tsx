import { useEffect } from "react";
type UseIsMobileProps = {
  openMobileMenu: boolean;
  setOpenMobileMenu: (open: boolean) => void;
};

const useScreenController = ({
  openMobileMenu,
  setOpenMobileMenu,
}: UseIsMobileProps) => {
  useEffect(() => {
    function innerWidthChecker() {
      if (window.innerWidth > 640) {
        setOpenMobileMenu(false);
      }
    }
    window.addEventListener("resize", innerWidthChecker);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", innerWidthChecker);
    };
  }, []);

  useEffect(() => {
    // Toggle body overflow based on mobile menu state
    if (openMobileMenu) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0); // Scroll to top when menu is opened
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openMobileMenu]);
};
export default useScreenController;
