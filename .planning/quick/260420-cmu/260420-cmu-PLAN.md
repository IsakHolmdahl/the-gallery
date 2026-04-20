# 260420-cmu: compress locally, then upload remote, then save

## Plan

**Task:** Add client-side image compression, remote upload, and a save endpoint.

### Scope

- [ ] 1. Local image compression (Canvas API, no new deps)
- [ ] 2. Remote upload + save API endpoint

### Assumptions

- "Save" = persist the generated artwork (image URL + prompt/metadata) for later retrieval
- "Upload remote" = send compressed image to a storage service (S3, Vercel Blob, etc.)
- No database currently exists — save API will need a data store

### Open Questions

- What storage service for images? (S3, Vercel Blob, Cloudinary?)
- What database for metadata? (SQLite, Postgres, Vercel KV?)
- What fields to save? (image, prompt, timestamp, user?)

---

*Plan created 2026-04-20 — awaiting user input on open questions before proceeding.*
