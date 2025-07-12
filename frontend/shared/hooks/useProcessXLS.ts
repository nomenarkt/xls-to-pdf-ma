import axios from "../api/axios";
import { FlightRow } from "../types/flight";
import { Mode, Category } from "../../components/ModeSelector";

/**
 * Uploads an XLS file and retrieves parsed flight rows.
 *
 * Example:
 * ```ts
 * const rows = await useProcessXLS()(file, Mode.PRECOMMANDES, Category.SALON);
 * ```
 */
export function useProcessXLS() {
  return async (
    file: File,
    mode: Mode,
    category: Category,
  ): Promise<FlightRow[]> => {
    if (!Object.values(Mode).includes(mode)) {
      throw new Error(`Invalid mode: ${mode}`);
    }
    if (!Object.values(Category).includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }
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
