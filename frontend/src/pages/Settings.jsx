import { Link } from "react-router-dom";

const Settings = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const getInitials = (name, email) => {
    if (name) {
      const parts = name.trim().split(/\s+/);
      return (parts[0]?.[0] || "") + (parts[1]?.[0] || "").toUpperCase();
    }
    return (email || "?").charAt(0).toUpperCase();
  };

  return (
    <div className="mt-16 min-h-screen bg-black px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="mt-1 text-sm text-neutral-400">Manage your account details.</p>

        {user ? (
          <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-lg font-semibold text-white">
                {getInitials(user?.name, user?.email)}
              </span>
              <div>
                <p className="text-lg font-medium">{user?.name || "User"}</p>
                <p className="text-sm text-neutral-400">{user?.email}</p>
              </div>
            </div>

            <dl className="mt-6 space-y-4 border-t border-neutral-800 pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-400">Name</dt>
                <dd className="text-neutral-200">{user?.name || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-400">Email</dt>
                <dd className="text-neutral-200">{user?.email || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-400">Role</dt>
                <dd className="text-neutral-200">{user?.role || "USER"}</dd>
              </div>
            </dl>

            <div className="mt-6 rounded-lg border border-sky-500/20 bg-sky-500/5 p-4 text-sm text-neutral-300">
              For security reasons, password changes are done via the secure
              <Link to="/login" className="ml-1 text-sky-400 hover:underline">password reset </Link>
              flow. Log out and use the "Forgot password" option on the login screen if you need to update it.
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 text-center">
            <p className="text-neutral-400">You are not logged in.</p>
            <Link to="/login" className="mt-3 inline-block text-sm text-sky-400 hover:underline">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
