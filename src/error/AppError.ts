class AppError extends Error {
    public status: number;
    public code: string;
    public details: any;
    constructor(message: string, status: number = 500, code: string = "INTERNAL_SERVER_ERROR", details: any = null) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}
export default AppError;