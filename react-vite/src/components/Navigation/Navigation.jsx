import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useSelector } from "react-redux";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  const profileButtonClassName = sessionUser ? "" : "hidden-profile-button"
  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      <li className={profileButtonClassName}>
        <ProfileButton/>
      </li>
    </ul>
  );
}

export default Navigation;
