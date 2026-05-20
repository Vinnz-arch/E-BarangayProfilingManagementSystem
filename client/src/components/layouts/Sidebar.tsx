import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../util/axios";
import { Icon, LoadingSpinner } from "../ui";
import * as FaIcons from 'react-icons/fa6';
import { PATHS } from "../../routes/path";
import { notify } from "../../util/notify";
import { useState } from "react";

interface MenuItem {
  name: string;
  icon: keyof typeof FaIcons;
  path: string;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
      setIsLoggingOut(true);

      try {
          await api.post("/logout");
      } catch (error) {
          console.error("Logout error:", error);
      } finally {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsLoggingOut(false);
          notify.success("Logged out successfully");
          navigate(PATHS.LOGIN);
      }
  };

  const menuGroups: MenuGroup[] = [
    {
      group: "Navigation",
      items: [
        {
          name: "Dashboard",
          icon: "FaChartSimple",
          path: PATHS.APP.DASHBOARD,
        },
        {
          name: "Sitio",
          icon: "FaMapPin",
          path: PATHS.APP.SITIO,
        },
        {
          name: "Household",
          icon: "FaHouse",
          path: PATHS.APP.HOUSEHOLD,
        },
        {
          name: "Beneficiaries",
          icon: "FaPeopleGroup",
          path: PATHS.APP.BENEFICIARIES,
        },
        {
          name: "Residents",
          icon: "FaUsers",
          path: PATHS.APP.RESIDENTS,
        },
        {
          name: "Barangay Official",
          icon: "FaUserShield",
          path: PATHS.APP.BARANGAYOFFICIALS,
        },
        {
          name: "Document Requests",
          icon: "FaFileLines",
          path: PATHS.APP.DOCUMENT_REQUESTS,
        },
        {
          name: "Announcements",
          icon: "FaBullhorn",
          path: PATHS.APP.ANNOUNCEMENTS,
        },
        {
          name: "Disaster Alerts",
          icon: "FaTowerBroadcast",
          path: PATHS.APP.DISASTER_READINESS,
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-68 h-screen bg-bg-light pt-20 transition-transform border-r border-border-muted shadow
      ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:shadow-none`}>
      <div className="h-full px-4 pb-4 flex flex-col justify-between">
        <div className="">
          {menuGroups.map((group) => (
            <div key={group.group} className="mb-6">
              <h3 className="px-3 mb-2 text-sm font-black uppercase italic tracking-widest text-text-muted">
                {group.group}
              </h3>

              <ul className="space-y-1.5 font-medium">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className={`flex items-center p-2.5 rounded-xl group ${
                          isActive
                            ? "bg-primary text-bg-dark shadow scale-[1.02] z-10 hover:bg-primary/80"
                            : "text-text hover:text-bg-dark hover:bg-primary"
                        }`}
                      >
                        <Icon
                          iconName={item.icon}
                          className={`transition-colors ${
                            isActive
                              ? "text-bg-dark"
                              : "text-text group-hover:text-bg-dark"
                          }`}
                        />
                        <span
                          className={`ml-3 text-sm ${
                            isActive
                              ? "font-black italic uppercase tracking-tighter"
                              : "text-text group-hover:text-bg-dark"
                          }`}
                        >
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="pb-8">
            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`w-full flex items-center p-2.5 rounded-xl group transition-all duration-300 cursor-pointer ${
                  isLoggingOut 
                    ? "bg-bg-main text-text-muted cursor-not-allowed" 
                    : "text-danger hover:bg-danger hover:text-bg-light"
                }`}
            >
                {isLoggingOut ? (
                  <LoadingSpinner size="sm" color="text-text-muted" />
                ) : (
                  <Icon
                    iconName="FaArrowRightFromBracket"
                    className="text-danger group-hover:text-bg-light transition-colors"
                  />
                )}
                <span className={`ml-3 text-sm font-black italic uppercase tracking-tighter ${
                  !isLoggingOut && "group-hover:text-bg-light"
                }`}>
                    {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
            </button>
        </div>
      </div>
    </aside>
  );
  
};

export default Sidebar;