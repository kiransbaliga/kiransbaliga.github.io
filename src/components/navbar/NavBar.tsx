import "./NavBar.css";
const Navbar = () => {
  return (
    <nav>
      <div className="navbar-left-main">
        <span>@</span>kiransbaliga
      </div>
      <div className="navbar-right">
        <a className="navItem-common" href="#Articles">
          Articles
        </a>
        <a className="navItem-common" href="#Projects">
          Projects
        </a>
        <a className="navItem-common" href="#Capabilities">
          Capabilities
        </a>
        <a className="navItem-highlight" href="./blog">
          Blog
        </a>
      </div>
      <div className="menubar">
        
        <a className="navItem-highlight" href="./blog">
          Blog
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
