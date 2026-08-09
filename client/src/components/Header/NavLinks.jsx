import React from 'react';
import { NavLink } from "react-router-dom";

const NavLinks = ({ isMobile = false, onLinkClick }) => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/research", label: "Research" },
    { to: "/publications", label: "Publications" },
    { to: "/team", label: "Team" },
    { to: "/videos", label: "Videos" },
    { to: "/contact", label: "Contact" },
  ];

  if (isMobile) {
    return (
      <>
        {links.map((link) => (
          <li key={link.to} className="list-none">
            <NavLink
              to={link.to}
              onClick={onLinkClick}
              className={({ isActive }) =>
                `link-significa py-1 text-3xl font-bold tracking-tighter transition-colors inline-block ${
                  isActive ? "text-brand-primary" : "text-text-main"
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </>
    );
  }

  return null;
};

export default NavLinks;
