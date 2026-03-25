import { Link } from "react-router-dom";

const NavLinks = ({ createRipple, isMobile = false, onLinkClick }) => {
  const baseClass = isMobile
    ? "nav-link block px-3 py-3 text-gray-700 hover:bg-gray-50 text-base rounded-md transition"
    : "nav-link text-gray-700 font-normal text-base py-2 px-3 rounded-md transition duration-200 active:scale-95";

  return (
    <>
      <Link
        to="/"
        className={baseClass}
        onClick={e => {
          createRipple(e);
          onLinkClick && onLinkClick();
        }}
      >
        Lobby
      </Link>
      <Link
        to="/articles"
        className={baseClass}
        onClick={e => {
          createRipple(e);
          onLinkClick && onLinkClick();
        }}
      >
        Articles
      </Link>
      <Link
        to="/videos"
        className={baseClass}
        onClick={e => {
          createRipple(e);
          onLinkClick && onLinkClick();
        }}
      >
        Video
      </Link>
      {isMobile && (
        <Link
          to="/projects"
          className={baseClass}
          onClick={e => {
            createRipple(e);
            onLinkClick && onLinkClick();
          }}
        >
          Projects
        </Link>
      )}
    </>
  );
};

export default NavLinks;
