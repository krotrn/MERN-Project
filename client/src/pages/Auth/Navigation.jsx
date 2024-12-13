import { useState, useEffect, useRef } from "react";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { MdOutlineLocalMovies } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../redux/api/user";
import { toast } from "react-toastify";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [ logoutMutation ] = useLogoutMutation();

  const toggleDropdownOpen = () => setDropdownOpen((prev) => !prev);

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || "Network Error, Try Again");
    }
  };
  // This useEffect hook adds an event listener to detect clicks outside the dropdown.
  // If a click is detected outside the dropdown, it will close the dropdown by setting dropdownOpen to false.
  // The event listener is cleaned up when the component unmounts to avoid memory leaks.
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky flex  w-fit left-0 right-0 bottom-10 mx-auto justify-center items-end z-50">
      <div className="bg-[#0f0f0f] border min-w-fit  p-6 rounded shadow-lg">
        <section className="flex justify-between items-center">
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link
              to="/"
              className="flex items-center text-white hover:text-gray-300 transition"
              aria-label="Home"
            >
              <AiOutlineHome size={26} />
              <span className="hidden sm:block ml-2">Home</span>
            </Link>

            <Link
              to="/movies"
              className="flex items-center text-white hover:text-gray-300 transition"
              aria-label="Movies"
            >
              <MdOutlineLocalMovies size={26} />
              <span className="hidden sm:block ml-2">Movies</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="relative" ref={dropdownRef}>
            {userInfo ? (
              <>
                <button
                  onClick={toggleDropdownOpen}
                  className="text-white flex items-center focus:outline-none"
                  aria-label="User Menu"
                >
                  <span>{userInfo.username}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-2 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                </button>
                {dropdownOpen ? (
                  <ul
                    className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-lg w-40"
                    role="menu"
                  >
                    {userInfo.isAdmin && (
                      <li>
                        <Link
                          to="/admin/movies/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                ) : null}
              </>
            ) : (
              <ul className="flex items-center space-x-6">
                <li>
                  <Link
                    to="/login"
                    className="flex items-center text-white hover:text-gray-300 transition"
                    aria-label="Login"
                  >
                    <AiOutlineLogin size={26} />
                    <span className="hidden sm:block ml-2">Login</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="flex items-center text-white hover:text-gray-300 transition"
                    aria-label="Register"
                  >
                    <AiOutlineUserAdd size={26} />
                    <span className="hidden sm:block ml-2">Register</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Navigation;
