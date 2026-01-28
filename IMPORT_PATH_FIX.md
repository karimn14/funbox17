# Import Path Fix - api/index.ts

## ✅ Issue Resolved

**Error**: `Cannot find module './vite'` in `api/index.ts` around line 110

**Root Cause**: The `api/index.ts` file was trying to import from `./vite`, but the `vite.ts` file is actually located in the `server/` directory, not in the `api/` directory.

## 📝 Fix Applied

### File Structure
```
main2/
├── api/
│   └── index.ts          ← Serverless entry point
├── server/
│   ├── index.ts          ← Local dev entry point
│   ├── routes.ts
│   ├── static.ts
│   └── vite.ts           ← Vite setup (HERE!)
└── ...
```

### Change Made in `api/index.ts`

**Before (Line 111):**
```typescript
const { setupVite } = await import("./vite");
```

**After (Line 111):**
```typescript
const { setupVite } = await import("../server/vite");
```

### Why This Fix Works

- `api/index.ts` is in the `api/` folder
- `vite.ts` is in the `server/` folder
- To import from `api/` → `server/`, we need to:
  1. Go up one level: `..`
  2. Enter the server folder: `/server`
  3. Import the file: `/vite`
- Full path: `../server/vite`

## ✅ Verification

### TypeScript Errors Check
```bash
npm run check
```

**Result**: ✅ No errors in `api/index.ts` related to the import

The TypeScript compiler found no issues with the import path in `api/index.ts`. Other errors shown are pre-existing issues in different files (ModuleDetail.tsx, Quiz.tsx, etc.) and are unrelated to this fix.

## 📋 All Import Paths in api/index.ts (Now Correct)

```typescript
// Line 3 - Routes
import { registerRoutes } from "../server/routes"; ✅

// Line 4 - Static files
import { serveStatic } from "../server/static"; ✅

// Line 111 - Vite setup (FIXED)
const { setupVite } = await import("../server/vite"); ✅
```

## 🎯 When This Code Runs

This import is only used during **local development**:

```typescript
if (process.env.NODE_ENV !== "production") {
    const { setupVite } = await import("../server/vite");
    await setupVite(httpServer, app);
}
```

- **Local Dev** (`NODE_ENV=development`): Uses Vite dev server with HMR
- **Production** (Vercel): Skips this code entirely, serves static files instead

## ✅ Status

- ✅ Import path corrected: `./vite` → `../server/vite`
- ✅ TypeScript errors resolved
- ✅ Ready for local development
- ✅ Ready for Vercel deployment

## 📚 Related Fixes

This completes the Vercel serverless migration:

1. ✅ ES Module `__dirname` fix (`server/static.ts`)
2. ✅ Build script updated (client-only in `package.json`)
3. ✅ Build tools moved to dependencies
4. ✅ **Import path fixed (`api/index.ts`)** ← This fix
5. ✅ Serverless configuration (`vercel.json`)

---

**Status**: ✅ **RESOLVED**
**File**: `api/index.ts`
**Line**: 111
**Change**: `"./vite"` → `"../server/vite"`
