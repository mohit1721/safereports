import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "https://safereports.onrender.com/api";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/reset-password`, {
        token,
        email,
        newPassword,
      });
      if (data.success) {
        toast.success("Password reset successfully. Please log in.");
        navigate("/login");
      } else {
        toast.error(data.message || "Reset failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordInput = (value, setter, placeholder) => (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="appearance-none block w-full px-3 py-2 pr-10 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
        placeholder={placeholder}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-200 focus:outline-none"
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center py-12 px-4">
        <p className="text-sm text-neutral-400">Invalid or missing reset link.</p>
        <Link to="/forgot-password" className="mt-3 text-sm text-blue-400 hover:underline">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Set New Password
        </h1>
        <p className="text-center text-sm text-neutral-400">
          Choose a new password for {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900/50 backdrop-blur-sm py-8 px-4 shadow-xl border border-neutral-800 rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-300">New password</label>
              {passwordInput(newPassword, setNewPassword, "Enter new password")}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-300">Confirm password</label>
              {passwordInput(confirmPassword, setConfirmPassword, "Confirm new password")}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
