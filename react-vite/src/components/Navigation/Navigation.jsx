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


  useEffect(() => {
    if(location.pathname != "/search" && location.pathname != "/"){
      setSearchInput("")
    }
    
  }, [location])






  const handleSearch = async () => {

    if(searchInput == ""){
       navigate("/")
       console.log("navigating home")
       return
    }
    else{
      console.log("dispatching get search stocks")
      await dispatch(getAllSearchStocksThunk(searchInput))
    }
    console.log("Search submitted:", searchInput);
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
        <NavLink to="/"><FaFeather className="robinhood-logo-home"/></NavLink>
      </div>
      <div className="search-bar-container">
        <FaSearch />
        <input
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


