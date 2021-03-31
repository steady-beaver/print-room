import React, { useState, useEffect } from "react";
import { NavLink, Link, useHistory  } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useShoppingBag } from "../../Contexts/ShoppingBagContext"



const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileSubMenuClasses, setProfileSubMenuClasses] = useState("hidden");
  const [posterSubMenuClasses, setPosterSubMenuClasses] = useState("hidden");

  const history = useHistory();
  const { currentUser, logout } = useAuth();

  const { shoppingList } = useShoppingBag();


  const loggingOutFn = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
    setProfileSubMenuClasses("hidden");
    history.push("/login");
  };



  // =======================================================================


  const unauthMenu = (
    <>
      <li> <NavLink to="/" exact> Home </NavLink> </li>
      <li> <NavLink to="/login">Log in</NavLink> </li>
      <li> <NavLink to="/signup">Sign up</NavLink> </li>
    </>
  )

  const authMenu = (
    <>
      <li><NavLink to="/" exact> Home </NavLink></li>

      <li
        onMouseEnter={() => setPosterSubMenuClasses("")}
        onMouseLeave={() => setPosterSubMenuClasses("hidden")}
      >
        <a> Poster </a>
        <div className={posterSubMenuClasses + " sub-menu"}>
          <ul>
            {/* Poster sub menu */}
            <li><NavLink to="/search">Search</NavLink></li>
            <li><NavLink to="/upload">Upload</NavLink></li>
          </ul>
        </div>
      </li>

      <li>
        <NavLink to="/shopping">
          <div id="shоpping-container">
            <img src="/assets/shopping-bag-icon.svg" width="25" alt="Shopping bag icon" />
            <div id="shopping-counter">  {shoppingList.length}  </div>
          </div>
        </NavLink>
      </li>
      <li
        onMouseEnter={() => setProfileSubMenuClasses("")}
        onMouseLeave={() => setProfileSubMenuClasses("hidden")} >
        <a>
          <img src="/assets/profile-icon.svg" width="30" alt="Profile icon" id="profile-icon-img" />
        </a>

        {/* Profile sub menu */}
        <div className={profileSubMenuClasses + " sub-menu"}>
          <ul>
            <li> <Link to="/profile">Profile</Link> </li>
            <li> <a onClick={loggingOutFn}> Log out </a> </li>
          </ul>
        </div>
      </li>
    </>
  );

  const authMobileMenu = (
    <>
      <li><NavLink to="/" exact> Home </NavLink></li>

      <li> <a> Poster </a>
        <div className=" sub-menu">
          <ul>
            {/* Poster sub menu */}
            <li><NavLink to="/search">Search</NavLink></li>
            <li><NavLink to="/upload">Upload</NavLink></li>
          </ul>
        </div>
      </li>

      <li>
        <NavLink to="/shopping"> Shopping bag </NavLink>
      </li>
      <li> <a>Account</a>
        <div className=" sub-menu">
          <ul>
            {/* Profile sub menu */}
            <li> <Link to="/profile">Profile</Link> </li>
            <li> <a onClick={loggingOutFn}> Log out </a> </li>
          </ul>
        </div>
      </li>
    </>
  );

  let menu

  const choosMenu = (user) => {
    if (user == null) {
      return unauthMenu
    }
    else {

      if (isMobileMenuOpen) {
        return authMobileMenu
      }
      else{
        return authMenu
      }
      
    }
  }

  menu = choosMenu(currentUser);

  // ==================================================================

  // Catch the moment when resizing from mobile to tablet 
  // and set isMobileMenuOpened to false

  useEffect(() => {
    menu = unauthMenu;

    const fromMobileToTablet = () => {
      if (window.innerWidth > 640) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', fromMobileToTablet);
    fromMobileToTablet();

    return () => window.removeEventListener('resize', fromMobileToTablet);
  }, [])







  // =======================================================================


  return (
    <header>
      <div className="side-frame ">

        {/*           Logo           */}
        <div id="logo">
          <img src="/assets/logo.svg" alt="Print room company logo" />
        </div>

        {/*           Hamburger (mobile menu link)           */}
        <div id="hamburger-icon">
          <a>
            {isMobileMenuOpen
              ? (
                <img className="close-menu-icon" src="/assets/x-close-icon.svg" alt="Close mobile menu icon"
                  onClick={() => { setIsMobileMenuOpen((currentState) => !currentState); }}
                />
              ) : (
                <img className="open-menu-icon" src="/assets/hamburger-menu-icon.svg" alt="Hamburger mobile menu icon"
                  onClick={() => { setIsMobileMenuOpen((currentState) => !currentState); }}
                />
              )}
          </a>
        </div>

        {/*           Menu items           */}
        <nav className={isMobileMenuOpen ? "full-screen" : ""}>
          <ul onClick={() => setIsMobileMenuOpen(false)}>{menu}</ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
