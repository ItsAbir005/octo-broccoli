import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof AppError)) {
        console.error("AppError Log:", err.message);
        return res.status(err.status).json({
            success: false,
            error: err.message,
            code: err.code,
            details: err.details
        });
    }
    console.error("Error Log:", err.message);
    res.status(500).json({
        success: false,
        error: "Something went wrong on server",
    });
};
export default globalErrorHandler;