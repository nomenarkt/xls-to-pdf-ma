import { useState } from "react";
import axios from "../api/axios";
import { FlightRow } from "../types/flight";

export function useEditFlightRow() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (row: FlightRow): Promise<FlightRow> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.patch<FlightRow>("/process", {
        num_vol: row.num_vol,
        jc: row.jc,
        yc: row.yc,
      });
      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      setError(err as Error);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}
