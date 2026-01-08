import { Response, } from "express";
export const apiSuccess = (res:Response, data:any, message = "Success", status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const apiError = (res:Response, error:any, message = "Error", status = 500) => {
  res.status(status).json({
    success: false,
    message,
    error,
  });
};
