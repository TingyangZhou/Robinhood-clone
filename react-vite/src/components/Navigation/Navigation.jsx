import "./Navigation.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllSearchStocksThunk} from "../../redux/stocks";
import { useDispatch } from "react-redux";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton.jsx"
import { FaFeather, FaSearch } from "react-icons/fa"






function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()


  const [searchInput, setSearchInput] = useState("");

  //reset search bar when navigating away from home
  useEffect(() => {
    if(location.pathname != "/search" && location.pathname != "/"){
      removeSearchState()
    }
  }, [location])

  const removeSearchState = () => {
    sessionStorage.removeItem("searchText")
    setSearchInput("")
  }





  const handleSearch = async () => {

    if(searchInput == ""){
       navigate("/")
       sessionStorage.removeItem("searchText")
       console.log("navigating home")
       return
    }
    console.log("Search submitted:", searchInput);
    sessionStorage.setItem("searchText", searchInput)
    navigate("/search", { state: { from: "/search", searchInput: searchInput } })
    
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
      <div className="logo-home-container">
        <NavLink  onClick={removeSearchState} to="/"><FaFeather className="robinhood-logo-home"/></NavLink>
      </div>
      <div className="search-bar-container">
        <FaSearch />
        <input
       type="text"
       placeholder="search for stocks..."
       value={ sessionStorage.getItem("searchText") ? sessionStorage.getItem("searchText") : searchInput}
       onChange={(e) => {
        sessionStorage.removeItem("searchText")
        setSearchInput(e.target.value)}}
       onKeyDown={handleKeyDown}
       ></input></div>
      <div>
        <ProfileButton/>
      </div>
    </header>
  );
}


export default Navigation;


