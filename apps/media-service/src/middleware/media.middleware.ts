import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "shared";

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 mb
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new AppError(400, "Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
}).single("image"); // field name  we need to use in our request object

export function uploadHandler(req: Request, res: Response, next: NextFunction) {
  imageUpload(req, res, (err: unknown) => {
    if (!err) {
      return next();
    }

    if (err instanceof AppError) {
      return next(err);
    }

    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "LIMIT_FILE_SIZE"
    ) {
      return next(new AppError(400, "Image must be 10 mb or smaller"));
    }
    return next(new AppError(400, "Invalid image request"));
  });
}
