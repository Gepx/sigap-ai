import multer from "multer";
import { AppError } from "../middlewares/error.middleware.js";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Multer memory storage — stores uploaded CSV in RAM as a Buffer.
 * Then the controller uploads the Buffer to Supabase Storage.
 */
export const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter(_req, file, cb) {
    const allowedMimetypes = [
      "text/csv",
      "application/csv",
      "text/plain",
      "application/vnd.ms-excel",
    ];
    const isAllowed =
      allowedMimetypes.includes(file.mimetype) ||
      file.originalname.toLowerCase().endsWith(".csv");

    if (!isAllowed) {
      return cb(new AppError("Only CSV files are allowed.", 415) as unknown as null, false);
    }
    cb(null, true);
  },
});
