import { spawn } from "child_process";
import { Mode, Category } from "../../components/ModeSelector";

export function buildPythonErrorMessage(
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

export function usePythonSubprocess() {
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
        resolve({ stdout, stderr, exitCode: code ?? null });
      });
    });
  };
}
