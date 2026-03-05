// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useState } from "react";
import ReservationsManager from "./ReservationsManager";
import AdminTab from "./AdminTab";
import ProductsTab from "./ProductsTab";
import LastPieceForm from "./LastPieceForm";
import CategoriesTab from "./CategoriesTab";
import LastPiecesTab from "./LastPiecesTab";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAdminApi from "@/hooks/useAdminApi";
import toast from "react-hot-toast";
import CategoryForm from "./CategoryForm";
import ProductForm from "./ProductForm";
import { getImageUrl } from "@/lib/utils";
import AdminDialogs from "./AdminDialogs";

type Product = {
  _id?: string;
  Name: string;
  PricePerMeter: number;
  Description?: string;
  Image?: string[];
  SubCategory?: string;
  MainCategory?: string;
  VideoUrl?: string;
  MostSold?: boolean;
  discount?: number;
  discountText?: string;
  isNewArrival?: boolean;
};

type Category = {
  _id?: string;
  Name: string;
  ParentCategory?: Category | null;
  Image?: string;
  isSubCategory?: boolean;
  priority?: number;
};

const TABS = [
  { key: "products", label: "المنتجات" },
  { key: "categories", label: "الفئات" },
  { key: "lastpieces", label: "قطع أخيرة" },
  { key: "reservations", label: "الحجوزات" },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].key);
  const api = useAdminApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lastPieces, setLastPieces] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingLastPiece, setEditingLastPiece] = useState<any | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isCreatingLastPiece, setIsCreatingLastPiece] = useState(false);

  const load = async () => {
    const [p, c, lp] = await Promise.all([
      api.getProducts(),
      api.getCategories(),
      api.getAdminLastPieces(),
    ]);
    setProducts(p || []);
    setCategories(c || []);
    setLastPieces(lp || []);
  };

  const openEditingProduct = (p: Product) => {
    setEditingProduct(p);
    try {
      history.pushState({ nawamDialog: true }, "");
    } catch (e) {
      void e;
    }
  };

  const openEditingLastPiece = (lp: any) => {
    setEditingLastPiece(lp);
    try {
      history.pushState({ nawamDialog: true }, "");
    } catch (e) {
      void e;
    }
  };

  const openEditingCategory = (c: Category) => {
    setEditingCategory(c);
    try {
      history.pushState({ nawamDialog: true }, "");
    } catch (e) {
      void e;
    }
  };

  const [managingImagesProduct, setManagingImagesProduct] =
    useState<Product | null>(null);

  const openManageImages = (p: Product) => {
    setManagingImagesProduct(p);
    try {
      history.pushState({ nawamDialog: true }, "");
    } catch (e) {
      void e;
    }
  };

  const closeManageImages = () => setManagingImagesProduct(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close forms when the browser back button is pressed.
  useEffect(() => {
    const handlePop = () => {
      // Close any open dialog/form state. No-op if already closed.
      setIsCreatingCategory(false);
      setIsCreatingProduct(false);
      setEditingProduct(null);
      setEditingCategory(null);
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const updateProductState = (item: Product, isUpdate: boolean) => {
    if (isUpdate) {
      setProducts((prev) => prev.map((p) => (p._id === item._id ? item : p)));
    } else {
      setProducts((prev) => [...prev, item]);
    }
  };

  const updateCategoryState = (item: Category, isUpdate: boolean) => {
    if (isUpdate) {
      setCategories((prev) =>
        prev.map((c) => (c?._id === item?._id ? item : c))
      );
    } else {
      setCategories((prev) => [...prev, item]);
    }
  };

  const updateLastPieceState = (item: any, isUpdate: boolean) => {
    if (isUpdate) {
      setLastPieces((prev) => prev.map((p) => (p._id === item._id ? item : p)));
    } else {
      setLastPieces((prev) => [...prev, item]);
    }
  };

  const handleCreateProduct = async () => {
    // API call handled in ProductForm
  };

  const handleUpdateProduct = async () => {
    // API call handled in ProductForm
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟")) return;
    await api.deleteProduct(id);
    await load();
  };

  const handleCreateCategory = async () => {
    // API call handled in CategoryForm
  };

  const handleUpdateCategory = async () => {
    // API call handled in CategoryForm
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذه الفئة؟")) return;
    await api.deleteCategory(id);
    await load();
  };

  const handleDeleteLastPiece = async (id: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذه القطعة؟")) return;
    await api.deleteLastPiece(id);
    await load();
  };

  return (
    <div className="space-y-6 text-lg md:text-2xl admin-dashboard">
      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2 mb-4">
        {TABS.map((tab) => (
          <AdminTab
            tab={tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "products" && (
        <ProductsTab
          products={products}
          categories={categories}
          openEditingProduct={openEditingProduct}
          openManageImages={openManageImages}
          handleDeleteProduct={handleDeleteProduct}
          isCreatingProduct={isCreatingProduct}
          setIsCreatingProduct={setIsCreatingProduct}
          handleCreateProduct={handleCreateProduct}
          updateProductState={updateProductState}
          load={load}
          setProducts={setProducts}
        />
      )}

      {activeTab === "categories" && (
        <CategoriesTab
          categories={categories}
          load={load}
          isCreatingCategory={isCreatingCategory}
          setIsCreatingCategory={setIsCreatingCategory}
          handleCreateCategory={handleCreateCategory}
          updateCategoryState={updateCategoryState}
          openEditingCategory={openEditingCategory}
          handleDeleteCategory={handleDeleteCategory}
        />
      )}

      {activeTab === "lastpieces" && (
        <LastPiecesTab
          lastPieces={lastPieces}
          products={products}
          categories={categories}
          load={load}
          isCreatingLastPiece={isCreatingLastPiece}
          setIsCreatingLastPiece={setIsCreatingLastPiece}
          updateLastPieceState={updateLastPieceState}
          openEditingLastPiece={openEditingLastPiece}
          handleDeleteLastPiece={handleDeleteLastPiece}
        />
      )}

      {activeTab === "reservations" && (
        <section className="bg-white/60 dark:bg-white/5 p-4 rounded-lg">
          <ReservationsManager />
        </section>
      )}

      {/* Edit dialogs and manage images dialog */}
      <AdminDialogs
        api={api}
        products={products}
        setProducts={setProducts}
        managingImagesProduct={managingImagesProduct}
        setManagingImagesProduct={setManagingImagesProduct}
        closeManageImages={closeManageImages}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        editingLastPiece={editingLastPiece}
        setEditingLastPiece={setEditingLastPiece}
        categories={categories}
        updateProductState={updateProductState}
        updateCategoryState={updateCategoryState}
        updateLastPieceState={updateLastPieceState}
        handleUpdateProduct={handleUpdateProduct}
        handleUpdateCategory={handleUpdateCategory}
      />
    </div>
  );
};

export default AdminDashboard;
