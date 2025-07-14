import { spawn } from "child_process";
import { readFile } from "fs/promises";
import { Mode, Category } from "../../components/ModeSelector";
import { FlightRow } from "../types/flight";

function buildPythonErrorMessage(
  stderr: string,
  code?: number | null,
  hint = "Python subprocess failed to parse XLS",
): Error {
  const parts = [hint];
  const trimmed = stderr.trim();
  if (trimmed) {
    parts.push(trimmed);
  }
  if (code !== undefined) {
    parts.push(`exit code ${code}`);
  }
  return new Error(parts.join(": "));
}

export interface PythonFilters {
  mode: Mode;
  category: Category;
}

/**
 * Launches the Python processing script with the given filters and parses the
 * resulting data.
 *
 * `outputFile` must contain a JSON array of {@link FlightRow} objects in the
 * following shape:
 * `num_vol`, `depart`, `arrivee`, `imma`, `sd_loc`, `sa_loc`, `j_class`,
 * `y_class`.
 *
 * For the full structure see
 * `/docs/frontend/flight/ingestion_filtering/parse_filter/TECH_SPEC.frontend.md`.
 */
export function usePythonSubprocess() {
  return async (
    inputFile: string,
    outputFile: string,
    filters: PythonFilters,
  ): Promise<FlightRow[]> => {
    if (!Object.values(Mode).includes(filters.mode)) {
      throw new Error(`Invalid mode: ${filters.mode}`);
    }
    if (!Object.values(Category).includes(filters.category)) {
      throw new Error(`Invalid category: ${filters.category}`);
    }

    return new Promise((resolve, reject) => {
      const proc = spawn("python", [
        "main.py",
        "--input",
        inputFile,
        "--output",
        outputFile,
        "--mode",
        filters.mode,
        "--category",
        filters.category,
      ]);

      let stderr = "";
      proc.stderr.on("data", (d) => {
        stderr += String(d);
      });

      const timer = setTimeout(() => {
        proc.kill();
        reject(new Error("Process timeout"));
      }, 10000);

      proc.on("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });

      proc.on("close", async (code) => {
        clearTimeout(timer);
        if (code !== 0) {
          reject(buildPythonErrorMessage(stderr, code));
          return;
        }
        try {
          const text = await readFile(outputFile, "utf8");
          try {
            const data = JSON.parse(text) as FlightRow[];
            resolve(data);
          } catch {
            const message = stderr.trim()
              ? stderr.trim()
              : "Invalid JSON output from Python process";
            reject(buildPythonErrorMessage(message, code));
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  };
}
