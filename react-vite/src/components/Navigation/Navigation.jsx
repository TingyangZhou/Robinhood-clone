import "./Navigation.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllSearchStocksThunk, getAllStocksThunk } from "../../redux/stocks";
import { useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton.jsx"






function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const location = useLocation()


  const [searchInput, setSearchInput] = useState("");


  // useEffect(() => {
  //   setSearchInput("")


  // }, [location])






  const handleSearch = async () => {
    navigate("")
    if(searchInput == ""){
      dispatch(getAllStocksThunk())
    }
    else{
      dispatch(getAllSearchStocksThunk(searchInput))
    }
    console.log("Search submitted:", searchInput);
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };




  const navClassName = sessionUser ? "nav-bar-main": "hidden-home-link"
  return (
    <header  className={navClassName}>
      <div>
        <NavLink to="/">Home</NavLink>
      </div>
      <div><input
       type="text"
       placeholder="search for stocks..."
       value={searchInput}
       onChange={(e) => setSearchInput(e.target.value)}
       onKeyDown={handleKeyDown}
       ></input></div>
      <div>
        <ProfileButton/>
      </div>
    </header>
  );
}


export default Navigation;


