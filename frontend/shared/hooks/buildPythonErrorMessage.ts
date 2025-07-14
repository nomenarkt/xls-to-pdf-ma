export function buildPythonErrorMessage(
  stderr: string,
  code?: number | null,
  hint = "Python subprocess failed to parse XLS",
  debugMode = false,
): Error {
  const parts = [hint];
  const trimmed = stderr.trim();
  if (debugMode && trimmed) {
    parts.push(trimmed);
  }
  if (code !== undefined) {
    parts.push(`exit code ${code}`);
  }
  return new Error(parts.join(": "));
}
