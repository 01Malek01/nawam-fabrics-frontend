import React, { useEffect, useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Helmet } from "react-helmet";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await checkAuth();
        if (!mounted) return;
        if (!res || !res.loggedIn) {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        navigate("/login", { replace: true });
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [checkAuth, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>جارٍ التحقق من بيانات الدخول...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>لوحة التحكم - نوام للأقمشة</title>
        <meta
          name="description"
          content="لوحة تحكم المشرف - إدارة المنتجات والفئات."
        />
      </Helmet>
      <div className="min-h-screen bg-background-light dark:bg-background-dark p-6">
        <h1 className="text-2xl font-bold text-right mb-4">
          لوحة التحكم (إدارة)
        </h1>
        <AdminDashboard />
      </div>
    </>
  );
};

export default Admin;
