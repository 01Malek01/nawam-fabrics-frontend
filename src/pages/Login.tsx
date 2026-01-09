import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ username, password });
      if (res && res.status === "success" && res.user.role === "admin") {
        // notify other parts of app that auth changed
        try {
          localStorage.setItem("nawam:auth", String(Date.now()));
        } catch (e) {}
        try {
          window.dispatchEvent(new Event("nawam:auth-changed"));
        } catch (e) {}
        navigate("/admin", { replace: true });
      } else if (res && res.status === "success") {
        try {
          localStorage.setItem("nawam:auth", String(Date.now()));
        } catch (e) {}
        try {
          window.dispatchEvent(new Event("nawam:auth-changed"));
        } catch (e) {}
        navigate("/", { replace: true });
      } else {
        setError("Invalid credentials");
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded shadow p-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-right mb-4">
          تسجيل الدخول
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg md:text-xl text-right">
              اسم المستخدم
            </label>
            <input
              title="username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full mt-2 p-3 text-lg md:text-xl border rounded"
            />
          </div>
          <div>
            <label className="block text-lg md:text-xl text-right">
              كلمة المرور
            </label>
            <input
              title="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 p-3 text-lg md:text-xl border rounded"
            />
          </div>
          {error && <div className="text-red-600 text-base">{error}</div>}
          <div className="text-lg md:text-xl text-right">
            ليس لديك حساب؟{" "}
            <Link to="/signup" className="text-primary">
              إنشاء حساب
            </Link>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded text-lg md:text-xl"
              disabled={loading}
            >
              {loading ? "جاري الدخول..." : "دخول"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
