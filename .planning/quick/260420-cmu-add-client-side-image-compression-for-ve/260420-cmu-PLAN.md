---
phase: quick
plan: 260420-cmu
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/file-utils.ts
  - src/components/prompt-form.tsx
  - next.config.js
autonomous: true
requirements: []
user_setup: []
must_haves:
  truths:
    - "Images over ~4MB are automatically compressed before base64 encoding"
    - "Compressed images remain under the Vercel free tier ~4.5MB body limit"
    - "User sees brief feedback during compression"
    - "Images under ~4MB pass through uncompressed"
    - "Next.js server actions body limit is set to 10mb (was default 1.5mb)"
  artifacts:
    - path: "src/components/file-utils.ts"
      provides: "compressImage function using Canvas API"
      exports: ["compressImage"]
    - path: "src/components/prompt-form.tsx"
      provides: "Integration of compressImage in processFile flow"
    - path: "next.config.js"
      provides: "serverActions.bodySizeLimit configuration"
  key_links:
    - from: "src/components/prompt-form.tsx"
      to: "src/components/file-utils.ts"
      via: "compressImage import and call in processFile"
      pattern: "import.*compressImage"
    - from: "processFile"
      to: "compressImage"
      via: "await compressImage(file) when file.size > threshold"
      pattern: "compressImage\\(.*\\)"
    - from: "next.config.js"
      to: "server actions"
      via: "experimental.serverActions.bodySizeLimit"
      pattern: "bodySizeLimit"
---

## Objective

Add client-side image compression to keep base64-encoded images under Vercel's ~4.5MB request body limit. Uses the Canvas API — zero new dependencies.

**Purpose:** Vercel free tier enforces ~4.5MB request body limit. A 10MB JPEG inflates to ~13.3MB when base64-encoded, guaranteeing failure. Compression ensures large images are resized/quality-reduced client-side before encoding.

**Output:** `compressImage()` function in `file-utils.ts`, integrated into `processFile()` in `prompt-form.tsx`.

## Context

@src/components/file-utils.ts
@src/components/prompt-form.tsx

Current state:
- `MAX_SIZE_BYTES = 10MB` — validates type and size
- `processFile()` reads file as base64 via `FileReader.readAsDataURL()`, passes directly to server action
- No compression between validation and base64 encoding

Threshold: 4MB raw → ~5.3MB base64. Safe for Vercel. Files ≤4MB skip compression.

## Tasks

### Task 1: Add `compressImage` to file-utils.ts

**Files:** `src/components/file-utils.ts`

**Action:** Add and export an async `compressImage(file: File): Promise<File>` function that:

1. Creates an `<img>` element, loads the file via `URL.createObjectURL(file)`
2. Draws to an offscreen `<canvas>` with:
   - Max dimension 2048px on the longer side (preserving aspect ratio) — only scale down if actual dimension exceeds 2048
   - Quality 0.85 for JPEG output (use `canvas.toBlob()` with `'image/jpeg'`)
3. Converts the Blob back to a `File` with name and type
4. Returns the compressed File
5. Cleans up the object URL via `revokeObjectURL()`

Also export a constant `COMPRESSION_THRESHOLD = 4 * 1024 * 1024` (4MB) for use in prompt-form.

**Verify:**
```
grep -q "compressImage" src/components/file-utils.ts && grep -q "COMPRESSION_THRESHOLD" src/components/file-utils.ts
```

**Done:** `compressImage` and `COMPRESSION_THRESHOLD` exported from `file-utils.ts`. Function uses only Canvas API, no npm dependencies.

### Task 2: Integrate compression in prompt-form.tsx processFile

**Files:** `src/components/prompt-form.tsx`

**Action:** Modify `processFile()` to:

1. Import `compressImage` and `COMPRESSION_THRESHOLD` from `./file-utils`
2. Make `processFile` async
3. After validation passes, before reading as base64:
   - If `file.size > COMPRESSION_THRESHOLD`, set `imageError("Compressing...")` as temporary feedback
   - `file = await compressImage(file)`
   - Clear `imageError(null)` after compression completes
4. Then proceed with existing preview URL + FileReader flow using the (possibly compressed) file

**Verify:**
```
grep -q "compressImage" src/components/prompt-form.tsx && grep -q "COMPRESSION_THRESHOLD" src/components/prompt-form.tsx
```

**Done:** Large images are compressed before base64 encoding. "Compressing..." feedback shown during the operation. Images ≤4MB pass through untouched.

### Task 3: Increase Next.js body size limit in next.config.js

**Files:** `next.config.js`

**Action:** Add `serverActions.bodySizeLimit` config to increase the default 1.5MB limit to 10MB:

```js
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [],
  },
}
```

**Verify:**
```
grep -q "bodySizeLimit" next.config.js
```

**Done:** `next.config.js` has `serverActions.bodySizeLimit: '10mb'`. Frontend can send up to 10MB to server actions (though compression should keep payloads under ~4.5MB in practice).

## Verification

1. `grep` confirms all files have required changes
2. TypeScript compiles: `npx tsc --noEmit` passes
3. `grep -q "bodySizeLimit" next.config.js` — body limit is configured
4. Manual test: upload a >4MB JPEG — should see "Compressing..." briefly, then preview loads with compressed image

## Success Criteria

- [ ] `compressImage` and `COMPRESSION_THRESHOLD` exported from `file-utils.ts`
- [ ] Canvas API only (no new dependencies in package.json)
- [ ] `processFile` in `prompt-form.tsx` calls `compressImage` for files >4MB
- [ ] "Compressing..." feedback shown during compression
- [ ] `next.config.js` has `serverActions.bodySizeLimit: '10mb'`
- [ ] TypeScript compiles without errors
