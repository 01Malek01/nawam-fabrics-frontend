import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { checkAuth } = useAuth();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await checkAuth();
        if (!mounted) return;
        const isLogged = !!res?.loggedIn;
        setLoggedIn(isLogged);
        // Try common admin flags: user.role === 'admin' or user.isAdmin
        const user = res?.user;
        const isAdmin = !!(
          user &&
          (user.isAdmin || user.role === "admin" || user.role === "Admin")
        );
        setAuthorized(isLogged && isAdmin);
      } catch (err) {
        setLoggedIn(false);
        setAuthorized(false);
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [checkAuth]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>جارٍ التحقق من صلاحيات الدخول...</div>
      </div>
    );
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!authorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
