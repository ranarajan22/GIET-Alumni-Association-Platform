import Navbar from "../components/Navbar";
import EnhancedFooter from "../components/EnhancedFooter";
import BackToTopButton from "../components/BackToTopButton";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <Navbar />
      <div className="mx-3 sm:mx-[10%] min-h-screen pt-16 sm:pt-20">
        <Outlet />
      </div>
      <EnhancedFooter />
      <BackToTopButton />
    </div>
  );
}

export default Layout;
