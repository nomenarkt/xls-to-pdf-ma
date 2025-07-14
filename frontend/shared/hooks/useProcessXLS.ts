import { writeFile, readFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { FlightRow } from "../types/flight";
import { Mode } from "../../components/ModeSelector";
import {
  usePythonSubprocess,
  PythonSubprocessResult,
} from "./usePythonSubprocess";
import { buildPythonErrorMessage } from "./buildPythonErrorMessage";

/**
 * Uploads an XLS file and retrieves parsed flight rows.
 *
 * Example:
 * ```ts
 * const rows = await useProcessXLS()(file, Mode.PRECOMMANDES);
 * ```
 */
export function useProcessXLS() {
  const run = usePythonSubprocess();
  return async (file: File, mode: Mode): Promise<FlightRow[]> => {
    if (!Object.values(Mode).includes(mode)) {
      throw new Error(`Invalid mode: ${mode}`);
    }

    const timestamp = Date.now();
    const inputPath = path.join(tmpdir(), `input-${timestamp}-${file.name}`);
    const outputPath = path.join(tmpdir(), `output-${timestamp}.json`);

    const buffer = await file.arrayBuffer();
    await writeFile(inputPath, Buffer.from(buffer));

    const result: PythonSubprocessResult = await run(inputPath, outputPath, {
      mode,
    });

    if (result.exitCode !== 0) {
      throw buildPythonErrorMessage(result.stderr, result.exitCode);
    }

    const text = await readFile(outputPath, "utf8");
    try {
      return JSON.parse(text) as FlightRow[];
    } catch {
      const message = result.stderr.trim()
        ? result.stderr.trim()
        : "Invalid JSON output from Python process";
      throw buildPythonErrorMessage(message, result.exitCode);
    }
  };
}
