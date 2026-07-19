import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Lobby", end: true },
  { to: "/articles", label: "Articles" },
  { to: "/videos", label: "Videos" },
];

const NavLinks = ({ isMobile = false, onLinkClick }) => {
  const baseClass = isMobile
    ? "block px-4 py-3 text-[15px] text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
    : "relative text-[14px] font-medium py-2 transition-colors";

  return (
    <>
      {links.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onLinkClick}
          className={({ isActive }) =>
            isMobile
              ? `${baseClass} ${isActive ? 'text-white bg-white/5' : ''}`
              : `${baseClass} ${isActive ? 'text-white' : 'text-white/65 hover:text-white'} group`
          }
        >
          {({ isActive }) => (
            <>
              {label}
              {!isMobile && (
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] rounded-full bg-signal transition-all duration-200 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;
