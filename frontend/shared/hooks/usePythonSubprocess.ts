import { spawn } from "child_process";
import { Mode, Category } from "../../components/ModeSelector";
import { buildPythonErrorMessage } from "./buildPythonErrorMessage";

export interface PythonFilters {
  mode: Mode;
  category: Category;
}

/**
 * Launches the Python processing script with the given filters.
 *
 * The spawned CLI writes a JSON array to `outputFile`. Consumers are
 * responsible for reading and parsing the file after the process exits.
 * See `/docs/frontend/flight/ingestion_filtering/parse_filter/TECH_SPEC.frontend.md`.
 */
export interface PythonSubprocessResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

export function usePythonSubprocess(debugMode = false) {
  return async (
    inputFile: string,
    outputFile: string,
    filters: PythonFilters,
  ): Promise<PythonSubprocessResult> => {
    if (!Object.values(Mode).includes(filters.mode)) {
      throw new Error(`Invalid mode: ${filters.mode}`);
    }
    if (!Object.values(Category).includes(filters.category)) {
      throw new Error(`Invalid category: ${filters.category}`);
    }

    return new Promise((resolve, reject) => {
      const proc = spawn("python", [
        "cli/main.py",
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
      let stdout = "";
      proc.stderr.on("data", (d) => {
        stderr += String(d);
      });
      proc.stdout.on("data", (d) => {
        stdout += String(d);
      });

      const timer = setTimeout(() => {
        proc.kill();
        reject(new Error("Process timeout"));
      }, 10000);

      proc.on("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });

      proc.on("close", (code) => {
        clearTimeout(timer);
        if (code && code !== 0) {
          reject(buildPythonErrorMessage(stderr, code, undefined, debugMode));
          return;
        }
        resolve({ stdout, stderr, exitCode: code ?? null });
      });
    });
  };
}
