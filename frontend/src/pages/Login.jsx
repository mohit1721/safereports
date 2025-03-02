import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/operations/auth"; // Import the login thunk
import {toast} from "react-hot-toast"
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false)
  // const { isLoading, error } = useSelector((state) => state.auth); // Get login status from Redux

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    const response = await loginUser(email, password);
    console.log("logged in response",response);
    if (response.success) {
      // Redirect based on role
      const {role}  = response.user;
      console.log("logged in response role",response.user.role);

      if (role === "POLICESTATION")
      {
        toast.success(`${role} Logged in successfully`)
        navigate("/police-dashboard");
      }
   
      else if (role === "ADMIN") 
      {
        toast.success(`${role} Logged in successfully`)
        navigate("/admin-dashboard");
      }
      else navigate("/"); // Default page
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-neutral-400">Only Police and Admin can login</p>
        <h2 className="text-center text-sm text-neutral-400">
          Sign in to access your admin dashboard
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900/50 backdrop-blur-sm py-8 px-4 shadow-xl border border-neutral-800 rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-neutral-300">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
