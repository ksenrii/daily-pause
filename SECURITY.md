# Security Policy

Daily Pause is a local-first browser app. It has no backend, no account system,
and no upload endpoint.

## Reporting Issues

If you find a security issue, please open a GitHub issue with:

- what happened
- how to reproduce it
- your browser and operating system
- whether the issue affects local data privacy or file handling

## File Handling Notes

Daily Pause validates local image files before saving them:

- JPEG, PNG, WebP, and GIF only
- file signature checks
- 10MB size limit
- no server-side storage
- no execution path for uploaded files

Images are stored as IndexedDB blobs in the user's browser.
