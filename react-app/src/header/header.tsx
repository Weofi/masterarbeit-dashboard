import {NavLink} from "react-router";
import "./header.css";

function Header() {
  return (
    <header>
      <nav>
        <NavLink to="/" end>React Dashboard</NavLink>
        <div className="spacer"></div>
        <NavLink to="/1k" end>Dashboard 1k</NavLink>
        <NavLink to="/10k" end>Dashboard 10k</NavLink>
        <NavLink to="/100k">Dashboard 100k</NavLink>
        <NavLink to="/1M">Dashboard 1M</NavLink>
      </nav>
    </header>
  );
}

export default Header;
