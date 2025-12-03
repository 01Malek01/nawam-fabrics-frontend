// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
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
            // skip internal file placeholders and server-handled file keys to avoid duplicates
            if (
              k === "_imageFiles" ||
              k === "_videoFile" ||
              k === "Image" ||
              k === "VideoUrl"
            )
              return;
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
            fd.append("Image", data._videoFile);
          }
          {
            const res = await fetch(`${BASE}/admin/products`, {
              method: "POST",
              body: fd,
              credentials: "include",
            });
            let result: any = null;
            try {
              result = await res.json();
            } catch (e) {
              // ignore JSON parse error
            }
            if (!res.ok) {
              setStatus("error");
              throw new Error(
                result?.message ||
                  JSON.stringify(result) ||
                  `HTTP ${res.status}`
              );
            }
            setStatus("success");
            return result;
          }
        }
        {
          const res = await fetch(`${BASE}/admin/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
          });
          const result = await res.json();
          if (!res.ok) {
            setStatus("error");
            throw new Error(
              result?.message || JSON.stringify(result) || `HTTP ${res.status}`
            );
          }
          setStatus("success");
          return result;
        }
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
            if (
              k === "_imageFiles" ||
              k === "_videoFile" ||
              k === "Image" ||
              k === "VideoUrl"
            )
              return;
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
            fd.append("Image", data._videoFile);
          }
          {
            const res = await fetch(`${BASE}/admin/products/${id}`, {
              method: "PUT",
              body: fd,
              credentials: "include",
            });
            let result: any = null;
            try {
              result = await res.json();
            } catch (e) {}
            if (!res.ok) {
              setStatus("error");
              throw new Error(
                result?.message ||
                  JSON.stringify(result) ||
                  `HTTP ${res.status}`
              );
            }
            setStatus("success");
            return result;
          }
        }
        {
          const res = await fetch(`${BASE}/admin/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
          });
          const result = await res.json();
          if (!res.ok) {
            setStatus("error");
            throw new Error(
              result?.message || JSON.stringify(result) || `HTTP ${res.status}`
            );
          }
          setStatus("success");
          return result;
        }
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

  const deleteProductImage = useCallback(
    async (productId: string, imageIndex: number) => {
      setStatus("loading");
      try {
        const res = await fetch(
          `${BASE}/admin/products/${productId}/gallery/${imageIndex}`,
          {
            method: "PUT",
            credentials: "include",
          }
        );
        let result: unknown = null;
        try {
          result = await res.json();
        } catch (e) {
          // ignore parse error
        }
        if (!res.ok) {
          setStatus("error");
          throw new Error((result as any)?.message || `HTTP ${res.status}`);
        }
        setStatus("success");
        return result;
      } catch (e) {
        setStatus("error");
        throw e;
      } finally {
        setTimeout(() => setStatus("idle"), 1000);
      }
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
          {
            const res = await fetch(`${BASE}/admin/categories`, {
              method: "POST",
              body: fd,
              credentials: "include",
            });
            let result: any = null;
            try {
              result = await res.json();
            } catch (e) {
              /* ignore */
            }
            if (!res.ok) {
              setStatus("error");
              throw new Error(
                result?.message ||
                  JSON.stringify(result) ||
                  `HTTP ${res.status}`
              );
            }
            setStatus("success");
            return result;
          }
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
          {
            const res = await fetch(`${BASE}/admin/categories/${id}`, {
              method: "PUT",
              body: fd,
              credentials: "include",
            });
            let result: any = null;
            try {
              result = await res.json();
            } catch (e) {
              /* ignore */
            }
            if (!res.ok) {
              setStatus("error");
              throw new Error(
                result?.message ||
                  JSON.stringify(result) ||
                  `HTTP ${res.status}`
              );
            }
            setStatus("success");
            return result;
          }
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

  const deleteProductVideo = useCallback(
    async (id: string) => {
      setStatus("loading");
      try {
        const res = await fetch(`${BASE}/admin/products/${id}/video`, {
          method: "DELETE",
          credentials: "include",
        });
        let result: unknown = null;
        try {
          result = await res.json();
        } catch (e) {
          /* ignore */
        }
        if (!res.ok) {
          setStatus("error");
          throw new Error((result as any)?.message || `HTTP ${res.status}`);
        }
        setStatus("success");
        return result;
      } catch (e) {
        setStatus("error");
        throw e;
      } finally {
        setTimeout(() => setStatus("idle"), 1000);
      }
    },
    [BASE]
  );

  return {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
    deleteProductVideo,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    status,
  };
}
