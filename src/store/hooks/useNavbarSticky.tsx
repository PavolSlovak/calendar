import { useEffect } from "react";

const useNavbarSticky = () => {
  useEffect(() => {
    function handleScroll() {
      const header = document.querySelector("header");
      if (header) {
        if (window.scrollY > 0) {
          header.classList.add("fixed", "shadow-lg");
        } else {
          header.classList.remove("fixed", "shadow-lg");
        }
      }
    }
    window.addEventListener("scroll", handleScroll);
    // Cleanup function to remove the event listener

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
};
export default useNavbarSticky;
