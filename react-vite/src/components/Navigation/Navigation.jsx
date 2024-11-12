import "./Navigation.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllSearchStocksThunk, getAllStocksThunk } from "../../redux/stocks";
import { useDispatch } from "react-redux";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton.jsx"






function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()


  const [searchInput, setSearchInput] = useState("");


  useEffect(() => {
    if(location.pathname != "/search" && location.pathname != "/"){
      setSearchInput("")
    }
    
  }, [location])






  const handleSearch = async () => {

    if(searchInput == ""){
       await dispatch(getAllStocksThunk())
    }
    else{
      await dispatch(getAllSearchStocksThunk(searchInput))
    }
    console.log("Search submitted:", searchInput);
    navigate("/search")
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


