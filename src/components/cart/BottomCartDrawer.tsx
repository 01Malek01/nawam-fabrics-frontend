//@ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import useCartApi from "@/hooks/useCartApi";
import { useCartDrawer } from "@/context/CartDrawerContext";
import { getImageUrl } from "@/lib/utils";

export default function BottomCartDrawer() {
  const {
    isCartDrawerOpen: open,
    closeCartDrawer,
    openCartDrawer,
    setCartDrawerOpen,
  } = useCartDrawer();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getCartItems } = useCartApi();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (!open) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await getCartItems();
        if (!mounted) return;
        const fetchedItems = Array.isArray(res)
          ? res
          : res?.cart?.items || res?.items || [];
        if (mounted) setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
      } catch (e) {
        if (mounted) setError(String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [open, getCartItems]);

  function handleContinueShopping() {
    // close without triggering history.pop to avoid navigation conflicts
    setCartDrawerOpen(false);
    navigate("/");
  }

  function handleGoToCart() {
    setCartDrawerOpen(false);
    navigate("/cart");
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => (v ? openCartDrawer() : closeCartDrawer())}
    >
      {/* <DrawerTrigger asChild>
    <Button variant="ghost" aria-label="Open cart drawer">
     <ShoppingCart className="h-5 w-5" />
    </Button>
   </DrawerTrigger> */}
      <DrawerContent data-vaul-drawer-direction="bottom">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>سلة التسوق</DrawerTitle>
          </DrawerHeader>

          <div className="p-4">
            {loading && <div className="text-center">جار التحميل...</div>}
            {error && <div className="text-red-600 text-center">{error}</div>}

            {!loading && !error && items.length === 0 && (
              <div className="text-center text-muted-foreground">
                السلة فارغة
              </div>
            )}

            <ul className="space-y-3">
              {items.map((it) => {
                const product = it.product || {};
                const productId = product._id || it.productId || it._id;
                const name = product.Name || it.name || product.title || "منتج";
                const meters = it.meters ?? 0;
                const price = it.pricePerMeter ?? product.PricePerMeter ?? 0;
                const subtotal = meters * price;
                const raw =
                  (Array.isArray(it.images) && it.images[0]) ||
                  (product.Image && product.Image[0]);
                const src = raw ? getImageUrl(raw) : undefined;

                return (
                  <li
                    key={it._id || productId}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center gap-3 text-right flex-1">
                      {src && (
                        <img
                          src={src}
                          alt={name}
                          className="h-16 w-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{name}</div>
                        <div className="text-sm text-muted-foreground">
                          {meters} م² · {price ? `${price} ج.م/م` : "-"}
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{subtotal} ج.م</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <DrawerFooter>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={handleContinueShopping}
              >
                متابعة التسوق
              </Button>
              <Button className="flex-1" onClick={handleGoToCart}>
                الذهاب إلى السلة
              </Button>
            </div>
            <DrawerClose asChild>
              <Button variant="outline" className="mt-2">
                إغلاق
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function formatPrice(v) {
  if (v == null) return "AED 0";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 2,
    }).format(v);
  } catch (e) {
    return `AED ${v}`;
  }
}
