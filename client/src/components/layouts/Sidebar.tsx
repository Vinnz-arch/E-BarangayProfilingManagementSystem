import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "../ui";
import * as FaIcons from 'react-icons/fa6';
import { PATHS } from "../../routes/path";

// Define the shape of a single menu item
interface MenuItem {
  name: string;
  icon: keyof typeof FaIcons;
  path: string;
}

// Define the shape of a menu group
interface MenuGroup {
  group: string;
  items: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

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
        }
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-bg-light pt-20 transition-transform border-r border-border-muted shadow
      ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:shadow-none`}>
      <div className="h-full px-4 pb-4 overflow-y-auto">
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
    </aside>
  );
  
};

export default Sidebar;