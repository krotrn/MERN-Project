import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/api/user";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo?.data) navigate(redirect);
  }, [navigate, userInfo, redirect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Login successful!");
      setFormData({ email: "", password: "" });
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || "Network error, please try again.");
    }
  };

  return (
    <div className="flex flex-row items-center justify-between h-full min-h-screen bg-white text-gray-900 p-4">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 px-4">
        <h1 className="text-4xl font-bold mb-6 text-teal-400">Welcome Back</h1>
        <p className="text-gray-400 mb-4">
          Please sign in to continue. Enter your email and password below.
        </p>
        <form
          onSubmit={submitHandler}
          className="bg-white text-gray-900 p-8 rounded-lg shadow-md space-y-6"
        >
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-teal-300"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 bg-[#d2d4da] text-gray-900 rounded-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-teal-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 bg-[#d2d4da] text-gray-900 rounded-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded transition ${
              isLoading ? "cursor-wait opacity-70" : "hover:opacity-90"
            }`}
          >
            {isLoading ? <Loader /> : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-sm text-center">
          New user?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-teal-400 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <img
          src="https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login Illustration"
          className="rounded-lg shadow-lg object-cover w-3/4 h-auto"
        />
      </div>
    </div>
  );
};

export default Login;
