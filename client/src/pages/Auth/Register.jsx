import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useRegisterMutation } from "../../redux/api/user";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { username, email, password, confirmPassword } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo?.data) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const getPasswordStrength = () => {
    if (!password.trim()) return "";
    if (password.length < 6) return "Weak";
    if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.length >= 8
    )
      return "Strong";
    return "Medium";
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      toast.error(
        "Password must be at least 8 characters long and include an uppercase letter and a number."
      );
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("User successfully registered.");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Network error, please try again.");
    }
  };

  return (
    <div className="flex flex-row items-center justify-between min-h-full p-4 bg-white text-gray-900">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 mb-0 px-4">
        <h1 className="text-4xl font-bold mb-6 text-teal-400">Create an Account</h1>
        <p className="text-gray-400 mb-4">
          Please register to continue. Enter Username, Email and Password below.
        </p>
        <form
          onSubmit={submitHandler}
          className="bg-white text-gray-900 p-8 rounded-lg shadow-md space-y-6"
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2 text-teal-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 bg-[#d2d4da] text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your username"
              value={username}
              onChange={handleChange}
              aria-label="Username"
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-teal-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 bg-[#d2d4da] text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              aria-label="Email Address"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-teal-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 bg-[#d2d4da] text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
              aria-label="Password"
              required
              autoComplete="new-password"
            />
            <p className="text-sm mt-1 text-gray-400">
              Strength:{" "}
              <span
                className={`font-bold ${
                  getPasswordStrength() === "Weak"
                    ? "text-red-500"
                    : getPasswordStrength() === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {getPasswordStrength()}
              </span>
            </p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-teal-300">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-2 bg-[#d2d4da] text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={handleChange}
              aria-label="Confirm Password"
              required
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded transition disabled:opacity-50 ${
              isLoading ? "cursor-wait" : "hover:bg-teal-600"
            }`}
          >
            {isLoading ? <Loader /> : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-4">
          Already have an account?{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="text-teal-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Right Section */}
      <div className="hidden w-full lg:w-1/2 lg:flex justify-center">
        <img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Create Account Illustration"
          className="w-full h-auto rounded-lg object-cover shadow-md"
        />
      </div>
    </div>
  );
};

export default Register;
