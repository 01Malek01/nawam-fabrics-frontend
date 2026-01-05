import { useCallback } from "react";

type AuthCheckResponse = {
  loggedIn: boolean;
  user?: any;
};

export default function useAuth() {
  const BASE = (import.meta.env.VITE_NODE_BACKEND_URL as string) || "";

  const checkAuth = useCallback(async (): Promise<AuthCheckResponse> => {
    const res = await fetch(`${BASE}/auth/check-auth`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { loggedIn: false };
    return res.json();
  }, [BASE]);

  const login = useCallback(
    async (payload: { username: string; password: string }) => {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
      }
      return res.json();
    },
    [BASE]
  );

  const logout = useCallback(async () => {
    await fetch(`${BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  }, [BASE]);
  const signup = useCallback(
    async (payload: { username: string; password: string }) => {
      const res = await fetch(`${BASE}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Signup failed");
      }
      return res.json();
    },
    [BASE]
  );

  return { checkAuth, login, logout, signup };
}
