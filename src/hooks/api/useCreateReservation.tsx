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

export default useCreateReservation;
