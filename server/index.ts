import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import 'dotenv/config';

const app = express();
const httpServer = createServer(app);

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  process.env.CLIENT_URL,      // Production frontend URL
  "http://localhost:5173",     // Local development
  "http://localhost:5000",     // Local backend
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check allow list
    if (allowedOrigins.some(allowed => origin && origin.startsWith(allowed as string))) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

// --- MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

// --- ROUTE REGISTRATION (Lazy Init for Serverless) ---
// Kita buat flag agar registerRoutes hanya jalan sekali
let routesRegistered = false;

const setupApp = async () => {
  if (!routesRegistered) {
    await registerRoutes(httpServer, app);
    
    // Error Handler (Harus didaftarkan setelah routes)
    app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Internal Server Error:", err);
      if (res.headersSent) return next(err);
      return res.status(status).json({ message });
    });

    routesRegistered = true;
  }
};

// --- VERCEL SPECIFIC HANDLER ---
// Middleware ini memastikan setupApp selesai sebelum request diproses
app.use(async (req, res, next) => {
  await setupApp();
  next();
});

// --- LOCAL SERVER STARTUP ---
// Kode ini hanya jalan di Local / VPS (bukan Vercel)
if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
  (async () => {
    try {
      await setupApp(); // Pastikan setup selesai sebelum listen
      
      // Vite setup hanya untuk local dev
      if (process.env.NODE_ENV !== "production") {
          const { setupVite } = await import("./vite");
          await setupVite(httpServer, app);
      } else {
          serveStatic(app);
      }

      const port = parseInt(process.env.PORT || "5000", 10);
      httpServer.listen(port, "0.0.0.0", () => {
        log(`🚀 Server running on port ${port}`);
        log(`🌐 Client URL: ${process.env.CLIENT_URL || 'Not Set'}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
    }
  })();
}

export default app;