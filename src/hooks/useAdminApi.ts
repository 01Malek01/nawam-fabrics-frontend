// Simple admin API hook. Replace endpoints with your real API endpoints.
import { useCallback, useState } from "react";

type Product = any;
type Category = any;

export default function useAdminApi() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const BASE = (import.meta.env.VITE_NODE_BACKEND_URL as string) || "";
  const getProducts = useCallback(async () => {
    const res = await fetch(`${BASE}/admin/products`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  }, [BASE]);

  const createProduct = useCallback(
    async (data: Product) => {
      setStatus("loading");
      try {
        if (data && (data._imageFiles || data._videoFile)) {
          const fd = new FormData();
          Object.keys(data).forEach((k) => {
            if (k === "_imageFiles" || k === "_videoFile") return;
            const v = (data as any)[k];
            if (v === undefined || v === null) return;
            if (Array.isArray(v)) {
              fd.append(k, JSON.stringify(v));
            } else {
              fd.append(k, String(v));
            }
          });
          if (data._imageFiles) {
            data._imageFiles.forEach((f: File) => fd.append("Image", f));
          }
          if (data._videoFile) {
            fd.append("VideoUrl", data._videoFile);
          }
          await fetch(`${BASE}/admin/products`, {
            method: "POST",
            body: fd,
            credentials: "include",
          });
          setStatus("success");
          return;
        }
        await fetch(`${BASE}/admin/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        });
        setStatus("success");
      } catch (e) {
        setStatus("error");
        throw e;
      } finally {
        setTimeout(() => setStatus("idle"), 1000);
      }
    },
    [BASE]
  );

  const updateProduct = useCallback(
    async (id: string, data: Product) => {
      setStatus("loading");
      try {
        if (data && (data._imageFiles || data._videoFile)) {
          const fd = new FormData();
          Object.keys(data).forEach((k) => {
            if (k === "_imageFiles" || k === "_videoFile") return;
            const v = (data as any)[k];
            if (v === undefined || v === null) return;
            if (Array.isArray(v)) {
              fd.append(k, JSON.stringify(v));
            } else {
              fd.append(k, String(v));
            }
          });
          if (data._imageFiles) {
            data._imageFiles.forEach((f: File) => fd.append("Image", f));
          }
          if (data._videoFile) {
            fd.append("VideoUrl", data._videoFile);
          }
          await fetch(`${BASE}/admin/products/${id}`, {
            method: "PUT",
            body: fd,
            credentials: "include",
          });
          setStatus("success");
          return;
        }
        await fetch(`${BASE}/admin/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        });
        setStatus("success");
      } catch (e) {
        setStatus("error");
        throw e;
      } finally {
        setTimeout(() => setStatus("idle"), 1000);
      }
    },
    [BASE]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await fetch(`${BASE}/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    [BASE]
  );

  const getCategories = useCallback(async () => {
    const res = await fetch(`${BASE}/admin/categories`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  }, [BASE]);

  const createCategory = useCallback(
    async (data: Category) => {
      setStatus("loading");
      try {
        if (data && data._imageFile) {
          const fd = new FormData();
          Object.keys(data).forEach((k) => {
            if (k === "_imageFile") return;
            const v = (data as any)[k];
            if (v === undefined || v === null) return;
            fd.append(k, String(v));
          });
          fd.append("Image", data._imageFile);
          await fetch(`${BASE}/admin/categories`, {
            method: "POST",
            body: fd,
            credentials: "include",
          });
          setStatus("success");
          return;
        }
        await fetch(`${BASE}/admin/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        });
        setStatus("success");
      } catch (e) {
        setStatus("error");
        throw e;
      } finally {
        setTimeout(() => setStatus("idle"), 1000);
      }
    },
    [BASE]
  );

  const updateCategory = useCallback(
    async (id: string, data: Category) => {
      setStatus("loading");
      try {
        if (data && data._imageFile) {
          const fd = new FormData();
          Object.keys(data).forEach((k) => {
            if (k === "_imageFile") return;
            const v = (data as any)[k];
            if (v === undefined || v === null) return;
            fd.append(k, String(v));
          });
          fd.append("Image", data._imageFile);
          await fetch(`${BASE}/admin/categories/${id}`, {
            method: "PUT",
            body: fd,
            credentials: "include",
          });
          setStatus("success");
          return;
        }
        await fetch(`${BASE}/admin/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        });
        setStatus("success");
      } catch (e) {
        setStatus("error");
        throw e;
      } finally {
        setTimeout(() => setStatus("idle"), 1000);
      }
    },
    [BASE]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      await fetch(`${BASE}/admin/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    [BASE]
  );

  const uploadVideo = useCallback(
    async (file: File) => {
      const fd = new FormData();
      fd.append("video", file);
      const res = await fetch(`${BASE}/admin/uploads/video`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Video upload failed");
      return res.json();
    },
    [BASE]
  );

  return {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    status,
  };
}
