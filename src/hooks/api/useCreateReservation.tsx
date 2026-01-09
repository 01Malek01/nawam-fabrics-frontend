import { getImageUrl } from "@/lib/utils";
import { useState } from "react";

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
      console.log("reservations triggered-------------");
      // 1) Create reservation in our backend first
      const nodeRes = await fetch(
        `${import.meta.env.VITE_NODE_BACKEND_URL}/reservations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
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
            text || `Telegram request failed ${res.status}`
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
      console.log("reservations triggered-------------");
      // 1) Create reservation in our backend first
      const nodeRes = await fetch(
        `${import.meta.env.VITE_NODE_BACKEND_URL}/reservations/cartReservation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        }
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
                  text || `Telegram request failed ${res.status}`
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
              text || `Telegram request failed ${res.status}`
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
