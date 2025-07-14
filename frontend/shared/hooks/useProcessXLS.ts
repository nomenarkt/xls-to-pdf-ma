import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { FlightRow } from "../types/flight";
import { Mode, Category } from "../../components/ModeSelector";
import { usePythonSubprocess } from "./usePythonSubprocess";

/**
 * Uploads an XLS file and retrieves parsed flight rows.
 *
 * Example:
 * ```ts
 * const rows = await useProcessXLS()(file, Mode.PRECOMMANDES, Category.SALON);
 * ```
 */
export function useProcessXLS() {
  const run = usePythonSubprocess();
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

    const timestamp = Date.now();
    const inputPath = path.join(tmpdir(), `input-${timestamp}-${file.name}`);
    const outputPath = path.join(tmpdir(), `output-${timestamp}.json`);

    const buffer = await file.arrayBuffer();
    await writeFile(inputPath, Buffer.from(buffer));

    return run(inputPath, outputPath, { mode, category });
  };
}
