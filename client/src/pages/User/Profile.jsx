import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useUpdateProfileMutation } from "../../redux/api/user.js";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { username, email, password, confirmPassword } = formData;

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo.data) {
      setFormData((data) => ({
        ...data,
        username: userInfo.data.username || "",
        email: userInfo.data.email || "",
      }));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((data) => ({ ...data, [id]: value.trimStart() }));
  };

  const getPasswordStrength = () => {
    if (!password.trim()) return "";
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) {
      return "Strong";
    }
    return "Medium";
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.trim() !== confirmPassword.trim()) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username: username,
        email: email,
        password: password,
      }).unwrap();

      dispatch(setCredentials(res));
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error?.data?.message || "Network Error");
    }
  };

  return (
    <div className="container mx-auto p-4 mt-10">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-xl bg-gray-800 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Update Profile</h2>

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your name"
                className="form-input p-3 rounded-md w-full border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="form-input p-3 rounded-md w-full border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter a new password"
                className="form-input p-3 rounded-md w-full border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <p className="text-sm mt-1 text-gray-400">
                Strength: {" "}
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
              <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                className="form-input p-3 rounded-md w-full border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-teal-500 w-full font-bold text-white py-3 px-4 rounded-md hover:bg-teal-600 transition disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
