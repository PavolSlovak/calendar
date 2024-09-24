import { useEffect } from "react";

const useNavbarSticky = () => {
  useEffect(() => {
    function handleScroll() {
      const header = document.querySelector("header");
      const mainContent = document.querySelector("main"); // Assuming the main content is inside a <main> tag

      if (header) {
        if (window.scrollY > 0) {
          header.classList.add("fixed", "shadow-lg");
          mainContent?.classList.add("mt-20"); // Add margin top to the main content to avoid overlapping with the header
        } else {
          header.classList.remove("fixed", "shadow-lg");
          mainContent?.classList.remove("mt-20");
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
