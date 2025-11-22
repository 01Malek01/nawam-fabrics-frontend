import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useRef, createContext, useMemo, useContext, useCallback, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useLocation, useNavigate, Link, useParams, useSearchParams, BrowserRouter, Routes, Route } from "react-router-dom";
import { X, ChevronUp, ChevronDown, Search, Menu, Phone, Mail, XIcon, ChevronLeft, ChevronRight, Maximize2, MapPin, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Airtable from "airtable";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FaWhatsapp } from "react-icons/fa";
import Slider from "react-slick";
import { FormProvider, Controller, useFormContext, useFormState, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Helmet } from "react-helmet";
import * as DialogPrimitive from "@radix-ui/react-dialog";
const base = new Airtable({
  apiKey: "patiEYFo7vQVj5D6V.2fbb6321a4d7aea4cf6468cafe705523d5aebf6abd93a293c98b7de2c5603f0c"
}).base("appwCLO3ih961yHM6");
const airtableService = {
  // Get all records
  async getAllRecords(tableName = "Products") {
    try {
      const records = await base(tableName).select().all();
      return records.map((record) => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error("Error fetching records:", error);
      throw error;
    }
  },
  // Get single record by ID
  async getRecordById(id, tableName = "Products") {
    try {
      const record = await base(tableName).find(id);
      return {
        id: record.id,
        ...record.fields
        // Video: record.fields.Video?.[0]?.url || "",
        // VideoUrl: record.fields.VideoUrl || "",
      };
    } catch (error) {
      console.error("Error fetching record:", error);
      throw error;
    }
  },
  // Search records
  async searchRecords(filterByFormula, tableName = "Products") {
    try {
      const records = await base(tableName).select({
        filterByFormula
      }).all();
      return records.map((record) => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error("Error searching records:", error);
      throw error;
    }
  }
};
const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    const fetch2 = async () => {
      setLoading(true);
      try {
        const all = await airtableService.getAllRecords("Categories");
        const main = all.filter((c) => !c?.ParentCategory);
        const subs = all.filter((c) => c?.ParentCategory?.length > 0);
        const mapped = main.map((m) => {
          const children = subs.filter((s) => s.ParentCategory?.includes(m.id)).map((s) => ({ id: s.id, name: s.Name || s.name || "" }));
          return {
            id: m.id,
            name: m.Name || m.name || "",
            subCategories: children
          };
        });
        if (mounted) setCategories(mapped);
      } catch (e) {
        console.error("Failed to load categories for mobile menu", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch2();
    return () => {
      mounted = false;
    };
  }, [isOpen]);
  const toggle = (id) => setExpanded((s) => ({ ...s, [id]: !s[id] }));
  const goToCategory = (id) => {
    onClose();
    navigate(`/categories/${encodeURIComponent(id)}`);
  };
  const goToSubCategory = (mainId, subId) => {
    onClose();
    navigate(
      `/categories/${encodeURIComponent(mainId)}/${encodeURIComponent(subId)}`
    );
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { x: "100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "100%", opacity: 0 },
      transition: { type: "tween", ease: "easeInOut", duration: 0.3 },
      className: "fixed inset-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm p-6 overflow-y-auto",
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-end mb-8", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
            "aria-label": "Close menu",
            children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" })
          }
        ) }),
        /* @__PURE__ */ jsxs("nav", { className: "flex flex-col space-y-6 text-right", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: `text-2xl font-medium ${isActive("/") ? "text-black dark:text-white" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"}`,
              onClick: onClose,
              children: "جميع المنتجات"
            }
          ),
          loading ? /* @__PURE__ */ jsx("div", { className: "text-center", children: "جاري التحميل..." }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: categories.map((c) => /* @__PURE__ */ jsxs("div", { className: "border-t pt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => goToCategory(c.id),
                  className: "text-lg font-medium text-right p-2 flex-1",
                  children: c.name
                }
              ),
              c.subCategories.length > 0 && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => toggle(c.id),
                  className: "p-2",
                  "aria-label": "Toggle subcategories",
                  children: expanded[c.id] ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-5 w-5" })
                }
              )
            ] }),
            expanded[c.id] && /* @__PURE__ */ jsx("div", { className: "pr-4 mt-2 space-y-1 flex flex-col items-end", children: c.subCategories.map((s) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => goToSubCategory(c.id, s.id),
                className: "w-full text-right px-3 py-2 text-base hover:bg-gray-100 dark:hover:bg-gray-800",
                children: s.name
              },
              s.id
            )) })
          ] }, c.id)) }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/about",
              className: `text-2xl font-medium ${isActive("/about") ? "text-black dark:text-white" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"}`,
              onClick: onClose,
              children: "من نحن؟"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/faq",
              className: `text-2xl font-medium ${isActive("/faq") ? "text-black dark:text-white" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"}`,
              onClick: onClose,
              children: "الأسئلة الشائعة"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/contact",
              className: `text-2xl font-medium ${isActive("/contact") ? "text-black dark:text-white" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"}`,
              onClick: onClose,
              children: "تواصل معنا"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/washing-instructions",
              className: `text-2xl font-medium ${isActive("/washing-instructions") ? "text-black dark:text-white" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"}`,
              onClick: onClose,
              children: "إرشادات الغسيل"
            }
          )
        ] })
      ]
    }
  ) });
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        `/categories/all?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };
  useEffect(() => {
    if (!isSearchOpen) return;
    let mounted = true;
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const allCategories = await airtableService.getAllRecords("Categories");
        const mainCategories = allCategories.filter((c) => !c?.ParentCategory).map((c) => ({ id: c.id, name: c.Name || c.name || "" }));
        if (mounted) setCategories(mainCategories.filter((c) => c.name));
      } catch (e) {
        console.error("Failed to load categories", e);
      } finally {
        if (mounted) setIsLoadingCategories(false);
      }
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, [isSearchOpen]);
  const handleCategoryClick = (cat) => {
    setIsSearchOpen(false);
    navigate(`/categories/${encodeURIComponent(cat)}`);
    setSearchQuery("");
  };
  return /* @__PURE__ */ jsx("div", { className: "relative flex items-center", children: isSearchOpen ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "text",
          placeholder: "ابحث عن الأقمشة...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "w-[200px] md:w-[300px]",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          type: "button",
          onClick: () => setIsSearchOpen(false),
          children: "×"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-full mt-2 w-[200px] md:w-[300px] bg-white dark:bg-gray-800 border rounded shadow-md z-50", children: isLoadingCategories ? /* @__PURE__ */ jsx("div", { className: "p-3 text-center", children: "جاري التحميل..." }) : categories.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-3 text-center", children: "لا توجد فئات" }) : /* @__PURE__ */ jsx("ul", { className: "max-h-56 overflow-auto", children: categories.map((c) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      "button",
      {
        className: "w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700",
        onClick: () => handleCategoryClick(c.id),
        children: c.name
      }
    ) }, c.id)) }) })
  ] }) : /* @__PURE__ */ jsx(
    Button,
    {
      variant: "ghost",
      size: "icon",
      onClick: () => setIsSearchOpen(true),
      className: "hover:bg-transparent",
      children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5" })
    }
  ) });
}
const imageCache = /* @__PURE__ */ new Set();
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (imageCache.has(src)) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => {
      imageCache.add(src);
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
};
const LazyImage = ({
  src,
  alt,
  placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="%23999"%3ELoading...%3C/text%3E%3C/svg%3E',
  className = "",
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  useEffect(() => {
    if (imageCache.has(src)) {
      setImageSrc(src);
      setIsLoading(false);
      return;
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            preloadImage(src).then(() => {
              setImageSrc(src);
              setIsLoading(false);
              onLoad?.();
            }).catch(() => {
              setHasError(true);
              setIsLoading(false);
              onError?.();
            });
            if (imgRef.current && observerRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: "50px",
        // Start loading 50px before entering viewport
        threshold: 0.01
      }
    );
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, onLoad, onError]);
  return /* @__PURE__ */ jsx(
    "img",
    {
      ref: imgRef,
      src: imageSrc,
      alt,
      className: `${className} ${isLoading ? "blur-sm" : "blur-0"} ${hasError ? "opacity-50" : "opacity-100"} transition-all duration-300`,
      loading: "lazy",
      decoding: "async",
      ...props
    }
  );
};
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path;
  };
  return /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-black/10 dark:border-white/10 ", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center justify-between px-3 md:px-0", children: [
      /* @__PURE__ */ jsx("div", { className: "md:hidden flex items-center", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsMobileMenuOpen(true),
          className: "p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5",
          "aria-label": "Open menu",
          children: /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center md:justify-start", children: /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "flex items-center gap-4 text-[#A8511A] dark:text-[#A8511A]",
          children: /* @__PURE__ */ jsx(
            "img",
            {
              className: "h-64 md:h-64 w-auto object-contain",
              src: " logo.png",
              alt: "el Nawam fabrics image"
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden flex items-center", children: /* @__PURE__ */ jsx("div", { className: "ml-2", children: /* @__PURE__ */ jsx(SearchBar, {}) }) }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-9", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/",
            className: `text-base font-medium ${isActive("/") ? "font-bold text-[#A8511A] dark:text-[#A8511A]" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"}`,
            children: "جميع المنتجات"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/about",
            className: `text-base font-medium ${isActive("/about") ? "font-bold text-black dark:text-white" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"}`,
            children: "من نحن؟"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/faq",
            className: `text-base font-medium ${isActive("/faq") ? "font-bold text-black dark:text-white" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"}`,
            children: "الأسئلة الشائعة"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/contact",
            className: `text-base font-medium ${isActive("/contact") ? "font-bold text-black dark:text-white" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"}`,
            children: "تواصل معنا"
          }
        ),
        /* @__PURE__ */ jsx(SearchBar, {})
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      MobileMenu,
      {
        isOpen: isMobileMenuOpen,
        onClose: () => setIsMobileMenuOpen(false)
      }
    )
  ] });
};
const Footer = () => {
  const phoneNumber = "0453316154";
  const whatsappNumbers = ["01008124051", "01148820088"];
  const email = "Info@elnawamfabrics.com";
  const footerLinks = [
    { name: "من نحن؟", path: "/about" },
    { name: "الأسئلة الشائعة", path: "/faq" },
    { name: "الشروط و الاحكام", path: "/terms" },
    { name: "سياسة الاسترجاع و الاستبدال", path: "/return-policy" },
    { name: "سياسة الخصوصية", path: "/privacy-policy" },
    { name: "الشحن و التوصيل", path: "/shipping" },
    { name: "الشكاوي و المقترحات", path: "/complaints" },
    { name: "إرشادات الغسيل", path: "/washing-instructions" },
    { name: "أنواع الاقمشة", path: "/fabric-types" },
    { name: "فروعنا", path: "/branches" }
  ];
  return /* @__PURE__ */ jsx("footer", { className: "bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-right", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base sm:text-lg font-semibold text-[#A8511A] mb-3 sm:mb-4", children: "روابط مهمة" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-2 sm:gap-3", children: footerLinks.map((link) => /* @__PURE__ */ jsx(
          Link,
          {
            to: link.path,
            className: "text-gray-600 dark:text-gray-300 hover:text-[#A8511A] dark:hover:text-[#A8511A] transition-colors text-sm sm:text-base py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
            children: link.name
          },
          link.path
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-right", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base sm:text-lg font-semibold text-[#A8511A] mb-3 sm:mb-4", children: "تواصل معنا" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center sm:justify-start gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800", children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 text-gray-500 flex-shrink-0" }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `tel:${phoneNumber}`,
                className: "text-gray-600 dark:text-gray-300 hover:text-[#A8511A] dark:hover:text-[#A8511A] transition-colors text-sm sm:text-base break-all",
                children: phoneNumber
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center sm:justify-start gap-2 mb-2", children: [
              /* @__PURE__ */ jsx(FaWhatsapp, { className: "h-4 w-4 text-green-600 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-300 text-sm sm:text-base font-medium", children: "واتساب:" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 sm:gap-3 sm:mr-6", children: whatsappNumbers.map((number, index) => /* @__PURE__ */ jsxs(
              "a",
              {
                href: `https://wa.me/2${number}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 break-all",
                children: [
                  /* @__PURE__ */ jsx(FaWhatsapp, { className: "w-3 h-3 text-green-600 flex-shrink-0" }),
                  /* @__PURE__ */ jsx("span", { children: number })
                ]
              },
              index
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center sm:justify-start gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-gray-500 flex-shrink-0" }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `mailto:${email}`,
                className: "text-gray-600 dark:text-gray-300 hover:text-[#A8511A] dark:hover:text-[#A8511A] transition-colors text-sm sm:text-base break-all",
                children: email
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-right", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base sm:text-lg font-semibold text-[#A8511A] mb-3 sm:mb-4", children: "النوام للاقمشة" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed px-4 sm:px-0", children: "نقدم أفضل أنواع الأقمشة بجودة عالية وأسعار تنافسية. نحن ملتزمون بتقديم أفضل خدمة لعملائنا." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 mt-6 sm:mt-8 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-500 dark:text-gray-400 text-xs sm:text-sm", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " النوام للاقمشة. جميع الحقوق محفوظة."
    ] }) })
  ] }) });
};
const FloatingWhatsApp = () => {
  const phoneNumber = "01008124051";
  const whatsappLink = `https://wa.me/2${phoneNumber}`;
  return /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 left-6 z-50 group", children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href: whatsappLink,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "flex items-center justify-center w-20 h-20 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse hover:animate-none",
        "aria-label": "تواصل معنا عبر واتساب",
        children: /* @__PURE__ */ jsx(FaWhatsapp, { className: "w-10 h-10" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none", children: [
      "تواصل معنا عبر واتساب",
      /* @__PURE__ */ jsx("div", { className: "absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" })
    ] })
  ] });
};
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function LandingPageCard({
  category,
  onClick,
  className = ""
}) {
  const [showSubcategories, setShowSubcategories] = useState(false);
  const navigate = useNavigate();
  const handleCardClick = () => {
    if (category.subCategories && category.subCategories.length > 0) {
      setShowSubcategories(true);
    } else {
      onClick(category.id);
    }
  };
  const handleSubcategoryClick = (e, subCategoryId) => {
    e.stopPropagation();
    navigate(`/categories/${category.id}/${subCategoryId}`);
    setShowSubcategories(false);
  };
  const handleCloseOverlay = (e) => {
    e.stopPropagation();
    setShowSubcategories(false);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative w-full rounded-xl overflow-hidden cursor-pointer group ${className}`,
      onClick: handleCardClick,
      children: [
        /* @__PURE__ */ jsx("div", { className: "relative w-full h-0 pb-[100%] sm:pb-[75%] md:pb-[66.67%]", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: category.imageUrl,
            alt: category.name,
            className: "absolute inset-0 w-full h-full object-cover object-left-top transition-transform duration-500 group-hover:scale-105"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-5xl font-bold mb-3 drop-shadow-lg", children: category.name }),
          /* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-white mb-4 rounded-full" })
        ] }),
        showSubcategories && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center p-4 sm:p-6 z-50 overflow-y-auto",
            onClick: handleCloseOverlay,
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "w-full max-w-6xl bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 md:p-8 space-y-4 min-h-full flex flex-col",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4 sm:mb-6", children: [
                    /* @__PURE__ */ jsxs("h3", { className: "text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-right w-full", children: [
                      "اختر من ",
                      category.name
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        title: "Close",
                        onClick: handleCloseOverlay,
                        className: "flex-shrink-0 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors ml-4",
                        children: /* @__PURE__ */ jsx(
                          XIcon,
                          {
                            size: 24,
                            className: "sm:w-7 sm:h-7 md:w-8 md:h-8",
                            fill: "black"
                          }
                        )
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4", children: category.subCategories?.map((subCategory) => /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "outline",
                      onClick: (e) => handleSubcategoryClick(e, subCategory.id),
                      className: "cursor-pointer w-full min-h-[80px] sm:min-h-[100px] p-3 sm:p-4 text-center rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md flex items-center justify-center",
                      children: /* @__PURE__ */ jsx("span", { className: "text-base sm:text-lg md:text-xl font-medium text-gray-900 dark:text-white whitespace-normal break-words leading-tight px-2", children: subCategory.name })
                    },
                    subCategory.id
                  )) }),
                  /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-6 sm:hidden", children: /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "outline",
                      onClick: handleCloseOverlay,
                      className: "cursor-pointer px-8 py-3 text-base font-medium border-2",
                      children: "إغلاق"
                    }
                  ) })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
const NextArrow$1 = ({ className, onClick }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${className} !flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg z-10 transition-all duration-300 absolute !right-5 !top-1/2 !transform !-translate-y-1/2`,
      onClick,
      "aria-label": "Next slide",
      children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-6 h-6" })
    }
  );
};
const PrevArrow$1 = ({ className, onClick }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${className} !flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg z-10 transition-all duration-300 absolute !left-5 !top-1/2 !transform !-translate-y-1/2`,
      onClick,
      "aria-label": "Previous slide",
      children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-6 h-6" })
    }
  );
};
const heroSlides = [
  {
    id: 1,
    image: "/banner1.jpeg",
    buttonLink: "/categories"
  },
  {
    id: 3,
    image: "/banner3.png",
    buttonLink: "/categories"
  },
  {
    id: 4,
    image: "/banner4.png",
    buttonLink: "/categories"
  }
];
const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5e3,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    nextArrow: /* @__PURE__ */ jsx(NextArrow$1, {}),
    prevArrow: /* @__PURE__ */ jsx(PrevArrow$1, {}),
    dotsClass: "slick-dots !bottom-6",
    customPaging: () => /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors duration-200 mx-1" }),
    beforeChange: (current, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true
        }
      }
    ]
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full overflow-hidden rounded-lg mb-8", children: [
    /* @__PURE__ */ jsx(Slider, { ...settings, children: heroSlides.map((slide) => /* @__PURE__ */ jsx("div", { className: "relative w-full", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full h-0 pb-[56.25%]", children: [
      " ",
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 w-full h-full", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: slide.image,
          alt: slide.image,
          className: "w-full h-full object-cover",
          loading: "eager"
        }
      ) })
    ] }) }, slide.id)) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-6 right-6 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium", children: [
      currentSlide + 1,
      " / ",
      heroSlides.length
    ] })
  ] });
};
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
const Form = FormProvider;
const FormFieldContext = React.createContext(
  {}
);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = React.createContext(
  {}
);
function FormItem({ className, ...props }) {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "form-item",
      className: cn("grid gap-2", className),
      ...props
    }
  ) });
}
function FormLabel({
  className,
  ...props
}) {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      "data-slot": "form-label",
      "data-error": !!error,
      className: cn("data-[error=true]:text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
}
function FormControl({ ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      "data-slot": "form-control",
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
}
function FormMessage({ className, ...props }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      "data-slot": "form-message",
      id: formMessageId,
      className: cn("text-destructive text-sm", className),
      ...props,
      children: body
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const useCreateReservation = () => {
  const [data, setData] = useState(void 0);
  const [error, setError] = useState(void 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const createReservation = async (payload) => {
    setIsLoading(true);
    setError(void 0);
    try {
      const res = await fetch(
        `${"http://localhost:7227/api"}/Reservations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed with status ${res.status}`);
      }
      const json = await res.json().catch(() => void 0);
      setData(json);
      setIsSuccess(true);
      return json;
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Unknown error");
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };
  return { createReservation, data, error, isLoading, isSuccess };
};
const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "الاسم يجب أن يكون على الأقل حرفين"
  }),
  customerPhone: z.string().regex(/^\+?[0-9\s-]{10,}$/, {
    message: "رقم الهاتف غير صالح"
  }),
  quantityMeters: z.string().min(1, {
    message: "الكمية مطلوبة، ولا يمكن أن تكون فارغة"
  }),
  customerAddress: z.string().min(5, {
    message: "العنوان يجب أن يكون على الأقل 5 أحرف"
  }),
  productRecordId: z.string().min(1, {
    message: "المنتج يجب أن يكون على الأقل 1 حرف"
  }),
  Images: z.array(z.string()).min(1, {
    message: "يجب اختيار صورة واحدة على الأقل"
  })
});
function FabricOrderForm({ fabric }) {
  const { createReservation, isLoading, isSuccess, error } = useCreateReservation();
  useEffect(() => {
    console.log(fabric);
  }, [fabric]);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      quantityMeters: 1,
      customerAddress: "",
      productRecordId: fabric.id,
      Images: []
    }
  });
  async function onSubmit(values) {
    try {
      await createReservation(values);
      form.reset();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "جاري معالجة طلبك..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-red-500 text-4xl mb-4", children: "⚠️" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-red-600 dark:text-red-400", children: "حدث خطأ" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 mb-4", children: "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً." }),
      /* @__PURE__ */ jsx(Button, { onClick: () => navigate("/"), className: "mt-4", children: "المحاولة مرة أخرى" })
    ] });
  }
  if (isSuccess) {
    return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-green-500 text-4xl mb-4", children: "✓" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-green-600 dark:text-green-400", children: "تم إرسال طلبك بنجاح!" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 mb-4", children: "سنتواصل معك قريباً لتأكيد الطلب وتفاصيل الدفع." }),
      /* @__PURE__ */ jsx(Button, { onClick: () => navigate("/"), className: "mt-4", children: "العودة للصفحة الرئيسية" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white", children: [
      "طلب ",
      fabric?.name
    ] }),
    /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "customerName",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "الاسم الكامل" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "أدخل اسمك الكامل", ...field }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "customerPhone",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "رقم الهاتف" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "tel", placeholder: "أدخل رقم هاتفك", ...field }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "quantityMeters",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "الكمية (متر)" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                placeholder: "أدخل الكمية المطلوبة",
                ...field
              }
            ) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "customerAddress",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "العنوان" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              Textarea,
              {
                placeholder: "أدخل عنوانك بالتفصيل",
                className: "min-h-[100px]",
                ...field
              }
            ) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "Images",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "اختر الصور المطلوبة" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: fabric.images?.map((imageUrl, index) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  id: `image-${index}`,
                  checked: field.value?.includes(imageUrl),
                  onChange: (e) => {
                    const updatedImages = e.target.checked ? [...field.value, imageUrl] : field.value.filter((url) => url !== imageUrl);
                    field.onChange(updatedImages);
                  },
                  className: "sr-only peer"
                }
              ),
              /* @__PURE__ */ jsxs(
                "label",
                {
                  htmlFor: `image-${index}`,
                  className: "block relative cursor-pointer rounded-lg overflow-hidden border-5 border-transparent peer-checked:border-blue-500 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(
                      LazyImage,
                      {
                        src: imageUrl,
                        alt: `صورة ${index + 1} للمنتج`,
                        className: "w-full h-32 object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/0 peer-checked:bg-black/20 transition-colors flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full border-2 border-white bg-primary opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-4 h-4 text-white",
                        fill: "currentColor",
                        viewBox: "0 0 20 20",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            fillRule: "evenodd",
                            d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                            clipRule: "evenodd"
                          }
                        )
                      }
                    ) }) })
                  ]
                }
              )
            ] }, index)) }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end gap-4 pt-4", children: /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full sm:w-auto cursor-pointer", children: "تأكيد الطلب" }) })
    ] }) })
  ] });
}
const OrderDialogContext = createContext(
  void 0
);
const OrderDialogProvider = ({ children }) => {
  const [isOrderDialogOpen, setOrderDialogOpen] = useState(false);
  const value = useMemo(() => {
    return {
      isOrderDialogOpen,
      openOrderDialog: () => setOrderDialogOpen(true),
      closeOrderDialog: () => setOrderDialogOpen(false),
      setOrderDialogOpen
    };
  }, [isOrderDialogOpen]);
  return /* @__PURE__ */ jsx(OrderDialogContext.Provider, { value, children });
};
const useOrderDialog = () => {
  const ctx = useContext(OrderDialogContext);
  if (!ctx) {
    throw new Error(
      "useOrderDialog must be used within an OrderDialogProvider"
    );
  }
  return ctx;
};
const FabricCard = ({
  fabric,
  buttonTitle,
  href,
  buttonAction,
  isLazyLoaded = true
}) => {
  const { isOrderDialogOpen, closeOrderDialog } = useOrderDialog();
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const displayPrice = fabric?.price || fabric?._raw?.Price || fabric?._raw?.price || fabric?._raw?.سعر || "";
  return /* @__PURE__ */ jsxs("div", { className: "group relative flex flex-col h-full", children: [
    isImageExpanded && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4",
        onClick: () => setIsImageExpanded(false),
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              title: "Close",
              onClick: (e) => {
                e.stopPropagation();
                setIsImageExpanded(false);
              },
              className: "cursor-pointer absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20",
              children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" })
            }
          ),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: fabric?.image,
              alt: fabric?.name,
              className: "max-h-[90vh] max-w-full object-contain ",
              onClick: (e) => e.stopPropagation()
            }
          )
        ]
      }
    ),
    isOrderDialogOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm",
        onClick: () => closeOrderDialog()
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isOrderDialogOpen ? "opacity-100" : "pointer-events-none opacity-0"}`,
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  title: "Close",
                  onClick: () => closeOrderDialog(),
                  className: "cursor-pointer absolute left-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300",
                  children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
                }
              ),
              /* @__PURE__ */ jsx(FabricOrderForm, { fabric })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col h-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group relative aspect-square overflow-hidden rounded-lg bg-gray-100",
            onClick: () => setIsImageExpanded(true),
            children: [
              isLazyLoaded ? /* @__PURE__ */ jsx(
                LazyImage,
                {
                  src: fabric?.image,
                  alt: fabric?.name,
                  className: "cursor-pointer h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-105"
                }
              ) : /* @__PURE__ */ jsx(
                "img",
                {
                  src: fabric?.image,
                  alt: fabric?.name,
                  className: "cursor-pointer h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-105"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100", children: /* @__PURE__ */ jsx(Maximize2, { className: "h-8 w-8 text-white" }) })
            ]
          }
        ),
        href && /* @__PURE__ */ jsx(
          Link,
          {
            to: href,
            className: "absolute inset-0 z-10",
            "aria-label": `View ${fabric.name}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col mt-3 sm:mt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start sm:items-center justify-between py-2 gap-2 min-h-[3rem] sm:min-h-[3.5rem]", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base sm:text-lg font-medium text-gray-900 dark:text-white leading-tight flex-1", children: fabric?.name }),
          /* @__PURE__ */ jsxs("div", { className: "text-right flex-shrink-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-xl font-bold text-primary leading-tight", children: displayPrice || "—" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1 text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-green-600", children: "جنيه" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-500", children: "/ متر" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-end", children: /* @__PURE__ */ jsx(
          Button,
          {
            onClick: (e) => {
              buttonAction();
              e.preventDefault();
              e.stopPropagation();
            },
            className: "w-full cursor-pointer rounded-lg p-3 sm:p-4 text-base sm:text-lg font-bold mt-auto",
            children: buttonTitle
          }
        ) })
      ] })
    ] })
  ] });
};
const optimizedImageCache = /* @__PURE__ */ new Map();
const optimizeImageWithWeserv = (imageUrl, options = {}) => {
  const cacheKey = `${imageUrl}-${JSON.stringify(options)}`;
  if (optimizedImageCache.has(cacheKey)) {
    return optimizedImageCache.get(cacheKey);
  }
  if (!imageUrl || !imageUrl.startsWith("http")) {
    return imageUrl;
  }
  const {
    width = 800,
    // Default width for product images
    quality = 80,
    // 80% quality for good balance
    format = "webp"
  } = options;
  const params = new URLSearchParams({
    url: imageUrl,
    w: width.toString(),
    q: quality.toString(),
    output: format,
    il: "",
    // Interlace/progressive loading
    af: ""
    // Auto-format (serve best format based on browser support)
  });
  const optimizedUrl = `https://images.weserv.nl/?${params.toString()}`;
  optimizedImageCache.set(cacheKey, optimizedUrl);
  return optimizedUrl;
};
const optimizeImage = (imageUrl, options = {}) => {
  return optimizeImageWithWeserv(imageUrl, options);
};
const optimizeImages = (imageUrls, options = {}) => {
  return imageUrls.map((url) => optimizeImage(url, options));
};
const Fabrics = ({
  categoryId,
  subCategoryId,
  searchQuery,
  showMostSold
}) => {
  const navigate = useNavigate();
  const [fabrics, setFabrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        setIsLoading(true);
        const records = await airtableService.getAllRecords("Products");
        console.log(records);
        const normalized = records.map((r) => {
          const imagesFromImageField = Array.isArray(r.Image) ? r.Image.map((a) => a.url).filter(Boolean) : Array.isArray(r.Images) ? r.Images.map((a) => a?.url ? a.url : a).filter(Boolean) : [];
          const imageUrl = imagesFromImageField[0] || r.image || r.Image && r.Image[0]?.url || r.Images && r.Images[0]?.url || "";
          const optimizedMainImage = imageUrl ? optimizeImage(imageUrl, { width: 800, quality: 80 }) : "";
          const optimizedImages = imagesFromImageField.length > 0 ? optimizeImages(imagesFromImageField, {
            width: 1200,
            quality: 85
          }) : [];
          return {
            id: r.id,
            name: r.Name || r.name || "",
            price: String(r.PricePerMeter || r.PricePerMeter || ""),
            image: optimizedMainImage,
            images: optimizedImages,
            description: r.Description || r.description || "",
            mainCategory: Array.isArray(r.MainCategory) ? r.MainCategory : r.MainCategory || r.mainCategory || [],
            subCategory: Array.isArray(r.SubCategory) ? r.SubCategory : r.SubCategory || r.subCategory || [],
            _raw: r
          };
        });
        let filteredFabrics = normalized;
        if (searchQuery) {
          const searchRegex = new RegExp(searchQuery, "i");
          filteredFabrics = filteredFabrics.filter(
            (fabric) => searchRegex.test(fabric.name) || searchRegex.test(fabric.description) || Array.isArray(fabric.mainCategory) && fabric.mainCategory.join(" ") && searchRegex.test(fabric.mainCategory.join(" ")) || Array.isArray(fabric.subCategory) && fabric.subCategory.join(" ") && searchRegex.test(fabric.subCategory.join(" ")) || Array.isArray(fabric._raw?.MainCategory) && searchRegex.test(fabric._raw.MainCategory.join(" ")) || Array.isArray(fabric._raw?.SubCategory) && searchRegex.test(fabric._raw.SubCategory.join(" "))
          );
        }
        if (categoryId && categoryId !== "all") {
          filteredFabrics = filteredFabrics.filter((fabric) => {
            const hasMainCategory = Array.isArray(fabric.mainCategory) && fabric.mainCategory.includes(categoryId) || String(fabric.mainCategory) === String(categoryId);
            const matchesSubCategory = subCategoryId ? Array.isArray(fabric.subCategory) && fabric.subCategory.includes(subCategoryId) || String(fabric.subCategory) === String(subCategoryId) : true;
            return hasMainCategory && matchesSubCategory;
          });
        }
        if (showMostSold) {
          filteredFabrics = filteredFabrics.filter(
            (fabric) => fabric._raw?.MostSold === true
          );
        }
        setFabrics(filteredFabrics);
      } catch (error) {
        console.error("Error fetching fabrics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFabrics();
  }, [categoryId, subCategoryId, searchQuery, showMostSold]);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx(
      LazyImage,
      {
        src: "/logo.png",
        alt: "Loading...",
        className: "h-32 w-32 md:h-48 md:w-48"
      }
    ) }) });
  }
  if (fabrics.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[50vh] text-center p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-2", children: "لا توجد منتجات" }),
      searchQuery && /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
        'لم يتم العثور على منتجات تطابق بحثك: "',
        searchQuery,
        '"'
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: showMostSold ? "flex overflow-x-auto gap-4 pb-4 snap-x" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4",
      children: fabrics.map((fabric) => /* @__PURE__ */ jsx(
        "div",
        {
          className: showMostSold ? "flex-none w-[280px] snap-start" : void 0,
          children: /* @__PURE__ */ jsx(
            FabricCard,
            {
              fabric,
              href: `/fabric/${fabric.id}`,
              buttonTitle: "اطلب",
              buttonAction: () => navigate(`/fabric/${fabric.id}`),
              isLazyLoaded: false
            }
          )
        },
        fabric.id
      ))
    }
  );
};
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const allCategories = await airtableService.getAllRecords("Categories");
        const mainCategories = allCategories.filter(
          (category) => !category?.ParentCategory
        );
        const subCategories = allCategories.filter(
          (category) => category?.ParentCategory?.length > 0
        );
        const categoriesWithSubs = mainCategories.map((category) => {
          const imageUrl = category.Image?.[0]?.url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAgEn5bBp8A3v5TMgmG_Xy30ZssTkQ8uJQAkn9gjKJvFTKqVKFHIOVfsEWTffLVupooswoJqnDc2pwIS3RFtU8Y2nx3tuFu2A6cdTRVdJ-0zdiZBOmRiFOvmKQGlFK8ViKl_t7BjzhTIi-k9S3DqfghfDdi6L_x8J5uT-4nKcla4hFpaPprg2XU4LthpdL30Fbu88v8p-bqOjfnmxRs-Jhvu-JZQsTMUBEb-j5TB5P-GDg1712IqY5Fe-4yfiTk5UreQ_nUBDL02pY";
          const optimizedImageUrl = imageUrl ? optimizeImage(imageUrl, { width: 600, quality: 80 }) : imageUrl;
          const categorySubs = subCategories.filter((sub) => sub.ParentCategory.includes(category.id)).map((sub) => {
            const subImageUrl = sub.Image?.[0]?.url || imageUrl;
            return {
              id: sub.id,
              name: sub.Name,
              description: sub.Description,
              imageUrl: subImageUrl ? optimizeImage(subImageUrl, { width: 600, quality: 80 }) : subImageUrl,
              productsCount: sub.ProductsCount || 0
            };
          });
          return {
            id: category.id,
            name: category.Name,
            description: category.Description,
            imageUrl: optimizedImageUrl,
            subCategories: categorySubs,
            productsCount: category.ProductsCount || 0
          };
        });
        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx(
      LazyImage,
      {
        src: "/logo.png",
        alt: "Loading...",
        className: "h-32 w-32 md:h-48 md:w-48"
      }
    ) }) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "الرئيسية - النوام للأقمشة" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "اكتشف مجموعة واسعة من الأقمشة عالية الجودة في النوام للأقمشة. تصفح الفئات والمنتجات الأكثر مبيعاً."
        }
      ),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "keywords",
          content: "أقمشة, قماش, ملابس, نوام, fabrics, textile"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen", children: [
      /* @__PURE__ */ jsx(HeroSlider, {}),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-6  text-[#A8511A] dark:text-[#A8511A] text-center", children: "الأصناف الرئيسية" }),
      " ",
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 max-w-7xl mx-auto px-4 py-8", children: categories?.map((category) => /* @__PURE__ */ jsx(
        LandingPageCard,
        {
          category,
          onClick: () => {
            console.log("Selected:", category);
            if (category?.subCategories?.length === 0) {
              navigate(`/categories/${category.id}`);
            }
          },
          className: ""
        },
        category.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-900/50 mt-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12 rounded-lg", children: [
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-8 text-[#A8511A] dark:text-[#A8511A] text-center", children: "الأكثر مبيعا" }) }),
        /* @__PURE__ */ jsx("div", { className: "w-full backdrop-blur-sm bg-white/30 dark:bg-black/30 p-6 rounded-xl shadow-xl overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-amber-500/20 hover:scrollbar-thumb-amber-500/30 pb-2", children: /* @__PURE__ */ jsx(Fabrics, { showMostSold: true }) }) })
      ] }) })
    ] })
  ] });
};
const About = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "من نحن - النوام للأقمشة" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "تعرف على تاريخ وخبرة محلات النوام للأقمشة منذ عام 1972. نقدم أقمشة عالية الجودة وخدمة متميزة."
        }
      )
    ] }),
    /* @__PURE__ */ jsx("section", { className: "max-w-4xl mx-auto py-10 px-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-bold text-[#A8511A] mb-2", children: "✨ محلات النوام للأقمشة والأصواف ✨" }),
        /* @__PURE__ */ jsx("div", { className: "w-24 h-1 bg-[#A8511A] mx-auto rounded-full" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-gray-700 dark:text-gray-300 text-lg leading-relaxed", children: [
            "منذ عام ",
            /* @__PURE__ */ jsx("strong", { className: "text-[#A8511A]", children: "1972" }),
            " ونحن نمنحك الأناقة بخامات راقية واختيارات فريدة من أقمشة الصوف، الكشمير، الجلابيات، والبدل الرجالية."
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 text-lg leading-relaxed mt-3", children: "نختار لك الأفضل لتصميم إطلالة تليق بذوقك الراقي." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4 text-right", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-[#A8511A] mb-4", children: "معلومات التواصل" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start gap-3 p-3 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors", children: [
            /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 font-medium", children: "البحيرة – دمنهور – منطقة العبّارة – برج اللواء – أمام مدرسة التعاون" }) }),
            /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-gray-500 flex-shrink-0" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-right", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start gap-3 mb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-300 font-medium", children: "واتساب:" }),
              /* @__PURE__ */ jsx(FaWhatsapp, { className: "h-5 w-5 text-green-600 flex-shrink-0" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 mr-8", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "https://wa.me/201148820088",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm flex items-center justify-start gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 p-1 rounded",
                  children: [
                    /* @__PURE__ */ jsx(FaWhatsapp, { className: "w-3 h-3 text-green-600 flex-shrink-0" }),
                    /* @__PURE__ */ jsx("span", { children: "01148820088" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "https://wa.me/201008124051",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm flex items-center justify-start gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 p-1 rounded",
                  children: [
                    /* @__PURE__ */ jsx(FaWhatsapp, { className: "w-3 h-3 text-green-600 flex-shrink-0" }),
                    /* @__PURE__ */ jsx("span", { children: "01008124051" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start gap-3 p-3 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors", children: [
            /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 font-medium", children: "شحن لجميع المحافظات" }) }),
            /* @__PURE__ */ jsx(Truck, { className: "h-5 w-5 text-gray-500 flex-shrink-0" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-[#A8511A] mb-3", children: "قيمنا" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-[#A8511A] mb-2", children: "الجودة العالية" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "نختار أفضل الخامات من مصادر موثوقة لضمان رضا عملائنا" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-[#A8511A] mb-2", children: "الخدمة المتميزة" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "فريق عمل متخصص لمساعدتك في اختيار الأنسب لك" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-[#A8511A] mb-2", children: "الأسعار التنافسية" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "نقدم أفضل الأسعار مع ضمان الجودة العالية" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-[#A8511A] mb-2", children: "الشحن السريع" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "توصيل آمن وسريع لجميع أنحاء الجمهورية" })
            ] })
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
const Contact = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "اتصل بنا - النوام للأقمشة" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "تواصل معنا في نوام للأقمشة. نحن هنا لمساعدتك في اختيار الأقمشة المناسبة."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto py-10 px-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-right", children: "❓ الأسئلة الشائعة" }),
      /* @__PURE__ */ jsx("div", { className: "bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-3 text-gray-900 dark:text-white", children: "🧵 1. هل الأقمشة أصلية وجودتها مضمونة؟" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "نعم، جميع الأقمشة لدينا أصلية ومختارة بعناية من أفضل المصانع المحلية والمستوردة لضمان أعلى جودة وأفضل خامة." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-3 text-gray-900 dark:text-white", children: "📦 2. هل توفرون الشحن لجميع المحافظات؟" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "نعم، يتوفر شحن لجميع محافظات مصر من خلال شركات شحن موثوقة لضمان سرعة التوصيل وسلامة المنتج." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-3 text-gray-900 dark:text-white", children: "💰 3. ما هي طريقة الدفع؟" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "يتم دفع عربون 10٪ من قيمة الطلب عن طريق فودافون كاش أو إنستا باي، والباقي يُسدّد عند استلام الطلب من المندوب." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-3 text-gray-900 dark:text-white", children: "⏱️ 4. كم تستغرق مدة التوصيل؟" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "عادة يتم التوصيل خلال من 2 إلى 5 أيام عمل حسب المحافظة ومكان العميل." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-3 text-gray-900 dark:text-white", children: "🔄 5. هل يمكن استبدال أو إرجاع المنتج؟" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "نعم، يمكنك الاستبدال أو الإرجاع خلال 14 يومًا من الاستلام بشرط أن يكون القماش بحالته الأصلية ولم يُستخدم أو يُقصّ." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-3 text-gray-900 dark:text-white", children: "🧽 6. كيف أعتني بالقماش بعد الشراء؟" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "ننصح دائمًا بـ الغسيل الجاف للأصواف والصوف الكشمير، وتجنب استخدام الماء الساخن أو العصر القوي للحفاظ على نعومة القماش وجودته." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-3 text-gray-900 dark:text-white", children: "📞 7. كيف يمكنني التواصل معكم؟" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed mb-3", children: "يمكنك التواصل معنا مباشرة عبر:" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-gray-700 dark:text-gray-300", children: [
            /* @__PURE__ */ jsx("p", { className: "flex items-center justify-end gap-2", children: /* @__PURE__ */ jsx("span", { children: "📲 واتساب: 01148820088 / 01008124051" }) }),
            /* @__PURE__ */ jsx("p", { className: "flex items-center justify-end gap-2", children: /* @__PURE__ */ jsx("span", { children: "📍 أو زيارة الفرع: البحيرة – دمنهور – منطقة العبّارة – برج اللواء – أمام مدرسة التعاون" }) })
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const NextArrow = ({ className, style, onClick }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${className} !flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg z-10`,
      style: { ...style, right: "10px" },
      onClick,
      "aria-label": "Next slide",
      children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-6 h-6" })
    }
  );
};
const PrevArrow = ({ className, style, onClick }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${className} !flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg z-10`,
      style: { ...style, left: "10px" },
      onClick,
      "aria-label": "Previous slide",
      children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-6 h-6" })
    }
  );
};
const ImagesSlider = ({ images }) => {
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const mainSettings = {
    dots: window.innerWidth >= 768,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
    nextArrow: /* @__PURE__ */ jsx(NextArrow, {}),
    prevArrow: /* @__PURE__ */ jsx(PrevArrow, {}),
    dotsClass: "slick-dots !bottom-4 hidden md:block",
    customPaging: () => /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-200" }),
    beforeChange: (current, next) => setCurrentSlide(next)
  };
  const overlaySettings = {
    dots: window.innerWidth >= 768,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
    nextArrow: /* @__PURE__ */ jsx(NextArrow, {}),
    prevArrow: /* @__PURE__ */ jsx(PrevArrow, {}),
    initialSlide: currentSlide,
    dotsClass: "slick-dots !bottom-8",
    customPaging: () => /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-200" }),
    afterChange: (current) => setCurrentSlide(current)
  };
  const handlePopState = useCallback(() => {
    if (isOverlayOpen) {
      setIsOverlayOpen(false);
      window.history.pushState(null, "", window.location.href);
    } else {
      window.history.back();
    }
  }, [isOverlayOpen]);
  useEffect(() => {
    if (isOverlayOpen) {
      window.history.pushState({ modalOpen: true }, "", window.location.href);
    }
  }, [isOverlayOpen]);
  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handlePopState]);
  const handleImageClick = (index) => {
    setCurrentSlide(index);
    setIsOverlayOpen(true);
  };
  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "slider-container relative group", children: [
    /* @__PURE__ */ jsx(Slider, { ...mainSettings, ref: (slider) => setSlider1(slider), children: images.map((image, index) => /* @__PURE__ */ jsx("div", { className: "px-2", children: /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden rounded-lg cursor-zoom-in", children: /* @__PURE__ */ jsx(
      LazyImage,
      {
        src: image,
        alt: `Fabric ${index + 1}`,
        className: "w-full h-96 object-cover rounded-lg transition-transform duration-300 hover:scale-105",
        onClick: () => handleImageClick(index)
      }
    ) }) }, index)) }),
    images.length > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-4 px-2", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-300 mb-3 text-center", children: [
        images.length,
        " صور متاحة - انقر للتصفح"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2", children: images.map((image, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          className: `group relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 ${currentSlide === idx ? "border-[#A8511A] ring-2 ring-[#A8511A]/20" : "border-gray-200 hover:border-[#A8511A]/50"}`,
          onClick: () => {
            if (slider1) {
              slider1.slickGoTo(idx);
              setCurrentSlide(idx);
            }
          },
          "aria-label": `View image ${idx + 1}`,
          children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: image,
                alt: `Fabric thumbnail ${idx + 1}`,
                className: "w-full h-full object-cover transition-transform duration-200 group-hover:scale-110",
                loading: "lazy"
              }
            ),
            currentSlide === idx && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#A8511A]/20 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-[#A8511A] rounded-full" }) })
          ]
        },
        idx
      )) })
    ] }),
    /* @__PURE__ */ jsx(DialogPrimitive.Root, { open: isOverlayOpen, onOpenChange: setIsOverlayOpen, children: /* @__PURE__ */ jsx(DialogPrimitive.Portal, { children: /* @__PURE__ */ jsx(DialogPrimitive.Overlay, { className: "fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        className: "relative max-w-6xl w-full max-h-[90vh]",
        onPointerDownOutside: handleCloseOverlay,
        onEscapeKeyDown: handleCloseOverlay,
        children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "default",
              size: "icon",
              className: "absolute -top-12 right-0 z-50 bg-gray-800 hover:bg-gray-700 text-white border-none",
              onClick: handleCloseOverlay,
              "aria-label": "Close overlay",
              children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" })
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-white text-center absolute -top-12 inset-0", children: "اسحب لليمين او لليسار لتصفح الصور" }),
          /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full", children: [
            /* @__PURE__ */ jsx(
              Slider,
              {
                ...overlaySettings,
                ref: (slider) => setSlider2(slider),
                children: images.map((image, index) => /* @__PURE__ */ jsx("div", { className: "outline-none", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-[70vh]", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: image,
                    alt: `Fabric ${index + 1} - Full view`,
                    className: "max-h-full max-w-full object-contain rounded-lg"
                  }
                ) }) }, index))
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "mt-4 px-8", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center space-x-2 overflow-x-auto py-2", children: images.map((image, idx) => /* @__PURE__ */ jsx(
              "button",
              {
                className: `flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${currentSlide === idx ? "border-white scale-110" : "border-transparent hover:border-white/50"}`,
                onClick: () => {
                  if (slider2) {
                    slider2.slickGoTo(idx);
                  }
                },
                children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: image,
                    alt: `Thumbnail ${idx + 1}`,
                    className: "w-full h-full object-cover"
                  }
                )
              },
              idx
            )) }) })
          ] })
        ]
      }
    ) }) }) })
  ] });
};
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
              children: [
                /* @__PURE__ */ jsx(XIcon, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
const VideoIframe = ({ videoUrl }) => {
  return /* @__PURE__ */ jsx("div", { className: "max-w-[100vw] h-[30rem] overflow-hidden rounded-lg mx-auto", children: /* @__PURE__ */ jsx(
    "iframe",
    {
      className: "w-full h-full",
      src: videoUrl,
      title: "Product Video",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowFullScreen: true
    }
  ) });
};
function FabricPage() {
  const { fabricId } = useParams();
  const { isOrderDialogOpen, setOrderDialogOpen } = useOrderDialog();
  const [fabric, setFabric] = useState(null);
  useEffect(() => {
    const fetchFabric = async () => {
      const fabricData = await airtableService.getRecordById(
        fabricId
      );
      const rawImages = fabricData.Image?.map((image) => image.url) || [];
      const optimizedImageUrls = rawImages.length > 0 ? optimizeImages(rawImages, { width: 1200, quality: 85 }) : [];
      setFabric({
        id: fabricData.id,
        images: optimizedImageUrls,
        name: fabricData.Name,
        price: fabricData.PricePerMeter,
        description: fabricData?.Description || "",
        mainCategory: fabricData.MainCategory,
        subCategory: fabricData.SubCategory,
        videoUrl: fabricData.VideoUrl || fabricData?.Video?.[0]?.url || ""
      });
    };
    fetchFabric();
  }, [fabricId]);
  if (!fabric) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx(
      LazyImage,
      {
        src: "/logo.png",
        alt: "Loading...",
        className: "h-32 w-32 md:h-48 md:w-48"
      }
    ) }) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxs("title", { children: [
        fabric?.name || "قماش",
        " - النوام للأقمشة"
      ] }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: fabric?.description || "تفاصيل القماش في النوام للأقمشة"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white p-4 rounded-lg shadow lg:order-2", children: fabric.images && fabric.images.length > 0 ? /* @__PURE__ */ jsx(ImagesSlider, { images: fabric.images }) : /* @__PURE__ */ jsx("div", { className: "w-full h-64 bg-gray-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { children: "No images available" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 order-1", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: fabric.name }) }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-primary flex  items-center  gap-2", children: [
            fabric?.price,
            /* @__PURE__ */ jsx("span", { className: "  text-green-600", children: "جنيه" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-base font-medium text-gray-500", children: "/ متر" })
          ] }),
          fabric.description && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900", children: "الوصف" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 whitespace-pre-line", children: fabric.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-gray-200", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                className: "w-full md:w-auto cursor-pointer",
                onClick: () => setOrderDialogOpen(true),
                children: "طلب الآن"
              }
            ),
            /* @__PURE__ */ jsx(
              Dialog,
              {
                open: isOrderDialogOpen,
                onOpenChange: setOrderDialogOpen,
                children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[425px] max-h-[90vh] overflow-y-auto", children: fabric && /* @__PURE__ */ jsx(FabricOrderForm, { fabric }) })
              }
            )
          ] })
        ] })
      ] }),
      fabric.videoUrl && /* @__PURE__ */ jsxs("div", { className: "product-video w-full mt-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "مقطع الفيديو للمنتج" }),
        /* @__PURE__ */ jsx(VideoIframe, { videoUrl: fabric.videoUrl })
      ] })
    ] })
  ] });
}
function ProductsPage() {
  const { categoryId, subCategoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "المنتجات - النوام للأقمشة" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "تصفح مجموعة واسعة من الأقمشة حسب الفئة أو البحث في النوام للأقمشة."
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      Fabrics,
      {
        categoryId,
        subCategoryId,
        searchQuery: searchQuery || void 0
      }
    ) })
  ] });
}
const FAQ = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "الأسئلة الشائعة - النوام للأقمشة" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "إجابات على الأسئلة الشائعة حول الأقمشة، الشحن، الجودة، والخدمات في نوام للأقمشة."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-3xl mx-auto py-10 px-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-right", children: "الأسئلة الشائعة" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-right", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-primary-600", children: "🚚 أسئلة عن الشحن والتوصيل" }),
          /* @__PURE__ */ jsxs("details", { className: "border rounded-lg p-4 bg-white/60 dark:bg-white/5", children: [
            /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-lg font-semibold", children: "هل لديكم شحن لجميع المحافظات؟" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-black/80 dark:text-white/80", children: "نعم، نوفر الشحن إلى جميع محافظات مصر حتى باب البيت بفضل الله. متوسط وقت التوصيل يومان لمعظم المحافظات." })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "border rounded-lg p-4 bg-white/60 dark:bg-white/5", children: [
            /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-lg font-semibold", children: "هل يمكنني معاينة المنتج قبل الاستلام؟" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-black/80 dark:text-white/80", children: "للأسف لا يمكن المعاينة قبل الاستلام وذلك لحماية المنتج من التلف أو السرقة، حيث أن شركات الشحن تلغي مسؤوليتها في حالة الموافقة على المعاينة. لكن لا تقلق، نوفر لك ضمان الاستبدال أو الاسترجاع بعد استلام المنتج إذا لم يكن مطابقاً للتوقعات." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-primary-600", children: "💳 أسئلة عن الدفع" }),
          /* @__PURE__ */ jsxs("details", { className: "border rounded-lg p-4 bg-white/60 dark:bg-white/5", children: [
            /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-lg font-semibold", children: "ما هي طرق الدفع المتاحة؟" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 text-black/80 dark:text-white/80 space-y-2", children: [
              /* @__PURE__ */ jsx("p", { children: "نوفر عدة خيارات سهلة وآمنة للدفع:" }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc pr-5 space-y-1", children: [
                /* @__PURE__ */ jsx("li", { children: "💳 الدفع عند الاستلام (مع رسوم عربون ١٠٪)" }),
                /* @__PURE__ */ jsx("li", { children: "📱 فودافون كاش" }),
                /* @__PURE__ */ jsx("li", { children: "📲 انستا باي" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "border rounded-lg p-4 bg-white/60 dark:bg-white/5", children: [
            /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-lg font-semibold", children: "كيف يعمل نظام الدفع عند الاستلام؟" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-black/80 dark:text-white/80", children: 'عند اختيار "الدفع عند الاستلام"، نحجز عربون ١٠٪ من إجمالي قيمة الطلبية قبل الشحن، ثم تقوم بدفع المبلغ المتبقي عند استلام الطلبية.' })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-primary-600", children: "🔄 أسئلة عن الإرجاع والاستبدال" }),
          /* @__PURE__ */ jsxs("details", { className: "border rounded-lg p-4 bg-white/60 dark:bg-white/5", children: [
            /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-lg font-semibold", children: "هل يوجد سياسة استبدال أو استرجاع؟" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-black/80 dark:text-white/80", children: "نعم، نوفر خدمة الاستبدال والاسترجاع مع ضمان جودة المنتج لضمان رضاك التام عن شرائك." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-primary-600", children: "📞 أسئلة عن التواصل" }),
          /* @__PURE__ */ jsxs("details", { className: "border rounded-lg p-4 bg-white/60 dark:bg-white/5", children: [
            /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-lg font-semibold", children: "هل يوجد رقم واتساب للتواصل؟" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 text-black/80 dark:text-white/80", children: [
              /* @__PURE__ */ jsx("p", { children: "نعم، يمكنك التواصل معنا مباشرة على:" }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold mt-1", children: "01148820088" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2", children: "فريق خدمة العملاء متاح لمساعدتك في أي استفسار." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "border rounded-lg p-4 bg-white/60 dark:bg-white/5", children: [
            /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-lg font-semibold", children: "كيف أطمئن على طلبي بعد التوصيل؟" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-black/80 dark:text-white/80", children: "جميع طلباتنا مغلقة بشكل آمن ومحكم. في حال وجود أي استفسار عن المنتج بعد الاستلام، يمكنك التواصل معنا على الواتساب وسنقوم بمساعدتك على الفور." })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const TermsAndConditions = () => {
  return /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto py-10 px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-right", children: "الشروط والأحكام" }),
    /* @__PURE__ */ jsx("div", { className: "bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "🏪 1. التعريف بالموقع" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: [
          "يُدار هذا الموقع من قبل **محلات النوام للأقمشة والأصواف الراقية**، ويقع مقرنا في:",
          /* @__PURE__ */ jsx("br", {}),
          "**📍 محافظة البحيرة – دمنهور – منطقة العَبّارة – برج اللواء – أمام مدرسة التعاون**",
          /* @__PURE__ */ jsx("br", {}),
          "**📞 01148820088 | 📞 01008124051**",
          /* @__PURE__ */ jsx("br", {}),
          "يُقدّم الموقع عرضًا لمجموعة مختارة من الأقمشة الرجالية عالية الجودة مع إمكانية الطلب والتوصيل لجميع المحافظات داخل مصر."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "💳 2. الطلب والدفع" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-none space-y-2 text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ jsx("li", { children: "**عند اختيار أي منتج** من السلة، يقوم العميل بإدخال بياناته الصحيحة (الاسم – رقم الهاتف – العنوان)." }),
          /* @__PURE__ */ jsx("li", { children: "**بعد تأكيد الطلب، يتم دفع عربون بنسبة 10%** من قيمة المنتج عن طريق فودافون كاش أو إنستا باي." }),
          /* @__PURE__ */ jsx("li", { children: "**يتم سداد باقي المبلغ** عند استلام الطلب من المندوب." }),
          /* @__PURE__ */ jsx("li", { children: "**في حال عدم دفع العربون خلال 24 ساعة،** يحق للمحل إلغاء الطلب تلقائيًا." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "🚚 3. الشحن والتوصيل" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-none space-y-2 text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ jsx("li", { children: "**يتم الشحن إلى جميع محافظات** جمهورية مصر العربية عن طريق شركات شحن معتمدة." }),
          /* @__PURE__ */ jsx("li", { children: "**يتم التواصل مع العميل** لتأكيد العنوان وموعد التسليم قبل الشحن." }),
          /* @__PURE__ */ jsx("li", { children: "**مدة التوصيل تختلف حسب المحافظة،** عادة من ٢ إلى ٥ أيام عمل." }),
          /* @__PURE__ */ jsx("li", { children: "**في حال تعذر التواصل مع العميل لأكثر من مرتين،** يتم إلغاء الطلب تلقائيًا." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "🔄 4. سياسة الاستبدال والاسترجاع" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-none space-y-2 text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ jsx("li", { children: "**يحق للعميل استبدال أو استرجاع المنتج خلال 14 يومًا** من تاريخ الاستلام في حال وجود عيب مصنعي أو اختلاف في المواصفات المتفق عليها." }),
          /* @__PURE__ */ jsx("li", { children: "**يجب أن يكون المنتج بحالته الأصلية** دون استخدام أو تفصيل." }),
          /* @__PURE__ */ jsx("li", { children: "**يتحمل العميل تكلفة الشحن** في حال الرغبة في التبديل بدون وجود عيب في المنتج." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "🔖 5. الملكية الفكرية" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "جميع الصور، التصاميم، والشعارات المعروضة على الموقع هي **ملك حصري لـ محلات النوام للأقمشة والأصواف**، ولا يجوز استخدامها أو نسخها دون إذن خطي مسبق من إدارة المحل." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "🔐 6. سياسة الخصوصية" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-none space-y-2 text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ jsx("li", { children: "**نحن نحترم خصوصية عملائنا،** وجميع البيانات التي يتم جمعها من خلال الموقع (الاسم – الهاتف – العنوان) تُستخدم فقط لغرض التواصل وتوصيل الطلب." }),
          /* @__PURE__ */ jsx("li", { children: "**يتم إرسال تفاصيل الطلب** لإدارة المحل عبر قناة خاصة ومؤمَّنة على تليجرام، ولا يتم مشاركة هذه البيانات مع أي طرف ثالث." }),
          /* @__PURE__ */ jsx("li", { children: "**نحن ملتزمون بالحفاظ على سرية البيانات** وعدم استخدامها لأي أغراض تسويقية دون موافقة العميل." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "⚙️ 7. التعديلات" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "يحتفظ **محل النوام للأقمشة والأصواف** بالحق في تعديل هذه الشروط والأحكام في أي وقت، ويتم نشر التحديثات على هذه الصفحة فورًا." })
      ] })
    ] }) })
  ] });
};
const ReturnPolicy = () => {
  return /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto py-10 px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-right", children: "سياسة الاسترجاع و الاستبدال" }),
    /* @__PURE__ */ jsx("div", { className: "bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "border-r-4 border-[#A8511A] pr-4", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "يحق للعميل إرجاع القماش في حد أقصاه 14 يوم من تاريخ فاتورة الشراء ( من تاريخ استلام المنتج )." }) }),
      /* @__PURE__ */ jsx("div", { className: "border-r-4 border-[#A8511A] pr-4", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "يحق للعميل إرجاع البضاعة المباعة له بعد فحصها, وقد يستغرق مدة فحصة 4 أيام عمل كحد أقصى من تاريخ إرجاعه." }) }),
      /* @__PURE__ */ jsx("div", { className: "border-r-4 border-[#A8511A] pr-4", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "يجب التأكد من عدم وجود أي خلل مصنعي قبل تفصيل القماش, والشركة لا تتحمل أي تبعات أخرى تمت على المنتج بعد تفصيل القماش." }) }),
      /* @__PURE__ */ jsx("div", { className: "border-r-4 border-[#A8511A] pr-4", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "يجب أن تكون البضاعة المسترجعة على نفس حالتها الأصلية, ولم تتعرض لأي تلف أو تغير من قص أو غسيل أو تعرض القماش لمؤثرات خارجية." }) })
    ] }) })
  ] });
};
const PrivacyPolicy = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "سياسة الخصوصية - النوام للأقمشة" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "اقرأ سياسة الخصوصية لموقع النوام للأقمشة. نحن نحترم خصوصيتك ونحمي بياناتك."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto py-10 px-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-right", children: "سياسة الخصوصية" }),
      /* @__PURE__ */ jsx("div", { className: "bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed font-semibold", children: [
          "🔐 سياسة الخصوصية – محلات النوام للأقمشة والأصواف",
          /* @__PURE__ */ jsx("br", {}),
          "في **محلات النوام للأقمشة والأصواف الراقية**، نحترم خصوصية عملائنا ونلتزم بحماية جميع المعلومات الشخصية التي يتم جمعها من خلال موقعنا الإلكتروني. يُرجى قراءة هذه السياسة بعناية لمعرفة كيفية تعاملنا مع بياناتك عند استخدامك للموقع."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "🧾 1. جمع المعلومات" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "نقوم بجمع بعض البيانات عند قيام العميل بتقديم طلب أو ملء نموذج على الموقع، وتشمل هذه البيانات:" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-none space-y-1 mt-2 text-gray-700 dark:text-gray-300", children: [
            /* @__PURE__ */ jsx("li", { children: "الاسم الكامل" }),
            /* @__PURE__ */ jsx("li", { children: "رقم الهاتف" }),
            /* @__PURE__ */ jsx("li", { children: "العنوان الكامل للتوصيل" }),
            /* @__PURE__ */ jsx("li", { children: "ملاحظات الطلب (إن وُجدت)" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed mt-2", children: "يتم جمع هذه المعلومات فقط لتسهيل عملية التواصل، تجهيز الطلب، وتأكيد الشحن." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "💬 2. استخدام المعلومات" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "نستخدم البيانات الشخصية المقدمة من العملاء للأغراض التالية فقط:" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-none space-y-1 mt-2 text-gray-700 dark:text-gray-300", children: [
            /* @__PURE__ */ jsx("li", { children: "تجهيز الطلبات وإتمام عملية البيع." }),
            /* @__PURE__ */ jsx("li", { children: "التواصل مع العميل لتأكيد الطلب أو الرد على الاستفسارات." }),
            /* @__PURE__ */ jsx("li", { children: "ترتيب عملية الشحن والتسليم." }),
            /* @__PURE__ */ jsx("li", { children: "تحسين تجربة المستخدم وتطوير الخدمات." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed mt-2 font-semibold", children: "لن نقوم بأي حال من الأحوال ببيع أو مشاركة هذه البيانات مع أي طرف ثالث خارج المحل." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "🔒 3. حماية المعلومات" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "نلتزم بحماية بيانات العملاء من أي وصول غير مصرح به أو تعديل أو إفشاء. تُرسل تفاصيل الطلبات إلى إدارة المحل عبر قناة خاصة ومؤمَّنة على تطبيق تليجرام لضمان سرية المعلومات. كما نُطبّق إجراءات أمنية تقنية وإدارية للحفاظ على سلامة المعلومات." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "📬 4. التواصل مع العملاء" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "قد نتواصل مع العملاء عبر الهاتف أو تطبيق واتساب أو البريد الإلكتروني فقط لتأكيد الطلبات أو متابعة عمليات التوصيل." }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed mt-2 font-semibold", children: [
            "📞 أرقام التواصل الرسمية:",
            /* @__PURE__ */ jsx("br", {}),
            "واتساب الأساسي: **01148820088**",
            /* @__PURE__ */ jsx("br", {}),
            "رقم إضافي للتواصل: **01008124051**"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed mt-2", children: "لن نستخدم بياناتك لأي أغراض تسويقية دون موافقتك المسبقة." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "⚙️ 5. ملفات تعريف الارتباط (Cookies)" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "قد يستخدم الموقع ملفات تعريف الارتباط لتحسين تجربة التصفح. يمكن للعميل رفض استخدام هذه الملفات من إعدادات المتصفح، لكن ذلك قد يؤثر على بعض خصائص الموقع." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "🧾 6. حقوق العميل" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-none space-y-1 mt-2 text-gray-700 dark:text-gray-300", children: [
            /* @__PURE__ */ jsx("li", { children: "للعميل الحق في طلب معرفة البيانات المسجّلة عنه أو تعديلها أو حذفها." }),
            /* @__PURE__ */ jsx("li", { children: "يمكن للعميل التواصل معنا عبر الأرقام أو زيارة مقرنا:" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed mt-1", children: "**📍 محافظة البحيرة – دمنهور – منطقة العَبّارة – برج اللواء – أمام مدرسة التعاون**" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2 text-gray-900 dark:text-white", children: "🔁 7. تحديثات سياسة الخصوصية" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "قد نقوم بتحديث سياسة الخصوصية من وقت لآخر، وسيتم نشر أي تعديل جديد في هذه الصفحة مع تاريخ التحديث. استخدامك للموقع بعد نشر أي تعديلات يعني موافقتك على السياسة الجديدة." })
        ] })
      ] }) })
    ] })
  ] });
};
const Shipping = () => {
  return /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto py-10 px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-right", children: "الشحن و التوصيل" }),
    /* @__PURE__ */ jsx("div", { className: "bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "border-r-4 border-[#A8511A] pr-4", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "نقدم خدمة الشحن والتوصيل لجميع مدن ومحافظات" }) }),
      /* @__PURE__ */ jsx("div", { className: "border-r-4 border-[#A8511A] pr-4", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "يتم تجهيز الطلبات يومياً ورفعها للتسليم لشركة الشحن (عدا يوم الجمعة)" }) }),
      /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "تتراوح مدة توصيل شركة الشحن بعد استلام الطلبات حسب المنطقة والمدينة:" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed font-medium mt-2", children: "من 1 : 3 ايام عمل" })
      ] })
    ] }) })
  ] });
};
const Complaints = () => {
  return /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto py-10 px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-right", children: "الشكاوي و المقترحات" }),
    /* @__PURE__ */ jsx("div", { className: "bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right", children: /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 leading-relaxed", children: "سيتم إضافة محتوى صفحة الشكاوي والمقترحات قريباً..." }) })
  ] });
};
const FabricTypes = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "أنواع الأقمشة - نوام للأقمشة" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "استكشف مجموعة متنوعة من أنواع الأقمشة في نوام للأقمشة. من الصوف إلى الكشمير وغيرها."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto py-10 px-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-right", children: "أنواع الاقمشة" }),
      /* @__PURE__ */ jsx("div", { className: "bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right", children: /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 leading-relaxed", children: "سيتم إضافة محتوى أنواع الأقمشة قريباً..." }) })
    ] })
  ] });
};
const Branches = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "الفروع - نوام للأقمشة" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "اكتشف فروع نوام للأقمشة في مختلف المحافظات. زورنا للحصول على أفضل الأقمشة."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto py-10 px-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-right", children: "فروعنا" }),
      /* @__PURE__ */ jsx("div", { className: "bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right", children: /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 leading-relaxed", children: "سيتم إضافة محتوى فروع النوام للاقمشة قريباً..." }) })
    ] })
  ] });
};
const WashingInstructions = () => {
  return /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto py-10 px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-right", children: "إرشادات الغسيل" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4 text-[#A8511A]", children: "الغسيل اليدوي" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6 mb-8", children: /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-800 dark:text-gray-200", children: "يفضل غسل الصوف يدويًا للحفاظ على نعومته وشكله:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-none space-y-2 mt-2 text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ jsx("li", { children: "**الماء:** استخدم ماءً بارداً أو فاتراً (حوالي 30 درجة مئوية)، وتجنب استخدام الماء الساخن الذي يؤدي إلى انكماش الألياف." }),
          /* @__PURE__ */ jsx("li", { children: "**المنظف:** استخدم منظفاً خاصاً بالصوف أو منظفاً معتدلاً ولطيفاً، وتجنب المنظفات القوية أو التي تحتوي على مواد مبيضة." }),
          /* @__PURE__ */ jsx("li", { children: "**طريقة الغسيل:** املأ وعاءً بالماء والمنظف، ثم ضع قطعة الصوف واضغط عليها بلطف، وتجنب الفرك أو العصر القوي." }),
          /* @__PURE__ */ jsx("li", { children: "**الشطف:** اشطف الصوف بالماء البارد عدة مرات حتى تتأكد من إزالة كل المنظف." }),
          /* @__PURE__ */ jsx("li", { children: "**العصر:** اعصر قطعة الصوف بلطف شديد للتخلص من الماء الزائد، وتجنب عصرها بقوة." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4 text-[#A8511A]", children: "الغسيل في الغسالة" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6 mb-8", children: /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-800 dark:text-gray-200", children: "إذا كنت ستستخدم الغسالة، اتبع الخطوات التالية:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-none space-y-2 mt-2 text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ jsx("li", { children: "**البرنامج:** استخدم دورة غسيل مخصصة للصوف أو دورة الغسيل اليدوي (Hand Wash)، أو دورة الملابس الرقيقة." }),
          /* @__PURE__ */ jsx("li", { children: '**الماء:** اضبط درجة حرارة الماء على "بارد".' }),
          /* @__PURE__ */ jsx("li", { children: "**المنظف:** استخدم منظفاً خاصاً بالصوف." }),
          /* @__PURE__ */ jsx("li", { children: "**التجفيف:** استخدم دورة التجفيف اللطيفة أو الخفيفة، أو تجنب استخدام المجفف تماماً." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4 text-[#A8511A]", children: "التجفيف" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6 mb-8", children: /* @__PURE__ */ jsxs("div", { className: "border-r-4 border-[#A8511A] pr-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-800 dark:text-gray-200", children: "تُعد طريقة التجفيف جزءاً حاسماً للحفاظ على جودة الصوف:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-none space-y-2 mt-2 text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ jsx("li", { children: "**التجفيف الطبيعي:** بعد عصر قطعة الصوف بلطف، افردها على سطح مستوٍ وفوق منشفة جافة." }),
          /* @__PURE__ */ jsx("li", { children: "**تجنب أشعة الشمس:** لا تعرض الصوف لأشعة الشمس المباشرة أو للحرارة العالية، واتركه يجف في مكان جاف ومعتدل." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4 text-[#A8511A]", children: "نصائح إضافية" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx("div", { className: "border-r-4 border-[#A8511A] pr-4", children: /* @__PURE__ */ jsxs("ul", { className: "list-none space-y-2 text-gray-700 dark:text-gray-300", children: [
        /* @__PURE__ */ jsx("li", { children: "**معالجة البقع:** عالج البقع قبل الغسيل باستخدام منظف لطيف، وتجنب فرك البقعة بقوة." }),
        /* @__PURE__ */ jsx("li", { children: "**تجديد الصوف:** للتخلص من التجاعيد، يمكنك تعليق قطعة الصوف في مكان رطب كالحمام بعد الاستحمام، حيث يعمل البخار على تنعيم الألياف." }),
        /* @__PURE__ */ jsx("li", { children: "**إزالة الوبر:** يمكن استخدام ماكينة حلاقة الأقمشة أو منديل تجفيف الملابس للتخلص من الوبر المتراكم." }),
        /* @__PURE__ */ jsx("li", { children: "**التخزين:** عند التخزين، احرص على وضع الصوف في مكان بارد وجاف بعيداً عن الرطوبة، واستخدم أكياس السيليكا أو الفحم النشط للمساعدة في امتصاص الرطوبة." })
      ] }) }) })
    ] })
  ] });
};
function App() {
  return /* @__PURE__ */ jsxs(BrowserRouter, { children: [
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col px-2 md:px-10", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxs(Routes, { children: [
        /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Home, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(About, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsx(Contact, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/fabric/:fabricId", element: /* @__PURE__ */ jsx(FabricPage, {}) }),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: "/categories/:categoryId/:subCategoryId",
            element: /* @__PURE__ */ jsx(ProductsPage, {})
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "/categories/:categoryId", element: /* @__PURE__ */ jsx(ProductsPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/faq", element: /* @__PURE__ */ jsx(FAQ, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/terms", element: /* @__PURE__ */ jsx(TermsAndConditions, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/return-policy", element: /* @__PURE__ */ jsx(ReturnPolicy, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/privacy-policy", element: /* @__PURE__ */ jsx(PrivacyPolicy, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/shipping", element: /* @__PURE__ */ jsx(Shipping, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/complaints", element: /* @__PURE__ */ jsx(Complaints, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/fabric-types", element: /* @__PURE__ */ jsx(FabricTypes, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/branches", element: /* @__PURE__ */ jsx(Branches, {}) }),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: "/washing-instructions",
            element: /* @__PURE__ */ jsx(WashingInstructions, {})
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(FloatingWhatsApp, {})
    ] })
  ] });
}
const createApp = () => /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(OrderDialogProvider, { children: /* @__PURE__ */ jsx(App, {}) }) });
if (typeof window !== "undefined") {
  createRoot(document.getElementById("root")).render(createApp());
}
export {
  createApp
};
