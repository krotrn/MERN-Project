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
  const [logoutMutation] = useLogoutMutation();

  const toggleDropdownOpen = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Network Error, Try Again");
    }
  };

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
    <div className="sticky flex w-[40%] left-0 right-0 bottom-10 mx-auto justify-center items-end z-50">
      <div
        className="bg-linear-to-r from-gray-800 via-gray-900 to-black border border-gray-700 w-full min-w-fit p-6 rounded-3xl shadow-2xl backdrop-blur-lg bg-opacity-60"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <section className="flex justify-between space-x-4 py-2">
          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link
              to="/"
              className="flex items-center text-gray-200 hover:text-teal-400 transition-colors"
              aria-label="Home"
            >
              <AiOutlineHome size={26} />
              <span className="hidden sm:block ml-2 font-medium">Home</span>
            </Link>

            <Link
              to="/movies"
              className="flex items-center text-gray-200 hover:text-teal-400 transition-colors"
              aria-label="Movies"
            >
              <MdOutlineLocalMovies size={26} />
              <span className="hidden sm:block ml-2 font-medium">Movies</span>
            </Link>
          </div>

          {/* User Section */}
          {userInfo?.data ? (
            <div className="flex space-x-8 relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdownOpen}
                className="text-gray-200 flex items-center focus:outline-hidden"
                aria-label="User Menu"
              >
                <span className="font-medium">{userInfo.data.username}</span>
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
              {dropdownOpen && (
                <ul
                  className="absolute right-0 bottom-full hover:transform hover:scale-105 transition-transform duration-500 mb-2 bg-linear-to-r from-gray-700 via-gray-800 to-gray-900 text-gray-200 rounded-lg shadow-lg w-48 divide-y divide-gray-600"
                  role="menu"
                >
                  {userInfo?.data?.isAdmin && (
                    <li>
                      <Link
                        to="/admin/movies/dashboard"
                        className="block px-4 py-2 hover:bg-teal-500 hover:text-white transition-colors rounded-t-lg"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-teal-500 hover:text-white transition-colors"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-teal-500 hover:text-white transition-colors rounded-b-lg"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex space-x-8" ref={dropdownRef}>
              <Link
                to="/login"
                className="flex items-center text-gray-200 hover:text-teal-400 transition-colors"
                aria-label="Login"
              >
                <AiOutlineLogin size={26} />
                <span className="hidden sm:block ml-2 font-medium">Login</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center text-gray-200 hover:text-teal-400 transition-colors"
                aria-label="Register"
              >
                <AiOutlineUserAdd size={26} />
                <span className="hidden sm:block ml-2 font-medium">
                  Register
                </span>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Navigation;
