import { useState } from "react";

export type CreateReservationPayload = {
  productRecordId: string;
  quantityMeters: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
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
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Reservations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed with status ${res.status}`);
      }
      const json = (await res.json().catch(() => undefined)) as unknown;
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

  return { createReservation, data, error, isLoading ,isSuccess };
};

export default useCreateReservation;
