import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/path";
import { Icon } from "../ui";
import Logo from "../../assets/logo.png";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {

  return (
    <nav className="fixed top-0 z-50 w-full bg-bg-light border-b border-border-muted">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            {/* Mobile Sidebar Toggle */}
            <span
              onClick={onMenuClick}
              className="p-2 mr-2 text-text-muted rounded-lg sm:hidden focus:outline-none">
              <Icon iconName="FaAlignJustify" />
            </span>
            <Link to={PATHS.APP.DASHBOARD} className="flex gap-3 items-center">
              <img className="w-13 h-13" src={Logo} alt="App Logo"/>
              <span className="text-text font-black text-lg tracking-tighter uppercase italic hidden sm:block">E-Barangay Profiling Management System</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
  
};

export default Navbar;