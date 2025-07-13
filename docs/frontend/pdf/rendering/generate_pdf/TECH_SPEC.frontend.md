**📄 File:** `docs/frontend/pdf/rendering/generate_pdf/TECH_SPEC.frontend.md`
**📁 Context:** PDF Rendering → Generate PDF
**🏷 Epic:** PDF Export
**🏷 Feature:** Table-to-PDF Submission
**🎯 Owner:** Frontend Team

---

## 🧠 Objective

Enable client-side submission of parsed and edited XLS data to the backend’s `/generate_pdf` endpoint, receive the resulting PDF, and trigger file download in a user-friendly manner.

---

## 📦 Module Interfaces

### `useGeneratePDF.ts`

A hook to send JSON data and handle blob response.

```ts
type GeneratePDFInput = FlightRow[];

function useGeneratePDF(): {
  generate: (data: GeneratePDFInput) => Promise<Blob>;
  isLoading: boolean;
  error: string | null;
}
```

---

### `DownloadPDFButton.tsx`

Tailwind-styled button that handles UI for PDF export.

```tsx
type Props = {
  onDownload: () => Promise<void>;
};

<Button onClick={onDownload}>Download PDF</Button>
```

---

## 🧩 Data Flow

1. Table data → `useGeneratePDF().generate()`
2. API call: `POST /generate_pdf` with JSON body
3. Response: `application/pdf` blob
4. Trigger download in browser with generated filename

---

## 🔒 Validation & Contracts

* Validated using `FlightRowSchema` (shared)
* Ensure proper headers:

  * `Content-Type: application/json`
  * `Accept: application/pdf`
* Fallback to error UI if:

  * Blob is not a PDF
  * Network errors or invalid JSON

---

## 🧪 Test Matrix

* [x] Valid JSON returns Blob
* [x] Blob content-type is PDF
* [x] Simulate download
* [x] Handle backend 500 / 422 responses
* [x] Button shows spinner while loading
* [x] Retry flow and disabled state

