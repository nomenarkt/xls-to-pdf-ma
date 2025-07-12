import { spawn } from "child_process";
import { readFile } from "fs/promises";
import { Mode, Category } from "../../components/ModeSelector";
import { FlightRow } from "../types/flight";

export interface PythonFilters {
  mode: Mode;
  category: Category;
}

/**
 * Launches the Python processing script with filters and returns parsed rows.
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
          reject(new Error(stderr || `Process exited with code ${code}`));
          return;
        }
        try {
          const text = await readFile(outputFile, "utf8");
          const data = JSON.parse(text) as FlightRow[];
          resolve(data);
        } catch (err) {
          reject(err);
        }
      });
    });
  };
}
