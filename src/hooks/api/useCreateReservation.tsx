import { getImageUrl } from "@/lib/utils";
import { useState } from "react";

type AnyRecord = Record<string, unknown>;

const asRecord = (value: unknown): AnyRecord | undefined => {
  return typeof value === "object" && value !== null
    ? (value as AnyRecord)
    : undefined;
};

const parsePositiveNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    if (!normalized) return undefined;
    const parsed = Number(normalized);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return undefined;
};

const getFirstNumericField = (
  record: AnyRecord,
  fields: string[],
): number | undefined => {
  for (const field of fields) {
    const parsed = parsePositiveNumber(record[field]);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
};

const extractLineItemValue = (item: unknown): number => {
  const itemRecord = asRecord(item);
  if (!itemRecord) return 0;

  const quantity =
    getFirstNumericField(itemRecord, [
      "quantityMeters",
      "meters",
      "quantity",
      "qty",
    ]) ?? 1;
  const directPrice = getFirstNumericField(itemRecord, [
    "pricePerMeter",
    "PricePerMeter",
    "price",
    "Price",
  ]);

  const productRecord =
    asRecord(itemRecord.productRecordId) || asRecord(itemRecord.product);
  const nestedPrice = productRecord
    ? getFirstNumericField(productRecord, [
        "pricePerMeter",
        "PricePerMeter",
        "price",
        "Price",
      ])
    : undefined;

  const price = directPrice ?? nestedPrice;
  if (price === undefined) return 0;

  return quantity * price;
};

const inferPurchaseValue = (
  reservation: unknown,
  payload: unknown,
): number | undefined => {
  const reservationRecord = asRecord(reservation);

  if (reservationRecord) {
    const directTotal = getFirstNumericField(reservationRecord, [
      "total",
      "totalPrice",
      "finalTotal",
      "grandTotal",
      "amount",
      "subtotal",
    ]);

    if (directTotal !== undefined) return directTotal;

    const items = Array.isArray(reservationRecord.items)
      ? reservationRecord.items
      : [];
    if (items.length > 0) {
      const itemsTotal = items.reduce(
        (sum, item) => sum + extractLineItemValue(item),
        0,
      );
      if (itemsTotal > 0) return itemsTotal;
    }

    const quantity = getFirstNumericField(reservationRecord, [
      "quantityMeters",
      "meters",
      "quantity",
      "qty",
    ]);
    const productRecord =
      asRecord(reservationRecord.productRecordId) ||
      asRecord(reservationRecord.product);
    const price = productRecord
      ? getFirstNumericField(productRecord, [
          "pricePerMeter",
          "PricePerMeter",
          "price",
          "Price",
        ])
      : undefined;

    if (quantity !== undefined && price !== undefined) {
      return quantity * price;
    }
  }

  const payloadRecord = asRecord(payload);
  if (payloadRecord) {
    const quantity = getFirstNumericField(payloadRecord, [
      "quantityMeters",
      "meters",
      "quantity",
      "qty",
    ]);
    const price = getFirstNumericField(payloadRecord, [
      "pricePerMeter",
      "PricePerMeter",
      "price",
      "Price",
    ]);

    if (quantity !== undefined && price !== undefined) {
      return quantity * price;
    }
  }

  return undefined;
};

const getPurchaseContentIds = (
  reservation: unknown,
  payload: unknown,
): string[] => {
  const ids: string[] = [];

  const pushId = (value: unknown) => {
    if (typeof value !== "string") return;
    const trimmed = value.trim();
    if (trimmed) ids.push(trimmed);
  };

  const reservationRecord = asRecord(reservation);
  const payloadRecord = asRecord(payload);

  if (reservationRecord) {
    const items = Array.isArray(reservationRecord.items)
      ? reservationRecord.items
      : [];

    for (const item of items) {
      const itemRecord = asRecord(item);
      if (!itemRecord) continue;

      const nestedProduct = asRecord(itemRecord.productRecordId);
      if (nestedProduct && typeof nestedProduct._id === "string") {
        pushId(nestedProduct._id);
      } else {
        pushId(itemRecord.productRecordId);
      }
    }

    const topProduct = asRecord(reservationRecord.productRecordId);
    if (topProduct && typeof topProduct._id === "string") {
      pushId(topProduct._id);
    } else {
      pushId(reservationRecord.productRecordId);
    }
  }

  pushId(payloadRecord?.productRecordId);

  return Array.from(new Set(ids));
};

const trackPurchaseEvent = (reservation: unknown, payload: unknown) => {
  if (typeof window === "undefined") return;

  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;

  const reservationRecord = asRecord(reservation);
  const orderId =
    reservationRecord && typeof reservationRecord._id === "string"
      ? reservationRecord._id
      : undefined;
  const value = inferPurchaseValue(reservation, payload);
  const contentIds = getPurchaseContentIds(reservation, payload);

  const eventData: Record<string, unknown> = {
    currency: "EGP",
  };

  if (value !== undefined) {
    eventData.value = Number(value.toFixed(2));
  }

  if (orderId) {
    eventData.order_id = orderId;
  }

  if (contentIds.length > 0) {
    eventData.content_ids = contentIds;
    eventData.content_type = "product";
  }

  fbq("track", "Purchase", eventData);
};

export type CreateReservationPayload = {
  productRecordId: string;
  quantityMeters: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  Images: string[];
};

export const useCreateReservation = () => {
  const [data, setData] = useState<unknown>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const createReservation = async (payload: CreateReservationPayload) => {
    setIsLoading(true);
    setError(undefined);
    try {
      // 1) Create reservation in our backend first
      const nodeRes = await fetch(
        `${import.meta.env.VITE_NODE_BACKEND_URL}/reservations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!nodeRes.ok) {
        const text = await nodeRes.text().catch(() => "");
        throw new Error(text || `Request failed with status ${nodeRes.status}`);
      }

      const reservation = (await nodeRes.json().catch(() => undefined)) as
        | unknown
        | undefined;

      // store primary result
      setData(reservation);
      setIsSuccess(true);
      trackPurchaseEvent(reservation, payload);

      // 2) Notify telegram bot (best-effort). Attach reservation info if available.
      try {
        const tgBody = { ...payload, reservation };
        const res = await fetch(`${import.meta.env.VITE_TG_BOT_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tgBody),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          const tgErr = new Error(
            text || `Telegram request failed ${res.status}`,
          );
          // surface telegram error but do not rollback reservation
          setError(tgErr);
          return { reservation, telegramError: tgErr } as unknown;
        }

        const tgJson = (await res.json().catch(() => undefined)) as unknown;
        return { reservation, telegram: tgJson } as unknown;
      } catch (tgErr) {
        const e =
          tgErr instanceof Error
            ? tgErr
            : new Error("Telegram notification failed");
        setError(e);
        return { reservation, telegramError: e } as unknown;
      }
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
export const useCreateCartReservation = () => {
  const [data, setData] = useState<unknown>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const createCartReservation = async (payload: any) => {
    setIsLoading(true);
    setError(undefined);
    try {
      // 1) Create reservation in our backend first
      const nodeRes = await fetch(
        `${import.meta.env.VITE_NODE_BACKEND_URL}/reservations/cartReservation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        },
      );

      if (!nodeRes.ok) {
        const text = await nodeRes.text().catch(() => "");
        throw new Error(text || `Request failed with status ${nodeRes.status}`);
      }

      const reservation = (await nodeRes.json().catch(() => undefined)) as
        | unknown
        | undefined;

      // store primary result
      setData(reservation);
      setIsSuccess(true);
      trackPurchaseEvent(reservation, payload);

      // 2) Notify telegram bot (best-effort). For cart reservations, send one
      // notification per item so each product is visible individually.
      const tgResults: Array<any> = [];
      try {
        const items = (reservation && (reservation as any).items) || [];
        if (Array.isArray(items) && items.length > 0) {
          for (const item of items) {
            const tgBody = {
              // include top-level customer fields and item-specific fields
              customerName:
                (reservation as any).customerName || payload.customerName,
              customerPhone:
                (reservation as any).customerPhone || payload.customerPhone,
              customerAddress:
                (reservation as any).customerAddress || payload.customerAddress,
              Images: item.Images.map((i: string) => getImageUrl(i)) || [],
              productRecordId: item.productRecordId,
              quantityMeters: item.quantityMeters,
              isCartReservation: true,
              reservationId: (reservation as any)._id,
              itemId: item._id,
            };

            try {
              const res = await fetch(`${import.meta.env.VITE_TG_BOT_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tgBody),
                credentials: "include",
              });

              if (!res.ok) {
                const text = await res.text().catch(() => "");
                const tgErr = new Error(
                  text || `Telegram request failed ${res.status}`,
                );
                tgResults.push({ item: item, ok: false, error: tgErr });
                // record but don't throw
                setError(tgErr);
                continue;
              }

              const tgJson = (await res
                .json()
                .catch(() => undefined)) as unknown;
              tgResults.push({ item: item, ok: true, response: tgJson });
            } catch (tgErr) {
              const e =
                tgErr instanceof Error
                  ? tgErr
                  : new Error("Telegram notification failed");
              tgResults.push({ item: item, ok: false, error: e });
              setError(e);
            }
          }
        } else {
          // fallback: send single notification for whole payload
          const tgBody = { ...payload, reservation };
          const res = await fetch(`${import.meta.env.VITE_TG_BOT_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tgBody),
            credentials: "include",
          });
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            const tgErr = new Error(
              text || `Telegram request failed ${res.status}`,
            );
            setError(tgErr);
            tgResults.push({ ok: false, error: tgErr });
          } else {
            const tgJson = (await res.json().catch(() => undefined)) as unknown;
            tgResults.push({ ok: true, response: tgJson });
          }
        }

        // return reservation with telegram per-item results
        return { reservation, telegramResults: tgResults } as unknown;
      } catch (tgErr) {
        const e =
          tgErr instanceof Error
            ? tgErr
            : new Error("Telegram notification failed");
        setError(e);
        return { reservation, telegramError: e } as unknown;
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Unknown error");
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCartReservation, data, error, isLoading, isSuccess };
};

export default useCreateReservation;
