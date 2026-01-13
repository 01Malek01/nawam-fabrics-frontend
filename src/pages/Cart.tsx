// @ts-nocheck
import React, { useEffect, useState } from "react";
import useCartApi from "@/hooks/useCartApi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/utils";
import { Trash2, ShoppingBag, ShoppingCart } from "lucide-react";
import MultiOrderForm from "@/components/MultiOrderForm";

const Cart = () => {
  const { getCartItems, removeItemFromCart, clearCart } = useCartApi();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [showMultiOrderForm, setShowMultiOrderForm] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const auth = await checkAuth();
        if (!auth?.loggedIn) {
          navigate("/login");
          return;
        }
        const res = await getCartItems();
        if (!mounted) return;
        // support both formats: array or { cart: { items: [...] } }
        const fetchedItems = Array.isArray(res)
          ? res
          : res?.cart?.items || res?.items || [];
        setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
      } catch (err) {
        toast.error("فشل جلب سلة التسوق");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [getCartItems, checkAuth, navigate]);

  const handleRemove = async (productId) => {
    if (!confirm("هل تريد إزالة هذا العنصر من السلة؟")) return;
    try {
      await removeItemFromCart(productId);
      const res = await getCartItems();
      const fetchedItems = Array.isArray(res)
        ? res
        : res?.cart?.items || res?.items || [];
      setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
      toast.success("تمت الإزالة");
    } catch (err) {
      toast.error(err?.message || "فشل الإزالة");
    }
  };

  const handleClear = async () => {
    if (!confirm("هل تريد مسح السلة بالكامل؟")) return;
    try {
      await clearCart();
      setItems([]);
      toast.success("تم مسح السلة");
    } catch (err) {
      toast.error(err?.message || "فشل المسح");
    }
  };

  const handleOrder = () => {
    console.log("order triggered");
    setShowMultiOrderForm(true);
  };

  const total = items.reduce((acc, it) => {
    const meters = it.meters ?? 0;
    const qty = it.quantity ?? 1;
    const price = it.pricePerMeter ?? it.product?.PricePerMeter ?? 0;
    return acc + meters * price * qty;
  }, 0);
  const deliveryFee = 100; // fixed delivery fee in EGP
  const finalTotal = total + deliveryFee;

  // Mobile Card Component
  const CartItemMobile = ({ item }) => {
    const product = item.product || {};
    const productId = product._id || item.productId || item._id;
    const name = product.Name || item.name || product.title || "منتج";
    const meters = item.meters ?? 0;
    const price = item.pricePerMeter ?? product.PricePerMeter ?? 0;
    const subtotal = meters * price;

    const raw =
      (Array.isArray(item.images) && item.images[0]) ||
      (product.Image && product.Image[0]);
    const src = raw ? getImageUrl(raw) : undefined;

    return (
      <div className="bg-white rounded-lg shadow p-5 mb-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4 flex-1">
            {src && (
              <img
                src={src}
                alt={name}
                className="h-24 w-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-3">{name}</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-lg">المتر:</span>
                  <span className="font-medium text-lg">{meters} م²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lg">السعر/م:</span>
                  <span className="font-medium text-lg">
                    {price ? `${price} ج.م` : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between items-center">
          <div className="font-bold text-2xl">المجموع: {subtotal} ج.م</div>
          <Button
            variant="destructive"
            size="lg"
            onClick={() => handleRemove(productId)}
            className="px-5 py-3 text-lg"
          >
            <Trash2 className="h-5 w-5 ml-2" />
            إزالة
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-8 md:py-12 relative">
      {showMultiOrderForm && <MultiOrderForm />}
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-right">
          سلة التسوق
        </h1>
        {items.length > 0 && (
          <div className="text-lg md:text-xl text-gray-600">
            <span className="font-semibold">{items.length}</span> عنصر
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="text-2xl">جاري التحميل...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-xl p-12 text-center">
          <ShoppingCart className="h-24 w-24 mx-auto text-gray-400 mb-6" />
          <div className="text-3xl mb-6">لا يوجد عناصر في السلة</div>
          <Button onClick={() => navigate("/")} className="px-8 py-4 text-lg">
            <ShoppingBag className="h-5 w-5 ml-2" />
            متابعة التسوق
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-xl p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-5 text-xl font-semibold">المنتج</th>
                    <th className="p-5 text-xl font-semibold">المتر</th>
                    <th className="p-5 text-xl font-semibold">السعر/م</th>
                    <th className="p-5 text-xl font-semibold">المجموع</th>
                    <th className="p-5 text-xl font-semibold">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => {
                    const product = it.product || {};
                    const productId = product._id || it.productId || it._id;
                    const name =
                      product.Name || it.name || product.title || "منتج";
                    const meters = it.meters ?? 0;
                    const price =
                      it.pricePerMeter ?? product.PricePerMeter ?? 0;
                    const subtotal = meters * price;

                    const raw =
                      (Array.isArray(it.images) && it.images[0]) ||
                      (product.Image && product.Image[0]);
                    const src = raw ? getImageUrl(raw) : undefined;

                    return (
                      <tr
                        key={it._id || productId}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-5 align-middle">
                          <div className="flex items-center gap-5 justify-start">
                            {src && (
                              <img
                                src={src}
                                alt={name}
                                className="h-20 w-20 object-cover rounded-lg"
                              />
                            )}
                            <div className="font-semibold text-xl">{name}</div>
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <div className="text-xl">{meters} م²</div>
                        </td>
                        <td className="p-5 align-middle">
                          <div className="text-xl">
                            {price ? `${price} ج.م` : "-"}
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <div className="font-bold text-2xl">
                            {subtotal} ج.م
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <Button
                            variant="destructive"
                            size="lg"
                            className="px-5 py-3 text-lg"
                            onClick={() => handleRemove(productId)}
                          >
                            <Trash2 className="h-5 w-5 ml-2" />
                            إزالة
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-6">
            {items.map((item, index) => (
              <CartItemMobile key={item._id || index} item={item} />
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-8 md:mt-12 bg-white rounded-xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
              <div className="w-full md:w-auto text-right order-2 md:order-1">
                <div className="text-right">
                  <div className="text-lg md:text-xl">
                    المجموع الفرعي:{" "}
                    <span className="font-medium">{total} ج.م</span>
                  </div>
                  <div className="text-lg md:text-xl mt-1">
                    تكلفة التوصيل:{" "}
                    <span className="font-medium">{deliveryFee} ج.م</span>
                  </div>
                  <div className="text-2xl md:text-3xl lg:text-4xl mt-2">
                    الإجمالي:{" "}
                    <span className="font-extrabold text-3xl md:text-4xl lg:text-5xl">
                      {finalTotal} ج.م
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto order-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1 sm:flex-none py-4 text-lg"
                >
                  <ShoppingBag className="h-5 w-5 ml-2" />
                  متابعة التسوق
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClear}
                  className="flex-1 sm:flex-none py-4 text-lg"
                >
                  <Trash2 className="h-5 w-5 ml-2" />
                  مسح السلة
                </Button>
                <Button
                  onClick={handleOrder}
                  className="flex-1 sm:flex-none py-4 text-lg bg-green-600 hover:bg-green-700"
                >
                  طلب الآن
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
