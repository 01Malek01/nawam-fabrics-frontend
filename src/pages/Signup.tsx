import SignupForm from "@/components/SignupForm";
import useAuth from "@/hooks/useAuth";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const onSubmit = async (data: { username: string; password: string }) => {
    const res = await signup({
      username: data.username,
      password: data.password,
    });
    if (res && res.status === "success") {
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6">
      <SignupForm onSubmit={onSubmit} />
    </div>
  );
}
