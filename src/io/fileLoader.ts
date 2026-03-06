// ─── File Loader — open / drag-and-drop .mid files ───────────────────────────

/** Returns true if the filename ends with .mid or .midi (case-insensitive). */
export function validateMidiExtension(filename: string): boolean {
  return /\.(mid|midi)$/i.test(filename);
}

/** Wraps FileReader so callers can use async/await. */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (): void => resolve(reader.result as ArrayBuffer);
    reader.onerror = (): void =>
      reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsArrayBuffer(file);
  });
}

export interface FileLoadResult {
  buffer: ArrayBuffer;
  filename: string;
}

/**
 * Opens the native OS file-picker restricted to .mid / .midi files.
 * Resolves with the ArrayBuffer + filename, or null if the user cancels.
 */
export function openFilePicker(): Promise<FileLoadResult | null> {
  return new Promise<FileLoadResult | null>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".mid,.midi";
    input.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
    document.body.appendChild(input);

    const cleanup = (): void => {
      if (input.parentNode) {
        document.body.removeChild(input);
      }
    };

    input.addEventListener("change", () => {
      const file = input.files?.[0] ?? null;
      cleanup();

      if (!file) {
        resolve(null);
        return;
      }

      if (!validateMidiExtension(file.name)) {
        reject(
          new Error(
            `Unsupported file type "${file.name}". Please choose a .mid or .midi file.`,
          ),
        );
        return;
      }

      readFileAsArrayBuffer(file)
        .then((buffer) => resolve({ buffer, filename: file.name }))
        .catch(reject);
    });

    // "cancel" event is supported in Chromium 113+ and Firefox 91+.
    input.addEventListener("cancel", () => {
      cleanup();
      resolve(null);
    });

    input.click();
  });
}
