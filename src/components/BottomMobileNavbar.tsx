import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Home } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";

const BottomMobileNavbar = () => {
  const { checkAuth, logout } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await checkAuth();
        if (mounted) setLoggedIn(!!res?.loggedIn);
      } catch (e) {
        if (mounted) setLoggedIn(false);
      }
    })();

    const handle = () => {
      (async () => {
        try {
          const res = await checkAuth();
          if (mounted) setLoggedIn(!!res?.loggedIn);
        } catch (e) {
          if (mounted) setLoggedIn(false);
        }
      })();
    };

    const storageHandler = (e: StorageEvent) => {
      if (e.key === "nawam:auth") handle();
    };

    window.addEventListener("nawam:auth-changed", handle);
    window.addEventListener("storage", storageHandler);

    return () => {
      mounted = false;
      window.removeEventListener("nawam:auth-changed", handle);
      window.removeEventListener("storage", storageHandler);
    };
  }, [checkAuth]);

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("logout failed", e);
    } finally {
      try {
        localStorage.setItem("nawam:auth", String(Date.now()));
      } catch (e) {}
      try {
        window.dispatchEvent(new Event("nawam:auth-changed"));
      } catch (e) {}
      setLoggedIn(false);
      setShowMenu(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-900 border-t border-black/10 dark:border-white/10">
      <div className="max-w-5xl mx-auto px-4">
        <nav className="flex items-center justify-between py-3 min-h-[68px]">
          <Link to="/cart" aria-label="Open cart" className="flex-1">
            <div className="flex flex-col items-center text-center text-sm text-[#A8511A] dark:text-[#A8511A]">
              <ShoppingCart className="h-8 w-8" />
              <span className="mt-1">سلة التسوق</span>
            </div>
          </Link>

          <div className="flex-1 flex justify-center relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((s) => !s)}
              aria-label="Account menu"
              className="flex flex-col items-center text-center text-sm text-[#A8511A] dark:text-[#A8511A] px-2 py-1"
            >
              <User className="h-8 w-8" />
              <span className="mt-1">الحساب</span>
            </button>

            {showMenu && (
              <div className="absolute bottom-14 w-44 bg-white dark:bg-gray-900 border border-[#A8511A]/20 dark:border-[#A8511A]/30 rounded shadow-md p-2 right-1/2 translate-x-1/2 text-right">
                {loggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-3 py-2 text-sm text-[#A8511A] dark:text-[#A8511A] hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    تسجيل الخروج
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setShowMenu(false)}
                    className="block text-right px-3 py-2 text-sm text-[#A8511A] dark:text-[#A8511A] hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    تسجيل الدخول
                  </Link>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/")}
            aria-label="Go to shop"
            className="flex-1 flex flex-col items-center text-center text-sm text-[#A8511A] dark:text-[#A8511A]"
          >
            <Home className="h-8 w-8" />
            <span className="mt-1">الرئيسية</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default BottomMobileNavbar;
