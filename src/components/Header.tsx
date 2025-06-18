import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarToggle,
  NavbarCollapse,
  DarkThemeToggle,
  Button,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { userActions } from "../store/userSlice";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: TRootState) => state.user.user);

  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const visiblePaths = [
      "/",
      "/home",
      "/about",
      "/register",
      "/login",
      "/profile",
      "/fav-cards",
      "/my-cards",
      "/my-cards/new",
      "/sandbox",
    ];
    setShowNavbar(visiblePaths.includes(location.pathname));
  }, [location.pathname]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (!showNavbar) return null;

  return (
    <Navbar
      fluid
      rounded
      className="bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-3 shadow-md"
    >
      {/* Left side: Brand + Nav Links + Hamburger on mobile */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center space-x-6">
          {/* Brand */}
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-500"
          >
            BCards
          </Link>

          {/* Nav links: hidden on mobile, visible inline on md+ */}
          <NavbarCollapse className="hidden md:flex md:flex-row md:items-center md:space-x-4">
            <Link
              to="/about"
              className={`text-sm ${
                location.pathname === "/about"
                  ? "text-blue-500"
                  : "text-gray-600 dark:text-gray-300"
              } hover:text-blue-500`}
            >
              ABOUT
            </Link>

            {user && (
              <Link
                to="/fav-cards"
                className={`text-sm ${
                  location.pathname === "/fav-cards"
                    ? "text-blue-500"
                    : "text-gray-600 dark:text-gray-300"
                } hover:text-blue-500`}
              >
                FAV CARDS
              </Link>
            )}

            {(user?.isBusiness || user?.isAdmin) && (
              <Link
                to="/my-cards"
                className={`text-sm ${
                  location.pathname === "/my-cards" || location.pathname === "/my-cards/new"
                    ? "text-blue-500"
                    : "text-gray-600 dark:text-gray-300"
                } hover:text-blue-500`}
              >
                MY CARDS
              </Link>
            )}

            {user?.isAdmin && (
              <Link
                to="/sandbox"
                className={`text-sm ${
                  location.pathname === "/sandbox"
                    ? "text-blue-500"
                    : "text-gray-600 dark:text-gray-300"
                } hover:text-blue-500`}
              >
                SANDBOX
              </Link>
            )}
          </NavbarCollapse>
        </div>

        {/* Hamburger visible only on mobile */}
        <NavbarToggle className="md:hidden" aria-label="Toggle navigation menu" />
      </div>

      {/* Right side: Search, profile, dark mode, buttons */}
      <NavbarCollapse className="w-full md:w-auto md:flex md:items-center md:space-x-3 mt-3 md:mt-0">
        <div className="relative w-full md:w-44 mb-2 md:mb-0">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name…"
            className="w-full pl-3 pr-10 py-2 rounded-md text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Search by name"
          />
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {user && (
          <Link to="/profile" title="Profile" className="mb-2 md:mb-0">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-gray-400 hover:border-blue-500 transition duration-200"
            />
          </Link>
        )}

        <DarkThemeToggle className="mb-2 md:mb-0" />

        {!user ? (
          <div className="flex space-x-2">
            <Link to="/register">
              <Button color="light" size="sm">
                SIGNUP
              </Button>
            </Link>
            <Link to="/login">
              <Button color="light" size="sm">
                LOGIN
              </Button>
            </Link>
          </div>
        ) : (
          <Button
            size="sm"
            color="light"
            onClick={() => dispatch(userActions.logout())}
            className="w-full md:w-auto"
          >
            SIGN OUT
          </Button>
        )}
      </NavbarCollapse>
    </Navbar>
  );
};

export default Header;

