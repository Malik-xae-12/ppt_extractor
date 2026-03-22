# PPTX Extraction Architecture & Workflow

## 1. Overview
The backend provides a high-performance **FastAPI** service designed to deeply parse uploaded `.pptx` (Microsoft PowerPoint) files. Instead of relying solely on generic text scrapers, this system combines high-level markdown conversion with granular, slide-by-slide extraction of native shapes—including accurate data grids (tables), text frameworks, embedded graphic assets, and composite architecture diagrams.

## 2. Core Libraries & Packages

### **`FastAPI` & `Pydantic`**
- **Role:** Handles the asynchronous file routing, HTTP request validation, and strict typing of the outgoing JSON payloads.

### **`python-pptx`**
- **Role:** The primary traversal engine.
- **Why it’s crucial:** Unlike high-level wrappers, `python-pptx` gives direct object-model access to the XML layer of a slide deck. We use it to natively iterate through slides, identify specific entity types (`ShapeType.TABLE`, `ShapeType.PICTURE`, `ShapeType.GROUP`), and extract coordinate data or embedded blob bytes without losing formatting natively.

### **`markitdown`**
- **Role:** Fallback global content compiler.
- **Why it’s crucial:** It rapidly processes the entire deck to reconstruct a single string representations (`full_markdown`) of the presentation, keeping the logical flow intact for Large Language Models or plain text viewers.

---

## 3. Parsing Workflow Logic

When a client hits the `/api/v1/extract/` POST endpoint with a `.pptx` payload, the following sequence executes synchronously (or asynchronously via thread pooling):

1. **Ingestion & Safety:** 
   The route accepts an `UploadFile`. The file extension is validated strictly. Since parsing massive memory streams can cause OOM errors, the file is immediately piped to disk using Python's built-in `tempfile.NamedTemporaryFile(suffix=".pptx", delete=False)`.

2. **Global Markdown Generation:**
   The physical path of the temp file is fed to `markitdown`'s converter, aggressively parsing out the textual skeleton into an aggregated Markdown representation.

3. **Slide Iteration Grid (`python-pptx`):**
   The presentation is opened in memory `Presentation(temp_path)`. The system loops over `prs.slides`. For every slide, a baseline object is initialized holding arrays for text strings, 2D arrays for tables, Base64 strings for images, and detected SmartArt/Group strings for diagrams.

4. **Shape Interrogation (The Core Engine):**
   Within each slide, every graphical `shape` is inspected utilizing the `shape_type` Enum:
   - **Text (`has_text_frame`):** Paragraphs and runs are joined natively and appended directly.
   - **Tables (`has_table`):** The engine loops through `shape.table.rows` and `shape.table.columns`. A multidimensional array `string[][]` is built matching the grid layout perfectly, bypassing typical CSS/HTML mangling.
   - **Visuals (`ShapeType.PICTURE`):** The raw binary image blob is extracted via `shape.image.blob`. It is immediately converted into a `Base64` URI (`data:image/{ext};base64,...`) so that the frontend requires no static file hosting to render it.

5. **Payload Serialization:**
   Once the final shape of the final slide is parsed, the temporary file is deleted `os.unlink()`. Data is serialized against the `ExtractionResponse` Pydantic BaseModel and sent to the client.

---

## 4. Architecture Diagrams & Visual Extraction
One of the most complex parts of parsing corporate PPTX files involves native **SmartArt** or grouped architecture diagrams.

When the shape type is detected as `ShapeType.GROUP`, the engine recursively unpacks the child elements. Often, architecture figures are constructed natively using dozens of nested rectangles and lines. By scanning these children for `text_frames`, the backend successfully identifies the node labels composing an abstract network architecture diagram, injecting them into the `architecture_diagrams` dataset for LLM ingestion.

## 5. Security & Limitations
- **Stateless Execution:** Because images and files are encoded in-memory or securely mapped directly from a volatile `/tmp` namespace to `Base64`, the server is completely stateless and stores no persistent PII graphics from previous sessions.
- **Support Matrix:** Strictly `application/vnd.openxmlformats-officedocument.presentationml.presentation` is approved. Legacy `.ppt` (OLE wrappers) are rejected structurally to avoid buffer issues.
