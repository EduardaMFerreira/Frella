import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(err.status || 500).json({
    error: {
      message: err.message || "Erro interno",
      status: err.status || 500,
    },
  });
};