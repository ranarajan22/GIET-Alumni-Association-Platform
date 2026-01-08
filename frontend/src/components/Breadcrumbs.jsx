// eslint-disable-next-line no-unused-vars
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  const breadcrumbNames = {
    "": "Home",
    dashboard: "Dashboard",
    about: "About",
    contact: "Contact",
    roleselection: "Role Selection",
    login: "Login",
    alumni: "Alumni Registration",
    student: "Student Registration",
    network: "Network",
    messages: "Messages",
    mentorships: "Mentorships",
    events: "Events",
    jobs: "Job Openings",
  };

  return (
    <nav className="px-4 py-3 mb-6 text-slate-300" aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <li>
          <Link to="/" className="text-cyan-300 hover:text-cyan-200 transition">
            Home
          </Link>
        </li>

        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbNames[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);

          return (
            <li key={index} className="flex items-center gap-2">
              <FaChevronRight className="text-gray-400 text-xs" />
              {isLast ? (
                <span className="text-slate-200 font-medium">{displayName}</span>
              ) : (
                <Link to={routeTo} className="text-cyan-300 hover:text-cyan-200 transition">
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
