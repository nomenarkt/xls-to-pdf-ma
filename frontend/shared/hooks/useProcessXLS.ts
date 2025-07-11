import axios from "../api/axios";
import { FlightRow } from "../types/flight";

export function useProcessXLS() {
  return async (
    file: File,
    mode: string,
    category: string,
  ): Promise<FlightRow[]> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);
    formData.append("category", category);
    try {
      const res = await axios.post<FlightRow[]>("/process", formData);
      return res.data;
    } catch (err) {
      throw err;
    }
  };
}
